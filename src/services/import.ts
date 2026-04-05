import mammoth from 'mammoth';

export type DocumentType = 
  | 'manuscript'
  | 'character_bible'
  | 'world_bible'
  | 'timeline'
  | 'outline'
  | 'mixed'
  | 'unknown';

export interface ImportAnalysis {
  type: DocumentType;
  confidence: number;
  language: string;
  suggestedModule: string;
  preview: string;
  itemCount?: number;
}

export interface ParsedCharacter {
  id: string;
  name: string;
  fullName?: string;
  age?: string;
  origin?: string;
  physicalDescription?: string;
  personality?: string;
  motivations?: string;
  powers?: string;
  role?: 'protagonist' | 'antagonist' | 'supporting' | 'minor';
  customFields: Record<string, string>;
  rawContent: string;
}

export interface ParsedChapter {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  scenes?: ParsedScene[];
}

export interface ParsedScene {
  id: string;
  title: string;
  content: string;
  pov?: string;
  tense?: 'present' | 'past';
}

export interface ParsedTimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  characters?: string[];
}

export interface ParsedBibleEntry {
  id: string;
  section: string;
  title: string;
  content: string;
}

export interface ImportResult {
  type: DocumentType;
  characters?: ParsedCharacter[];
  chapters?: ParsedChapter[];
  events?: ParsedTimelineEvent[];
  bibleEntries?: ParsedBibleEntry[];
  rawText?: string;
  warnings: string[];
}

// Extrair texto de diferentes formatos
export async function extractText(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  if (extension === 'docx') {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }
  
  if (extension === 'md' || extension === 'txt') {
    return await file.text();
  }
  
  throw new Error(`Formato .${extension} não suportado ainda`);
}

