// Tipos principais do KC-QuillRift

// Usuário
export interface User {
  id: string;
  email: string;
  name: string;
  photoURL?: string;
  createdAt: Date;
}

// Projeto/Livro
export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  language: 'pt-BR' | 'en' | 'es';
  genre?: string;
  wordCount: number;
  createdAt: Date;
  updatedAt: Date;
  acts: Act[];
  userId: string;
}

// Ato
export interface Act {
  id: string;
  title: string;
  order: number;
  summary?: string;
  pov?: 'first' | 'second' | 'third-limited' | 'third-omniscient';
  chapters: Chapter[];
}

// Capítulo
export interface Chapter {
  id: string;
  title: string;
  order: number;
  summary?: string;
  scenes: Scene[];
}

// Cena (unidade principal de escrita)
export interface Scene {
  id: string;
  title: string;
  order: number;
  content: string; // JSON do TipTap
  wordCount: number;
  
  // Metadados
  pov?: 'first' | 'second' | 'third-limited' | 'third-omniscient';
  povCharacterId?: string;
  tense?: 'past' | 'present' | 'future';
  
  // Direção para IA
  beats?: string;
  
  // Contexto
  summary?: string;
  
  // Snapshots
  snapshots?: Snapshot[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Snapshot (versão salva)
export interface Snapshot {
  id: string;
  content: string;
  trigger: 'manual' | 'auto' | 'pre-ai' | 'pre-replace';
  label?: string;
  createdAt: Date;
}

// Compêndio
export interface Compendium {
  characters: Character[];
  locations: Location[];
  items: Item[];
  concepts: Concept[];
}

// Personagem
export interface Character {
  id: string;
  name: string;
  aliases: string[];
  description: string;
  appearance?: string;
  personality?: string;
  background?: string;
  goals?: string;
  notes?: string;
  hiddenFromAI?: boolean;
  mentionedIn: string[]; // IDs de cenas
}

// Local
export interface Location {
  id: string;
  name: string;
  aliases: string[];
  description: string;
  significance?: string;
  hiddenFromAI?: boolean;
  mentionedIn: string[];
}

// Item
export interface Item {
  id: string;
  name: string;
  description: string;
  significance?: string;
  hiddenFromAI?: boolean;
  mentionedIn: string[];
}

// Conceito
export interface Concept {
  id: string;
  name: string;
  description: string;
  category?: string;
  hiddenFromAI?: boolean;
}

// Provedor LLM
export interface LLMProvider {
  id: string;
  name: string;
  type: 'ollama' | 'openrouter' | 'openai' | 'anthropic' | 'mistral' | 'custom';
  baseUrl?: string;
  apiKey?: string;
  models: string[];
  defaultModel: string;
  
  // Capabilities
  supportsStreaming: boolean;
  supportsTools: boolean;
  supportsThinking: boolean;
  maxOutputTokens: number;
  temperatureRange: [number, number];
}

// Mensagem para LLM
export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Configurações do projeto
export interface ProjectSettings {
  defaultProvider: string;
  providers: LLMProvider[];
  theme: 'light' | 'dark' | 'system';
  autoSaveInterval: number; // ms
  fontSize: number;
}

// Contexto para IA
export interface AIContext {
  project: Project;
  currentAct: Act;
  currentChapter: Chapter;
  currentScene: Scene;
  selectedCharacters: string[];
  selectedLocations: string[];
  selectedItems: string[];
  previousScenes?: Scene[];
}
