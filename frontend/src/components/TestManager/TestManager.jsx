import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
	AddOptionOnQuestion,
	AddQuestion,
	DeleteOption,
	EditOptionCorrectStatus,
	EditOptionName,
	EditQuestion,
	EditQuestionType,
	GetDetailQuestion,
	GetQuestions,
} from '../../../service/APIs/Test'
import { InputDefault } from '../Inputs'
import { useDebounce } from '../../../service/Hooks/useDebounce'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Plus, Trash2 } from 'lucide-react'
import { DefaultButton } from '../Buttons'

const TestHeaderBlock = ({ num, questionId, isActive, onClick }) => {
	const STYLES = {
		// По умолчанию все блоки в дефолтном стиле
		default: 'bg-[var(--white)] text-[var(--middle)] hover:text-[var(--hero)] ',
		// При клике активируется этот стиль
		active: 'bg-[var(--hero)] text-white',
	}

	return (
		<div
			onClick={() => onClick(questionId)} // Передаем UUID вопроса при клике
			className={`w-10 h-10 flex items-center justify-center rounded-[10px] font-semibold text-xl shadow-[var(--shadow)] select-none cursor-pointer transition-all hover:scale-101 active:scale-99 active:shadow-inner
                ${isActive ? STYLES.active : STYLES.default}
            `}
		>
			<p>{num}</p> {/* Порядковый номер для красоты отображения */}
		</div>
	)
}

const TestHeader = ({ isEdit = true }) => {
	const [searchParams, setSearchParams] = useSearchParams()

	// Достаем текущий questionId из URL (строка, содержащая UUID)
	const activeQuestionId = searchParams.get('questionId')
	const activeSection = searchParams.get('section')

	const [questionsData, setQuestionsData] = useState([])

	const addQuestion = async () => {
		try {
			await AddQuestion(testId)
		} catch (err) {
			console.log(err)
		}
	}

	useEffect(() => {
		const getQuestions = async () => {
			try {
				const res = await GetQuestions(activeSection)
				setQuestionsData(res)
			} catch (err) {
				console.log(err)
			}
		}
		activeSection && getQuestions()
	}, [activeSection])

	const handleBlockClick = id => {
		// Создаем копию текущих параметров, чтобы НЕ СТЕРЕТЬ существующий параметр ?section=...
		const newParams = new URLSearchParams(searchParams)

		// Добавляем или обновляем только questionId
		newParams.set('questionId', id)

		// Обновляем URL строки браузера
		setSearchParams(newParams)
	}

	return (
		<div className='flex flex-col gap-4 w-full mb-15'>
			{questionsData && (
				<div className='flex flex-wrap w-full gap-2'>
					{questionsData?.map((q, idx) => (
						<motion.div
							key={q}
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{
								duration: 0.3,
								delay: idx * 0.1,
								ease: 'easeOut',
							}}
						>
							<TestHeaderBlock
								key={q}
								num={idx + 1}
								questionId={q}
								// Сверяем UUID из URL с UUID текущего вопроса в цикле
								isActive={q === activeQuestionId}
								onClick={handleBlockClick}
							/>
						</motion.div>
					))}
					<motion.div
						key={questionsData?.length + 1}
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{
							duration: 0.3,
							delay: questionsData?.length * 0.1,
							ease: 'easeOut',
						}}
					>
						<div
							onClick={() => addQuestion()} // Передаем UUID вопроса при клике
							className={`w-10 h-10 flex items-center justify-center rounded-[10px] font-semibold text-xl shadow-[var(--shadow)] select-none cursor-pointer transition-all bg-[var(--white)] text-[var(--middle)] hover:bg-[var(--hero)] hover:text-white hover:scale-101 active:scale-99 active:shadow-inner`}
						>
							<Plus strokeWidth={3} />
						</div>
					</motion.div>
				</div>
			)}
		</div>
	)
}

