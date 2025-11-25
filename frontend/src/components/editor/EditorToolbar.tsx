import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
} from 'lucide-react';

interface EditorToolbarProps {
  editor: Editor | null;
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}

const ToolbarButton = ({ 
  onClick, 
  isActive = false, 
  disabled = false, 
  children,
  title
}: ToolbarButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    style={{
      padding: '0.5rem',
      borderRadius: '0.25rem',
      border: 'none',
      background: isActive ? 'var(--color-bg-sidebar-hover)' : 'transparent',
      color: isActive ? 'white' : 'var(--color-text-secondary)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
    }}
    onMouseEnter={(e) => {
      if (!isActive && !disabled) {
          e.currentTarget.style.background = 'var(--color-bg-secondary)';
          e.currentTarget.style.color = 'var(--color-text-primary)';
      }
    }}
    onMouseLeave={(e) => {
      if (!isActive && !disabled) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = 'var(--color-text-secondary)';
      }
    }}
  >
    {children}
  </button>
);

export default function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) {
    return null;
  }

  return (
    <div style={{
      display: 'flex',
      gap: '0.25rem',
      padding: '0.5rem',
      borderBottom: '1px solid var(--color-border)',
      background: 'var(--color-bg-primary)',
      flexWrap: 'wrap',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        title="Bold"
      >
        <Bold size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        title="Italic"
      >
        <Italic size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        title="Strikethrough"
      >
        <Strikethrough size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive('code')}
        title="Code"
      >
        <Code size={18} />
      </ToolbarButton>
      
      <div style={{ width: '1px', background: 'var(--color-border)', margin: '0 0.5rem' }} />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive('heading', { level: 1 })}
        title="Heading 1"
      >
        <Heading1 size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        title="Heading 2"
      >
        <Heading2 size={18} />
      </ToolbarButton>

      <div style={{ width: '1px', background: 'var(--color-border)', margin: '0 0.5rem' }} />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        title="Bullet List"
      >
        <List size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        title="Ordered List"
      >
        <ListOrdered size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        title="Blockquote"
      >
        <Quote size={18} />
      </ToolbarButton>

      <div style={{ width: '1px', background: 'var(--color-border)', margin: '0 0.5rem' }} />

      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo"
      >
        <Undo size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo"
      >
        <Redo size={18} />
      </ToolbarButton>
    </div>
  );
}
