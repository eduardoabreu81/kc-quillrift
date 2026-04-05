import { useState, useCallback, useEffect } from 'react';
import { 
  workflowEngine, 
  WORKFLOW_PRESETS, 
  type WorkflowExecution,
  type WorkflowStep 
} from '../lib/workflow';

export interface UseWorkflowOptions {
  onStepStart?: (execution: WorkflowExecution, step: WorkflowStep) => void;
  onStepComplete?: (execution: WorkflowExecution, step: WorkflowStep, result: string) => void;
  onStepError?: (execution: WorkflowExecution, step: WorkflowStep, error: string) => void;
  onComplete?: (execution: WorkflowExecution) => void;
}

export function useWorkflow(options: UseWorkflowOptions = {}) {
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [currentExecution, setCurrentExecution] = useState<WorkflowExecution | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  // Configura hooks do engine
  useEffect(() => {
    workflowEngine.setHooks({
      onStepStart: (exec, step) => {
        setExecutions(prev => 
          prev.map(e => e.id === exec.id ? exec : e)
        );
        options.onStepStart?.(exec, step);
      },
      onStepComplete: (exec, step, result) => {
        setExecutions(prev => 
          prev.map(e => e.id === exec.id ? exec : e)
        );
        options.onStepComplete?.(exec, step, result);
      },
      onStepError: (exec, step, error) => {
        setExecutions(prev => 
          prev.map(e => e.id === exec.id ? exec : e)
        );
        setIsRunning(false);
        options.onStepError?.(exec, step, error);
      },
      onWorkflowComplete: (exec) => {
        setExecutions(prev => 
          prev.map(e => e.id === exec.id ? exec : e)
        );
        setIsRunning(false);
        setCurrentExecution(exec);
        options.onComplete?.(exec);
      }
    });
  }, [options]);

  const startWorkflow = useCallback(async (
    workflowId: string, 
    context: Record<string, unknown>
  ) => {
    setIsRunning(true);
    const execution = await workflowEngine.startWorkflow(workflowId, context);
    setExecutions(prev => [...prev, execution]);
    setCurrentExecution(execution);
    return execution;
  }, []);

  const acceptWorkflow = useCallback((executionId: string) => {
    const success = workflowEngine.acceptWorkflow(executionId);
    if (success) {
      // Recarrega execuções
      setExecutions(workflowEngine.getAllExecutions());
    }
    return success;
  }, []);

  const getWorkflowPresets = useCallback(() => {
    return WORKFLOW_PRESETS;
  }, []);

  const getExecution = useCallback((id: string) => {
    return workflowEngine.getExecution(id);
  }, []);

  return {
    // Estado
    executions,
    currentExecution,
    isRunning,
    
    // Ações
    startWorkflow,
    acceptWorkflow,
    getWorkflowPresets,
    getExecution,
    
    // Presets
    presets: WORKFLOW_PRESETS
  };
}
