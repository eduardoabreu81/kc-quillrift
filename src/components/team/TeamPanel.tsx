import { useState } from 'react';
import { cn } from '../../lib/utils';
import { 
  Users, 
  Bot,
  CheckCircle, 
  Circle, 
  Clock, 
  MessageSquare,
  Send,
  Plus,
  Wrench,
  UserCircle
} from 'lucide-react';
import { useAgent } from '../../hooks/useAgent';
import { getAvailableSkills } from '../../hooks/useSkill';

interface TeamPanelProps {
  teamId?: string;
  currentAgentId?: string;
}

export function TeamPanel({ teamId = 'default-team', currentAgentId = 'user' }: TeamPanelProps) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [selectedAgent] = useState<string | undefined>(undefined);
  
  const {
    agent,
    tasks,
    messages,
    stats,
    isLoading,
    addTask,
    claimTask,
    completeTask,
    sendMessage,
  } = useAgent({
    teamId,
    agentId: currentAgentId,
    agentName: 'User',
    role: 'lead',
  });

  const availableSkills = getAvailableSkills();

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    await addTask(newTaskTitle);
    setNewTaskTitle('');
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;
    await sendMessage(selectedAgent, messageInput);
    setMessageInput('');
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-bg)]">
      {/* Header */}
      <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-[var(--color-primary)]" />
          <h3 className="font-semibold text-[var(--color-text)]">Agent Team</h3>
        </div>
        
        {/* Stats */}
        <div className="flex gap-2 text-xs">
          <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700">
            {stats.pending} pendente{stats.pending !== 1 && 's'}
          </span>
          <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
            {stats.inProgress} ativo{stats.inProgress !== 1 && 's'}
          </span>
          <span className="px-2 py-1 rounded-full bg-green-100 text-green-700">
            {stats.completed} concluído{stats.completed !== 1 && 's'}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Available Skills Section */}
        <div>
          <h4 className="text-sm font-medium text-[var(--color-text-muted)] mb-3 flex items-center gap-2">
            <Wrench className="w-4 h-4" /> Skills Disponíveis
          </h4>
          
          <div className="space-y-2">
            {availableSkills.map((skill) => (
              <div
                key={skill.id}
                className="p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-sm hover:border-[var(--color-primary)] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {skill.id === 'architect' && '🏛️'}
                    {skill.id === 'bible-keeper' && '📚'}
                    {skill.id === 'voice-smith' && '🎭'}
                    {skill.id === 'consistency-guard' && '🛡️'}
                    {skill.id === 'red-pen' && '✒️'}
                  </span>
                  <div>
                    <div className="font-medium text-[var(--color-text)]">{skill.name}</div>
                    <div className="text-xs text-[var(--color-text-muted)]">{skill.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Agents Section */}
        <div>
          <h4 className="text-sm font-medium text-[var(--color-text-muted)] mb-3 flex items-center gap-2">
            <Bot className="w-4 h-4" /> Agents Ativos
          </h4>
          
          <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-primary)]">
            <UserCircle className="w-5 h-5 text-[var(--color-primary)]" />
            <div className="flex-1">
              <div className="text-sm font-medium">{agent.name}</div>
              <div className="flex items-center gap-1">
                <span className={cn(
                  "w-2 h-2 rounded-full",
                  agent.status === 'working' && "bg-yellow-400",
                  agent.status === 'idle' && "bg-green-400"
                )} />
                <span className="text-xs text-[var(--color-text-muted)]">
                  {agent.status === 'working' ? 'Trabalhando' : 'Disponível'}
                </span>
              </div>
            </div>
            <span className="text-xs px-2 py-1 rounded bg-[var(--color-primary)] text-white">
              {agent.role}
            </span>
          </div>
        </div>

        {/* Task List */}
        <div>
          <h4 className="text-sm font-medium text-[var(--color-text-muted)] mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Task Queue
            <span className="text-xs text-[var(--color-text-muted)] ml-auto">
              para agents executarem
            </span>
          </h4>

          {/* Add Task */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Nova task para um agent..."
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]"
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            />
            <button
              onClick={handleAddTask}
              disabled={isLoading}
              className="px-3 py-2 rounded-lg bg-[var(--color-primary)] text-white"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Tasks */}
          <div className="space-y-2">
            {tasks.length === 0 && (
              <div className="text-sm text-[var(--color-text-muted)] text-center py-4">
                Nenhuma task. Crie uma para um agent executar.
              </div>
            )}
            
            {tasks.map((task) => (
              <div
                key={task.id}
                className={cn(
                  "p-3 rounded-lg border transition-colors",
                  task.status === 'completed' && "bg-green-50 border-green-200",
                  task.status === 'in-progress' && "bg-yellow-50 border-yellow-200",
                  task.status === 'pending' && "bg-[var(--color-bg-elevated)] border-[var(--color-border)]"
                )}
              >
                <div className="flex items-start gap-2">
                  {task.status === 'completed' ? (
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  ) : task.status === 'in-progress' ? (
                    <Clock className="w-4 h-4 text-yellow-600 mt-0.5" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-400 mt-0.5" />
                  )}
                  
                  <div className="flex-1">
                    <span className={cn(
                      "text-sm",
                      task.status === 'completed' && "line-through text-gray-500"
                    )}>
                      {task.title}
                    </span>
                    
                    {task.assignee && (
                      <span className="text-xs text-[var(--color-text-muted)] ml-2">
                        @{task.assignee}
                      </span>
                    )}
                  </div>

                  {task.status === 'pending' && (
                    <button
                      onClick={() => claimTask(task.id)}
                      className="text-xs px-2 py-1 rounded bg-[var(--color-primary)] text-white"
                    >
                      Executar
                    </button>
                  )}

                  {task.status === 'in-progress' && task.assignee === currentAgentId && (
                    <button
                      onClick={() => completeTask(task.id)}
                      className="text-xs px-2 py-1 rounded bg-green-500 text-white"
                    >
                      Concluir
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div>
          <h4 className="text-sm font-medium text-[var(--color-text-muted)] mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> Inter-Agent Messages
          </h4>

          <div className="space-y-2 max-h-48 overflow-y-auto mb-3">
            {messages.length === 0 && (
              <div className="text-sm text-[var(--color-text-muted)] text-center py-4">
                Nenhuma mensagem. Agents podem se comunicar aqui.
              </div>
            )}
            
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="p-2 rounded-lg bg-[var(--color-bg-elevated)] text-sm"
              >
                <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                  <Bot className="w-3 h-3" />
                  <span className="font-medium">{msg.from}</span>
                  <span>•</span>
                  <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="mt-1">{msg.content}</p>
              </div>
            ))}
          </div>

          {/* Send Message */}
          <div className="flex gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Enviar mensagem para team..."
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]"
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              className="px-3 py-2 rounded-lg bg-[var(--color-primary)] text-white"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
