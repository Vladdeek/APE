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
	FlaskConical,
	FilePlus2,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useSearchParams } from 'react-router-dom'
import { TextEditor } from '../components/ConstructorViews/TextEditor'
import { PhotoBlock } from '../components/ConstructorViews/PhotoImport'
import { VideoImport } from '../components/ConstructorViews/VideoImport'
import { CodeUploader } from '../components/ConstructorViews/CodeImport'
import { FileManager } from '../components/ConstructorViews/FilesImport'
import { Formula } from '../components/ConstructorViews/FormulaConstructor'
import { ButtonConstructor } from '../components/ConstructorViews/ButtonConstructor'
import { Callout } from '../components/ConstructorViews/Callout'
import { DefaultButton } from '../components/Buttons'
import { InputDefault } from '../components/Inputs'

const COMPONENT_MAP = {
	text: TextEditor,
	image: PhotoBlock,
	video: VideoImport,
	code: CodeUploader,
	files: FileManager,
	formula: Formula,
	button: ButtonConstructor,
	callout: Callout,
}

export const LESSON_TYPES = [
	{
		label: 'Лекция',
		apiType: 'lecture',
		icon: <BookMarked size={24} />,
		description:
			'Теоретический материал с поддержкой текста, изображений, видео и аудио.',
	},
	{
		label: 'Практика',
		apiType: 'practice',
		icon: <NotebookPen size={24} />,
		description:
			'Задания для самостоятельного выполнения. Включает инструкции и примеры.',
	},
	{
		label: 'Тест',
		apiType: 'test',
		icon: <LaptopMinimalCheck size={24} />,
		description: 'Проверка знаний с помощью различных типов вопросов.',
	},
]
const CreateItemButton = ({ type = 'module', onAdd }) => {
	const [isOpen, setIsOpen] = useState(false)
	const [step, setStep] = useState(0)
	const [title, setTitle] = useState('')
	const [selectedTypeIndex, setSelectedTypeIndex] = useState(0)
	const [isNameValid, setIsNameValid] = useState(false)

	const isModule = type === 'module'

	const resetState = () => {
		setIsOpen(false)
		setStep(0)
		setTitle('')
		setIsNameValid(false)
	}

	const handleSave = () => {
		if (isModule) {
			onAdd({ name: title })
		} else {
			onAdd({
				title: title,
				type: LESSON_TYPES[selectedTypeIndex].apiType,
				content: {},
			})
		}
		resetState()
	}

	return (
		<div className='w-full'>
			<DefaultButton
				invert={true}
				width='w-full'
				onClick={() => setIsOpen(prev => !prev)}
			>
				<div className='flex items-center justify-center gap-3 w-full'>
					{isModule ? <Package size={20} /> : <FilePlus2 size={20} />}
					<span style={{ fontSize: '16px' }}>
						{isModule ? 'Добавить модуль' : 'Добавить занятие'}
					</span>
				</div>
			</DefaultButton>

			{isOpen && (
				<div className='bg-[var(--white)] rounded-xl shadow-[var(--shadow)] p-4 mt-3 flex flex-col gap-3 z-10 w-full'>
					{/* Шаг выбора типа (только для уроков) */}
					{!isModule && step === 0 && (
						<>
							<div className='grid grid-cols-3 gap-2'>
								{LESSON_TYPES.map((item, index) => (
									<button
										key={index}
										type='button'
										onClick={() => setSelectedTypeIndex(index)}
										className={`flex flex-col items-center justify-center gap-2 py-2 rounded-lg transition-all
                                            ${selectedTypeIndex === index ? 'bg-[var(--hero-epta)] text-white' : 'bg-[var(--bg)] text-[var(--middle)]'}
                                            hover:scale-105 cursor-pointer`}
									>
										<span>{item.icon}</span>
										<span className='font-medium'>{item.label}</span>
									</button>
								))}
							</div>
							<p className='text-[var(--middle)] text-center text-sm'>
								{LESSON_TYPES[selectedTypeIndex].description}
							</p>
							<div className='flex justify-end mt-2'>
								<DefaultButton width='w-full' onClick={() => setStep(1)}>
									Далее
								</DefaultButton>
							</div>
						</>
					)}

					{/* Шаг ввода названия (для модулей сразу, для уроков - вторым шагом) */}
					{(isModule || step === 1) && (
						<div className='flex flex-col gap-3'>
							<InputDefault
								title={isModule ? 'Название модуля' : 'Название занятия'}
								placeholder='Введите название'
								required={true}
								value={title}
								onChange={e => setTitle(e.target.value)}
								onStatusChange={setIsNameValid}
							/>
							<div className='flex justify-between gap-2 mt-2'>
								{!isModule && (
									<DefaultButton
										invert={true}
										width='w-full'
										flexParams='justify-center'
										onClick={() => setStep(0)}
									>
										Назад
									</DefaultButton>
								)}
								<DefaultButton
									width='w-full'
									flexParams='justify-center'
									onClick={() => setStep(0)}
									disabled={!isNameValid}
								>
									{isModule ? 'Добавить модуль' : 'Создать'}
								</DefaultButton>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	)
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
		// {
		// 	title: 'Таблица',
		// 	type: 'table',
		// 	icon: <Table size={32} />,
		// },
		// {
		// 	title: 'Аудио',
		// 	type: 'audio',
		// 	icon: <AudioLines size={32} />,
		// },
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
			<div className='grid lg:grid-cols-4 grid-cols-2 gap-2 p-3 bg-[var(--white)] rounded-2xl shadow-[var(--shadow)] w-fit'>
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
			<div className='flex items-center justify-between bg-[var(--white)] rounded-xl shadow-[var(--shadow)] p-3'>
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
					className='p-1.5 hover:bg-[var(--light-middle)] text-[var(--black)] rounded-lg cursor-pointer transition-all'
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

const CoursePage = ({ role }) => {
	const { courseId } = useParams()
	const [searchParams, setSearchParams] = useSearchParams()
	const activeSectionId = searchParams.get('section') || 'sec-1'
	const [blocks, setBlocks] = useState([])

	const [isEdit, setIsEdit] = useState(false)

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
						{role === 'teacher' && (
							<CreateItemButton
								type='lesson'
								onAdd={() => {
									console.log('create lesson')
								}}
							/>
						)}
					</Module>
				))}
				{role === 'teacher' && (
					<CreateItemButton
						type='module'
						onAdd={() => {
							console.log('create module')
						}}
					/>
				)}
			</div>

			{/* Основной контент */}
			<div className='w-full h-full bg-[var(--white)] shadow-lg rounded-3xl p-4'>
				<div className='flex items-center justify-between w-full bg-[var(--white)] shadow-[var(--shadow)] rounded-xl pr-3 pl-4 py-2'>
					<div className='flex items-center gap-3'>
						<span className={'text-[var(--middle)] h-full w-auto'}>
							{icons[activeSection.type]}
						</span>
						<div className='flex flex-col'>
							<p
								className={'text-[var(--middle)] text-sm uppercase font-medium'}
							>
								{labels[activeSection.type]}
							</p>
							<p className={'text-[var(--black)] text-lg'}>
								{activeSection.title}
							</p>
						</div>
					</div>
					{role === 'teacher' && (
						<DefaultButton
							onClick={() => setIsEdit(prev => !prev)}
							rounded={'rounded-lg'}
							width='w-38'
							flexParams='justify-center'
						>
							{isEdit ? 'Сохранить' : 'Редактировать'}
						</DefaultButton>
					)}
				</div>
				<div className='w-full h-full overflow-y-auto px-2 py-4'>
					<ContentView isEdit={isEdit} />
				</div>
			</div>
		</div>
	)
}

export default CoursePage
