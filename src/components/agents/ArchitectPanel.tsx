import { useState } from 'react';
import { cn } from '../../lib/utils';
import { useLLM, useLLMSettings } from '../../hooks/useLLM';
import { Settings, Sparkles, BookOpen, ChevronDown, ChevronUp, Plus, Loader2, AlertCircle } from 'lucide-react';

interface ConceptVariant {
  id: string;
  title: string;
  subtitle: string;
  genre: string;
  tone: string;
  logline: string;
  concept: string;
  structure: {
    format: 'standalone' | 'duology' | 'trilogy' | 'series';
    books: Array<{
      number: number;
      title: string;
      subtitle: string;
      arc: string;
      chapters: number;
      summary: string;
    }>;
  };
}

export function ArchitectPanel() {
  const [prompt, setPrompt] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [variants, setVariants] = useState<ConceptVariant[]>([]);
  const [expandedVariant, setExpandedVariant] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  
  const { settings, updateSettings, isConfigured } = useLLMSettings();
  const { isLoading, error, streamContent, generate } = useLLM({ 
    config: {
      provider: settings.provider,
      apiKey: settings.apiKey,
      model: settings.model,
      temperature: settings.temperature,
      maxTokens: settings.maxTokens,
    }
  });

  const handleGenerate = async () => {
    if (!prompt.trim() || !isConfigured) return;
    
    const systemPrompt = `Você é o Architect, um co-autor especialista em estrutura narrativa.

Gere EXATAMENTE 3 variações de conceito para a ideia do autor.

Responda em JSON válido com esta estrutura:
{
  "variants": [
    {
      "id": "v1",
      "title": "Título",
      "subtitle": "Subtítulo",
      "genre": "Gênero",
      "tone": "Tom/estilo",
      "logline": "Uma frase de impacto",
      "concept": "Parágrafo descritivo",
      "structure": {
        "format": "standalone|duology|trilogy|series",
        "books": [
          {
            "number": 1,
            "title": "Título",
            "subtitle": "Subtítulo",
            "arc": "Arco dramático",
            "chapters": 12,
            "summary": "Resumo"
          }
        ]
      }
    }
  ]
}

Regras:
- 3 variações distintas (v1, v2, v3)
- Cada uma com abordagem diferente (saga épica, thriller focado, drama íntimo)
- Estruturas variadas (standalone a série)
- Seja específico e criativo`;

    await generate(prompt, systemPrompt);
    
    // Tenta fazer parse do resultado
    try {
      const match = streamContent.match(/\{[\s\S]*\}/);
      if (match) {
        const data = JSON.parse(match[0]);
        if (data.variants) {
          setVariants(data.variants);
        }
      }
    } catch (e) {
      console.error('Failed to parse LLM response:', e);
    }
  };

  const handleCreateProject = (variant: ConceptVariant) => {
    console.log('Criando projeto:', variant);
    alert(`Projeto "${variant.title}" criado! (${variant.structure.books.length} livro(s))`);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏛️</span>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">Architect</h2>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={cn(
              "p-2 rounded-lg transition-colors",
              showSettings && "bg-[var(--color-primary-light)] text-[var(--color-primary)]",
              !showSettings && "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg)]"
            )}
            title="Configurações LLM"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-[var(--color-text-muted)]">
          Descreva sua ideia e receba variações de conceito e estrutura
        </p>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
          <h4 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
            Configuração LLM
          </h4>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-[var(--color-text-muted)] mb-1">Provedor</label>
              <select
                value={settings.provider}
                onChange={(e) => updateSettings({ provider: e.target.value as any })}
                className="w-full p-2 text-sm rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)]"
              >
                <option value="openrouter">OpenRouter (recomendado)</option>
                <option value="ollama">Ollama (local)</option>
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
              </select>
            </div>
            
            {settings.provider !== 'ollama' && (
              <div>
                <label className="block text-xs text-[var(--color-text-muted)] mb-1">API Key</label>
                <input
                  type="password"
                  value={settings.apiKey}
                  onChange={(e) => updateSettings({ apiKey: e.target.value })}
                  placeholder="sk-..."
                  className="w-full p-2 text-sm rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)]"
                />
              </div>
            )}
            
            <div>
              <label className="block text-xs text-[var(--color-text-muted)] mb-1">Modelo</label>
              <input
                type="text"
                value={settings.model}
                onChange={(e) => updateSettings({ model: e.target.value })}
                placeholder="anthropic/claude-3.5-sonnet"
                className="w-full p-2 text-sm rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)]"
              />
            </div>
          </div>
          
          {!isConfigured && (
            <div className="flex items-center gap-2 mt-3 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span className="text-xs text-amber-500">Configure a API key para usar o Architect</span>
            </div>
          )}
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-b border-[var(--color-border)]">
        <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
          Sua ideia
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className={cn(
            "w-full h-24 p-3 text-sm rounded-lg resize-none mb-3",
            "bg-[var(--color-bg)] border border-[var(--color-border)]",
            "text-[var(--color-text)] placeholder-[var(--color-text-muted)]",
            "focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
          )}
          placeholder="Ex: Um homem descobre que pode voltar no tempo ao morrer, mas não controla quando..."
        />
        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isLoading || !isConfigured}
          className={cn(
            "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all",
            !prompt.trim() || isLoading || !isConfigured
              ? "bg-[var(--color-bg)] text-[var(--color-text-muted)] cursor-not-allowed"
              : "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Architect pensando...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              {isConfigured ? 'Gerar conceitos' : 'Configure LLM primeiro'}
            </>
          )}
        </button>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-auto p-4">
        {!variants.length && !isLoading && !streamContent && (
          <div className="text-center py-12 text-[var(--color-text-muted)]">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Descreva sua ideia acima para começar</p>
            <p className="text-xs mt-1 opacity-70">
              Quanto mais detalhes, melhor o Architect pode ajudar
            </p>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            {error}
          </div>
        )}

        {isLoading && streamContent && (
          <div className="p-3 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)]">
            <p className="text-xs text-[var(--color-text-muted)] mb-2">Gerando...</p>
            <pre className="text-xs text-[var(--color-text)] whitespace-pre-wrap font-mono">{streamContent.slice(-500)}</pre>
          </div>
        )}

        {variants.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                Variações sugeridas
              </h3>
              <span className="text-xs text-[var(--color-text-muted)]">
                {variants.length} opções
              </span>
            </div>

            {variants.map((variant, index) => (
              <VariantCard
                key={variant.id}
                variant={variant}
                index={index}
                isExpanded={expandedVariant === variant.id}
                isSelected={selectedVariant === variant.id}
                onToggle={() => setExpandedVariant(
                  expandedVariant === variant.id ? null : variant.id
                )}
                onSelect={() => setSelectedVariant(variant.id)}
                onCreate={() => handleCreateProject(variant)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Componente para cada variação
interface VariantCardProps {
  variant: ConceptVariant;
  index: number;
  isExpanded: boolean;
  isSelected: boolean;
  onToggle: () => void;
  onSelect: () => void;
  onCreate: () => void;
}

function VariantCard({ 
  variant, 
  index, 
  isExpanded, 
  isSelected,
  onToggle, 
  onSelect,
  onCreate 
}: VariantCardProps) {
  const colors = [
    'border-l-amber-500',
    'border-l-blue-500', 
    'border-l-purple-500'
  ];
  
  const badges = ['🥇', '🥈', '🥉'];

  return (
    <div
      className={cn(
        "border border-[var(--color-border)] rounded-lg overflow-hidden transition-all",
        "border-l-4",
        colors[index],
        isSelected && "ring-2 ring-[var(--color-primary)] bg-[var(--color-bg-elevated)]"
      )}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full p-4 text-left hover:bg-[var(--color-bg-elevated)] transition-colors"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm">{badges[index]}</span>
              <h4 className="font-semibold text-[var(--color-text)] truncate">
                {variant.title}
              </h4>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] line-clamp-1">
              {variant.subtitle}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-muted)]">
                {variant.genre}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-muted)]">
                {variant.structure.format === 'standalone' ? '1 livro' : 
                 variant.structure.format === 'duology' ? '2 livros' :
                 variant.structure.format === 'trilogy' ? '3 livros' : 'Série'}
              </span>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-[var(--color-text-muted)]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
          <div className="py-3">
            <span className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Logline</span>
            <p className="text-sm text-[var(--color-text)] mt-1 italic">"{variant.logline}"</p>
          </div>

          <div className="pb-3">
            <span className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Conceito</span>
            <p className="text-sm text-[var(--color-text)] mt-1 leading-relaxed">{variant.concept}</p>
          </div>

          <div className="pb-3">
            <span className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Tom</span>
            <p className="text-sm text-[var(--color-text)] mt-1">{variant.tone}</p>
          </div>

          <div className="pb-3">
            <span className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
              Estrutura ({variant.structure.books.reduce((acc, b) => acc + b.chapters, 0)} capítulos)
            </span>
            <div className="space-y-2 mt-2">
              {variant.structure.books.map((book) => (
                <div 
                  key={book.number}
                  className="p-2 rounded bg-[var(--color-bg)] border border-[var(--color-border)]"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[var(--color-text-muted)]">#{book.number}</span>
                    <span className="text-sm font-medium text-[var(--color-text)]">{book.title}</span>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1 line-clamp-2">
                    {book.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={onCreate}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium bg-[var(--color-primary)] text-white rounded hover:bg-[var(--color-primary-hover)] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Criar projeto
            </button>
            <button
              onClick={onSelect}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded border transition-colors",
                isSelected
                  ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white"
                  : "border-[var(--color-border)] hover:bg-[var(--color-bg)]"
              )}
            >
              {isSelected ? 'Selecionado' : 'Selecionar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
