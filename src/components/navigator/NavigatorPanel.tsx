import { useState } from 'react';
import { cn } from '../../lib/utils';
import { 
  Book, 
  Folder, 
  FileText, 
  ChevronRight, 
  ChevronDown,
  Plus,
  MoreVertical,
  GripVertical
} from 'lucide-react';

// Estrutura de exemplo baseada no Reset Infinito
interface Scene {
  id: string;
  title: string;
  order: number;
  pov?: string;
  location?: string;
  wordCount?: number;
}

interface Chapter {
  id: string;
  title: string;
  order: number;
  summary?: string;
  scenes: Scene[];
}

interface Act {
  id: string;
  title: string;
  order: number;
  summary?: string;
  chapters: Chapter[];
}

interface Book {
  id: string;
  title: string;
  subtitle?: string;
  order: number;
  acts: Act[];
}

const EXAMPLE_BOOK: Book = {
  id: 'livro-1',
  title: 'O Despertar do Paradoxo',
  subtitle: 'Reset Infinito #1',
  order: 1,
  acts: [
    {
      id: 'ato-1',
      title: 'Ato I: O Acidente',
      order: 1,
      summary: 'Marcus descobre seu poder após morrer em um acidente',
      chapters: [
        {
          id: 'cap-1',
          title: 'Capítulo 1: O Último Dia Normal',
          order: 1,
          scenes: [
            { id: 'cena-1-1-1', title: 'Cena 1: A Entrevista', order: 1, pov: 'Marcus', wordCount: 1200 },
            { id: 'cena-1-1-2', title: 'Cena 2: O Acidente', order: 2, pov: 'Marcus', wordCount: 800 },
            { id: 'cena-1-1-3', title: 'Cena 3: Primeiro Reset', order: 3, pov: 'Marcus', wordCount: 1500 },
          ]
        },
        {
          id: 'cap-2',
          title: 'Capítulo 2: Dissonância',
          order: 2,
          scenes: [
            { id: 'cena-1-2-1', title: 'Cena 1: Tentativa de Explicação', order: 1, pov: 'Marcus', wordCount: 2000 },
            { id: 'cena-1-2-2', title: 'Cena 2: Contato com Tom', order: 2, pov: 'Marcus', wordCount: 1800 },
          ]
        },
      ]
    },
    {
      id: 'ato-2',
      title: 'Ato II: A Descoberta',
      order: 2,
      summary: 'Marcus encontra outros e descobre a Chronos',
      chapters: [
        {
          id: 'cap-4',
          title: 'Capítulo 4: Elena',
          order: 4,
          scenes: [
            { id: 'cena-2-4-1', title: 'Cena 1: A Investigação', order: 1, pov: 'Elena', wordCount: 2500 },
            { id: 'cena-2-4-2', title: 'Cena 2: Primeiro Contato', order: 2, pov: 'Marcus', wordCount: 3000 },
          ]
        },
      ]
    },
  ]
};

