import React, { useEffect, useMemo } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
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
} from 'lucide-react'
import { RemoveButton } from './FileUploaderZone'

export const TextEditor = ({
	data,
	onDelete,
	onChange,
	isEdit = false,
	plainText,
	courseId,
}) => {
	// 1. ПРЕОБРАЗОВАНИЕ ПРИ ВХОДЕ: Из строки Slate-формата в схему Tiptap
	const initialContent = useMemo(() => {
		if (!data) return ''

		try {
			// Если пришла строка, парсим её в массив
			const parsed = typeof data === 'string' ? JSON.parse(data) : data

			// Если это уже структура Tiptap ({type: 'doc'}), отдаем как есть
			if (parsed && parsed.type === 'doc') return parsed

			// Если это массив в стиле Slate, собираем из него валидный Tiptap doc
			if (Array.isArray(parsed)) {
				const tiptapContent = parsed.map(block => {
					// Конвертируем children в content
					const blockContent =
						block.children?.map(child => ({
							type: 'text',
							text: child.text || '',
							// Если будут marks (bold, italic), Tiptap их подхватит, если передавать правильно
						})) || []

					return {
						type: 'paragraph',
						attrs: { textAlign: null },
						content: blockContent,
					}
				})

				return {
					type: 'doc',
					content: tiptapContent,
				}
			}
		} catch (e) {
			console.error('Ошибка парсинга входящего контента:', e)
		}
		return data
	}, [data])

	const editor = useEditor({
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
			const tiptapJson = editor.getJSON()

			// 2. ПРЕОБРАЗОВАНИЕ ПРИ ВЫХОДЕ: Из Tiptap в JSON-строку Slate-формата
			// Вытаскиваем только массив параграфов/блоков
			const tiptapBlocks = tiptapJson.content || []

			const slateBlocks = tiptapBlocks.map(block => {
				// Пересобираем элементы контента в формат { text: "..." } внутри children
				const children = block.content?.map(item => ({
					text: item.text || '',
				})) || [{ text: '' }] // Если параграф пустой, оставляем пустую строку

				return {
					type: 'paragraph',
					children: children,
				}
			})

			// Сериализуем полученный массив обратно в строку, как просит бэкенд
			onChange?.({
				content: JSON.stringify(slateBlocks),
				plainText: editor.getText(),
			})
		},
	})

	useEffect(() => {
		if (editor) {
			editor.setEditable(!!isEdit)
		}
	}, [isEdit, editor])

	// Синхронизация, если данные изменились извне
	useEffect(() => {
		if (editor && data) {
			// Быстрая проверка изменений, чтобы не сбрасывать фокус при вводе
			if (!editor.isFocused) {
				editor.commands.setContent(initialContent, false)
			}
		}
	}, [initialContent, editor])

	if (!editor) return null

	const ToolbarButton = ({ onClick, isActive, icon: Icon }) => (
		<button
			type='button'
			onMouseDown={e => {
				e.preventDefault()
				onClick()
			}}
			className={`p-2 rounded-lg cursor-pointer transition ${
				isActive
					? 'bg-[var(--hero-epta)] text-white'
					: 'hover:bg-[var(--hero-epta)] hover:text-white text-[var(--middle)]'
			}`}
		>
			<Icon size={18} />
		</button>
	)

	return (
		<div className={`flex gap-4 ${!isEdit ? 'w-full' : ''}`}>
			{isEdit && <RemoveButton onDelete={onDelete} />}

			<div className='w-full flex flex-col'>
				{isEdit && (
					<div className='flex flex-wrap gap-1 mb-2 bg-[var(--white)] shadow-[var(--shadow)] p-1.5 rounded-xl w-fit'>
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
						<div className='w-px h-6 bg-[var(--middle)] mx-1 self-center' />
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
						<div className='w-px h-6 bg-[var(--middle)] mx-1 self-center' />
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
                            .ProseMirror { outline: none !important; min-height: 60px; }
                            .ProseMirror p { margin-bottom: 8px; }
                            .ProseMirror ul { list-style-type: disc; padding-left: 20px; }
                            .ProseMirror ol { list-style-type: decimal; padding-left: 20px; }
                        `}
					</style>
					<EditorContent
						editor={editor}
						className={`text-[var(--black)] ${
							isEdit
								? 'px-4 py-3 rounded-2xl bg-[var(--light-gray)] border border-[var(--light-middle)] focus-within:border-[var(--hero)]'
								: ''
						}`}
					/>
				</div>
			</div>
		</div>
	)
}
