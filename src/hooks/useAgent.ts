import { useState, useEffect, useCallback } from 'react';
import type { Task, Message } from '../lib/teams';
import { getTeam } from '../lib/teams';
import type { Skill } from './useSkill';

export interface Agent {
  id: string;
  name: string;
  role: string;
  skill?: Skill;
  status: 'idle' | 'working' | 'offline';
  currentTask?: string;
}

export interface UseAgentOptions {
  teamId: string;
  agentId: string;
  agentName: string;
  role: string;
}

export function useAgent({ teamId, agentId, agentName, role }: UseAgentOptions) {
  const [manager] = useState(() => getTeam(teamId));
  const [tasks, setTasks] = useState<Task[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    blocked: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [agentState, setAgentState] = useState<Agent>({
    id: agentId,
    name: agentName,
    role,
    status: 'idle',
  });

  // Register as team member
  useEffect(() => {
    const register = async () => {
      const config = await manager.getConfig();
      if (config) {
        const existing = config.members.find(m => m.id === agentId);
        if (!existing) {
          config.members.push({
            id: agentId,
            name: agentName,
            role,
            status: 'active',
          });
          await manager.setConfig(config);
        }
      }
    };
    register();
  }, [manager, agentId, agentName, role]);

  // Poll for updates
  useEffect(() => {
    const interval = setInterval(async () => {
      const taskList = await manager.getTasks();
      const msgs = await manager.getMessages(agentId);
      const currentStats = await manager.getStats();
      
      setTasks(taskList.tasks);
      setMessages(msgs);
      setStats(currentStats);
      
      // Update agent state based on claimed tasks
      const myTask = taskList.tasks.find(t => t.assignee === agentId && t.status === 'in-progress');
      setAgentState(prev => ({
        ...prev,
        status: myTask ? 'working' : 'idle',
        currentTask: myTask?.id,
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [manager, agentId]);

  // Actions
  const addTask = useCallback(async (title: string, description?: string, dependsOn: string[] = []) => {
    setIsLoading(true);
    const task = await manager.addTask({
      title,
      description,
      status: 'pending',
      createdBy: agentId,
      dependsOn,
    });
    setIsLoading(false);
    return task;
  }, [manager, agentId]);

  const claimTask = useCallback(async (taskId: string) => {
    setIsLoading(true);
    const success = await manager.claimTask(taskId, agentId);
    if (success) {
      setAgentState(prev => ({ ...prev, status: 'working' }));
    }
    setIsLoading(false);
    return success;
  }, [manager, agentId]);

  const completeTask = useCallback(async (taskId: string) => {
    setIsLoading(true);
    const success = await manager.completeTask(taskId, agentId);
    if (success) {
      setAgentState(prev => ({ ...prev, status: 'idle', currentTask: undefined }));
    }
    setIsLoading(false);
    return success;
  }, [manager, agentId]);

  const sendMessage = useCallback(async (to: string | undefined, content: string) => {
    return manager.sendMessage({
      from: agentId,
      to,
      content,
    });
  }, [manager, agentId]);

  const getAvailableTasks = useCallback(async () => {
    return manager.getAvailableTasks();
  }, [manager]);

  return {
    agent: agentState,
    tasks,
    messages,
    stats,
    isLoading,
    addTask,
    claimTask,
    completeTask,
    sendMessage,
    getAvailableTasks,
  };
}