// Análise simples de tipo (heurística)
export function analyzeDocument(text: string): ImportAnalysis {
  const sample = text.slice(0, 3000).toLowerCase();
  
  // Detecção de personagens
  const hasCharacterPatterns = 
    /nome|personagem|character|idade|age|poder|power|habilidade|ability/i.test(sample) &&
    (sample.match(/^#{1,3}\s+\d*\.?\s*\w+/gm)?.length || 0) > 3;
  
  // Detecção de timeline
  const hasTimelinePatterns = 
    /(\d{4}|ano|year|d\.?c\.?|a\.?c\.?)/i.test(sample) &&
    sample.includes('event') || sample.includes('evento');
  
  // Detecção de bíblia de mundo
  const hasWorldBiblePatterns = 
    /regras?|rules?|sistema|system|universo|universe|lore|bíblia|bible/i.test(sample) &&
    sample.includes('##');
  
  // Detecção de manuscrito (capítulos)
  const hasChapterPatterns = 
    /capítulo|chapter|ato|act|cena|scene/i.test(sample) &&
    text.length > 5000;
  
  if (hasCharacterPatterns && !hasChapterPatterns) {
    const itemCount = (text.match(/^#{1,3}\s+\d*\.?\s*\w+/gm) || []).length;
    return {
      type: 'character_bible',
      confidence: 0.8,
      language: detectLanguage(sample),
      suggestedModule: 'characters',
      preview: `Detectado dossiê de personagens com aproximadamente ${itemCount} entradas`,
      itemCount
    };
  }
  
  if (hasTimelinePatterns) {
    return {
      type: 'timeline',
      confidence: 0.7,
      language: detectLanguage(sample),
      suggestedModule: 'timeline',
      preview: 'Detectada linha do tempo com eventos cronológicos'
    };
  }
  
  if (hasWorldBiblePatterns) {
    return {
      type: 'world_bible',
      confidence: 0.75,
      language: detectLanguage(sample),
      suggestedModule: 'bible',
      preview: 'Detectada bíblia de mundo com regras e lore'
    };
  }
  
  if (hasChapterPatterns) {
    const chapterCount = (text.match(/capítulo|chapter/gi) || []).length;
    return {
      type: 'manuscript',
      confidence: 0.85,
      language: detectLanguage(sample),
      suggestedModule: 'editor',
      preview: `Detectado manuscrito com aproximadamente ${chapterCount} capítulos`,
      itemCount: chapterCount
    };
  }
  
  return {
    type: 'unknown',
    confidence: 0.3,
    language: detectLanguage(sample),
    suggestedModule: 'editor',
    preview: 'Tipo de documento não identificado com certeza. Importar como texto?'
  };
}

// Detecção simples de idioma
function detectLanguage(text: string): string {
  const ptWords = ['de', 'da', 'do', 'para', 'com', 'por', 'uma', 'que', 'não'];
  const enWords = ['the', 'and', 'for', 'with', 'from', 'this', 'that', 'have', 'been'];
  
  const words = text.toLowerCase().split(/\s+/);
  const ptCount = ptWords.filter(w => words.includes(w)).length;
  const enCount = enWords.filter(w => words.includes(w)).length;
  
  if (ptCount > enCount) return 'pt';
  if (enCount > ptCount) return 'en';
  return 'unknown';
}

// Parsear dossiê de personagens
export function parseCharacterBible(text: string): ParsedCharacter[] {
  const characters: ParsedCharacter[] = [];
  
  // Dividir por headers de personagem (### 1. Nome ou ### Nome)
  const sections = text.split(/^#{1,3}\s+\d*\.?\s*/m).filter(Boolean);
  
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i].trim();
    if (!section) continue;
    
    const lines = section.split('\n');
    const nameLine = lines[0].trim();
    const name = nameLine.replace(/^[-–\s]+/, '').split('–')[0].trim();
    
    const character: ParsedCharacter = {
      id: `char_${Date.now()}_${i}`,
      name: name || `Personagem ${i + 1}`,
      rawContent: section,
      customFields: {}
    };
    
    // Extrair campos comuns
    const content = section.toLowerCase();
    
    // Nome completo
    const fullNameMatch = section.match(/\*\*?Nome completo:?\*\*?\s*:\s*(.+)/i);
    if (fullNameMatch) character.fullName = fullNameMatch[1].trim();
    
    // Idade
    const ageMatch = section.match(/\*\*?Idade:?\*\*?\s*:\s*(.+)/i);
    if (ageMatch) character.age = ageMatch[1].trim();
    
    // Origem
    const originMatch = section.match(/\*\*?Origem:?\*\*?\s*:\s*(.+)/i);
    if (originMatch) character.origin = originMatch[1].trim();
    
    // Poderes
    const powersMatch = section.match(/\*\*?Poderes?:?\*\*?\s*:\s*([\s\S]+?)(?=\n\s*\*\*|$)/i);
    if (powersMatch) character.powers = powersMatch[1].trim();
    
    // Motivação
    const motivationMatch = section.match(/\*\*?Motivação:?\*\*?\s*:\s*(.+)/i);
    if (motivationMatch) character.motivations = motivationMatch[1].trim();
    
    // Descrição física
    const physicalMatch = section.match(/\*\*?(Características físicas|Physical description):?\*\*?\s*:\s*([\s\S]+?)(?=\n\s*\*\*|$)/i);
    if (physicalMatch) character.physicalDescription = physicalMatch[2].trim();
    
    // Personalidade
    const personalityMatch = section.match(/\*\*?Personalidade:?\*\*?\s*:\s*(.+)/i);
    if (personalityMatch) character.personality = personalityMatch[1].trim();
    
    // Detectar role
    if (content.includes('protagonist') || content.includes('protagonista')) {
      character.role = 'protagonist';
    } else if (content.includes('antagonist') || content.includes('antagonista')) {
      character.role = 'antagonist';
    } else if (content.includes('supporting') || content.includes('secundário')) {
      character.role = 'supporting';
    }
    
    characters.push(character);
  }
  
  return characters.filter(c => c.name.length > 1);
}

// Parsear capítulos de manuscrito
export function parseManuscript(text: string): ParsedChapter[] {
  const chapters: ParsedChapter[] = [];
  
  // Padrões de capítulo em PT e EN
  const chapterPattern = /(?:^|\n)\s*(?:#{1,2}\s*)?(?:Capítulo|Chapter)\s*(\d+|[IVX]+)[:\s.-]*([^\n]*)/gi;
  const matches = [...text.matchAll(chapterPattern)];
  
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const startIndex = match.index!;
    const endIndex = i < matches.length - 1 ? matches[i + 1].index! : text.length;
    
    const chapterNum = match[1];
    const chapterTitle = match[2]?.trim() || `Capítulo ${chapterNum}`;
    const content = text.slice(startIndex, endIndex).trim();
    
    // Tentar extrair cenas (separadas por ### ou duas quebras de linha)
    const scenes = extractScenes(content);
    
    chapters.push({
      id: `chap_${Date.now()}_${i}`,
      title: chapterTitle || `Capítulo ${chapterNum}`,
      content: content,
      wordCount: content.split(/\s+/).length,
      scenes
    });
  }
  
  // Se não achou capítulos, tratar como documento único
  if (chapters.length === 0 && text.length > 100) {
    chapters.push({
      id: `chap_${Date.now()}_0`,
      title: 'Documento Importado',
      content: text,
      wordCount: text.split(/\s+/).length
    });
  }
  
  return chapters;
}

function extractScenes(chapterContent: string): ParsedScene[] {
  const scenes: ParsedScene[] = [];
  
  // Padrão: ### Cena X ou ### Scene X
  const scenePattern = /(?:^|\n)\s*#{1,3}\s*(?:Cena|Scene)\s*(\d+)[:\s.-]*([^\n]*)/gi;
  const matches = [...chapterContent.matchAll(scenePattern)];
  
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const startIndex = match.index!;
    const endIndex = i < matches.length - 1 ? matches[i + 1].index! : chapterContent.length;
    
    const content = chapterContent.slice(startIndex, endIndex).trim();
    
    // Detectar POV (primeira pessoa vs terceira)
    const firstFewLines = content.slice(0, 500);
    const firstPersonCount = (firstFewLines.match(/\b(eu|me|mim|minha|meu)\b/gi) || []).length;
    const thirdPersonCount = (firstFewLines.match(/\b(ele|ela|dele|dela|o |a )\b/gi) || []).length;
    
    scenes.push({
      id: `scene_${Date.now()}_${i}`,
      title: match[2]?.trim() || `Cena ${match[1]}`,
      content: content,
      pov: firstPersonCount > thirdPersonCount ? '1st' : '3rd',
      tense: detectTense(content)
    });
  }
  
  return scenes;
}

function detectTense(text: string): 'present' | 'past' {
  const sample = text.slice(0, 1000).toLowerCase();
  
  // Verbos no passado (PT)
  const pastMarkers = ['foi', 'era', 'estava', 'tinha', 'fiz', 'disse', 'viu', 'chegou'];
  // Verbos no presente (PT)
  const presentMarkers = ['é', 'está', 'tem', 'faz', 'diz', 'vê', 'chega', 'sou', 'estou'];
  
  const pastCount = pastMarkers.filter(m => sample.includes(m)).length;
  const presentCount = presentMarkers.filter(m => sample.includes(m)).length;
  
  return presentCount > pastCount ? 'present' : 'past';
}

// Parsear timeline
export function parseTimeline(text: string): ParsedTimelineEvent[] {
  const events: ParsedTimelineEvent[] = [];
  
  // Padrões de data: 1947, Ano 1, 2024, etc.
  const eventPattern = /(?:^|\n)\s*(?:[-•*]\s*)?(\d{4}|Ano\s*\d+|\d{2}\/\d{2}\/\d{4})[:\s.-]+([^\n]+)/gi;
  const matches = [...text.matchAll(eventPattern)];
  
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const date = match[1].trim();
    const title = match[2].trim();
    
    // Tentar pegar descrição nas linhas seguintes
    const startIndex = match.index! + match[0].length;
    const nextMatchIndex = i < matches.length - 1 ? matches[i + 1].index! : text.length;
    const description = text.slice(startIndex, nextMatchIndex).trim();
    
    events.push({
      id: `event_${Date.now()}_${i}`,
      date,
      title,
      description: description.slice(0, 500) // Limitar descrição
    });
  }
  
  return events;
}

// Parsear bíblia de mundo
export function parseWorldBible(text: string): ParsedBibleEntry[] {
  const entries: ParsedBibleEntry[] = [];
  
  // Dividir por seções principais (## Título)
  const sections = text.split(/^##\s+/m).filter(Boolean);
  
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i].trim();
    const lines = section.split('\n');
    const title = lines[0].trim();
    const content = lines.slice(1).join('\n').trim();
    
    if (title && content) {
      entries.push({
        id: `bible_${Date.now()}_${i}`,
        section: 'Geral',
        title,
        content: content.slice(0, 2000) // Limitar tamanho
      });
    }
  }
  
  return entries;
}

