// Team Manager - Browser version using localStorage

export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'blocked';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignee?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  dependsOn: string[];
}

export interface TeamConfig {
  id: string;
  name: string;
  leadId: string;
  members: Array<{
    id: string;
    name: string;
    role: string;
    status: 'active' | 'idle' | 'offline';
  }>;
  createdAt: string;
}

export interface Message {
  id: string;
  from: string;
  to?: string;
  content: string;
  timestamp: string;
}

export interface TaskList {
  tasks: Task[];
  version: number;
}

// Storage keys
const getStorageKey = (teamId: string, type: string) => `openclaw:team:${teamId}:${type}`;

// Team Manager
export class TeamManager {
  private teamId: string;

  constructor(teamId: string) {
    this.teamId = teamId;
  }

  private getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(getStorageKey(this.teamId, key));
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  private setItem(key: string, value: unknown): void {
    localStorage.setItem(getStorageKey(this.teamId, key), JSON.stringify(value));
  }

  // Config
  async getConfig(): Promise<TeamConfig | null> {
    return this.getItem<TeamConfig>('config');
  }

  async setConfig(config: TeamConfig): Promise<void> {
    this.setItem('config', config);
  }

  // Tasks
  async getTasks(): Promise<TaskList> {
    return this.getItem<TaskList>('tasks') || { tasks: [], version: 1 };
  }

  async saveTasks(tasks: TaskList): Promise<void> {
    this.setItem('tasks', tasks);
  }

  async addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const tasks = await this.getTasks();
    const newTask: Task = {
      ...task,
      id: `task-${Math.random().toString(36).slice(2, 10)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tasks.tasks.push(newTask);
    tasks.version++;
    await this.saveTasks(tasks);
    return newTask;
  }

  async claimTask(taskId: string, agentId: string): Promise<boolean> {
    const tasks = await this.getTasks();
    const task = tasks.tasks.find(t => t.id === taskId);
    
    if (!task || task.status !== 'pending') return false;
    
    // Check dependencies
    if (task.dependsOn.length > 0) {
      const completedDeps = task.dependsOn.every(depId => {
        const dep = tasks.tasks.find(t => t.id === depId);
        return dep?.status === 'completed';
      });
      if (!completedDeps) return false;
    }

    task.status = 'in-progress';
    task.assignee = agentId;
    task.updatedAt = new Date().toISOString();
    tasks.version++;
    await this.saveTasks(tasks);
    return true;
  }

  async completeTask(taskId: string, agentId: string): Promise<boolean> {
    const tasks = await this.getTasks();
    const task = tasks.tasks.find(t => t.id === taskId);
    
    if (!task || task.assignee !== agentId) return false;
    
    task.status = 'completed';
    task.updatedAt = new Date().toISOString();
    tasks.version++;
    await this.saveTasks(tasks);
    return true;
  }

  // Messages
  async getMessages(agentId: string): Promise<Message[]> {
    return this.getItem<Message[]>(`mailbox:${agentId}`) || [];
  }

  async sendMessage(message: Omit<Message, 'id' | 'timestamp'>): Promise<Message> {
    const newMessage: Message = {
      ...message,
      id: `msg-${Math.random().toString(36).slice(2, 10)}`,
      timestamp: new Date().toISOString(),
    };

    if (message.to) {
      // Direct message
      const messages = await this.getMessages(message.to);
      messages.push(newMessage);
      this.setItem(`mailbox:${message.to}`, messages);
    } else {
      // Broadcast - add to all members
      const config = await this.getConfig();
      if (config) {
        for (const member of config.members) {
          const messages = await this.getMessages(member.id);
          messages.push(newMessage);
          this.setItem(`mailbox:${member.id}`, messages);
        }
      }
    }

    return newMessage;
  }

  // Utils
  async getAvailableTasks(): Promise<Task[]> {
    const tasks = await this.getTasks();
    return tasks.tasks.filter(t => {
      if (t.status !== 'pending') return false;
      if (t.dependsOn.length === 0) return true;
      return t.dependsOn.every(depId => {
        const dep = tasks.tasks.find(task => task.id === depId);
        return dep?.status === 'completed';
      });
    });
  }

  async getStats(): Promise<{
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    blocked: number;
  }> {
    const tasks = await this.getTasks();
    return {
      total: tasks.tasks.length,
      pending: tasks.tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.tasks.filter(t => t.status === 'in-progress').length,
      completed: tasks.tasks.filter(t => t.status === 'completed').length,
      blocked: tasks.tasks.filter(t => t.status === 'blocked').length,
    };
  }
}

// Factory function
export async function createTeam(config: Omit<TeamConfig, 'createdAt'>): Promise<TeamManager> {
  const manager = new TeamManager(config.id);
  await manager.setConfig({
    ...config,
    createdAt: new Date().toISOString(),
  });
  return manager;
}

export function getTeam(teamId: string): TeamManager {
  return new TeamManager(teamId);
}
