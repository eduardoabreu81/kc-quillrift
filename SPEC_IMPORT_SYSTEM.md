# Sistema de Importação Inteligente - QuillRift

## Princípio Central
**Agnóstico de idioma e formato.** Não depende de palavras-chave específicas ("Chapter", "Capítulo", "Personagem"), mas sim de análise semântica do conteúdo.

---

## 1. Detecção de Tipo de Documento

### Método: Análise por LLM
Em vez de regex ou palavras-chave, usamos um modelo leve para classificar:

```typescript
type DocumentType = 
  | 'manuscript'      // Texto narrativo, capítulos, cenas
  | 'character_bible' // Fichas de personagens, perfis
  | 'world_bible'     // Regras do universo, lore, settings
  | 'timeline'        // Eventos em ordem cronológica
  | 'outline'         // Estrutura, sumários, beats
  | 'mixed'           // Combinação dos acima
  | 'unknown';        // Não identificado
```

### Prompt de Detecção (multi-idioma)
```
Analise este documento e classifique seu tipo principal.

Conteúdo: [primeiros 2000 caracteres do arquivo]

Responda apenas com JSON:
{
  "type": "manuscript|character_bible|world_bible|timeline|outline|mixed|unknown",
  "confidence": 0.0-1.0,
  "detectedLanguage": "pt|en|es|fr|...",
  "suggestedModule": "editor|characters|bible|timeline|saga"
}
```

### Heurísticas de Backup (quando LLM não disponível)
Se offline ou sem créditos de API:
- Contém muitos diálogos (travessão, aspas) → manuscript
- Lista de nomes com descrições físicas → character_bible
- Datas, anos, eventos sequenciais → timeline
- Seções tipo "Regras", "Leis", "Sistema" → world_bible

---

## 2. Parseamento Inteligente por Tipo

### 2.1 Manuscrito → Editor

**Detecção de estrutura:**
- Identifica divisões lógicas (capítulos, atos, cenas)
- Aceita múltiplos padrões no mesmo documento

**Padrões reconhecidos:**
```
# Capítulo 1
## Capítulo 1 - O Início
Capítulo 1
1. O Despertar
=== Capítulo 1 ===
Chapter One
Act I / Ato I
Scene 1 / Cena 1
```

**Extração de metadados:**
- Título do capítulo (se houver)
- POV (detecta por análise: "Eu vi..." → 1ª pessoa, "Ele viu..." → 3ª)
- Tempo verbal (presente/passado via análise linguística)
- Contagem de palavras por seção

**Fluxo:**
```
Upload DOCX/MD/TXT
    ↓
Extrair texto bruto
    ↓
Detectar divisões de capítulo
    ↓
Para cada capítulo:
  - Detectar POV
  - Detectar tempo verbal
  - Contar palavras
  - Criar estrutura no Editor
    ↓
Apresentar preview antes de confirmar
```

### 2.2 Character Bible → Módulo Characters

**Estruturas suportadas:**
Markdown estruturado (seus documentos):
```markdown
### 1. Marcus Chen
- **Nome completo:** Marcus Chen
- **Idade:** 28 anos
- **Poderes:** Reset Temporal
...
```

Tabela/CSV:
```
Nome,Idade,Poder,Motivação
Marcus Chen,28,Reset,Sobreviver
```

Texto livre (para AI parsear):
```
Marcus Chen tem 28 anos e trabalha como analista de dados. 
Ele tem o poder de resetar o tempo ao morrer...
```

**Extração de campos:**
```typescript
interface ExtractedCharacter {
  name: string;
  fullName?: string;
  age?: number | string;
  origin?: string;
  physicalDescription?: string;
  personality?: string;
  motivations?: string;
  powers?: string[];
  role?: 'protagonist' | 'antagonist' | 'supporting' | 'minor';
  // Campos customizados (traits expansíveis)
  customFields: Record<string, string>;
}
```

**AI complementa (opcional):**
Após importação:
- "Detectei 12 personagens. Para 3 deles, a descrição física está incompleta. Vamos completar juntos?"
- "O personagem 'Elena' tem motivação de vingança, mas não há detalhes sobre quem ela busca. Quer adicionar isso juntos?"

### 2.3 World Bible → Módulo Bible

**Seções detectadas:**
- Regras do universo / Laws of the universe
- Sistemas de poder / Power systems
- Geografia / Geography
- História / History
- Cultura / Culture
- Tecnologia / Technology

**Mapeamento:**
```
# REGRAS DO UNIVERSO → Seção "Regras"
# O RESET TEMPORAL → Entrada "Reset Temporal"
# O SISTEMA AION → Entrada "Sistema Aion"
```

### 2.4 Timeline → Módulo Timeline

**Formatos aceitos:**
- Lista com datas: "1947 - Evento X", "2024 - Evento Y"
- Tabela: Data | Evento | Personagens
- Texto corrido (AI extrai eventos sequenciais)

**Extração:**
```typescript
interface TimelineEvent {
  date: string; // pode ser "1947", "Ano 1", "Era do Despertar"
  title: string;
  description: string;
  charactersInvolved?: string[];
  bookReference?: string; // Livro 1, Livro 2...
}
```

