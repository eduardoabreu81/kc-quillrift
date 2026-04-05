import { useState } from 'react';
import { Plus, ChevronDown, ChevronUp, Trash2, Edit3, User } from 'lucide-react';
import type { ParsedCharacter } from '../../services/import';

interface CharacterCardProps {
  character: ParsedCharacter;
}

const ROLE_LABELS: Record<string, string> = {
  protagonist: 'Protagonista',
  antagonist: 'Antagonista', 
  supporting: 'Coadjuvante',
  minor: 'Figurante'
};

export function CharacterCard({ character }: CharacterCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAllTraits, setShowAllTraits] = useState(false);

  // Campos padrão que sempre mostramos se existirem
  const standardFields = [
    { key: 'fullName', label: 'Nome Completo', value: character.fullName },
    { key: 'age', label: 'Idade', value: character.age },
    { key: 'origin', label: 'Origem', value: character.origin },
    { key: 'physicalDescription', label: 'Descrição Física', value: character.physicalDescription },
    { key: 'personality', label: 'Personalidade', value: character.personality },
    { key: 'motivations', label: 'Motivação', value: character.motivations },
    { key: 'powers', label: 'Poderes & Habilidades', value: character.powers },
  ].filter(f => f.value);

  // Campos customizados
  const customFields = Object.entries(character.customFields || {});

  const allFields = [...standardFields, ...customFields.map(([k, v]) => ({ key: k, label: k, value: v }))];
  const visibleFields = showAllTraits ? allFields : allFields.slice(0, 4);
  const hasMoreFields = allFields.length > 4;

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden">
      {/* Header - sempre visível */}
      <div 
        className="p-4 flex items-start gap-4 cursor-pointer hover:bg-[var(--color-bg)] transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Avatar placeholder */}
        <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6 text-[var(--color-primary)]" />
        </div>

        {/* Info principal */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg truncate">{character.name}</h3>
            {character.role && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                {ROLE_LABELS[character.role] || character.role}
              </span>
            )}
          </div>
          
          {/* Preview quando colapsado */}
          {!isExpanded && (
            <p className="text-sm text-[var(--color-text-muted)] truncate">
              {character.motivations || character.powers || character.origin || 'Sem descrição'}
            </p>
          )}
        </div>

        {/* Toggle */}
        <button className="p-1 text-[var(--color-text-muted)]">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Conteúdo expandido */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-[var(--color-border)]">
          {/* Traits/Fields */}
          <div className="space-y-3 mt-4">
            {visibleFields.map((field) => (
              <div key={field.key} className="group">
                <label className="block text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                  {field.label}
                </label>
                <div className="text-sm text-[var(--color-text)] leading-relaxed whitespace-pre-wrap">
                  {field.value}
                </div>
              </div>
            ))}

            {/* Mostrar mais/menos */}
            {hasMoreFields && (
              <button
                onClick={() => setShowAllTraits(!showAllTraits)}
                className="text-sm text-[var(--color-primary)] hover:underline"
              >
                {showAllTraits ? 'Mostrar menos' : `+ ${allFields.length - 4} campos`}
              </button>
            )}
          </div>

          {/* Ações */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[var(--color-border)]">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
              <Plus className="w-4 h-4" />
              Adicionar campo
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
              <Edit3 className="w-4 h-4" />
              Editar
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-500 hover:text-red-400 transition-colors ml-auto">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Lista de personagens estilo Sudowrite
interface CharacterListProps {
  characters: ParsedCharacter[];
}

export function CharacterList({ characters }: CharacterListProps) {
  const [filter, setFilter] = useState('');

  const filtered = characters.filter(c => 
    c.name.toLowerCase().includes(filter.toLowerCase()) ||
    c.role?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Buscar personagens..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1.5 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg w-64"
          />
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-primary)] text-white text-sm rounded-lg hover:bg-[var(--color-primary-hover)]">
          <Plus className="w-4 h-4" />
          Novo Personagem
        </button>
      </div>

      {/* Contador */}
      <p className="text-sm text-[var(--color-text-muted)]">
        {filtered.length} personagem{filtered.length !== 1 && 's'}
      </p>

      {/* Lista */}
      <div className="space-y-3">
        {filtered.map((char) => (
          <CharacterCard 
            key={char.id} 
            character={char}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8 text-[var(--color-text-muted)]">
          <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Nenhum personagem encontrado</p>
        </div>
      )}
    </div>
  );
}