const QuestionOptionInput = ({
	id,
	initialText,
	initialIsCorrect,
	disabled,
	onOptionUpdate, // Колбэк для обновления данных в родителе (опционально)
}) => {
	const [searchParams] = useSearchParams() // Достаем хук
	const [textValue, setTextValue] = useState(initialText || '')
	const [isCorrect, setIsCorrect] = useState(initialIsCorrect || false)
	const activeQuestionId = searchParams.get('questionId')

	// Дебаунс для текста
	const debouncedSaveName = useDebounce(async newText => {
		try {
			await EditOptionName(id, newText)
		} catch (error) {
			console.error('Ошибка имени:', error)
		}
	}, 500)

	const handleTextChange = e => {
		const val = e.target.value
		setTextValue(val)
		debouncedSaveName(val)
	}

	// Обработка чекбокса внутри компонента
	const handleToggleCorrect = async () => {
		setIsCorrect(prev => !prev)
		try {
			await EditOptionCorrectStatus(activeQuestionId, id)
		} catch (err) {
			console.error(err)
			setIsCorrect(prev => !prev)
		}
	}

	const handleDelete = async () => {
		try {
			await DeleteOption(id)
			onOptionUpdate?.() // Оповещаем родителя, чтобы он обновил список
		} catch (err) {
			console.error(err)
		}
	}

	return (
		<div className='flex gap-2 w-full'>
			{/* Чекбокс */}
			<div className='flex items-center gap-3'>
				<div
					onClick={handleToggleCorrect}
					className={`flex justify-center items-center aspect-square rounded-[10px] border-1 h-8 w-8 transition-all cursor-pointer 
                    ${!isCorrect ? 'bg-[var(--white)] border-[var(--black)]/2.5 shadow-inner' : 'bg-[var(--hero)] border-[var(--hero)] shadow-[var(--shadow)]'}`}
				>
					<Check className={`text-white ${!isCorrect && 'opacity-0'}`} />
				</div>
			</div>

			{/* Инпут с дебаунсом */}
			<div className='flex-1'>
				<InputDefault
					value={textValue}
					onChange={handleTextChange}
					placeholder={'Введите вариант ответа...'}
				/>
			</div>

			{/* Кнопка удаления */}
			<div className='flex items-center gap-3'>
				<button
					disabled={disabled}
					onClick={() => handleDelete(id)}
					className={`flex justify-center items-center text-[var(--middle)] aspect-square rounded-xl border-1 border-[var(--black)]/2.5 h-full w-auto transition-all p-3 bg-[var(--white)] ${disabled ? 'opacity-50' : 'hover:shadow-[var(--shadow)] hover:bg-[var(--red-base)] hover:text-[var(--red-surface)] active:shadow-inner active:scale-99 active:brightness-95 cursor-pointer'}`}
				>
					<Trash2 strokeWidth={1.75} />
				</button>
			</div>
		</div>
	)
}

