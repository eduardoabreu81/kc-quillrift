# KC-QuillRift

> Studio de Escrita com IA — Gratuito, Open Source, Contexto Infinito

## 🎯 Visão

KC-QuillRift é um studio de escrita com IA para autores de long-form fiction. Substitui ferramentas pagas como Sudowrite ($19-59/mês) e NovelCrafter (~$10/mês) com uma alternativa 100% gratuita, open source, com dados locais e privados.

### Concorrentes Analisados

| Ferramenta | Tipo | Preço | O que Copiar | O que Rejeitar |
|------------|------|-------|--------------|----------------|
| **Sudowrite** | SaaS | $19-59/mês | Story Bible, Describe (5 sentidos), Feedback | Sistema de créditos, preço |
| **NovelCrafter** | SaaS | ~$10/mês | Context Selector (killer feature), Snapshots | Bugs de export, perda de dados |
| **Writingway** | Open Source (Python) | Grátis | Action Beats, LLM Preview modal | CLI, falta rich text |
| **SAGA** | Open Source (Python CLI) | Grátis | Knowledge Graph, Extração automática, Validação | Complexidade (Neo4j, Docker), CLI |

### Diferenciais

- ✅ **100% Gratuito** — sem créditos, sem ansiedade
- ✅ **Open Source** — código aberto, comunidade
- ✅ **Contexto "Infinito"** — armazenamento local + sync Firebase
- ✅ **100% Privado** — dados só saem se você quiser
- ✅ **Multi-provedor** — Ollama (local) + OpenRouter + OpenAI
- ✅ **Web App** — zero instalação, funciona em qualquer lugar
- ✅ **Knowledge Graph simplificado** — inspiração SAGA, mas sem Neo4j

## 🚀 Stack Tecnológica

- **Frontend:** React 18 + TypeScript + Vite
- **Editor:** TipTap (ProseMirror) — rich text profissional
- **Estilização:** Tailwind CSS 4 + Design System Literary Amber
- **Backend:** Firebase (Auth + Firestore + Storage)
- **Sync:** Firestore offline persistence + TanStack Query
- **Deploy:** Netlify (CI/CD automático)

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── editor/         # TipTap editor
│   ├── layout/         # Sidebar, Header
│   └── ui/             # Componentes UI reutilizáveis
├── modules/
│   ├── editor/         # Lógica do editor
│   ├── compendium/     # Worldbuilding
│   ├── workshop/       # Chat com IA
│   └── settings/       # Configurações
├── hooks/              # Hooks customizados
├── lib/                # Firebase, utilitários
├── types/              # Tipos TypeScript
└── data/               # Dados estáticos
```

## 🛠️ Configuração Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto (ou use existente)
3. Ative Authentication (Google, Email) e Firestore
4. Copie as credenciais em `src/lib/firebase.ts`

```typescript
const firebaseConfig = {
  apiKey: "sua-api-key",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

## 🚀 Deploy

### Local

```bash
npm install
npm run dev
```

### Produção (Netlify)

1. Conecte o repo ao Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy automático a cada push

## 🗺️ Roadmap

### Fase 0: Setup ✅
- [x] Projeto Vite + React + TypeScript
- [x] Tailwind CSS + Design System
- [x] TipTap Editor
- [x] Estrutura de pastas

### Fase 1: Core de Escrita (Atual)
- [ ] Firebase Auth + Firestore
- [ ] Estrutura: Book → Act → Chapter → Scene
- [ ] Context Selector (checkboxes)
- [ ] Compêndio (personagens, locais)
- [ ] Action Beats
- [ ] LLM Preview (Apply/Retry)

### Fase 2: IA & Sync
- [ ] Multi-provider (Ollama, OpenRouter)
- [ ] Snapshots (autosave)
- [ ] Offline persistence
- [ ] Story Bible wizard

### Fase 3: Polish
- [ ] Export DOCX, Markdown
- [ ] Rewrite, Describe (5 sentidos)
- [ ] TTS (Web Speech API)

### Fase 4: Beta
- [ ] Testes com usuários
- [ ] Ajustes UX
- [ ] Documentação

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit (`git commit -m 'Adiciona nova feature'`)
4. Push (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

MIT License — veja [LICENSE](LICENSE) para detalhes.

---

**Feito com ❤️ para escritores**
