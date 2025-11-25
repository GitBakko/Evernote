import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import EditorToolbar from './EditorToolbar';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  editable?: boolean;
}

export default function Editor({ content, onChange, editable = true }: EditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] px-8 py-4',
      },
    },
  });

  // Sync content when prop changes (e.g. selecting a different note)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {editable && <EditorToolbar editor={editor} />}
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