### 2.5 Outline → Estrutura do Projeto

Importa direto como estrutura de capítulos/atos no editor:
```
Livro 1: O Despertar
  Capítulo 1: O Fim do Começo
    Ato 1.1: A morte
    Ato 1.2: O retorno
  Capítulo 2: ...
```

---

## 3. Interface de Importação

### Fluxo do Usuário

```
[Botão "Import Document" na Dashboard]
              ↓
[Upload de arquivo: DOCX, MD, TXT, PDF*]
              ↓
[Análise em progresso...]
              ↓
[Preview do que foi detectado]
  ├─ Tipo: Dossiê de Personagens
  ├─ Idioma: Português (detectado)
  ├─ Itens encontrados: 19 personagens
  └─ [Lista preview dos personagens]
              ↓
[Mapeamento de campos]
  "O campo 'Poderes' no seu documento corresponde a qual campo do QuillRift?"
  [Dropdown: Poderes / Habilidades / Notas / Criar novo campo]
              ↓
[Confirmação final]
              ↓
[Importação com sucesso!]
  "19 personagens importados. 
   3 fichas têm campos incompletos. 
   [Ver fichas] [Completar com AI]"
```

### Tela de Preview
Mostra lado a lado:
- **Esquerda:** Conteúdo original (resumido)
- **Direita:** Como ficará no QuillRift
- **Checkboxes:** Selecionar quais itens importar (não é tudo ou nada)

---

## 4. Caso Específico: Reset Infinito

### Mapeamento dos seus documentos:

| Arquivo | Tipo Detectado | Destino no QuillRift | Itens |
|---------|---------------|----------------------|-------|
| `Biblia_Oficial_v3.md` | world_bible | Bible module | Regras, proibições, formatação, sementes |
| `Dossie_Personagens_v4.md` | character_bible | Characters module | 19 fichas de personagens |
| `Timeline-Definitivo-Livro-1.docx` | timeline | Timeline module | Eventos cronológicos |
| `Reset_Infinito_V8.docx` | manuscript | Editor | Capítulos, cenas, texto |

### Pós-importação sugerida:
Após importar todos:
1. **Cross-reference automático:**
   - Personagens da ficha → Marcados como presentes nas cenas
   - Eventos da timeline → Vinculados aos capítulos onde ocorrem
   - Regras da bíblia → Disponíveis como "Contexto" no Workshop

2. **Validação:**
   - "Sua Bíblia proíbe usar o termo 'energia aiônica' no Livro 1. 
      Detectei 3 ocorrências no manuscrito importado. Corrigir?"

---

## 5. Implementação Técnica

### Bibliotecas necessárias:
```javascript
// Parseamento de documentos
import mammoth from 'mammoth';        // DOCX → HTML/Markdown
import pdfParse from 'pdf-parse';     // PDF → texto (se necessário)

// Análise linguística (opcional, para heurísticas offline)
import natural from 'natural';        // Tokenização, stemmers

// LLM para análise semântica
// Usar mesmo sistema do Workshop (OpenRouter/OpenAI/etc)
```

### Estrutura de API:
```typescript
// POST /api/import/analyze
// Recebe: arquivo binário
// Retorna: { type, confidence, language, preview }

// POST /api/import/parse
// Recebe: arquivo + tipo confirmado + mapeamento de campos
// Retorna: { items: ParsedItem[], warnings: string[] }

// POST /api/import/confirm
// Recebe: items selecionados + projectId
// Retorna: { imported: number, errors: Error[] }
```

### Banco de Dados:
Nova tabela `imports`:
```sql
CREATE TABLE imports (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  filename TEXT,
  file_type VARCHAR(10), -- docx, md, txt
  detected_type VARCHAR(20),
  detected_language VARCHAR(10),
  status VARCHAR(20), -- analyzing, parsed, confirmed, error
  preview JSONB,       -- estrutura detectada
  created_at TIMESTAMP
);
```

---

## 6. Roadmap de Implementação

### Fase 1: MVP (v0.3)
- Upload de MD e TXT
- Detecção básica por LLM
- Parseamento de Character Bible (formato estruturado)
- Importação para Characters module

### Fase 2: Manuscritos (v0.4)
- Suporte a DOCX
- Detecção de estrutura de capítulos
- Importação para Editor com hierarquia
- Preview antes de confirmar

### Fase 3: Inteligência (v0.5)
- Parseamento de texto livre (não estruturado)
- AI sugere completude de fichas
- Cross-reference entre módulos
- Validação contra regras da Bíblia

### Fase 4: Multi-idioma refinado (v0.6)
- Otimização para espanhol, francês, alemão
- Detecção automática de encoding
- Suporte a scripts não-latinos (japonês, árabe)

---

## Notas

- **Privacidade:** Análise pode ser feita com modelo local (Ollama/LM Studio) para quem não quer mandar dados para API externa
- **Fallback:** Sempre permitir importação manual/assistida se detecção automática falhar
- **Idempotência:** Importar o mesmo arquivo 2x não duplica, atualiza registros existentes (match por nome)
