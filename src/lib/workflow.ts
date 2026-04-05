// Workflow Engine - Orquestrador de Agentes
// Sistema de cadeias de agents para workflows de escrita

export type WorkflowStepStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped';

export interface WorkflowStep {
  id: string;
  agentId: string;
  name: string;
  description: string;
  input: string[]; // Referências aos outputs de steps anteriores ou 'context'
  output: string;
  config?: Record<string, unknown>;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  steps: WorkflowStep[];
  onAccept?: string; // Step de pós-produção (opcional)
  requiresAcceptance: boolean; // Se precisa de aceite do usuário antes de pós-produção
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'paused' | 'completed' | 'failed';
  currentStep: number;
  context: Record<string, unknown>; // Dados acumulados (contexto inicial + outputs)
  stepResults: Record<string, {
    status: WorkflowStepStatus;
    output?: string;
    error?: string;
    startedAt?: string;
    completedAt?: string;
  }>;
  startedAt: string;
  completedAt?: string;
}

// ============================================================
// WORKFLOW PRESETS
// ============================================================

export const WORKFLOW_PRESETS: WorkflowDefinition[] = [
  {
    id: 'generate-scene',
    name: 'Gerar Cena',
    description: 'Gera uma cena nova com validação completa',
    icon: '🎬',
    requiresAcceptance: true,
    steps: [
      {
        id: 'step-1-writer',
        agentId: 'writer',
        name: 'Escritor',
        description: 'Gera o texto base da cena',
        input: ['context', 'timeline', 'bible'],
        output: 'draft'
      },
      {
        id: 'step-2-validator',
        agentId: 'lore-validator',
        name: 'Validador de Lore',
        description: 'Verifica consistência com documentação',
        input: ['draft', 'bible'],
        output: 'validationNotes'
      },
      {
        id: 'step-3-personas',
        agentId: 'persona-guard',
        name: 'Guardião de Personas',
        description: 'Valida consistência de personagens',
        input: ['draft', 'bible'],
        output: 'characterNotes'
      },
      {
        id: 'step-4-orchestrator',
        agentId: 'orchestrator',
        name: 'Orquestrador',
        description: 'Consolida ajustes e gera versão final',
        input: ['draft', 'validationNotes', 'characterNotes'],
        output: 'finalDraft'
      }
    ],
    onAccept: 'post-production'
  },
  
  {
    id: 'review-chapter',
    name: 'Revisar Capítulo',
    description: 'Revisão completa de capítulo existente',
    icon: '✏️',
    requiresAcceptance: true,
    steps: [
      {
        id: 'step-1-structure',
        agentId: 'structure-analyst',
        name: 'Analista de Estrutura',
        description: 'Analisa arco, ritmo e estrutura',
        input: ['chapter', 'outline'],
        output: 'structureNotes'
      },
      {
        id: 'step-2-editor',
        agentId: 'red-pen',
        name: 'Editor',
        description: 'Revisão de texto, clareza e estilo',
        input: ['chapter', 'structureNotes'],
        output: 'editedText'
      },
      {
        id: 'step-3-continuity',
        agentId: 'consistency-guard',
        name: 'Guardião de Continuidade',
        description: 'Verifica timeline e eventos',
        input: ['editedText', 'timeline'],
        output: 'continuityNotes'
      },
      {
        id: 'step-4-consolidate',
        agentId: 'orchestrator',
        name: 'Consolidação',
        description: 'Aplica ajustes sugeridos',
        input: ['editedText', 'structureNotes', 'continuityNotes'],
        output: 'finalChapter'
      }
    ]
  },
  
  {
    id: 'expand-character',
    name: 'Expandir Personagem',
    description: 'Desenvolve profundidade de personagem',
    icon: '👤',
    requiresAcceptance: true,
    steps: [
      {
        id: 'step-1-profile',
        agentId: 'character-writer',
        name: 'Perfil de Personagem',
        description: 'Gera background e traços',
        input: ['characterName', 'bible', 'storyContext'],
        output: 'characterProfile'
      },
      {
        id: 'step-2-voice',
        agentId: 'voice-smith',
        name: 'Voz do Personagem',
        description: 'Desenvolve voz e diálogo únicos',
        input: ['characterProfile'],
        output: 'voiceSample'
      },
      {
        id: 'step-3-consistency',
        agentId: 'bible-keeper',
        name: 'Validação de Consistência',
        description: 'Checa contra personagens existentes',
        input: ['characterProfile', 'bible'],
        output: 'consistencyCheck'
      }
    ],
    onAccept: 'update-bible'
  },
  
  {
    id: 'post-production',
    name: 'Pós-Produção',
    description: 'Atualiza documentação após aceite',
    icon: '📝',
    requiresAcceptance: false,
    steps: [
      {
        id: 'step-1-update-bible',
        agentId: 'bible-keeper',
        name: 'Atualizar Bible',
        description: 'Atualiza personagens, locais, conceitos',
        input: ['finalDraft', 'bible'],
        output: 'updatedBible'
      },
      {
        id: 'step-2-update-timeline',
        agentId: 'consistency-guard',
        name: 'Atualizar Timeline',
        description: 'Adiciona eventos à timeline',
        input: ['finalDraft', 'timeline'],
        output: 'updatedTimeline'
      },
      {
        id: 'step-3-history',
        agentId: 'historian',
        name: 'Registrar Histórico',
        description: 'Registra mudanças no histórico',
        input: ['finalDraft', 'updatedBible', 'updatedTimeline'],
        output: 'historyEntry'
      }
    ]
  }
];

