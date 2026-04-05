# Pesquisa de Mercado — KC-QuillRift

Análise detalhada de concorrentes e ferramentas similares.

---

## 1. Sudowrite (https://sudowrite.com/)

**Modelo:** SaaS pago  
**Preço:** $19-59/mês (sistema de créditos)  
**Código:** Fechado

### Features
- **Write:** Autocomplete inteligente com análise de personagens/tom/arco
- **Describe:** Descrições sensoriais usando 5 sentidos
- **Rewrite:** Reescrita flexível com direções
- **Expand:** Expandir cenas sem filler
- **Brainstorm:** Geração de ideias (nomes, títulos, itens)
- **First Draft:** 500-1000 palavras de outline
- **Story Bible:** Planejamento passo-a-passo (ideia → outline → capítulos)
- **Canvas:** Canvas visual para plot points, arcos, twists
- **Feedback:** Análise de história em 10 segundos (3 áreas de melhoria)
- **Visualize:** Gera arte de personagens/worldbuilding

### Críticas
- **Sistema de créditos causa ansiedade** — usuários relatam que o plano Hobby ($19/mês) esgota em 5-10 dias
- Créditos não acumulam (exceto no plano Max $59/mês)
- Preço elevado para escritores independentes

### Veredito
**Copiar:** Story Bible, Describe (5 sentidos), Feedback, Canvas (fase 2)  
**Rejeitar:** Sistema de créditos, preço elevado

---

## 2. NovelCrafter (https://www.novelcrafter.com/)

**Modelo:** SaaS pago  
**Preço:** ~$10/mês  
**Código:** Fechado

### Features
- **Context Selector:** Checkbox manual para selecionar o que entra no prompt (KILLER FEATURE)
- **Codex:** Personagens, locais, itens com tracking no texto
- **Snapshots:** Versionamento de drafts
- **Prompt Library:** Templates versionados
- **Personas:** Memória cross-project
- **Exportação:** DOCX, Markdown, PDF, ePub

### Críticas (do changelog)
- Perda de dados — usuários perderam dias/semanas de escrita
- Renderização de markdown quebrada (listas, blockquotes)
- Falsos positivos no Codex: "Don" detectado em "don't"
- Contexto vazando: itens "hidden from AI" ainda iam pro chat
- Exportação DOCX com bugs frequentes

### Veredito
**Copiar:** Context Selector (UX excepcional), Snapshots obrigatórios, Prompt Library  
**Rejeitar:** Bugs de estabilidade, falta de backup confiável

---

## 3. Writingway (https://github.com/aomukai/writingway)

**Modelo:** Open Source  
**Preço:** Grátis  
**Código:** Python/PyQt5 (aberto)

### Features
- **Action Beats:** Campo de direção para IA (conceito perfeito)
- **Context Selector:** Tab lateral com checkboxes (copiado por nós)
- **LLM Preview + Apply/Retry:** Modal simples (padrão ouro)
- **Rewrite:** Modal de reescrita
- **Sumarização:** Resumos automáticos de cenas/atos
- **Compêndio:** Database JSON de worldbuilding
- **Providers:** Ollama, OpenRouter, genérico OpenAI-compatible

### Limitações
- Editor de texto simples (sem rich text)
- TTS local (pyttsx3) — limitado
- Sem sync entre dispositivos
- Interface desktop-only

### Veredito
**Copiar:** Action Beats, Context Selector UX, LLM Preview modal, Rewrite  
**Rejeitar:** Editor sem formatação, falta de rich text, app desktop-only

---

## 4. SAGA (https://github.com/Lanerra/saga)

**Modelo:** Open Source  
**Preço:** Grátis  
**Código:** Python CLI (Apache-2.0)

### Visão Geral
SAGA (Semantic And Graph-enhanced Authoring) usa **Neo4j como knowledge graph** para consistência em ficção longa. Abordagem técnica sofisticada com LangGraph, embeddings, extração automática.

### Arquitetura Técnica
- **LangGraph:** Orquestração de workflow (checkpointed, resumable)
- **Neo4j:** Knowledge graph persistente (personagens, locais, relações, eventos)
- **Embeddings:** Vetorização para busca semântica
- **Filesystem:** YAML legíveis para humanos

### Workflow (2 fases)

#### Fase 1: Bootstrap
- Gera fichas de personagens
- Cria outline global (3 ou 5 atos)
- Persiste no grafo Neo4j

