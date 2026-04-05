import { useState } from 'react';
import { cn } from '../../lib/utils';
import { 
  Play, 
  CheckCircle, 
  Circle, 
  Loader2,
  ChevronDown,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useWorkflow } from '../../hooks/useWorkflow';
import type { WorkflowDefinition } from '../../lib/workflow';

interface WorkflowPanelProps {
  context?: Record<string, unknown>; // Contexto inicial (texto selecionado, bible, etc)
}

export function WorkflowPanel({ context = {} }: WorkflowPanelProps) {
  const [expandedWorkflow, setExpandedWorkflow] = useState<string | null>(null);
  const [selectedExecution, setSelectedExecution] = useState<string | null>(null);
  
  const { 
    presets, 
    executions, 
    currentExecution, 
    isRunning, 
    startWorkflow 
  } = useWorkflow({
    onComplete: (exec) => {
      console.log('Workflow completed:', exec);
    }
  });

  const handleStartWorkflow = async (workflow: WorkflowDefinition) => {
    const exec = await startWorkflow(workflow.id, {
      ...context,
      timestamp: new Date().toISOString()
    });
    setSelectedExecution(exec.id);
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'running': return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'failed': return <Circle className="w-4 h-4 text-red-500" />;
      default: return <Circle className="w-4 h-4 text-gray-300" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-bg)]">
      {/* Header */}
      <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-[var(--color-primary)]" />
          <h3 className="font-semibold text-[var(--color-text)]">Workflows</h3>
        </div>
        <p className="text-xs text-[var(--color-text-muted)]">
          Cadeias de agents para tarefas complexas
        </p>
      </div>

      <div className="flex-1 overflow-auto">
        {/* Workflow Presets */}
        <div className="p-4 space-y-3">
          <h4 className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
            Disponíveis
          </h4>
          
          {presets.filter(w => w.id !== 'post-production').map((workflow) => (
            <div 
              key={workflow.id}
              className={cn(
                "border rounded-lg overflow-hidden transition-colors",
                expandedWorkflow === workflow.id 
                  ? "border-[var(--color-primary)] bg-[var(--color-bg-elevated)]" 
                  : "border-[var(--color-border)] hover:border-[var(--color-primary)]"
              )}
            >
              <button
                onClick={() => setExpandedWorkflow(
                  expandedWorkflow === workflow.id ? null : workflow.id
                )}
                className="w-full p-3 flex items-center gap-3 text-left"
              >
                <span className="text-2xl">{workflow.icon}</span>
                <div className="flex-1">
                  <div className="font-medium text-[var(--color-text)]">{workflow.name}</div>
                  <div className="text-xs text-[var(--color-text-muted)]">{workflow.description}</div>
                </div>
                {expandedWorkflow === workflow.id ? (
                  <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)]" />
                )}
              </button>
              
              {expandedWorkflow === workflow.id && (
                <div className="px-3 pb-3">
                  <div className="pl-11 space-y-2">
                    <div className="text-xs text-[var(--color-text-muted)] space-y-1">
                      {workflow.steps.map((step, idx) => (
                        <div key={step.id} className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center text-[10px]">
                            {idx + 1}
                          </span>
                          <span>{step.name}</span>
                        </div>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => handleStartWorkflow(workflow)}
                      disabled={isRunning}
                      className="mt-3 w-full py-2 px-3 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isRunning ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Executando...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Iniciar Workflow
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Executions */}
        {executions.length > 0 && (
          <div className="px-4 pb-4">
            <h4 className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide mb-3">
              Execuções
            </h4>
            
            <div className="space-y-2">
              {executions.map((exec) => (
                <div 
                  key={exec.id}
                  onClick={() => setSelectedExecution(exec.id)}
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-colors",
                    selectedExecution === exec.id
                      ? "border-[var(--color-primary)] bg-[var(--color-bg-elevated)]"
                      : "border-[var(--color-border)] hover:border-[var(--color-primary)]"
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {getStepIcon(exec.status)}
                    <span className="text-sm font-medium">
                      {presets.find(p => p.id === exec.workflowId)?.name}
                    </span>
                    <span className="text-xs text-[var(--color-text-muted)] ml-auto">
                      {new Date(exec.startedAt).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[var(--color-primary)] transition-all"
                      style={{
                        width: `${(exec.currentStep / (presets.find(p => p.id === exec.workflowId)?.steps.length || 1)) * 100}%`
                      }}
                    />
                  </div>
                  
                  <div className="mt-2 text-xs text-[var(--color-text-muted)]">
                    Step {exec.currentStep + 1} de {presets.find(p => p.id === exec.workflowId)?.steps.length}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selected Execution Details */}
      {selectedExecution && currentExecution?.id === selectedExecution && (
        <div className="border-t border-[var(--color-border)] p-4 bg-[var(--color-bg-elevated)]">
          <h4 className="text-sm font-medium mb-3">Progresso</h4>
          
          <div className="space-y-2">
            {presets.find(p => p.id === currentExecution.workflowId)?.steps.map((step) => {
              const result = currentExecution.stepResults[step.id];
              return (
                <div key={step.id} className="flex items-center gap-2 text-sm">
                  {getStepIcon(result?.status || 'pending')}
                  <span className={cn(
                    result?.status === 'completed' && "text-[var(--color-text)]",
                    result?.status === 'running' && "text-[var(--color-primary)]",
                    (!result || result.status === 'pending') && "text-[var(--color-text-muted)]"
                  )}>
                    {step.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
