# Análise de Interface - Sudowrite

> Data: 2026-04-06
> Fonte: Prints da versão web do Sudowrite (produto em produção)
> Projeto de referência: "Reset Infinito" do usuário (54.490 palavras)

---

## 1. Dashboard / Home

### Layout
- Grid de cards de projetos
- Card principal mostra: título, palavras, última modificação
- Hover effects sutis nos cards

### Ações Principais
- **+ New** (dropdown): Project / Folder / Series
- **Import Novel** — botão destacado no topo
- Search bar

### Destaque
O botão "Import Novel" é prominente — indica que migração de outros formatos é um caso de uso importante.

---

## 2. Estrutura do Editor

### Layout Tripartido
```
┌─────────────────────────────────────────────────────────┐
│  [Sidebar Esquerda]  │  [Editor Central]  │  [Painel Direito]  │
│                      │                     │                     │
│  - Outline           │  - Texto do ato     │  - History          │
│    (capítulos/atos)  │  - CodeMirror/TipTap│  - Chat/AI          │
│                      │                     │                     │
└─────────────────────────────────────────────────────────┘
```

### Header do Editor
- Título do projeto
- Contador de palavras (ex: "51.774 saved")
- Botão "Save" (manual, apesar do auto-save)
- Status indicators

---

## 3. Story Bible (Painel Inferior)

A Story Bible é **colapsável** e fica abaixo do editor. Isso é crucial — não ocupa espaço quando não está em uso.

### Seções:

#### Braindump
- Campo de texto livre, grande
- Para ideias soltas, notas rápidas

#### Genre
- Dropdown/tags
- Exemplos vistos: Science Fiction, Thriller, Mystery

#### Style
**Três modos de operação:**
1. **Featured Styles** — estilos pré-definidos do Sudowrite
2. **Match My Style** — análise de amostra de texto do usuário
3. **Custom** — descrição livre do estilo desejado

#### Synopsis
- Textarea grande
- Pode ser muito extensa (o do Marcus Chen ocupava várias linhas)

---

## 4. Sistema de Personagens

### Lista de Personagens
- Cards horizontais ou lista vertical
- Quick add: "+ New Character"

### Ficha de Personagem (muito detalhada)

**Campos fixos:**
- Name
- Role (dropdown): Protagonist, Antagonist, Supporting, Minor, Love Interest
- Pronouns

**Campos expansíveis (botão "+ Add Trait"):**
Os campos abaixo são traits adicionáveis — não é um formulário fixo!

- Personality
- Motivations
- Internal Conflict
- Strengths
- Weaknesses
- Character Arc
- Physical Description
- Dialogue Style

**Essa flexibilidade é um diferencial importante.** O usuário não fica preso a um template rígido.

### Personagens vistos no projeto:
- **Marcus Chen** — Protagonista
- **The Architect** — Antagonista

---

## 5. Outline / Estrutura Narrativa

### Hierarquia Visual
```
Capítulo 1: O Fim do Começo
├── Ato 1.1 [3rd person 1st POV]
└── Ato 1.2 [3rd person 1st POV]

Capítulo 2: [título]
├── Ato 2.1
└── ...
```

### Controles por Ato
- **POV Selector**: Dropdown por ato (!)
  - "3rd person 1st POV" visto no exemplo
  - Isso permite POV diferente por ato, não só por projeto
- **Tone Selector**: "Choose tone" (dropdown)

### Ações
- "+ Add Chapter" — adiciona capítulo no final
- "+ Add Act" — adiciona ato ao capítulo atual
- Drag & drop para reordenar (implied pelo padrão de UI)

---

## 6. Ferramentas de Escrita (Write Menu)

### Modal/Panel com opções:

#### Auto
- Autocomplete inteligente
- O clássico "escreve junto comigo"

#### Guided
- Segue instruções específicas do usuário
- Mais controle sobre o output

#### Tone Shift
- Muda o tom do texto selecionado

#### Write Settings
- Configurações globais de geração

---

## 7. Brainstorm (Ferramenta de Ideação)

### Interface
- Cards visuais organizados em grid
- Cada card é uma categoria

