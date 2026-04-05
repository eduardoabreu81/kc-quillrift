// Serviço de integração com múltiplos provedores LLM

export type LLMProvider = 'openrouter' | 'ollama' | 'openai' | 'anthropic';

export interface LLMConfig {
  provider: LLMProvider;
  apiKey?: string;
  baseUrl?: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
}

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMStreamCallbacks {
  onChunk: (chunk: string) => void;
  onComplete: (fullText: string) => void;
  onError: (error: Error) => void;
}

const DEFAULT_CONFIGS: Record<LLMProvider, Partial<LLMConfig>> = {
  openrouter: {
    baseUrl: 'https://openrouter.ai/api/v1',
    model: 'anthropic/claude-3.5-sonnet',
    temperature: 0.7,
    maxTokens: 4000,
  },
  ollama: {
    baseUrl: 'http://localhost:11434',
    model: 'llama3.2',
    temperature: 0.7,
    maxTokens: 4000,
  },
  openai: {
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 4000,
  },
  anthropic: {
    baseUrl: 'https://api.anthropic.com/v1',
    model: 'claude-3-5-sonnet-20241022',
    temperature: 0.7,
    maxTokens: 4000,
  },
};

export class LLMService {
  private config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = { ...DEFAULT_CONFIGS[config.provider], ...config };
  }

  async *streamCompletion(messages: LLMMessage[]): AsyncGenerator<string> {
    const { provider, apiKey, baseUrl, model, temperature, maxTokens } = this.config;

    if (!apiKey && provider !== 'ollama') {
      throw new Error(`API key required for ${provider}`);
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    let body: Record<string, unknown>;
    let url: string;

    switch (provider) {
      case 'openrouter':
        headers['Authorization'] = `Bearer ${apiKey}`;
        headers['HTTP-Referer'] = window.location.origin;
        headers['X-Title'] = 'KC-QuillRift';
        url = `${baseUrl}/chat/completions`;
        body = {
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
          stream: true,
        };
        break;

      case 'ollama':
        url = `${baseUrl}/api/chat`;
        body = {
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
          stream: true,
        };
        break;

      case 'openai':
        headers['Authorization'] = `Bearer ${apiKey}`;
        url = `${baseUrl}/chat/completions`;
        body = {
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
          stream: true,
        };
        break;

      case 'anthropic':
        headers['x-api-key'] = apiKey!;
        headers['anthropic-version'] = '2023-06-01';
        url = `${baseUrl}/messages`;
        body = {
          model,
          messages: messages.filter(m => m.role !== 'system'),
          system: messages.find(m => m.role === 'system')?.content,
          temperature,
          max_tokens: maxTokens,
          stream: true,
        };
        break;

      default:
        throw new Error(`Unknown provider: ${provider}`);
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`LLM API error: ${error}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === 'data: [DONE]') continue;

          if (trimmed.startsWith('data: ')) {
            try {
              const data = JSON.parse(trimmed.slice(6));
              let chunk = '';

              if (provider === 'anthropic') {
                if (data.type === 'content_block_delta') {
                  chunk = data.delta?.text || '';
                }
              } else if (provider === 'ollama') {
                chunk = data.message?.content || '';
              } else {
                chunk = data.choices?.[0]?.delta?.content || '';
              }

              if (chunk) {
                yield chunk;
              }
            } catch (e) {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  async complete(messages: LLMMessage[]): Promise<string> {
    let fullText = '';
    for await (const chunk of this.streamCompletion(messages)) {
      fullText += chunk;
    }
    return fullText;
  }
}

// Prompts específicos para cada agente
export const ARCHITECT_PROMPT = `Você é o Architect, um co-autor especialista em estrutura narrativa para ficção.

Sua tarefa: Receber uma ideia de história e gerar um conceito completo com estrutura de série/livros.

Responda APENAS em JSON válido com esta estrutura:
{
  "title": "Título da obra",
  "subtitle": "Subtítulo/slogan",
  "genre": "Gênero principal",
  "tone": "Tom/estilo narrativo",
  "logline": "Uma frase que resume a premissa",
  "concept": "Parágrafo expandindo a ideia",
  "structure": {
    "format": "standalone|duology|trilogy|series",
    "books": [
      {
        "number": 1,
        "title": "Título do livro",
        "subtitle": "Subtítulo",
        "arc": "Arco principal",
        "chapters": 12,
        "summary": "Resumo do livro"
      }
    ]
  }
}

Regras:
- Seja criativo mas coerente
- Estruture arcos dramáticos claros
- Varie o número de capítulos conforme necessário
- O concept deve ser envolvente e específico`;
