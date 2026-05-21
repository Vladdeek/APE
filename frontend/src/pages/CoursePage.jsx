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
import { useCallback, useEffect, useRef, useState } from 'react'
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
import {
	CreateCourse,
	CreateLesson,
	CreateModule,
	ReadCourseById,
} from '../../service/APIs/Couses'
import {
	AppendLectureContent,
	DeleteBlock,
	ReadLectureContent,
	UpdateLectureContent,
} from '../../service/APIs/LectureContent'
import { debounce } from 'lodash'

const COMPONENT_MAP = {
	text: TextEditor,
	images: PhotoBlock,
	video: VideoImport,
	code: CodeUploader,
	files: FileManager,
	formula: Formula,
	button: ButtonConstructor,
	callout: Callout,
}

// Если LESSON_TYPES импортируется из другого места, этот массив можно удалить
const DEFAULT_LESSON_TYPES = [
	{
		label: 'Лекция',
		apiType: 'lecture',
		icon: <BookMarked size={18} />,
		description: 'Теоретический материал с блоками текста и медиа.',
	},
	{
		label: 'Практика',
		apiType: 'practice',
		icon: <NotebookPen size={18} />,
		description: 'Практическое задание для закрепления материала.',
	},
	{
		label: 'Тест',
		apiType: 'test',
		icon: <LaptopMinimalCheck size={18} />,
		description: 'Контрольное тестирование для проверки знаний.',
	},
]

