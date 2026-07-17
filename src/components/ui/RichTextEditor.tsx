"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { 
  Bold, Italic, Strikethrough, Code, 
  Heading1, Heading2, Heading3, 
  List, ListOrdered, Quote, ImageIcon,
  Undo, Redo, RemoveFormatting,
  AlignLeft, AlignCenter, AlignRight, Maximize, Minimize
} from 'lucide-react';
import { MediaPickerModal } from '../admin/MediaPickerModal';
import { useState } from 'react';

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '100%',
        renderHTML: attributes => {
          return {
            width: attributes.width,
          };
        },
      },
      style: {
        default: 'display: block; margin: 1rem auto;',
        renderHTML: attributes => {
          return {
            style: attributes.style,
          };
        },
      },
    };
  },
});

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor, onOpenMediaModal }: { editor: any, onOpenMediaModal: () => void }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 border-b border-slate-200 rounded-t-2xl">
      <div className="flex items-center gap-1 pe-2 border-e border-slate-200">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('bold') ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-200'}`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('italic') ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-200'}`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('strike') ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-200'}`}
          title="Strike"
        >
          <Strikethrough className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('code') ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-200'}`}
          title="Code"
        >
          <Code className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          className="p-2 rounded-lg transition-colors text-slate-600 hover:bg-slate-200"
          title="Clear Formatting"
        >
          <RemoveFormatting className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-1 px-2 border-e border-slate-200">
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-200'}`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-200'}`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-200'}`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-1 px-2 border-e border-slate-200">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('bulletList') ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-200'}`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('orderedList') ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-200'}`}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('blockquote') ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-200'}`}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          onClick={onOpenMediaModal}
          className="p-2 rounded-lg transition-colors text-slate-600 hover:bg-slate-200"
          title="افزودن تصویر"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
      </div>

      {editor.isActive('image') && (
        <>
          <div className="flex items-center gap-1 px-2 border-e border-slate-200 bg-indigo-50 rounded-lg animate-in fade-in duration-200">
            <button 
              onClick={() => editor.chain().focus().updateAttributes('image', { style: 'float: right; margin: 0 0 1rem 1rem;' }).run()}
              className="p-2 rounded-lg transition-colors text-indigo-700 hover:bg-indigo-100"
              title="راست‌چین"
            >
              <AlignRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => editor.chain().focus().updateAttributes('image', { style: 'display: block; margin: 1rem auto;' }).run()}
              className="p-2 rounded-lg transition-colors text-indigo-700 hover:bg-indigo-100"
              title="وسط‌چین"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button 
              onClick={() => editor.chain().focus().updateAttributes('image', { style: 'float: left; margin: 0 1rem 1rem 0;' }).run()}
              className="p-2 rounded-lg transition-colors text-indigo-700 hover:bg-indigo-100"
              title="چپ‌چین"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1 px-2 border-e border-slate-200 bg-indigo-50 rounded-lg animate-in fade-in duration-200">
            <button 
              onClick={() => editor.chain().focus().updateAttributes('image', { width: '50%' }).run()}
              className="p-2 rounded-lg transition-colors text-indigo-700 hover:bg-indigo-100"
              title="کوچک (۵۰٪)"
            >
              <Minimize className="w-4 h-4" />
            </button>
            <button 
              onClick={() => editor.chain().focus().updateAttributes('image', { width: '100%' }).run()}
              className="p-2 rounded-lg transition-colors text-indigo-700 hover:bg-indigo-100"
              title="بزرگ (۱۰۰٪)"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </>
      )}

      <div className="flex items-center gap-1 px-2 ml-auto">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="p-2 rounded-lg transition-colors text-slate-600 hover:bg-slate-200 disabled:opacity-50"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="p-2 rounded-lg transition-colors text-slate-600 hover:bg-slate-200 disabled:opacity-50"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      CustomImage.configure({
        HTMLAttributes: {
          class: 'rounded-xl shadow-sm border border-slate-200 max-w-full h-auto cursor-pointer transition-all hover:ring-2 hover:ring-indigo-400',
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-slate prose-rtl max-w-none w-full outline-none min-h-[400px] p-6',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-colors">
      <MenuBar editor={editor} onOpenMediaModal={() => setIsMediaModalOpen(true)} />
      <EditorContent editor={editor} />

      <MediaPickerModal 
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        requireSeo={true}
        onSelect={(data) => {
          if (editor && data.url) {
            editor.chain().focus().setImage({ 
              src: data.url, 
              alt: data.alt || '', 
              title: data.title || '' 
            }).run();
          }
        }}
      />
    </div>
  );
}