// Função principal de parseamento
export async function parseDocument(file: File): Promise<ImportResult> {
  const text = await extractText(file);
  const analysis = analyzeDocument(text);
  
  const result: ImportResult = {
    type: analysis.type,
    warnings: []
  };
  
  switch (analysis.type) {
    case 'character_bible':
      result.characters = parseCharacterBible(text);
      if (result.characters.length === 0) {
        result.warnings.push('Não foi possível extrair personagens automaticamente');
      }
      break;
      
    case 'manuscript':
      result.chapters = parseManuscript(text);
      if (result.chapters.length === 0) {
        result.warnings.push('Não foi possível detectar estrutura de capítulos');
      }
      break;
      
    case 'timeline':
      result.events = parseTimeline(text);
      break;
      
    case 'world_bible':
      result.bibleEntries = parseWorldBible(text);
      break;
      
    default:
      result.rawText = text;
      result.warnings.push('Tipo não identificado. Importando como texto bruto.');
  }
  
  return result;
}

// Verificar completude de personagens
export function checkCharacterCompleteness(character: ParsedCharacter): string[] {
  const missing: string[] = [];
  
  if (!character.physicalDescription) missing.push('descrição física');
  if (!character.motivations) missing.push('motivação');
  if (!character.personality) missing.push('personalidade');
  if (!character.powers && character.role !== 'minor') missing.push('poderes ou habilidades');
  
  return missing;
}
