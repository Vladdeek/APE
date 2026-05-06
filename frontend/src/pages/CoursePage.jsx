import {
	ChevronUp,
	Package,
	BookMarked,
	NotebookPen,
	LaptopMinimalCheck,
	Text,
	Code,
	Image,
	Film,
	Files,
	Table,
	AudioLines,
	Layers2,
	SquareFunction,
	MousePointerClick,
	Loader,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useSearchParams } from 'react-router-dom'
import { TextEditor } from '../components/ConstructorViews/TextEditor'
import { PhotoBlock } from '../components/ConstructorViews/PhotoImport'
import { VideoImport } from '../components/ConstructorViews/VideoImport'
import { CodeUploader } from '../components/ConstructorViews/CodeImport'
import { FileManager } from '../components/ConstructorViews/FilesImport'

const COMPONENT_MAP = {
	text: TextEditor,
	image: PhotoBlock,
	video: VideoImport,
	code: CodeUploader,
	files: FileManager,
}

const ContentView = ({
	content,
	onBlocksChange,
	SectionType,
	SectionName,
	isLoading,
	sectionId,
	onSectionTypeChange,
	isEdit,
	clearSelection,
}) => {
	const [questions, setQuestions] = useState([])
	const [activeIndex, setActiveIndex] = useState(0)
	const [blocks, setBlocks] = useState([])
	const { courseId } = useParams()

	// Синхронизация данных
	useEffect(() => {
		if (!content) return
		onSectionTypeChange?.(content.type)

		if (content.type === 'test') {
			setQuestions(content.content || [])
			setBlocks([])
		} else {
			setBlocks(content.content || [])
			setQuestions([])
		}
		setActiveIndex(0)
	}, [content])

	// Универсальный обработчик для всех типов блоков
	const handleUpdate = (index, newData) => {
		const updated = blocks.map((b, i) =>
			i === index ? { ...b, content: newData } : b,
		)
		setBlocks(updated)
		onBlocksChange?.(updated)
	}

	const handleRemove = index => {
		const block = blocks[index]
		const updated = blocks.filter((_, i) => i !== index)

		// Если в блоке были файлы — чистим сервер (твоя логика)
		if (blockHadContent(block)) {
			getBlockFilePaths(block).forEach(removeFile)
			onBlocksChange?.(updated, { forceSave: true })
		} else {
			onBlocksChange?.(updated)
		}
		setBlocks(updated)
	}

	console.log(blocks)

	if (SectionType && !content) return <Loader />

	return (
		<div className='h-fit overflow-y-scroll hide-scrollbar'>
			<div className='flex flex-col gap-3 p-2'>
				{SectionType === 'test' ? (
					<TestManager
						questions={questions}
						activeIndex={activeIndex}
						isEdit={isEdit}
						onUpdate={setQuestions}
						onIndexChange={setActiveIndex}
					/>
				) : (
					<div className='flex flex-col gap-4'>
						{blocks.map((block, i) => {
							const Component = COMPONENT_MAP[block.type]
							if (!Component) return null

							return (
								<motion.div
									key={i}
									initial={{ scale: 0.8, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={{
										duration: 0.3,
										delay: i * 0.1,
										ease: 'easeOut',
									}}
								>
									<Component
										data={block.content}
										isEdit={isEdit}
										onChange={data => handleUpdate(i, data)}
										onDelete={() => handleRemove(i)}
										courseId={courseId} // для загрузки файлов
									/>
								</motion.div>
							)
						})}

						{isEdit && (
							<ConstructorMenu
								onAdd={type => setBlocks([...blocks, { type, content: null }])}
							/>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

const ConstructorMenu = ({ onAdd }) => {
	const buttons = [
		{
			title: 'Текст',
			type: 'text',
			icon: <Text size={32} />,
		},
		{
			title: 'Код',
			type: 'code',
			icon: <Code size={32} />,
		},
		{
			title: 'Фото',
			type: 'image',
			icon: <Image size={32} />,
		},
		{
			title: 'Видео',
			type: 'video',
			icon: <Film size={32} />,
		},
		{
			title: 'Файлы',
			type: 'files',
			icon: <Files size={32} />,
		},
		{
			title: 'Таблица',
			type: 'table',
			icon: <Table size={32} />,
		},
		{
			title: 'Аудио',
			type: 'audio',
			icon: <AudioLines size={32} />,
		},
		{
			title: 'Выноска',
			type: 'callout',
			icon: <Layers2 size={32} />,
		},
		{
			title: 'Формула',
			type: 'formula',
			icon: <SquareFunction size={32} />,
		},
		{
			title: 'Кнопка',
			type: 'button',
			icon: <MousePointerClick size={32} />,
		},
	]

	return (
		<>
			<div className='grid lg:grid-cols-5 grid-cols-3 gap-2 p-3 bg-[var(--white)] rounded-2xl shadow-[var(--shadow)] w-fit'>
				{buttons.map((item, index) => (
					<button
						key={index}
						onClick={() => onAdd(item.type)}
						className='flex flex-col aspect-square items-center justify-center gap-2 bg-[var(--light-middle)] rounded-xl h-25 hover:bg-[var(--hero-epta)] hover:text-white cursor-pointer text-[var(--middle)] transition-all duration-100'
					>
						{item.icon}
						<p className='text-base '>{item.title}</p>
					</button>
				))}
			</div>
		</>
	)
}

const Module = ({ title, index, isExpanded, onToggle, children }) => {
	return (
		<div className='flex flex-col gap-2 mb-4'>
			<div className='flex items-center justify-between bg-[var(--white)] rounded-xl shadow-[var(--shadow)] p-3 border border-gray-100'>
				<div className='flex items-center gap-3 text-[var(--black)]'>
					<Package size={20} className='text-[var(--middle)]' />
					<div>
						<p className='text-xs text-[var(--middle)]'>Модуль {index}</p>
						<h3 className='font-semibold text-sm leading-tight text-[var(--black)]'>
							{title}
						</h3>
					</div>
				</div>

				<button
					onClick={onToggle}
					className='p-1.5 hover:bg-gray-100 rounded-lg cursor-pointer transition-all'
				>
					<ChevronUp
						className={`${!isExpanded ? 'rotate-180' : ''} transition-all`}
						size={18}
					/>
				</button>
			</div>

			{/* Отрисовка внутреннего контента (секций) */}
			{isExpanded && (
				<div className='flex flex-col gap-2 pl-4 transition-all'>
					{children}
				</div>
			)}
		</div>
	)
}

// Компонент Контента (Лекция/Практика/Тест)
const Content = ({ type, title, isSelected, onClick }) => {
	const icons = {
		lecture: <BookMarked size={18} />,
		practice: <NotebookPen size={18} />,
		test: <LaptopMinimalCheck size={18} />,
	}

	const labels = {
		lecture: 'Лекция',
		practice: 'Практика',
		test: 'Тест',
	}

	return (
		<div
			onClick={onClick}
			className={`flex flex-col gap-1 w-full p-3 rounded-xl transition-all shadow-[var(--shadow)] border 
                ${
									isSelected
										? 'border-[var(--hero)] bg-[var(--transparent-hero)]'
										: 'border-transparent bg-[var(--white)] hover:bg-[var(--light-middle)] cursor-pointer'
								}`}
		>
			<div className='flex items-center gap-2'>
				<span
					className={isSelected ? 'text-[var(--hero)]' : 'text-[var(--middle)]'}
				>
					{icons[type]}
				</span>
				<div className='flex flex-col'>
					<span className='text-[10px] uppercase tracking-wider text-[var(--middle)] font-bold'>
						{labels[type]}
					</span>
					<p className='font-medium text-sm text-[var(--black)]'>{title}</p>
				</div>
			</div>
		</div>
	)
}

const CoursePage = () => {
	const { courseId } = useParams()
	const [searchParams, setSearchParams] = useSearchParams()
	const activeSectionId = searchParams.get('section') || 'sec-1'
	const [blocks, setBlocks] = useState([])

	const [modules, setModules] = useState([
		{
			id: 'mod-1',
			title: 'Основы React',
			isExpanded: true,
			sections: [
				{ id: 'sec-1', title: 'Введение в SX', type: 'lecture' },
				{ id: 'sec-2', title: 'Props и State', type: 'practice' },
			],
		},
		{
			id: 'mod-2',
			title: 'Hooks & API',
			isExpanded: false,
			sections: [
				{ id: 'sec-3', title: 'useEffect Deep Dive', type: 'lecture' },
				{ id: 'sec-4', title: 'Итоговый тест', type: 'test' },
			],
		},
	])

	const activeSection = modules
		.flatMap(module => module.sections)
		.find(section => section.id === activeSectionId)

	const toggleModule = id => {
		setModules(prev =>
			prev.map(m => (m.id === id ? { ...m, isExpanded: !m.isExpanded } : m)),
		)
	}

	const handleSectionClick = id => {
		// Обновляем query-параметр.
		// { replace: true } нужен, чтобы не спамить в историю браузера при каждом клике
		setSearchParams({ section: id }, { replace: true })
	}

	const icons = {
		lecture: <BookMarked />,
		practice: <NotebookPen />,
		test: <LaptopMinimalCheck />,
	}
	const labels = {
		lecture: 'Лекция',
		practice: 'Практика',
		test: 'Тест',
	}

	const addBlock = type => setBlocks(prev => [...prev, { type, content: null }])

	return (
		<div className='grid grid-cols-[350px_1fr] h-screen gap-6 pt-30 pb-10 '>
			{/* Боковая панель (Sidebar) */}
			<div className='w-full h-full overflow-y-auto bg-[var(--white)] shadow-lg rounded-3xl p-4'>
				<h2 className='text-xl font-bold mb-3 px-2 text-[var(--black)]'>
					Содержание курса
				</h2>
				{modules.map((module, idx) => (
					<Module
						key={module.id}
						title={module.title}
						index={idx + 1}
						isExpanded={module.isExpanded}
						onToggle={() => toggleModule(module.id)}
					>
						{module.sections.map((section, index) => (
							<motion.div
								key={index}
								initial={{ scale: 0.8, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{
									duration: 0.3,
									delay: index * 0.1,
									ease: 'easeOut',
								}}
							>
								<Content
									key={section.id}
									title={section.title}
									type={section.type}
									isSelected={activeSectionId === section.id}
									onClick={() => handleSectionClick(section.id)}
								/>
							</motion.div>
						))}
					</Module>
				))}
			</div>

			{/* Основной контент */}
			<div className='w-full h-full bg-[var(--white)] shadow-lg rounded-3xl p-4'>
				<div className='flex items-center gap-3 w-full bg-[var(--white)] shadow-[var(--shadow)] rounded-xl px-4 py-2'>
					<span className={'text-[var(--middle)] h-full w-auto'}>
						{icons[activeSection.type]}
					</span>
					<div className='flex flex-col'>
						<p className={'text-[var(--middle)] text-sm uppercase font-medium'}>
							{labels[activeSection.type]}
						</p>
						<p className={'text-[var(--black)] text-lg'}>
							{activeSection.title}
						</p>
					</div>
				</div>
				<div className='w-full h-full overflow-y-auto px-2 py-4'>
					<ContentView isEdit={true} />
				</div>
			</div>
		</div>
	)
}

export default CoursePage
