# KC-QuillRift - Progress Log

## 🚀 Sprint em Andamento - 2026-04-05

### Etapa 1: Fundação ✅ (COMPLETO)
- [x] Setup React 18 + Vite + TypeScript
- [x] Design System "Literary Amber" (Tailwind)
- [x] TipTap Editor com toolbar básica
- [x] Architect Panel protótipo
- [x] Sidebar navegação entre views
- [x] Build passando

### Etapa 2: Integração LLM ✅ (COMPLETO)
- [x] Serviço LLM multi-provedor (OpenRouter, Ollama, OpenAI, Anthropic)
- [x] Hooks React useLLM() com streaming
- [x] useLLMSettings() com persistência localStorage
- [x] ArchitectPanel integrado com LLM real
- [x] UI de configuração de API keys
- [x] Parse de JSON estruturado das respostas

### Etapa 3: Bible/Worldbuilding ✅ (COMPLETO)
- [x] Tipos TypeScript para Character, Location, Item, Concept, TimelineEvent
- [x] Dados de exemplo do universo Reset Infinito
- [x] BiblePanel com tabs: Personagens, Locais, Itens, Conceitos
- [x] Lista e detalhe de personagens
- [x] Lista e detalhe de conceitos
- [x] Busca e filtros
- [x] Integrado na navegação

### Etapa 4: Navigator Estrutural ✅ (COMPLETO)
- [x] Árvore Livro→Atos→Capítulos→Cenas
- [x] Expandir/colapsar atos e capítulos
- [x] Seleção de cenas com highlight
- [x] Contagem de palavras por cena
- [x] Layout 3-colunas: Navigator | Editor | Contexto
- [x] Action Beats panel
- [x] LLM Preview com Apply/Retry
- [x] Context selector (checkboxes)

### Etapa 5: Polimentos 🔄 (EM ANDAMENTO)
- [ ] Drag-and-drop reorder
- [ ] Autocomplete inteligente
- [ ] Atalhos de teclado
- [ ] Persistência local

### Etapa 6: Firebase & Sync 🔥 (PENDENTE)
- [ ] Firebase Auth
- [ ] Firestore para projetos
- [ ] Offline persistence
- [ ] Export DOCX/Markdown

---

## Estrutura do Projeto

```
src/
├── components/
│   ├── agents/
│   │   └── ArchitectPanel.tsx    # Geração de estrutura com LLM
│   ├── bible/
│   │   └── BiblePanel.tsx        # Worldbuilding (chars, locais, conceitos)
│   ├── navigator/
│   │   └── NavigatorPanel.tsx    # Árvore Livro→Atos→Caps→Cenas
│   ├── editor/
│   │   └── TipTapEditor.tsx      # Editor rich text
│   └── layout/
│       └── Sidebar.tsx           # Navegação principal
├── hooks/
│   ├── useLLM.ts                 # Hook de streaming LLM
│   └── useLLMSettings.ts         # Configurações de provedor
├── services/
│   └── llm.ts                    # Serviço multi-provedor
├── types/
│   ├── architect.ts              # Tipos do Architect
│   └── bible.ts                  # Tipos da Bible
└── App.tsx                       # Views principais
```

## Views Implementadas

1. **Architect** (`/`) - Geração de conceitos e estrutura com IA
2. **Bible** (`/bible`) - Worldbuilding centralizado
3. **Navigator** (`/navigator`) - Editor com estrutura do livro
4. **Workbench** (`/workbench`) - Lista de projetos

## Decisões Técnicas

### Provedores LLM Suportados
1. **OpenRouter** (recomendado)
2. **Ollama** (local)
3. **OpenAI**
4. **Anthropic**

### Stack
- React 18 + TypeScript + Vite
- Tailwind CSS (Design System Literary Amber)
- TipTap (Editor)
- Firebase (Auth + Firestore) - pendente

### Deploy
- Netlify