#### Fase 2: Geração (capítulo a capítulo)
1. **Chapter Planning** → outline cena a cena
2. **Scene-level Generation** → busca contexto no Neo4j
3. **Extraction** → extrai entidades e relações do texto
4. **Embedding Generation** → vetoriza o capítulo
5. **Relationship Normalization** → mapeia relações para tipos canônicos
6. **Commit to Graph** → persiste no Neo4j com deduplicação
7. **Validation:**
   - Consistency checks (relações, traits)
   - LLM-based quality evaluation (coerência, prosa, pacing, tom)
   - Contradiction detection (mudanças abruptas de relação, timeline)
8. **Revision Loop** → se falhar, revisa e reprocessa
9. **Finalization** → sumário, markdown, graph healing
10. **Quality Assurance** → checks finais

### Features Diferenciadas
- **Knowledge Graph:** Relacionamentos complexos ("quem interagiu com X nos últimos 3 capítulos?")
- **Extração Automática:** IA extrai personagens/locais do texto gerado
- **Validação Automática:** Detecta contradições (ex: "A odeia B" vs "A beija B")
- **Graph Healing:** Merge automático de duplicatas, enriquecimento de nodes
- **Checkpoint/Resumable:** LangGraph permite pausar jobs longos

### Críticas
- **Setup complexo:** Docker + Neo4j + Python 3.12
- **CLI-only:** Sem interface gráfica
- **Não production-ready:** Issues críticos documentados
- **Single-user:** Sem colaboração

### Veredito
**Copiar:**
- Conceito de Knowledge Graph (simplificar para Firestore)
- Extração automática de entidades (agente sugestor)
- Validação de consistência (LoreKeeper)
- Graph Healing (manutenção do Compêndio)

**Rejeitar:**
- Complexidade técnica (Neo4j, Docker, CLI)
- Curva de aprendizado íngreme
- Falta de interface web

### Inspirações para KC-QuillRift
1. **Agente de Extração:** Sugerir automaticamente personagens novos ao ler texto
2. **Validação de Consistência:** Verificar contradições automaticamente
3. **Relacionamentos:** Armazenar "quem conhece quem" além de fichas isoladas
4. **Graph Healing:** Sugerir merge quando usuário cria "João" e "Joao"

---

## 5. Comparativo Geral

| Feature | Sudowrite | NovelCrafter | Writingway | SAGA | KC-QuillRift (Plano) |
|---------|-----------|--------------|------------|------|---------------------|
| **Preço** | $19-59/m | ~$10/m | Grátis | Grátis | **Grátis** |
| **Código** | Fechado | Fechado | Open | Open | **Open** |
| **Interface** | Web | Web | Desktop | CLI | **Web + PWA** |
| **Rich Text** | Sim | Sim | Não | Não | **Sim (TipTap)** |
| **Context Selector** | Parcial | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Não | ⭐⭐⭐⭐⭐ |
| **Knowledge Graph** | Não | Não | Não | ⭐⭐⭐⭐⭐ | Simplificado |
| **Extração Auto** | Não | Parcial | Não | ⭐⭐⭐⭐⭐ | Planejado |
| **Validação** | Básica | Básica | Não | ⭐⭐⭐⭐⭐ | Agente LoreKeeper |
| **Sync** | Nuvem | Nuvem | Não | Não | **Firebase** |
| **Offline** | Não | Não | Sim | Sim | **Sim (PWA)** |
| **Setup** | Zero | Zero | Simples | Complexo | **Zero** |

---

## 6. Decisões de Design Baseadas na Pesquisa

### UI/UX
- **Context Selector:** Copiar NovelCrafter + Writingway (checkboxes laterais)
- **LLM Preview:** Copiar Writingway (Apply/Retry obrigatórios)
- **Editor:** Rich text (TipTap) — diferencial vs Writingway/SAGA

### Arquitetura
- **Knowledge Graph:** Inspirado SAGA, mas simplificado (Firestore + relacionamentos)
- **Validação:** Agente LoreKeeper — tarefa prioritária
- **Extração:** Agente sugere entidades novas baseado no texto

### Modelo de Negócio
- **Preço:** Gratuito (diferencial vs Sudowrite/NovelCrafter)
- **Código:** Open source (diferencial vs todos concorrentes fechados)
- **Dados:** Local-first com sync (diferencial vs nuvem-only)

---

## 7. Features Diferenciadas KC-QuillRift

1. **Zero créditos, zero ansiedade** — use seus próprios providers
2. **Web app acessível** — nada para instalar (vs SAGA/Writingway)
3. **Knowledge Graph simplificado** — poder do SAGA sem complexidade
4. **Agentes especialistas** — LoreKeeper, VoiceSmith, RedPen
5. **PWA offline** — funciona sem internet, sync quando volta
6. **Português nativo** — PT-BR de primeira (vs inglês-only)
