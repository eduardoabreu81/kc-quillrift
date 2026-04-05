import { useState } from 'react';
import { Upload } from 'lucide-react';
import { Sidebar } from './components/layout/Sidebar';
import { TipTapEditor } from './components/editor/TipTapEditor';
import { ArchitectPanel } from './components/agents/ArchitectPanel';
import { BiblePanel } from './components/bible/BiblePanel';
import { NavigatorPanel } from './components/navigator/NavigatorPanel';
import { WorkflowPanel } from './components/workflow/WorkflowPanel';
import { ImportModal } from './components/import/ImportModal';
import type { ImportResult } from './services/import';
import { cn } from './lib/utils';

function App() {
  const [currentView, setCurrentView] = useState('architect'); // Começa no Architect

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg)]">
      {/* Sidebar */}
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {currentView === 'architect' && <ArchitectView />}
        {currentView === 'bible' && <BibleView />}
        {currentView === 'workflow' && <WorkflowView />}
        {currentView === 'navigator' && <NavigatorView />}
        {currentView === 'workbench' && <WorkbenchView />}
      </main>
    </div>
  );
}

// View do Architect (Modo Consultivo)
function ArchitectView() {
  return (
    <div className="flex h-full">
      {/* Panel principal do Architect */}
      <div className="w-[480px] border-r border-[var(--color-border)] bg-[var(--color-bg)]">
        <ArchitectPanel />
      </div>
      
      {/* Área de preview/detahles */}
      <div className="flex-1 flex flex-col bg-[var(--color-bg-elevated)]">
        <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
          <div>
            <h1 className="text-lg font-semibold text-[var(--color-text)]">Workbench</h1>
            <p className="text-xs text-[var(--color-text-muted)]">
              Comece criando um novo projeto com o Architect
            </p>
          </div>
        </header>
        
        <div className="flex-1 flex items-center justify-center text-[var(--color-text-muted)]">
          <div className="text-center">
            <span className="text-6xl block mb-4">🏛️</span>
            <h3 className="text-lg font-medium text-[var(--color-text)] mb-2">
              Bem-vindo ao KC-QuillRift
            </h3>
            <p className="text-sm max-w-md">
              Use o Architect no painel à esquerda para gerar conceitos e estruturas. 
              Depois, comece a escrever no Editor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// View da Bible (Worldbuilding)
function BibleView() {
  return (
    <div className="flex h-full">
      <div className="w-[400px] border-r border-[var(--color-border)] bg-[var(--color-bg)]">
        <BiblePanel />
      </div>
      <div className="flex-1 flex flex-col bg-[var(--color-bg-elevated)]">
        <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
          <div>
            <h1 className="text-lg font-semibold text-[var(--color-text)]">Visualização</h1>
            <p className="text-xs text-[var(--color-text-muted)]">
              Selecione um item na Bible para ver detalhes
            </p>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center text-[var(--color-text-muted)]">
          <div className="text-center">
            <span className="text-6xl block mb-4">📚</span>
            <p className="text-sm">A Bible centraliza worldbuilding:
              personagens, locais, itens e conceitos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// View do Workflow (Orquestração de Agents)
function WorkflowView() {
  return (
    <div className="flex h-full">
      <div className="w-[360px] border-r border-[var(--color-border)] bg-[var(--color-bg)]">
        <WorkflowPanel />
      </div>
      <div className="flex-1 flex flex-col bg-[var(--color-bg-elevated)]">
        <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
          <div>
            <h1 className="text-lg font-semibold text-[var(--color-text)]">Workflow Engine</h1>
            <p className="text-xs text-[var(--color-text-muted)]">
              Cadeias de agents para tarefas complexas de escrita
            </p>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center text-[var(--color-text-muted)]">
          <div className="text-center">
            <span className="text-6xl block mb-4">⚡</span>
            <p className="text-sm">Selecione um workflow à esquerda.<br/>
              Múltiplos agents trabalharão em sequência.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// View do Navigator (Editor com estrutura)
function NavigatorView() {
  return (
    <div className="flex h-full">
      {/* Navigator Panel - Estrutura */}
      <div className="w-[320px] border-r border-[var(--color-border)] bg-[var(--color-bg)]">
        <NavigatorPanel />
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--color-text-muted)]">
              Livro &gt; Ato I &gt; Capítulo 1 &gt; Cena 1
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
              Salvar versão
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
              Histórico
            </button>
            <button className="px-3 py-1.5 text-sm font-medium bg-[var(--color-primary)] text-white rounded hover:bg-[var(--color-primary-hover)] transition-colors">
              Gerar com IA
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Editor */}
          <div className="flex-1 flex flex-col">
            <TipTapEditor 
              placeholder="Comece a escrever sua história..."
              className="flex-1"
            />
          </div>

          {/* Right Panel - Context & AI */}
          <aside className="w-[320px] flex-shrink-0 border-l border-[var(--color-border)] bg-[var(--color-bg-elevated)] flex flex-col">
            {/* Action Beats */}
            <div className="p-4 border-b border-[var(--color-border)]">
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                Action Beats
              </label>
              <textarea
                className={cn(
                  "w-full h-20 p-3 text-sm rounded-lg resize-none",
                  "bg-[var(--color-bg)] border border-[var(--color-border)]",
                  "text-[var(--color-text)] placeholder-[var(--color-text-muted)]",
                  "focus:outline-none focus:border-[var(--color-primary)]"
                )}
                placeholder="O que deve acontecer nesta cena..."
              />
            </div>

            {/* Context Selector */}
            <div className="flex-1 overflow-auto p-4">
              <h3 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
                Contexto
              </h3>
              
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span>Cena anterior</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span>Sumário do capítulo</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded" />
                  <span>Bíblia do mundo</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded" />
                  <span>Personagens na cena</span>
                </label>
              </div>
            </div>

            {/* LLM Preview */}
            <div className="p-4 border-t border-[var(--color-border)]">
              <h3 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                Preview IA
              </h3>
              <div className="h-24 p-2 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-muted)]">
                Output da IA aparecerá aqui...
              </div>
              <div className="flex gap-2 mt-2">
                <button className="flex-1 px-3 py-1.5 text-sm bg-[var(--color-primary)] text-white rounded">
                  Aplicar
                </button>
                <button className="px-3 py-1.5 text-sm border rounded">
                  Retry
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// View do Workbench (lista de projetos)
function WorkbenchView() {
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [lastImport, setLastImport] = useState<ImportResult | null>(null);

  const handleImportComplete = (result: ImportResult) => {
    setLastImport(result);
    console.log('Importação completa:', result);
    // Aqui integraria com os módulos reais
    alert(`Importados: ${result.characters?.length || 0} personagens, ${result.chapters?.length || 0} capítulos`);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
        <div>
          <h1 className="text-lg font-semibold text-[var(--color-text)]">Seus Projetos</h1>
          <p className="text-xs text-[var(--color-text-muted)]">Gerencie seus projetos e importe documentos</p>
        </div>
        <button
          onClick={() => setIsImportOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          <Upload className="w-4 h-4" />
          Importar Documento
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center text-[var(--color-text-muted)]">
        <div className="text-center">
          <span className="text-6xl block mb-4">📚</span>
          <h3 className="text-lg font-medium text-[var(--color-text)] mb-2">
            {lastImport ? 'Importação Realizada!' : 'Nenhum Projeto Ainda'}
          </h3>
          <p className="text-sm">
            {lastImport 
              ? `Importados: ${lastImport.characters?.length || 0} personagens, ${lastImport.chapters?.length || 0} capítulos`
              : 'Importe seu primeiro documento para começar'}
          </p>
        </div>
      </div>

      {/* Import Modal */}
      <ImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImportComplete={handleImportComplete}
      />
    </div>
  );
}

export default App;
