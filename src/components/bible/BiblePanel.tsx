import { useState } from 'react';
import { cn } from '../../lib/utils';
import type { Character, Concept } from '../../types/bible';
import { EXAMPLE_CHARACTERS, EXAMPLE_CONCEPTS } from '../../types/bible';
import { Users, MapPin, Box, Lightbulb, Search, Plus, ChevronRight } from 'lucide-react';

type BibleTab = 'characters' | 'locations' | 'items' | 'concepts';

export function BiblePanel() {
  const [activeTab, setActiveTab] = useState<BibleTab>('characters');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'characters' as const, label: 'Personagens', icon: Users },
    { id: 'locations' as const, label: 'Locais', icon: MapPin },
    { id: 'items' as const, label: 'Itens', icon: Box },
    { id: 'concepts' as const, label: 'Conceitos', icon: Lightbulb },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">📚</span>
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Bible</h2>
        </div>
        <p className="text-xs text-[var(--color-text-muted)]">
          Worldbuilding: personagens, locais, itens e conceitos
        </p>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-[var(--color-border)]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar..."
            className={cn(
              "w-full pl-9 pr-3 py-2 text-sm rounded-lg",
              "bg-[var(--color-bg)] border border-[var(--color-border)]",
              "text-[var(--color-text)] placeholder-[var(--color-text-muted)]",
              "focus:outline-none focus:border-[var(--color-primary)]"
            )}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--color-border)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 px-2 py-2.5 text-xs font-medium transition-colors",
                activeTab === tab.id
                  ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)] bg-[var(--color-primary-light)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-elevated)]"
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-3">
        {activeTab === 'characters' && (
          <CharactersList searchQuery={searchQuery} />
        )}
        {activeTab === 'locations' && (
          <LocationsPlaceholder />
        )}
        {activeTab === 'items' && (
          <ItemsPlaceholder />
        )}
        {activeTab === 'concepts' && (
          <ConceptsList searchQuery={searchQuery} />
        )}
      </div>
    </div>
  );
}

// Lista de Personagens
function CharactersList({ searchQuery }: { searchQuery: string }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = EXAMPLE_CHARACTERS.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.aliases.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selected = filtered.find(c => c.id === selectedId);

  if (selected) {
    return (
      <CharacterDetail 
        character={selected} 
        onBack={() => setSelectedId(null)} 
      />
    );
  }

  return (
    <div className="space-y-2">
      <button className="w-full flex items-center justify-center gap-2 p-2 rounded-lg border border-dashed border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors">
        <Plus className="w-4 h-4" />
        <span className="text-sm">Novo personagem</span>
      </button>

      {filtered.map((character) => (
        <button
          key={character.id}
          onClick={() => setSelectedId(character.id)}
          className="w-full p-3 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors text-left"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-medium text-[var(--color-text)]">{character.name}</h4>
              {character.aliases.length > 0 && (
                <p className="text-xs text-[var(--color-text-muted)]">
                  aka {character.aliases.join(', ')}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1">
              {character.isSpecial && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--color-primary)] text-white">
                  Especial
                </span>
              )}
              {character.status === 'deceased' && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-500 text-white">
                  ✝
                </span>
              )}
            </div>
          </div>
          
          {character.occupation && (
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              {character.occupation}
            </p>
          )}
        </button>
      ))}
    </div>
  );
}

