import { useState, useRef } from 'react';
import { Upload, FileText, Users, BookOpen, Clock, AlertCircle, Check, X, ChevronRight } from 'lucide-react';
import type { ImportResult, ImportAnalysis, ParsedCharacter, ParsedChapter } from '../../services/import';
import { parseDocument, analyzeDocument, checkCharacterCompleteness } from '../../services/import';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (result: ImportResult) => void;
}

export function ImportModal({ isOpen, onClose, onImportComplete }: ImportModalProps) {
  const [step, setStep] = useState<'upload' | 'analyzing' | 'preview' | 'confirm'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<ImportAnalysis | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError(null);
    setStep('analyzing');

    try {
      const text = await selectedFile.text();
      const docAnalysis = analyzeDocument(text);
      setAnalysis(docAnalysis);
      
      // Parsear documento
      const docResult = await parseDocument(selectedFile);
      setResult(docResult);
      
      // Selecionar todos por padrão
      const allIds = new Set<string>();
      if (docResult.characters) {
        docResult.characters.forEach((c: ParsedCharacter) => allIds.add(`char_${c.id}`));
      }
      if (docResult.chapters) {
        docResult.chapters.forEach((c: ParsedChapter) => allIds.add(`chap_${c.id}`));
      }
      setSelectedItems(allIds);
      
      setStep('preview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao analisar arquivo');
      setStep('upload');
    }
  };

  const toggleItem = (id: string) => {
    const newSet = new Set(selectedItems);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedItems(newSet);
  };

  const handleImport = () => {
    if (!result) return;

    // Filtrar apenas itens selecionados
    const filteredResult: ImportResult = {
      ...result,
      characters: result.characters?.filter((c: ParsedCharacter) => selectedItems.has(`char_${c.id}`)),
      chapters: result.chapters?.filter((c: ParsedChapter) => selectedItems.has(`chap_${c.id}`)),
      warnings: result.warnings
    };

    onImportComplete(filteredResult);
    resetState();
    onClose();
  };

  const resetState = () => {
    setStep('upload');
    setFile(null);
    setAnalysis(null);
    setResult(null);
    setSelectedItems(new Set());
    setError(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'character_bible': return <Users className="w-5 h-5" />;
      case 'manuscript': return <BookOpen className="w-5 h-5" />;
      case 'timeline': return <Clock className="w-5 h-5" />;
      case 'world_bible': return <FileText className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'character_bible': return 'Dossiê de Personagens';
      case 'manuscript': return 'Manuscrito';
      case 'timeline': return 'Linha do Tempo';
      case 'world_bible': return 'Bíblia de Mundo';
      default: return 'Documento';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-surface)] rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <h2 className="text-lg font-semibold">Importar Documento</h2>
          <button onClick={handleClose} className="p-1 hover:bg-[var(--color-bg)] rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {step === 'upload' && (
            <div className="text-center py-8">
              <div 
                className="border-2 border-dashed border-[var(--color-border)] rounded-xl p-8 hover:border-[var(--color-primary)] cursor-pointer transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-[var(--color-text-muted)]" />
                <p className="text-lg mb-2">Clique para selecionar arquivo</p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Suporta: .md, .txt, .docx
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".md,.txt,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
            </div>
          )}

          {step === 'analyzing' && (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full mx-auto mb-4" />
              <p>Analisando documento...{file && <span className="text-[var(--color-text-muted)]"> ({file.name})</span>}</p>
            </div>
          )}

          {step === 'preview' && analysis && result && (
            <div className="space-y-4">
              {/* Tipo detectado */}
              <div className="p-4 bg-[var(--color-bg)] rounded-lg flex items-center gap-3">
                <div className="p-2 bg-[var(--color-primary)]/10 rounded-lg text-[var(--color-primary)]">
                  {getTypeIcon(analysis.type)}
                </div>
                <div>
                  <p className="font-medium">{getTypeLabel(analysis.type)}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">{analysis.preview}</p>
                </div>
              </div>

              {/* Warnings */}
              {result.warnings.length > 0 && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  {result.warnings.map((w: string, i: number) => (
                    <p key={i} className="text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                      {w}
                    </p>
                  ))}
                </div>
              )}

              {/* Preview de personagens */}
              {result.characters && result.characters.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Personagens detectados ({result.characters.length})</h3>
                  <div className="space-y-2 max-h-60 overflow-auto">
                    {result.characters.map((char: ParsedCharacter) => {
                      const missing = checkCharacterCompleteness(char);
                      const isSelected = selectedItems.has(`char_${char.id}`);
                      
                      return (
                        <div 
                          key={char.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            isSelected 
                              ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' 
                              : 'border-[var(--color-border)] hover:border-[var(--color-text-muted)]'
                          }`}
                          onClick={() => toggleItem(`char_${char.id}`)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`mt-0.5 ${isSelected ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'}`}>
                              {isSelected ? <Check className="w-4 h-4" /> : <div className="w-4 h-4 border-2 border-current rounded" />}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{char.name}</p>
                              {char.role && <p className="text-xs text-[var(--color-text-muted)]">{char.role}</p>}
                              
                              {missing.length > 0 && (
                                <p className="text-xs text-yellow-500 mt-1">
                                  Faltando: {missing.join(', ')}
                                </p>
                              )}
                              {missing.length === 0 && (
                                <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                                  <Check className="w-3 h-3" /> Completo
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Suggest completion */}
                  {result.characters.some((c: ParsedCharacter) => checkCharacterCompleteness(c).length > 0) && (
                    <p className="text-sm text-[var(--color-text-muted)] mt-2 italic">
                      Após importar, vamos completar juntos as fichas que estão com campos faltando?
                    </p>
                  )}
                </div>
              )}

              {/* Preview de capítulos */}
              {result.chapters && result.chapters.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Capítulos detectados ({result.chapters.length})</h3>
                  <div className="space-y-2 max-h-60 overflow-auto">
                    {result.chapters.map((chap: ParsedChapter) => {
                      const isSelected = selectedItems.has(`chap_${chap.id}`);
                      
                      return (
                        <div 
                          key={chap.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            isSelected 
                              ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' 
                              : 'border-[var(--color-border)] hover:border-[var(--color-text-muted)]'
                          }`}
                          onClick={() => toggleItem(`chap_${chap.id}`)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`mt-0.5 ${isSelected ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'}`}>
                              {isSelected ? <Check className="w-4 h-4" /> : <div className="w-4 h-4 border-2 border-current rounded" />}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{chap.title}</p>
                              <p className="text-xs text-[var(--color-text-muted)]">
                                {chap.wordCount.toLocaleString()} palavras
                                {chap.scenes && chap.scenes.length > 0 && ` • ${chap.scenes.length} cena(s)`}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Raw text fallback */}
              {result.rawText && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Conteúdo detectado</h3>
                  <div className="p-3 bg-[var(--color-bg)] rounded-lg max-h-40 overflow-auto">
                    <pre className="text-xs whitespace-pre-wrap">{result.rawText.slice(0, 1000)}...</pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 'preview' && (
          <div className="p-4 border-t border-[var(--color-border)] flex justify-between">
            <button
              onClick={() => setStep('upload')}
              className="px-4 py-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              Voltar
            </button>
            <button
              onClick={handleImport}
              disabled={selectedItems.size === 0}
              className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium disabled:opacity-50 flex items-center gap-2"
            >
              Importar {selectedItems.size > 0 && `(${selectedItems.size})`}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