const TestView = () => {
	const [searchParams] = useSearchParams() // Достаем хук
	const activeQuestionId = searchParams.get('questionId')
	const [data, setData] = useState({
		question: '',
		max_score: 1,
		options: [],
		type: '',
	})
	const isDataLoaded = useRef(false)

	const getQuestionDetails = async () => {
		try {
			const res = await GetDetailQuestion(activeQuestionId)
			// При загрузке отключаем проверку, устанавливаем данные
			setData({
				question: res?.name || '',
				max_score: res?.max_score || 1,
				options: res?.options || [],
				type: res?.type || '',
			})
			// После установки данных ставим флаг в true
			isDataLoaded.current = true
		} catch (err) {
			console.error(err)
		}
	}

	useEffect(() => {
		if (activeQuestionId) {
			isDataLoaded.current = false // Сбрасываем флаг при смене вопроса
			getQuestionDetails()
		}
	}, [activeQuestionId])

	const handleChange = (e, customValue) => {
		if (e?.target) {
			const { name, value, type: inputType, files } = e.target
			setData(prev => ({
				...prev,
				[name]: inputType === 'file' ? files[0] : value,
			}))
		} else if (typeof e === 'string') {
			setData(prev => ({ ...prev, [e]: customValue }))
		}
	}

	const addOption = async () => {
		try {
			// 1. Собираем все существующие коды в Set для быстрого поиска
			const existingCodes = new Set(data?.options?.map(opt => opt.option_code))

			// 2. Ищем первое число, которого нет в Set
			let newCode = 1
			while (existingCodes.has(String(newCode))) {
				newCode++
			}

			// 3. Отправляем найденный свободный код
			await AddOptionOnQuestion(activeQuestionId, String(newCode))
		} catch (err) {
			console.error(err)
		} finally {
			getQuestionDetails()
		}
	}

	const handleChangeTypeOnOption = async type => {
		try {
			await EditQuestionType(activeQuestionId, type)
		} catch (err) {
			console.error(err)
		} finally {
			getQuestionDetails()
		}
	}
	// 1. Создаем ref для хранения актуального ID, чтобы не зависеть от замыканий
	const activeQuestionIdRef = useRef(activeQuestionId)

	// 2. Обновляем ref каждый раз, когда ID меняется
	useEffect(() => {
		activeQuestionIdRef.current = activeQuestionId
	}, [activeQuestionId])

	// 3. Ваша дебаунс-функция (теперь берет ID из ref)
	const debouncedEditQuestion = useDebounce(async (q, s) => {
		const currentId = activeQuestionIdRef.current // Берем актуальный ID
		if (!currentId) {
			console.warn('ID отсутствует, сохранение пропущено')
			return
		}
		try {
			await EditQuestion(currentId, q, s)
		} catch (error) {
			console.error('Ошибка сохранения:', error)
		}
	}, 500)

	// 4. Эффект для вызова дебаунса
	useEffect(() => {
		if (!isDataLoaded.current) return
		debouncedEditQuestion(data.question, data.max_score)
	}, [data.question, data.max_score]) // activeQuestionId здесь больше не нужен для запуска

	return (
		<div className='w-full flex flex-col gap-6 items-center'>
			{/* Верхняя часть с вопросом и оценкой */}
			<div className='grid gap-4 grid-cols-[1fr_auto] w-full max-w-2xl'>
				<InputDefault
					title='Введите вопрос'
					name='question'
					value={data.question}
					onChange={handleChange}
				/>
				<div className='w-20'>
					<InputDefault
						title='Оценка'
						name='max_score'
						value={data.max_score}
						onChange={handleChange}
					/>
				</div>
			</div>

			{/* Блок управления типами */}
			<div className='w-full max-w-2xl '>
				{data?.type === 'choice' ? (
					<div className='flex flex-col items-center gap-3'>
						<div className='flex flex-col w-full items-center'>
							<p className='text-[var(--middle)] font-medium'>
								Варианты ответа
							</p>
							{/* Кнопка смены на открытый тип */}
							<button
								onClick={() => handleChangeTypeOnOption('open')}
								className='text-xs text-red-500 opacity-75 hover:opacity-100 hover:underline self-end cursor-pointer transition-all'
							>
								Убрать варианты ответа (сделать открытым)
							</button>
						</div>

						{data?.options?.map((q, i) => (
							<motion.div
								className='w-full'
								key={q.id}
								initial={{ scale: 0.8, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{
									duration: 0.3,
									delay: i * 0.1,
									ease: 'easeOut',
								}}
							>
								<QuestionOptionInput
									key={q.id}
									id={q.id}
									initialText={q.name}
									initialIsCorrect={q.is_correct}
									onOptionUpdate={getQuestionDetails}
									disabled={data?.options?.length <= 2}
								/>
							</motion.div>
						))}

						<DefaultButton onClick={addOption} className='mt-2'>
							<Plus strokeWidth={3} />
							<p>Добавить вариант</p>
						</DefaultButton>
					</div>
				) : (
					<div className='flex flex-col items-center gap-4'>
						<DefaultButton onClick={() => handleChangeTypeOnOption('choice')}>
							Добавить варианты ответа
						</DefaultButton>
					</div>
				)}
			</div>
		</div>
	)
}

const TestManager = () => {
	return (
		<>
			<TestHeader />
			<TestView />
		</>
	)
}

export default TestManager
