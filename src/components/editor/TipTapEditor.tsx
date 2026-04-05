import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import type { JSONContent } from '@tiptap/react';
import { cn } from '../../lib/utils';

interface TipTapEditorProps {
  content?: string | JSONContent;
  onChange?: (content: JSONContent) => void;
  placeholder?: string;
  className?: string;
}

export function TipTapEditor({ 
  content = '', 
  onChange, 
  placeholder = 'Comece a escrever...',
  className 
}: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className={cn('relative h-full', className)}>
      {/* Toolbar */}
      <div className="sticky top-0 z-10 flex items-center gap-1 p-2 border-b bg-[var(--color-bg-elevated)]">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            'p-2 rounded hover:bg-[var(--color-bg-sidebar)] transition-colors',
            editor.isActive('bold') && 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
          )}
          title="Negrito (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            'p-2 rounded hover:bg-[var(--color-bg-sidebar)] transition-colors',
            editor.isActive('italic') && 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
          )}
          title="Itálico (Ctrl+I)"
        >
          <em>I</em>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={cn(
            'p-2 rounded hover:bg-[var(--color-bg-sidebar)] transition-colors',
            editor.isActive('underline') && 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
          )}
          title="Sublinhado (Ctrl+U)"
        >
          <u>U</u>
        </button>
        <div className="w-px h-6 bg-[var(--color-border)] mx-2" />
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn(
            'p-2 rounded hover:bg-[var(--color-bg-sidebar)] transition-colors',
            editor.isActive('heading', { level: 1 }) && 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
          )}
          title="Título 1"
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(
            'p-2 rounded hover:bg-[var(--color-bg-sidebar)] transition-colors',
            editor.isActive('heading', { level: 2 }) && 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
          )}
          title="Título 2"
        >
          H2
        </button>
        <div className="w-px h-6 bg-[var(--color-border)] mx-2" />
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            'p-2 rounded hover:bg-[var(--color-bg-sidebar)] transition-colors',
            editor.isActive('bulletList') && 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
          )}
          title="Lista com marcadores"
        >
          • Lista
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            'p-2 rounded hover:bg-[var(--color-bg-sidebar)] transition-colors',
            editor.isActive('orderedList') && 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
          )}
          title="Lista numerada"
        >
          1. Lista
        </button>
        <div className="w-px h-6 bg-[var(--color-border)] mx-2" />
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(
            'p-2 rounded hover:bg-[var(--color-bg-sidebar)] transition-colors',
            editor.isActive('blockquote') && 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
          )}
          title="Citação"
        >
          " Citação
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-auto bg-[var(--color-bg-elevated)]">
        <EditorContent editor={editor} />
      </div>

      {/* Word Count */}
      <div className="sticky bottom-0 px-4 py-2 text-sm text-[var(--color-text-muted)] border-t bg-[var(--color-bg-elevated)]">
        {editor.storage.characterCount?.words() || 0} palavras
      </div>
    </div>
  );
}
