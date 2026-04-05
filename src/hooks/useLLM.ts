import { useState, useCallback, useRef } from 'react';
import { LLMService, ARCHITECT_PROMPT } from '../services/llm';
import type { LLMConfig, LLMMessage } from '../services/llm';

interface UseLLMOptions {
  config: LLMConfig;
}

interface UseLLMReturn {
  isLoading: boolean;
  error: string | null;
  streamContent: string;
  completeContent: string;
  generate: (prompt: string, systemPrompt?: string) => Promise<void>;
  generateArchitectConcept: (userPrompt: string) => Promise<void>;
  reset: () => void;
}

export function useLLM({ config }: UseLLMOptions): UseLLMReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamContent, setStreamContent] = useState('');
  const [completeContent, setCompleteContent] = useState('');
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setStreamContent('');
    setCompleteContent('');
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const generate = useCallback(async (prompt: string, systemPrompt?: string) => {
    setIsLoading(true);
    setError(null);
    setStreamContent('');
    setCompleteContent('');

    const service = new LLMService(config);
    
    const messages: LLMMessage[] = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    try {
      let fullText = '';
      for await (const chunk of service.streamCompletion(messages)) {
        fullText += chunk;
        setStreamContent(fullText);
      }
      setCompleteContent(fullText);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [config]);

  const generateArchitectConcept = useCallback(async (userPrompt: string) => {
    const architectPrompt = `${ARCHITECT_PROMPT}\n\nIdeia do autor: ${userPrompt}`;
    await generate(architectPrompt, ARCHITECT_PROMPT);
  }, [generate]);

  return {
    isLoading,
    error,
    streamContent,
    completeContent,
    generate,
    generateArchitectConcept,
    reset,
  };
}

// Hook para gerenciar configuração de LLM (persistida no localStorage)
const STORAGE_KEY = 'kc-quillrift-llm-config';

export interface LLMSettings {
  provider: 'openrouter' | 'ollama' | 'openai' | 'anthropic';
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

const DEFAULT_SETTINGS: LLMSettings = {
  provider: 'openrouter',
  apiKey: '',
  model: 'anthropic/claude-3.5-sonnet',
  temperature: 0.7,
  maxTokens: 4000,
};

export function useLLMSettings(): {
  settings: LLMSettings;
  updateSettings: (settings: Partial<LLMSettings>) => void;
  isConfigured: boolean;
} {
  const [settings, setSettings] = useState<LLMSettings>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
    return DEFAULT_SETTINGS;
  });

  const updateSettings = useCallback((newSettings: Partial<LLMSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isConfigured = settings.apiKey !== '' || settings.provider === 'ollama';

  return { settings, updateSettings, isConfigured };
}