### Categorias disponíveis:
- Dialogue
- Characters
- World Building
- Plot Points
- Names
- Places
- Objects
- Descriptions
- Sensory Descriptions
- And more...

### Fluxo de Brainstorm
1. Usuário seleciona categoria
2. Interface expande com:
   - **Prompt**: O que quer gerar?
   - **Context**: Contexto da história (opcional)
   - **Examples**: Pode adicionar exemplos do próprio texto (1, 2, 3...)
   - Botão "Generate"

### Resultado
- Lista de ideias geradas
- Copiar, inserir, ou descartar

---

## 8. More Tools (Menu expandido)

Ferramentas adicionais além das principais:

- **Visualize** — gera imagens/arte conceitual
- **Twist** — sugere reviravoltas na trama
- **Poem** — formatação poética
- **First Draft** — geração de rascunho completo
- **Canvas** — (não explorado nos prints)
- **Feedback** — análise do texto

---

## 9. Plugins / Extensions (Destaque MAJOR)

O Sudowrite tem um **marketplace de plugins** ativo.

### Categorias de Plugins vistos:

#### Análise e Edição
- Better Openers
- Remove Chaff (remover enchimento)
- Dev Edit Show Don't Tell
- Darkly Characters

#### Diálogo
- Dialogue Distinctifier (dar voz única)
- Filler Eradicator

#### Emoção
- Emotion Enhancer
- PassionPen
- Sex Scene in Detail (NSFW)

#### Estrutura
- Character Swap
- Chapter Recap
- Scene Ender

#### Criatividade
- Wonder Playground
- Good Behavior

### Modelo de Negócio dos Plugins
- Alguns são "Featured" (oficiais)
- Outros parecem de terceiros ("Created by...")
- Possível marketplace pago no futuro?

---

## 10. Padrões de UI/UX

### Design System
- **Cores**: Escuro por padrão (dark mode), tons de azul/ciano como accent
- **Tipografia**: Sans-serif clean, hierarquia clara
- **Espaçamento**: Generoso, não parece apertado
- **Cards**: Sombras sutis, bordas arredondadas

### Micro-interações
- Tooltips em botões
- Estados de loading elegantes
- Feedback visual imediato

### Padrões de Formulário
- Labels claros
- Placeholders descritivos
- Campos expansíveis ("+ Add Trait", "+ Add Example")

---

## 11. Diferenciais-Chave vs. QuillRift Atual

| Feature | Sudowrite | QuillRift v0.1 |
|---------|-----------|----------------|
| Story Bible | Completa, colapsável | Parcial, Bible module separado |
| Fichas de Personagem | Altamente flexíveis (traits) | Provavelmente schema fixo |
| POV por Ato | Sim | A definir |
| Marketplace de Plugins | Sim, robusto | Não planejado ainda |
| Brainstorm visual | Cards + exemplos | A definir |
| Tone Shift dedicado | Botão próprio | Provavelmente via prompt |
| Visualize (imagens) | Integrado | Não |

---

## 12. Insights para o QuillRift

### O que copiar:
1. **Story Bible colapsável** — não ocupar espaço do editor
2. **POV por ato** — não por projeto inteiro
3. **Traits expansíveis em personagens** — não schema fixo
4. **Brainstorm visual com cards** — mais intuitivo que lista
5. **Marketplace de plugins** — diferencial a longo prazo

### O que melhorar:
1. **Importação de documentos** — Sudowrite tem botão prominente
2. **Flexibilidade de metadados** — deixar usuário definir o que precisa
3. **Ferramentas de edição** — além de geração, ter análise (Remove Chaff, etc)

### O que não copiar (diferenciação):
1. **NSFW explícito** — manter QuillRift family-friendly/profissional
2. **Dark mode only** — oferecer tema claro também (literary amber)

---

## Anexos

### Prints referenciados:
- Dashboard com projetos
- Editor com Story Bible
- Fichas de personagem (Marcus Chen, The Architect)
- Outline com capítulos e atos
- Menu Write (Auto, Guided, Tone Shift)
- Interface Brainstorm
- Menu More Tools
- Plugins marketplace

---

*Análise feita por KimiClaw para o projeto QuillRift*
