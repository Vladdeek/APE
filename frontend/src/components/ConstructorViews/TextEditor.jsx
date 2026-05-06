import React, { useEffect, useMemo } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
// Вместо StarterKit берем только нужные модули по отдельности
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Strike from '@tiptap/extension-strike'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import History from '@tiptap/extension-history'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'

import {
	Bold as BoldIcon,
	Italic as ItalicIcon,
	Underline as UnderlineIcon,
	Strikethrough,
	List,
	ListOrdered,
	AlignLeft,
	AlignCenter,
	AlignRight,
	X,
} from 'lucide-react'

export const TextEditor = ({
	DelComponent,
	onChange,
	takeValue,
	isEdit = false,
}) => {
	const initialContent = useMemo(() => {
		if (!takeValue) return ''
		try {
			return JSON.parse(takeValue)
		} catch (e) {
			return takeValue
		}
	}, [takeValue])

	const editor = useEditor({
		// Явно перечисляем расширения. Теперь конфликту взяться просто неоткуда.
		extensions: [
			Document,
			Paragraph,
			Text,
			Bold,
			Italic,
			Strike,
			Underline,
			ListItem,
			BulletList,
			OrderedList,
			History,
			TextAlign.configure({
				types: ['heading', 'paragraph'],
			}),
		],
		content: initialContent,
		editable: !!isEdit,
		onUpdate: ({ editor }) => {
			onChange?.({
				content: JSON.stringify(editor.getJSON()),
				plainText: editor.getText(),
			})
		},
	})

	useEffect(() => {
		if (editor) editor.setEditable(!!isEdit)
	}, [isEdit, editor])

	if (!editor) return null

	const ToolbarButton = ({ onClick, isActive, icon: Icon }) => (
		<button
			type='button'
			onMouseDown={e => {
				e.preventDefault()
				onClick()
			}}
			className={`p-2 rounded transition ${
				isActive
					? 'bg-[var(--hero-epta)] text-white'
					: 'hover:bg-[var(--hero-epta)] hover:text-white text-gray-500'
			}`}
		>
			<Icon size={18} />
		</button>
	)

	return (
		<div className={`flex gap-2 ${!isEdit ? 'w-full' : ''}`}>
			{isEdit && (
				<button
					type='button'
					className='self-start bg-white shadow-md p-2 rounded-lg hover:bg-gray-50'
					onClick={DelComponent}
				>
					<X size={20} />
				</button>
			)}

			<div className='w-full flex flex-col'>
				{isEdit && (
					<div className='flex flex-wrap gap-1 mb-2 bg-white shadow-sm border border-gray-200 p-1.5 rounded-lg w-fit'>
						<ToolbarButton
							onClick={() => editor.chain().focus().toggleBold().run()}
							isActive={editor.isActive('bold')}
							icon={BoldIcon}
						/>
						<ToolbarButton
							onClick={() => editor.chain().focus().toggleItalic().run()}
							isActive={editor.isActive('italic')}
							icon={ItalicIcon}
						/>
						<ToolbarButton
							onClick={() => editor.chain().focus().toggleUnderline().run()}
							isActive={editor.isActive('underline')}
							icon={UnderlineIcon}
						/>
						<ToolbarButton
							onClick={() => editor.chain().focus().toggleStrike().run()}
							isActive={editor.isActive('strike')}
							icon={Strikethrough}
						/>
						<div className='w-px h-6 bg-gray-200 mx-1 self-center' />
						<ToolbarButton
							onClick={() => editor.chain().focus().toggleBulletList().run()}
							isActive={editor.isActive('bulletList')}
							icon={List}
						/>
						<ToolbarButton
							onClick={() => editor.chain().focus().toggleOrderedList().run()}
							isActive={editor.isActive('orderedList')}
							icon={ListOrdered}
						/>
						<div className='w-px h-6 bg-gray-200 mx-1 self-center' />
						<ToolbarButton
							onClick={() => editor.chain().focus().setTextAlign('left').run()}
							isActive={editor.isActive({ textAlign: 'left' })}
							icon={AlignLeft}
						/>
						<ToolbarButton
							onClick={() =>
								editor.chain().focus().setTextAlign('center').run()
							}
							isActive={editor.isActive({ textAlign: 'center' })}
							icon={AlignCenter}
						/>
						<ToolbarButton
							onClick={() => editor.chain().focus().setTextAlign('right').run()}
							isActive={editor.isActive({ textAlign: 'right' })}
							icon={AlignRight}
						/>
					</div>
				)}

				<div className='w-full'>
					<style>
						{`
                            .ProseMirror { outline: none !important; min-height: 100px; }
                            .ProseMirror p { margin-bottom: 8px; }
                            .ProseMirror ul { list-style-type: disc; padding-left: 20px; }
                            .ProseMirror ol { list-style-type: decimal; padding-left: 20px; }
                        `}
					</style>
					<EditorContent
						editor={editor}
						className={
							isEdit
								? 'px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus-within:border-blue-400'
								: ''
						}
					/>
				</div>
			</div>
		</div>
	)
}
