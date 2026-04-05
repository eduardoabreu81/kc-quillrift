# QuillRift — Roadmap Estratégico

## Filosofia
**Estabilidade → Core → Diferenciais**

Não adianta ter importação inteligente se o build quebra. Não adianta ter AI se não tem onde escrever.

---

## Fase 0: Fundação (Agora — v0.1.x)
**Meta: Build estável, app funcional**

### Semana 1 — Fix & Stabilize
- [ ] Corrigir todos os erros de TypeScript
- [ ] Resolver warnings de build
- [ ] Garantir que `npm run build` passe limpo
- [ ] Testar deploy no Netlify após fixes

### Semana 2 — Core Experience
- [ ] Verificar se Editor (TipTap) funciona corretamente
- [ ] Testar módulos existentes: Bible, Characters, Timeline
- [ ] Garantir persistência (localStorage/mock API)
- [ ] Testar em múltiplos navegadores

### Entregável
> App rodando sem erros. Usuário pode criar projeto, escrever, salvar.

---

## Fase 1: Escrita Real (v0.2 — 2-3 semanas)
**Meta: O usuário pode escrever um livro de verdade**

### Editor
- [ ] POV por ato/cena (não só por projeto)
- [ ] Tempo verbal por ato/cena (presente/passado)
- [ ] Contador de palavras em tempo real
- [ ] Auto-save confiável

### Estrutura
- [ ] Criar/deletar/reordenar capítulos
- [ ] Criar/deletar/reordenar atos dentro de capítulos
- [ ] Mover cenas entre capítulos
- [ ] Templates de estrutura (3 atos, hero's journey, etc)

### Exportação Básica
- [ ] Exportar para Markdown
- [ ] Exportar capítulo selecionado
- [ ] Exportar projeto completo

### Entregável
> Usuário pode escrever, estruturar e exportar um manuscrito completo.

---

## Fase 2: IA Core (v0.3 — 2-3 semanas)
**Meta: AI ajuda na escrita, não substitui**

### Workshop (Chat)
- [ ] Integração com OpenRouter/OpenAI
- [ ] Contexto seletivo: tudo / capítulo / ato / seleção
- [ ] Memória de conversa por projeto
- [ ] Presets de prompt salvos

### Escrita Assistida
- [ ] Continuar texto (gera a partir do cursor)
- [ ] Reescrever seleção (tom diferente)
- [ ] Expandir cena (adicionar detalhes sensoriais)

### Brainstorm
- [ ] Gerar ideias de cenas
- [ ] Sugerir nomes de personagens
- [ ] Resolver bloqueio criativo

### Entregável
> AI funciona como parceiro de escrita. Sugere, não impõe.

---

## Fase 3: Importação Inteligente (v0.4 — 2-3 semanas)
**Meta: "Vamos completar juntos?"**

### Upload & Detecção
- [ ] Upload MD, TXT, DOCX
- [ ] Detecção automática de tipo por AI
- [ ] Preview antes de confirmar

### Parseamento
- [ ] Manuscrito → estrutura de capítulos
- [ ] Dossiê de personagens → fichas
- [ ] Bíblia de mundo → entradas no Bible
- [ ] Timeline → eventos

### Completude Colaborativa
- [ ] Identificar campos faltantes
- [ ] Sugerir: "Vamos completar juntos?"
- [ ] Aceitar/rejeitar sugestões do AI

### Entregável
> Usuário migra projetos existentes em minutos, com ajuda do AI.

---

## Fase 4: Profundidade (v0.5 — 3-4 semanas)
**Meta: O que Sudowrite tem e nós fazemos melhor**

### Story Bible Expandida
- [ ] Seções customizáveis (não schema fixo)
- [ ] Cross-references: personagem ↔ cenas onde aparece
- [ ] Sementes narrativas com tracking

### Personagens
- [ ] Fichas com traits expansíveis (adicionar campo custom)
- [ ] Relacionamentos entre personagens (grafo visual)
- [ ] Arco de personagem ao longo dos livros

### Timeline
- [ ] Múltiplas timelines (livro 1, livro 2, saga completa)
- [ ] Eventos vinculados a capítulos
- [ ] Visualização de conflitos temporais

### Analytics
- [ ] Gráfico de palavras por capítulo
- [ ] Distribuição de POV ao longo do livro
- [ ] "Onde está meu personagem?" (heatmap de presença)

### Entregável
> Ferramentas de gerenciamento de saga ao nível profissional.

---

## Fase 5: Diferenciais (v0.6 — 3-4 semanas)
**Meta: O que só o QuillRift tem**

### Flexibilidade Narrativa
- [ ] POV por parágrafo (se o autor quiser)
- [ ] Mudança de tempo verbal no meio do capítulo
- [ ] Nenhuma trava de estrutura

### Agentes Especializados (Teams System)
- [ ] Architect: ajuda com estrutura de arco
- [ ] Bible Keeper: mantém consistência de mundo
- [ ] Voice Smith: diálogos distintivos por personagem
- [ ] Consistency Guard: detecta erros de continuidade

### Validação Inteligente
- [ ] "Sua Bíblia proíbe X, mas você usou Y"
- [ ] Checklist por capítulo baseado na Bíblia
- [ ] Detecção de sementes não resolvidas

### Colaboração
- [ ] Compartilhar projeto com beta readers
- [ ] Comentários em cenas específicas
- [ ] Modo "suggestion" do AI (tipo track changes)

### Entregável
> QuillRift é único. Não é mais "clone do Sudowrite", é ferramenta nova.

---

## Fase 6: Escala (v0.7+ — Futuro)
**Meta: Profissionalização**

- [ ] Sync backend (PostgreSQL + Railway)
- [ ] Colaboração em tempo real
- [ ] Apps mobile (Capacitor/Tauri mobile)
- [ ] Plugin marketplace (igual Sudowrite)
- [ ] Stripe / monetização

---

## Priorização para Reset Infinito

Como você já tem:
- Manuscrito avançado (54k palavras)
- Bíblia completa
- Dossiê de personagens
- Timeline definida

### Sequência sugerida:

1. **Agora (Fase 0)** → Build estável para você testar
2. **Pular Fase 1 parcial** → Você já tem estrutura, precisa de importação
3. **Fase 3 primeiro** → Importar seus documentos existentes
4. **Fase 2** → AI para ajudar a continuar escrevendo
5. **Fase 4** → Profundidade para gerenciar a saga de 5 livros

### Ordem customizada para você:

| Semana | Foco | Por quê |
|--------|------|---------|
| 1 | Fix build | Nada funciona se quebra |
| 2-3 | Importação | Jogar seus docs pro app |
| 4-5 | AI Core | Continuar escrevendo com ajuda |
| 6-8 | Profundidade | Gerenciar saga complexa |
| 9+ | Diferenciais | O que torna único |

---

## Checkpoints de Decisão

**Após Fase 0:** App estável? → Sim → Segue / Não → Fix até estabilizar
**Após Fase 3:** Importação funcionou com seus docs? → Sim → Fase 2 / Não → Ajustar
**Após Fase 4:** Está gerenciando a saga bem? → Sim → Diferenciais / Não → Mais ferramentas

---

## Notas

- **Nunca quebrar o que funciona.** Cada fase é estável antes de começar a próxima.
- **Você está no controle.** Pode pausar, repriorizar, ou pular features.
- **Testar com dados reais.** Usar seus docs do Reset Infinito como caso de teste.

---

*Roadmap v1.0 — definido em conjunto*
