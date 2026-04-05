import { useState } from 'react';
import { cn } from '../../lib/utils';
import { 
  Book, 
  BookOpen,
  Map, 
  Bot, 
  Settings, 
  Plus,
  ChevronRight,
  ChevronDown,
  FileText,
  MoreHorizontal,
  Sparkles,
  LayoutGrid
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const menuItems = [
  { id: 'architect', label: 'Architect', icon: Sparkles, highlight: true },
  { id: 'bible', label: 'Bible', icon: BookOpen },
  { id: 'workbench', label: 'Projetos', icon: LayoutGrid },
  { id: 'navigator', label: 'Navegador', icon: Map },
  { id: 'compendium', label: 'Compêndio', icon: FileText },
  { id: 'workshop', label: 'Oficina', icon: Bot },
  { id: 'settings', label: 'Configurações', icon: Settings },
];

// Mock data - substituir por dados reais do Firestore
const mockProject = {
  title: 'Meu Livro',
  acts: [
    {
      id: '1',
      title: 'Ato I: O Início',
      chapters: [
        { id: '1-1', title: 'Capítulo 1', scenes: [{ id: '1-1-1', title: 'Cena 1' }] },
        { id: '1-2', title: 'Capítulo 2', scenes: [] },
      ]
    },
    {
      id: '2',
      title: 'Ato II: O Conflito',
      chapters: [
        { id: '2-1', title: 'Capítulo 3', scenes: [] },
      ]
    }
  ]
};

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const [expandedActs, setExpandedActs] = useState<Set<string>>(new Set(['1']));
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set(['1-1']));

  const toggleAct = (actId: string) => {
    const newExpanded = new Set(expandedActs);
    if (newExpanded.has(actId)) {
      newExpanded.delete(actId);
    } else {
      newExpanded.add(actId);
    }
    setExpandedActs(newExpanded);
  };

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  return (
    <aside className="w-[var(--sidebar-width)] flex-shrink-0 flex flex-col bg-[var(--color-bg-sidebar)] border-r border-[var(--color-border)]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--color-border)]">
        <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
          <Book className="w-5 h-5 text-white" />
        </div>
        <span className="font-display font-semibold text-lg text-[var(--color-text-heading)]">
          KC-QuillRift
        </span>
      </div>

      {/* Main Menu */}
      <nav className="p-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                isActive
                  ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                  : item.highlight
                    ? 'text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]'
                    : 'text-[var(--color-text)] hover:bg-[var(--color-bg)]'
              )}
            >
              <Icon className={cn('w-5 h-5', item.highlight && !isActive && 'animate-pulse')} />
              <span className="font-medium">{item.label}</span>
              {item.highlight && !isActive && (
                <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--color-primary)] text-white">
                  Novo
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-[var(--color-border)] my-2" />

      {/* Project Structure - só mostrar quando em navigator */}
      {currentView === 'navigator' && (
        <div className="flex-1 overflow-auto px-2">
          <div className="flex items-center justify-between px-2 py-2">
            <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
              Estrutura
            </span>
            <button className="p-1 rounded hover:bg-[var(--color-bg)] text-[var(--color-text-muted)]">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            {mockProject.acts.map((act) => (
              <div key={act.id}>
                <button
                  onClick={() => toggleAct(act.id)}
                  className="w-full flex items-center gap-1 px-2 py-1.5 rounded text-left text-sm hover:bg-[var(--color-bg)] transition-colors"
                >
                  {expandedActs.has(act.id) ? (
                    <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)]" />
                  )}
                  <span className="font-medium text-[var(--color-text-heading)] truncate">{act.title}</span>
                </button>

                {expandedActs.has(act.id) && (
                  <div className="ml-4 space-y-1">
                    {act.chapters.map((chapter) => (
                      <div key={chapter.id}>
                        <button
                          onClick={() => toggleChapter(chapter.id)}
                          className="w-full flex items-center gap-1 px-2 py-1 rounded text-left text-sm hover:bg-[var(--color-bg)] transition-colors"
                        >
                          {expandedChapters.has(chapter.id) ? (
                            <ChevronDown className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                          )}
                          <span className="text-[var(--color-text)] truncate">{chapter.title}</span>
                        </button>

                        {expandedChapters.has(chapter.id) && (
                          <div className="ml-4 space-y-0.5">
                            {chapter.scenes.map((scene) => (
                              <button
                                key={scene.id}
                                className="w-full flex items-center gap-2 px-2 py-1 rounded text-left text-sm hover:bg-[var(--color-bg)] transition-colors group"
                              >
                                <FileText className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                                <span className="text-[var(--color-text-muted)] truncate flex-1">{scene.title}</span>
                                <button className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-[var(--color-bg-elevated)]">
                                  <MoreHorizontal className="w-3.5 h-3.5" />
                                </button>
                              </button>
                            ))}
                            <button className="w-full flex items-center gap-2 px-2 py-1 rounded text-left text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg)] transition-colors">
                              <Plus className="w-3.5 h-3.5" />
                              <span>Nova cena</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    <button className="w-full flex items-center gap-2 px-2 py-1 rounded text-left text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg)] transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Novo capítulo</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
            <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg)] transition-colors">
              <Plus className="w-4 h-4" />
              <span className="font-medium">Novo ato</span>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
