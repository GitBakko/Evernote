import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Unlink,
  Table as TableIcon,
  Columns,
  Rows,
  Trash2,
  Paperclip,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

interface EditorToolbarProps {
  editor: Editor | null;
  onAttach?: () => void;
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
    className={clsx(
      "p-2 rounded transition-colors flex items-center justify-center",
      isActive
        ? "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white"
        : "bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200",
      disabled && "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-gray-500 dark:hover:bg-transparent dark:hover:text-gray-400"
    )}
  >
    {children}
  </button>
);

export default function EditorToolbar({ editor, onAttach }: EditorToolbarProps) {
  const { t } = useTranslation();

  if (!editor) {
    return null;
  }

  return (
    <div className="flex gap-1 p-2 border-b border-gray-200 bg-white flex-wrap sticky top-0 z-10 dark:bg-gray-900 dark:border-gray-800">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        title={t('editor.bold')}
      >
        <Bold size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        title={t('editor.italic')}
      >
        <Italic size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        title={t('editor.underline')}
      >
        <Underline size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        title={t('editor.strikethrough')}
      >
        <Strikethrough size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive('code')}
        title={t('editor.code')}
      >
        <Code size={18} />
      </ToolbarButton>

      <div className="w-px bg-gray-200 mx-2 dark:bg-gray-700" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive('heading', { level: 1 })}
        title={t('editor.heading1')}
      >
        <Heading1 size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        title={t('editor.heading2')}
      >
        <Heading2 size={18} />
      </ToolbarButton>

      <div className="w-px bg-gray-200 mx-2 dark:bg-gray-700" />

      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        isActive={editor.isActive({ textAlign: 'left' })}
        title={t('editor.alignLeft')}
      >
        <AlignLeft size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        isActive={editor.isActive({ textAlign: 'center' })}
        title={t('editor.alignCenter')}
      >
        <AlignCenter size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        isActive={editor.isActive({ textAlign: 'right' })}
        title={t('editor.alignRight')}
      >
        <AlignRight size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        isActive={editor.isActive({ textAlign: 'justify' })}
        title={t('editor.alignJustify')}
      >
        <AlignJustify size={18} />
      </ToolbarButton>

      <div className="w-px bg-gray-200 mx-2 dark:bg-gray-700" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        title={t('editor.bulletList')}
      >
        <List size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        title={t('editor.orderedList')}
      >
        <ListOrdered size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        title={t('editor.blockquote')}
      >
        <Quote size={18} />
      </ToolbarButton>

      <div className="w-px bg-gray-200 mx-2 dark:bg-gray-700" />

      <ToolbarButton
        onClick={() => {
          const previousUrl = editor.getAttributes('link').href;
          const url = window.prompt('URL', previousUrl);
          if (url === null) return;
          if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
          }
          editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }}
        isActive={editor.isActive('link')}
        title={t('editor.link')}
      >
        <LinkIcon size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive('link')}
        title={t('editor.unlink')}
      >
        <Unlink size={18} />
      </ToolbarButton>

      <div className="w-px bg-gray-200 mx-2 dark:bg-gray-700" />

      <ToolbarButton
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        title={t('editor.insertTable')}
      >
        <TableIcon size={18} />
      </ToolbarButton>

      {editor.isActive('table') && (
        <>
          <ToolbarButton
            onClick={() => editor.chain().focus().addColumnBefore().run()}
            title={t('editor.addColumnBefore')}
          >
            <Columns size={18} className="rotate-90" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            title={t('editor.addColumnAfter')}
          >
            <Columns size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().addRowBefore().run()}
            title={t('editor.addRowBefore')}
          >
            <Rows size={18} className="rotate-90" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().addRowAfter().run()}
            title={t('editor.addRowAfter')}
          >
            <Rows size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().deleteTable().run()}
            title={t('editor.deleteTable')}
          >
            <Trash2 size={18} />
          </ToolbarButton>
        </>
      )}

      <div className="w-px bg-gray-200 mx-2 dark:bg-gray-700" />

      {onAttach && (
        <ToolbarButton
          onClick={onAttach}
          title={t('editor.attach')}
        >
          <Paperclip size={18} />
        </ToolbarButton>
      )}

      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title={t('editor.undo')}
      >
        <Undo size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title={t('editor.redo')}
      >
        <Redo size={18} />
      </ToolbarButton>
    </div>
  );
}