export function NavigatorPanel() {
  const [expandedActs, setExpandedActs] = useState<Set<string>>(new Set(['ato-1']));
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set(['cap-1']));
  const [selectedScene, setSelectedScene] = useState<string | null>('cena-1-1-1');

  const toggleAct = (actId: string) => {
    const next = new Set(expandedActs);
    if (next.has(actId)) next.delete(actId);
    else next.add(actId);
    setExpandedActs(next);
  };

  const toggleChapter = (chapterId: string) => {
    const next = new Set(expandedChapters);
    if (next.has(chapterId)) next.delete(chapterId);
    else next.add(chapterId);
    setExpandedChapters(next);
  };

  const totalWords = EXAMPLE_BOOK.acts.reduce((acc, act) => 
    acc + act.chapters.reduce((acc2, ch) => 
      acc2 + ch.scenes.reduce((acc3, sc) => acc3 + (sc.wordCount || 0), 0), 0), 0);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">🗺️</span>
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Navigator</h2>
        </div>
        <p className="text-xs text-[var(--color-text-muted)]">
          {EXAMPLE_BOOK.title} • {totalWords.toLocaleString()} palavras
        </p>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-auto p-3">
        {/* Book */}
        <div className="mb-2">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)]">
            <Book className="w-4 h-4" />
            <span className="font-medium text-sm">{EXAMPLE_BOOK.title}</span>
          </div>
        </div>

        {/* Acts */}
        <div className="ml-2 space-y-1">
          {EXAMPLE_BOOK.acts.map((act) => (
            <div key={act.id}>
              <button
                onClick={() => toggleAct(act.id)}
                className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-left hover:bg-[var(--color-bg-elevated)] transition-colors"
              >
                {expandedActs.has(act.id) ? (
                  <ChevronDown className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                )}
                <Folder className="w-4 h-4 text-[var(--color-text-muted)]" />
                <span className="text-sm font-medium text-[var(--color-text)]">{act.title}</span>
                <span className="ml-auto text-xs text-[var(--color-text-muted)]">
                  {act.chapters.length} caps
                </span>
              </button>

              {/* Chapters */}
              {expandedActs.has(act.id) && (
                <div className="ml-5 space-y-0.5">
                  {act.chapters.map((chapter) => (
                    <div key={chapter.id}>
                      <button
                        onClick={() => toggleChapter(chapter.id)}
                        className="w-full flex items-center gap-1.5 px-2 py-1 rounded-lg text-left hover:bg-[var(--color-bg-elevated)] transition-colors"
                      >
                        {expandedChapters.has(chapter.id) ? (
                          <ChevronDown className="w-3 h-3 text-[var(--color-text-muted)]" />
                        ) : (
                          <ChevronRight className="w-3 h-3 text-[var(--color-text-muted)]" />
                        )}
                        <span className="text-xs text-[var(--color-text-muted)]">#{chapter.order}</span>
                        <span className="text-sm text-[var(--color-text)] truncate">{chapter.title}</span>
                        <span className="ml-auto text-xs text-[var(--color-text-muted)]">
                          {chapter.scenes.length}
                        </span>
                      </button>

                      {/* Scenes */}
                      {expandedChapters.has(chapter.id) && (
                        <div className="ml-5 space-y-0.5">
                          {chapter.scenes.map((scene) => (
                            <button
                              key={scene.id}
                              onClick={() => setSelectedScene(scene.id)}
                              className={cn(
                                "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors group",
                                selectedScene === scene.id
                                  ? "bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                                  : "hover:bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)]"
                              )}
                            >
                              <GripVertical className="w-3 h-3 opacity-0 group-hover:opacity-50" />
                              <FileText className="w-3.5 h-3.5" />
                              <div className="flex-1 min-w-0">
                                <span className="text-sm truncate block">{scene.title}</span>
                                {scene.pov && (
                                  <span className="text-[10px] opacity-70">POV: {scene.pov}</span>
                                )}
                              </div>
                              {scene.wordCount && (
                                <span className="text-xs opacity-50">
                                  {scene.wordCount}
                                </span>
                              )}
                            </button>
                          ))}
                          <button className="w-full flex items-center gap-2 px-2 py-1 rounded-lg text-left text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors opacity-60 hover:opacity-100">
                            <Plus className="w-3.5 h-3.5" />
                            <span className="text-xs">Nova cena</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  <button className="w-full flex items-center gap-1.5 px-2 py-1 rounded-lg text-left text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors opacity-60 hover:opacity-100">
                    <Plus className="w-3.5 h-3.5" />
                    <span className="text-xs">Novo capítulo</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Scene Info */}
      {selectedScene && (
        <div className="p-3 border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase">Cena Selecionada</span>
            <button className="p-1 rounded hover:bg-[var(--color-bg)]">
              <MoreVertical className="w-4 h-4 text-[var(--color-text-muted)]" />
            </button>
          </div>
          <button className="w-full text-left p-2 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors">
            <span className="text-sm font-medium text-[var(--color-text)]">Abrir no Editor →</span>
          </button>
        </div>
      )}
    </div>
  );
}
