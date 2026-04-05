# Sistema de Agent Teams - OpenClaw

Sistema de coordenação multi-agente inspirado no Claude Code Agent Teams.

## Estrutura

```
~/.openclaw/teams/
└── {team-id}/
    ├── config.json          # Configuração do time
    ├── tasks.json           # Task list compartilhada
    └── mailbox/             # Mensagens entre agents
        ├── {agent-id}.json  # Caixa postal de cada agent
        └── broadcast.json   # Mensagens broadcast
```

## API

### Criar um Team
```typescript
import { createTeam } from './team-manager';

const team = await createTeam({
  id: 'kc-quillrift-sprint',
  name: 'KC-QuillRift Development',
  leadId: 'main-agent'
});
```

### Adicionar Task
```typescript
await team.addTask({
  id: 'task-001',
  title: 'Revisar arquitetura do Livro 1',
  description: 'Analisar estrutura de atos e capítulos',
  status: 'pending',
  dependsOn: []
});
```

### Claim Task
```typescript
await team.claimTask('task-001', 'subagent-01');
```

### Comunicação
```typescript
// Mensagem direta
await team.sendMessage({
  from: 'subagent-01',
  to: 'subagent-02',
  content: 'Terminei a análise do Ato I'
});

// Broadcast
await team.broadcast({
  from: 'lead',
  content: 'Novo requisito: adicionar plot twist no capítulo 10'
});
```

## Estados de Task

- `pending` - Aguardando
- `in-progress` - Em execução
- `completed` - Concluída
- `blocked` - Bloqueada (dependências)

## Eventos (Hooks)

- `TaskCreated` - Nova task criada
- `TaskClaimed` - Task foi claimada
- `TaskCompleted` - Task finalizada
- `MessageReceived` - Nova mensagem
- `TeammateIdle` - Teammate ficou ocioso