// Detalhe do Personagem
function CharacterDetail({ character, onBack }: { character: Character; onBack: () => void }) {
  return (
    <div className="space-y-4">
      <button 
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
      >
        <ChevronRight className="w-4 h-4 rotate-180" />
        Voltar
      </button>

      <div className="p-4 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)]">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-text)]">{character.name}</h3>
            {character.aliases.length > 0 && (
              <p className="text-sm text-[var(--color-text-muted)]">
                aka {character.aliases.join(', ')}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-1">
            {character.isSpecial && (
              <span className="text-[10px] px-2 py-1 rounded-full bg-[var(--color-primary)] text-white">
                Especial
              </span>
            )}
            <span className={cn(
              "text-[10px] px-2 py-1 rounded-full",
              character.status === 'active' && "bg-green-500/20 text-green-600",
              character.status === 'deceased' && "bg-gray-500/20 text-gray-600",
              character.status === 'inactive' && "bg-amber-500/20 text-amber-600",
            )}>
              {character.status === 'active' && 'Ativo'}
              {character.status === 'deceased' && 'Falecido'}
              {character.status === 'inactive' && 'Inativo'}
              {character.status === 'unknown' && 'Desconhecido'}
            </span>
          </div>
        </div>

        {character.age && (
          <div className="mb-3">
            <span className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase">Idade</span>
            <p className="text-sm text-[var(--color-text)]">{character.age} anos</p>
          </div>
        )}

        {character.occupation && (
          <div className="mb-3">
            <span className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase">Ocupação</span>
            <p className="text-sm text-[var(--color-text)]">{character.occupation}</p>
          </div>
        )}

        {character.appearance && (
          <div className="mb-3">
            <span className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase">Aparência</span>
            <p className="text-sm text-[var(--color-text)]">{character.appearance}</p>
          </div>
        )}

        {character.personality && (
          <div className="mb-3">
            <span className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase">Personalidade</span>
            <p className="text-sm text-[var(--color-text)]">{character.personality}</p>
          </div>
        )}

        {character.motivation && (
          <div className="mb-3">
            <span className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase">Motivação</span>
            <p className="text-sm text-[var(--color-text)]">{character.motivation}</p>
          </div>
        )}

        {character.arc && (
          <div className="mb-3">
            <span className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase">Arco</span>
            <p className="text-sm text-[var(--color-text)]">{character.arc}</p>
          </div>
        )}

        {character.power && (
          <div className="p-3 rounded-lg bg-[var(--color-primary-light)] border border-[var(--color-primary)]">
            <span className="text-[10px] font-semibold text-[var(--color-primary)] uppercase">Poder</span>
            <p className="text-sm text-[var(--color-text)] mt-1">{character.power}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Lista de Conceitos
function ConceptsList({ searchQuery }: { searchQuery: string }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = EXAMPLE_CONCEPTS.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.definition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selected = filtered.find(c => c.id === selectedId);

  if (selected) {
    return (
      <ConceptDetail 
        concept={selected} 
        onBack={() => setSelectedId(null)} 
      />
    );
  }

  return (
    <div className="space-y-2">
      <button className="w-full flex items-center justify-center gap-2 p-2 rounded-lg border border-dashed border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors">
        <Plus className="w-4 h-4" />
        <span className="text-sm">Novo conceito</span>
      </button>

      {filtered.map((concept) => (
        <button
          key={concept.id}
          onClick={() => setSelectedId(concept.id)}
          className="w-full p-3 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-bg)] text-[var(--color-text-muted)] uppercase">
              {concept.category}
            </span>
          </div>
          <h4 className="font-medium text-[var(--color-text)] mt-1">{concept.name}</h4>
          <p className="text-xs text-[var(--color-text-muted)] line-clamp-2">
            {concept.definition}
          </p>
        </button>
      ))}
    </div>
  );
}

// Detalhe do Conceito
function ConceptDetail({ concept, onBack }: { concept: Concept; onBack: () => void }) {
  return (
    <div className="space-y-4">
      <button 
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
      >
        <ChevronRight className="w-4 h-4 rotate-180" />
        Voltar
      </button>

      <div className="p-4 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)]">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] px-2 py-1 rounded-full bg-[var(--color-primary)] text-white uppercase">
            {concept.category}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-[var(--color-text)] mb-3">{concept.name}</h3>

        <div className="mb-4">
          <span className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase">Definição</span>
          <p className="text-sm text-[var(--color-text)] mt-1">{concept.definition}</p>
        </div>

        {concept.explanation && (
          <div className="mb-4">
            <span className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase">Explicação</span>
            <p className="text-sm text-[var(--color-text)] mt-1">{concept.explanation}</p>
          </div>
        )}

        {concept.rules && concept.rules.length > 0 && (
          <div className="mb-4">
            <span className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase">Regras</span>
            <ul className="mt-1 space-y-1">
              {concept.rules.map((rule, i) => (
                <li key={i} className="text-sm text-[var(--color-text)] flex items-start gap-2">
                  <span className="text-[var(--color-primary)]">•</span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// Placeholders
function LocationsPlaceholder() {
  return (
    <div className="text-center py-12 text-[var(--color-text-muted)]">
      <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
      <p className="text-sm">Nenhum local cadastrado</p>
      <button className="mt-3 flex items-center justify-center gap-2 mx-auto px-3 py-1.5 text-sm rounded-lg border border-dashed border-[var(--color-border)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors">
        <Plus className="w-4 h-4" />
        Adicionar local
      </button>
    </div>
  );
}

function ItemsPlaceholder() {
  return (
    <div className="text-center py-12 text-[var(--color-text-muted)]">
      <Box className="w-12 h-12 mx-auto mb-3 opacity-30" />
      <p className="text-sm">Nenhum item cadastrado</p>
      <button className="mt-3 flex items-center justify-center gap-2 mx-auto px-3 py-1.5 text-sm rounded-lg border border-dashed border-[var(--color-border)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors">
        <Plus className="w-4 h-4" />
        Adicionar item
      </button>
    </div>
  );
}
