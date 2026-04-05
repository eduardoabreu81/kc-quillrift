import { useState } from 'react';
import { cn } from '../../lib/utils';
import { 
  Users, 
  CheckCircle, 
  Circle, 
  Clock, 
  MessageSquare,
  Send,
  Plus
} from 'lucide-react';
import { useTeam } from '../../hooks/useTeam';

interface TeamPanelProps {
  teamId?: string;
  agentId?: string;
}

export function TeamPanel({ teamId = 'default-team', agentId = 'user' }: TeamPanelProps) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [selectedRecipient] = useState<string | undefined>(undefined);
  
  const {
    tasks,
    messages,
    stats,
    isLoading,
    addTask,
    claimTask,
    completeTask,
    sendMessage,
  } = useTeam({
    teamId,
    agentId,
    agentName: 'User',
    role: 'lead',
  });

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    await addTask(newTaskTitle);
    setNewTaskTitle('');
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;
    await sendMessage(selectedRecipient, messageInput);
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
        <div className="flex gap-2 text-xs">
          <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700">
            {stats.pending} pending
          </span>
          <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
            {stats.inProgress} active
          </span>
          <span className="px-2 py-1 rounded-full bg-green-100 text-green-700">
            {stats.completed} done
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Task List */}
        <div>
          <h4 className="text-sm font-medium text-[var(--color-text-muted)] mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Tasks
          </h4>

          {/* Add Task */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="New task..."
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
                      Claim
                    </button>
                  )}

                  {task.status === 'in-progress' && task.assignee === agentId && (
                    <button
                      onClick={() => completeTask(task.id)}
                      className="text-xs px-2 py-1 rounded bg-green-500 text-white"
                    >
                      Done
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
            <MessageSquare className="w-4 h-4" /> Messages
          </h4>

          <div className="space-y-2 max-h-48 overflow-y-auto mb-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="p-2 rounded-lg bg-[var(--color-bg-elevated)] text-sm"
              >
                <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
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
              placeholder="Message team..."
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
