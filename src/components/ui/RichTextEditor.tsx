"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';
import { Youtube } from '@tiptap/extension-youtube';
import { 
  Bold, Italic, Strikethrough, Underline as UnderlineIcon, Code, 
  Heading1, Heading2, Heading3, 
  List, ListOrdered, Quote, ImageIcon, Link as LinkIcon, Unlink,
  Undo, Redo, RemoveFormatting,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Maximize, Minimize,
  Minus, Table as TableIcon, Trash, Trash2, ArrowLeft, ArrowRight, ArrowUp, ArrowDown,
  TableCellsMerge, TableCellsSplit,
  Highlighter, Video as YoutubeIcon
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
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('underline') ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-200'}`}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
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
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('highlight') ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-200'}`}
          title="Highlight"
        >
          <Highlighter className="w-4 h-4" />
        </button>
        <div className="flex items-center mx-1 border border-slate-200 rounded-lg overflow-hidden h-8 relative" title="رنگ متن">
          <input
            type="color"
            onInput={event => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
            value={editor.getAttributes('textStyle').color || '#000000'}
            className="w-10 h-10 p-0 border-0 cursor-pointer absolute -top-1 -left-1"
          />
        </div>
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
        <button
          onClick={() => {
            const url = window.prompt('لینک ویدیو (یوتیوب، آپارات و...):');
            if (url) {
              editor.chain().focus().setYoutubeVideo({ src: url }).run();
            }
          }}
          className="p-2 rounded-lg transition-colors text-slate-600 hover:bg-slate-200"
          title="افزودن ویدیو"
        >
          <YoutubeIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-2 rounded-lg transition-colors text-slate-600 hover:bg-slate-200"
          title="خط جداکننده"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          className="p-2 rounded-lg transition-colors text-slate-600 hover:bg-slate-200"
          title="افزودن جدول"
        >
          <TableIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-1 px-2 border-e border-slate-200">
        <button
          onClick={() => {
            const previousUrl = editor.getAttributes('link').href;
            const url = window.prompt('آدرس اینترنتی (URL) را وارد کنید:', previousUrl);
            if (url === null) return;
            if (url === '') {
              editor.chain().focus().extendMarkRange('link').unsetLink().run();
              return;
            }
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
          }}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('link') ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-200'}`}
          title="افزودن لینک"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive('link')}
          className="p-2 rounded-lg transition-colors text-slate-600 hover:bg-slate-200 disabled:opacity-50"
          title="حذف لینک"
        >
          <Unlink className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-1 px-2 border-e border-slate-200">
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-200'}`}
          title="راست‌چین"
        >
          <AlignRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-200'}`}
          title="وسط‌چین"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-200'}`}
          title="چپ‌چین"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive({ textAlign: 'justify' }) ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-200'}`}
          title="تراز (Justify)"
        >
          <AlignJustify className="w-4 h-4" />
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

      {editor.isActive('table') && (
        <div className="flex items-center gap-1 px-2 border-e border-slate-200 bg-amber-50 rounded-lg animate-in fade-in duration-200">
          <button onClick={() => editor.chain().focus().addColumnBefore().run()} className="p-2 text-amber-700 hover:bg-amber-100 rounded-lg" title="افزودن ستون قبل"><ArrowLeft className="w-4 h-4" /></button>
          <button onClick={() => editor.chain().focus().addColumnAfter().run()} className="p-2 text-amber-700 hover:bg-amber-100 rounded-lg" title="افزودن ستون بعد"><ArrowRight className="w-4 h-4" /></button>
          <button onClick={() => editor.chain().focus().deleteColumn().run()} className="p-2 text-amber-700 hover:bg-amber-100 rounded-lg" title="حذف ستون"><Trash2 className="w-4 h-4" /></button>
          <button onClick={() => editor.chain().focus().addRowBefore().run()} className="p-2 text-amber-700 hover:bg-amber-100 rounded-lg" title="افزودن سطر بالا"><ArrowUp className="w-4 h-4" /></button>
          <button onClick={() => editor.chain().focus().addRowAfter().run()} className="p-2 text-amber-700 hover:bg-amber-100 rounded-lg" title="افزودن سطر پایین"><ArrowDown className="w-4 h-4" /></button>
          <button onClick={() => editor.chain().focus().deleteRow().run()} className="p-2 text-amber-700 hover:bg-amber-100 rounded-lg" title="حذف سطر"><Trash2 className="w-4 h-4" /></button>
          <button onClick={() => editor.chain().focus().mergeCells().run()} className="p-2 text-amber-700 hover:bg-amber-100 rounded-lg" title="ادغام سلول‌ها"><TableCellsMerge className="w-4 h-4" /></button>
          <button onClick={() => editor.chain().focus().splitCell().run()} className="p-2 text-amber-700 hover:bg-amber-100 rounded-lg" title="جداسازی سلول‌ها"><TableCellsSplit className="w-4 h-4" /></button>
          <button onClick={() => editor.chain().focus().deleteTable().run()} className="p-2 text-red-600 hover:bg-red-100 rounded-lg" title="حذف جدول"><Trash className="w-4 h-4" /></button>
        </div>
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
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Youtube.configure({
        inline: false,
        HTMLAttributes: {
          class: 'w-full aspect-video rounded-xl overflow-hidden my-4',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'w-full border-collapse border border-slate-300 my-4 prose-td:border-slate-300 prose-th:border-slate-300 prose-th:bg-slate-100',
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-indigo-600 underline hover:text-indigo-800 transition-colors cursor-pointer',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
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