// ============================================================
// WORKFLOW ENGINE
// ============================================================

export class WorkflowEngine {
  private executions: Map<string, WorkflowExecution> = new Map();
  private onStepStart?: (execution: WorkflowExecution, step: WorkflowStep) => void;
  private onStepComplete?: (execution: WorkflowExecution, step: WorkflowStep, result: string) => void;
  private onStepError?: (execution: WorkflowExecution, step: WorkflowStep, error: string) => void;
  private onWorkflowComplete?: (execution: WorkflowExecution) => void;

  setHooks(hooks: {
    onStepStart?: (execution: WorkflowExecution, step: WorkflowStep) => void;
    onStepComplete?: (execution: WorkflowExecution, step: WorkflowStep, result: string) => void;
    onStepError?: (execution: WorkflowExecution, step: WorkflowStep, error: string) => void;
    onWorkflowComplete?: (execution: WorkflowExecution) => void;
  }) {
    this.onStepStart = hooks.onStepStart;
    this.onStepComplete = hooks.onStepComplete;
    this.onStepError = hooks.onStepError;
    this.onWorkflowComplete = hooks.onWorkflowComplete;
  }

  async startWorkflow(
    workflowId: string, 
    initialContext: Record<string, unknown>
  ): Promise<WorkflowExecution> {
    const workflow = WORKFLOW_PRESETS.find(w => w.id === workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} não encontrado`);
    }

    const execution: WorkflowExecution = {
      id: `exec-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      workflowId,
      status: 'running',
      currentStep: 0,
      context: { ...initialContext },
      stepResults: {},
      startedAt: new Date().toISOString()
    };

    // Inicializa status dos steps
    workflow.steps.forEach(step => {
      execution.stepResults[step.id] = { status: 'pending' };
    });

    this.executions.set(execution.id, execution);

    // Inicia execução
    this.runNextStep(execution, workflow);

    return execution;
  }

  private async runNextStep(execution: WorkflowExecution, workflow: WorkflowDefinition) {
    if (execution.currentStep >= workflow.steps.length) {
      // Workflow completo
      execution.status = 'completed';
      execution.completedAt = new Date().toISOString();
      this.onWorkflowComplete?.(execution);
      return;
    }

    const step = workflow.steps[execution.currentStep];
    execution.stepResults[step.id] = {
      status: 'running',
      startedAt: new Date().toISOString()
    };

    this.onStepStart?.(execution, step);

    try {
      // Prepara input para o agente
      const stepInput = this.prepareStepInput(step, execution);
      
      // Executa o agente (mock por enquanto - substituir por chamada real)
      const result = await this.executeAgent(step.agentId, stepInput);
      
      // Guarda resultado
      execution.stepResults[step.id] = {
        status: 'completed',
        output: result,
        completedAt: new Date().toISOString()
      };

      // Adiciona ao contexto
      execution.context[step.output] = result;

      this.onStepComplete?.(execution, step, result);

      // Próximo step
      execution.currentStep++;
      this.runNextStep(execution, workflow);

    } catch (error) {
      execution.stepResults[step.id] = {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        completedAt: new Date().toISOString()
      };

      this.onStepError?.(execution, step, execution.stepResults[step.id].error!);
      
      execution.status = 'failed';
    }
  }

  private prepareStepInput(
    step: WorkflowStep, 
    execution: WorkflowExecution
  ): Record<string, unknown> {
    const input: Record<string, unknown> = {};
    
    step.input.forEach(key => {
      if (key === 'context') {
        input.context = execution.context;
      } else {
        input[key] = execution.context[key];
      }
    });

    return input;
  }

  private async executeAgent(agentId: string, input: Record<string, unknown>): Promise<string> {
    // TODO: Substituir por chamada real ao agente via API
    // Por enquanto, mock para testes
    console.log(`[MOCK] Executing agent ${agentId} with:`, input);
    return `[Mock output from ${agentId}]`;
  }

  getExecution(id: string): WorkflowExecution | undefined {
    return this.executions.get(id);
  }

  getAllExecutions(): WorkflowExecution[] {
    return Array.from(this.executions.values());
  }

  // Aceite do usuário para workflows que requerem
  acceptWorkflow(executionId: string): boolean {
    const execution = this.executions.get(executionId);
    if (!execution || execution.status !== 'paused') {
      return false;
    }

    const workflow = WORKFLOW_PRESETS.find(w => w.id === execution.workflowId);
    if (!workflow?.onAccept) {
      return false;
    }

    // Inicia workflow de pós-produção
    this.startWorkflow(workflow.onAccept, execution.context);
    return true;
  }

  // Pausa para aceite (usado quando precisa de aceite do usuário)
  pauseForAcceptance(executionId: string): boolean {
    const execution = this.executions.get(executionId);
    if (!execution || execution.status !== 'running') {
      return false;
    }

    execution.status = 'paused';
    return true;
  }
}

// Singleton instance
export const workflowEngine = new WorkflowEngine();