const CreateItemButton = ({
	type = 'module',
	onAdd,
	LESSON_TYPES = DEFAULT_LESSON_TYPES,
}) => {
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
				name: title, // Меняем 'title' на 'name', чтобы соответствовать аргументам API
				module_content_type: LESSON_TYPES[selectedTypeIndex].apiType,
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

					{/* Шаг ввода названия */}
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
									onClick={handleSave} // ИСПРАВЛЕНО: Вместо setStep(0) вызываем сохранение данных
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

	// Реф-карта для отслеживания ПЕРВОГО рендера КАЖДОГО блока по его id
	const firstRenderMap = useRef({})

	// Сбрасываем карту первых рендеров, если пользователь переключился на другую лекцию
	useEffect(() => {
		firstRenderMap.current = {}
	}, [sectionId])

	const handleRemove = async blockId => {
		console.log('delete block - ', blockId)
		try {
			await DeleteBlock(sectionId, blockId)
			readContent()
		} catch (err) {}
	}

	const addBlock = async (id, type) => {
		try {
			await AppendLectureContent(id, type)
			readContent()
		} catch (err) {}
	}

	const readContent = async () => {
		try {
			const res = await ReadLectureContent(sectionId)
			setBlocks(res.items)
		} catch (err) {}
	}

	// const debouncedUpdate = useCallback(
	// 	debounce(async (blockId, body, type) => {
	// 		try {
	// 			await UpdateLectureContent(sectionId, blockId, body, type)
	// 		} catch (err) {}
	// 	}, 500),
	// 	[sectionId],
	// )

	// const putContentInBlock = (blockId, body, type) => {
	// 	console.log('body i put: ', body)
	// 	// ЕСЛИ ЭТОТ БЛОК ТРИГГЕРИТСЯ ВПЕРВЫЕ ПОСЛЕ ЗАГРУЗКИ
	// 	if (firstRenderMap.current[blockId] === undefined) {
	// 		// Помечаем, что первый холостой вызов произошел
	// 		firstRenderMap.current[blockId] = false
	// 		console.log(
	// 			`[Блокировка авто-вызова]: Скипнут первый рендер для блока ${type} (${blockId})`,
	// 		)
	// 		return // СТОПАЕМ функцию, запрос на бэк не идет!
	// 	}

	// 	// Все последующие вызовы — это уже реальные действия пользователя
	// 	debouncedUpdate(blockId, body, type)
	// }

	const putContentInBlock = async (blockId, body, type) => {
		try {
			await UpdateLectureContent(sectionId, blockId, body, type)
			readContent()
		} catch (err) {}
	}

	useEffect(() => {
		if (sectionId) {
			readContent()
		}
	}, [sectionId])

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
						{blocks?.map((item, i) => {
							const { type, block } = item
							if (!block) return null

							const Component = COMPONENT_MAP[type]
							if (!Component) return null

							const isSpecialBlock = [
								'callout',
								'formula',
								'code',
								'text',
							].includes(type)

							return (
								<motion.div
									key={block.id}
									initial={{ scale: 0.8, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={{
										duration: 0.3,
										delay: i * 0.1,
										ease: 'easeOut',
									}}
								>
									<Component
										data={isSpecialBlock ? block.content : block.files}
										plainText={block.plain_text}
										isEdit={isEdit}
										onChange={data => putContentInBlock(block.id, data, type)}
										onDelete={() => handleRemove(block.id)}
										courseId={courseId}
										sectionId={sectionId}
									/>
								</motion.div>
							)
						})}

						{isEdit && (
							<ConstructorMenu onAdd={type => addBlock(sectionId, type)} />
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
			type: 'images',
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
	const activeSectionId = searchParams.get('section') || ''

	const [blocks, setBlocks] = useState([])
	const [isEdit, setIsEdit] = useState(false)
	const [modules, setModules] = useState([])
	const [isLoading, setIsLoading] = useState(true) // Состояние загрузки

	// Переносим чтение курса в useCallback, чтобы функцию можно было вызывать из других методов
	const fetchCourseData = useCallback(async () => {
		if (!courseId) return
		try {
			// Убираем setIsLoading(true) отсюда, чтобы интерфейс не «моргал» при создании уроков
			const res = await ReadCourseById(courseId)
			if (res && res.modules) {
				setModules(res.modules)

				// Если в URL еще не выбран section, выбираем первый доступный из пришедших данных
				if (!searchParams.get('section') && res.modules[0]?.sections[0]?.id) {
					setSearchParams(
						{ section: res.modules[0].sections[0].id },
						{ replace: true },
					)
				}
			}
		} catch (err) {
			console.error('Ошибка при загрузке курса:', err)
		} finally {
			setIsLoading(false)
		}
	}, [courseId, searchParams, setSearchParams])

	// Первый рендер и смена courseId
	useEffect(() => {
		setIsLoading(true)
		fetchCourseData()
	}, [courseId, fetchCourseData])

	// Поиск активной секции (лекции/теста) для отображения в шапке контента
	const activeSection = modules
		?.flatMap(m => m.content)
		.find(s => s.id === activeSectionId)

	const toggleModule = id => {
		setModules(prev =>
			prev.map(m => (m.id === id ? { ...m, isExpanded: !m.isExpanded } : m)),
		)
	}

	const handleSectionClick = id => {
		setSearchParams({ section: id }, { replace: true })
	}

	// Обработчики создания с async/await
	const createModule = async name => {
		try {
			await CreateModule(name, courseId)
			await fetchCourseData() // Обновляем данные с сервера
		} catch (err) {
			console.error('Ошибка при создании модуля:', err)
		}
	}

	const createLesson = async (name, module_content_type, module_id) => {
		try {
			await CreateLesson(name, module_content_type, module_id)
			await fetchCourseData() // Обновляем данные с сервера
		} catch (err) {
			console.error('Ошибка при создании урока:', err)
		}
	}

	const addBlock = type => setBlocks(prev => [...prev, { type, content: null }])

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

	if (isLoading) {
		return (
			<div className='flex items-center justify-center h-screen'>
				<p className='text-lg text-[var(--middle)]'>Загрузка курса...</p>
			</div>
		)
	}

	return (
		<div className='grid grid-cols-[350px_1fr] h-screen gap-6 pt-30 pb-10 '>
			{/* Боковая панель (Sidebar) */}
			<div className='w-full h-full overflow-y-auto bg-[var(--white)] shadow-lg rounded-3xl p-4'>
				<h2 className='text-xl font-bold mb-3 px-2 text-[var(--black)]'>
					Содержание курса
				</h2>
				{modules?.map((module, idx) => (
					<Module
						key={module.id}
						title={module.name}
						index={idx + 1}
						isExpanded={module.isExpanded}
						onToggle={() => toggleModule(module.id)}
					>
						{module?.content?.map((section, index) => (
							<motion.div
								key={section.id}
								initial={{ scale: 0.8, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{
									duration: 0.3,
									delay: index * 0.1,
									ease: 'easeOut',
								}}
							>
								<Content
									title={section.name}
									type={section.type}
									isSelected={activeSectionId === section.id}
									onClick={() => handleSectionClick(section.id)}
								/>
							</motion.div>
						))}

						{/* Кнопка создания УРОКА внутри модуля */}
						{role === 'teacher' && (
							<CreateItemButton
								type='lesson'
								onAdd={lessonData => {
									// lessonData содержит { name, module_content_type }
									createLesson(
										lessonData.name,
										lessonData.module_content_type,
										module.id,
									)
								}}
							/>
						)}
					</Module>
				))}

				{/* Кнопка создания МОДУЛЯ в самом низу списка */}
				{role === 'teacher' && (
					<CreateItemButton
						type='module'
						onAdd={moduleData => {
							// moduleData содержит { name }
							createModule(moduleData.name)
						}}
					/>
				)}
			</div>

			{/* Основной контент */}
			<div className='w-full h-full bg-[var(--white)] shadow-lg rounded-3xl p-4'>
				{activeSection && (
					<div className='flex items-center justify-between w-full bg-[var(--white)] shadow-[var(--shadow)] rounded-xl pr-3 pl-4 py-2'>
						<div className='flex items-center gap-3'>
							{activeSection && (
								<>
									<span className={'text-[var(--middle)] h-full w-auto'}>
										{icons[activeSection.type]}
									</span>
									<div className='flex flex-col'>
										<p
											className={
												'text-[var(--middle)] text-sm uppercase font-medium'
											}
										>
											{labels[activeSection.type]}
										</p>
										<p className={'text-[var(--black)] text-lg'}>
											{activeSection.name}
										</p>
									</div>
								</>
							)}
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
				)}

				<div className='w-full h-full overflow-y-auto px-2 py-4'>
					{/* Передаем id активной секции внутрь ContentView, чтобы он знал, что загружать */}
					<ContentView isEdit={isEdit} sectionId={activeSectionId} />
				</div>
			</div>
		</div>
	)
}

export default CoursePage
