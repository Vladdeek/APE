import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
	AddOptionOnQuestion,
	AddQuestion,
	DeleteOption,
	DeleteQuestion,
	EditOptionCorrectStatus,
	EditOptionName,
	EditQuestion,
	EditQuestionType,
	GetDetailQuestion,
	GetQuestions,
	GetSession,
	StartSession,
	SubmitAnswer,
} from '../../../service/APIs/Test'
import { InputDefault } from '../Inputs'
import { useDebounce } from '../../../service/Hooks/useDebounce'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, CheckCheck, Plus, Trash2, X } from 'lucide-react'
import { DefaultButton } from '../Buttons'
import { Me } from '../../../service/APIs/Authorization'

import React from 'react'

const StartTestingButton = ({ title, onClick }) => {
	return (
		<button
			onClick={onClick}
			className='relative inline-flex h-14 active:scale-98 overflow-hidden rounded-2xl p-0 focus:outline-none hover:p-[2px] hover:shadow-[var(--hero-glow)] transition-all duration-300'
		>
			<span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,var(--darkness-hero)_0%,var(--hero)_50%,var(--light-hero)_100%)]'></span>
			<span className='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-[14px] bg-[var(--black)] px-7 text-lg font-normal text-[var(--white)] backdrop-blur-3xl gap-2 undefined transition-all '>
				{title}
			</span>
		</button>
	)
}

const TestHeaderBlock = ({
	num,
	questionId,
	isActive,
	onClick,
	delQuestion,
	isEdit,
}) => {
	const STYLES = {
		// По умолчанию все блоки в дефолтном стиле
		default: 'bg-[var(--white)] text-[var(--middle)] hover:text-[var(--hero)] ',
		// При клике активируется этот стиль
		active: 'bg-[var(--hero)] text-white',
	}

	return (
		<div
			onClick={() => onClick(questionId)} // Передаем UUID вопроса при клике
			className={`w-10 h-10 flex items-center justify-center rounded-[10px] relative font-semibold text-xl shadow-[var(--shadow)] select-none cursor-pointer transition-all hover:scale-101 active:scale-99 active:shadow-inner group
                ${isActive ? STYLES.active : STYLES.default}
            `}
		>
			<p>{num}</p> {/* Порядковый номер для красоты отображения */}
			{isEdit && (
				<X
					onClick={e => delQuestion(e)}
					className='w-[16px] h-[16px] absolute -top-1 -right-1 bg-[var(--red-base)] rounded-full p-[3px] text-[var(--red-surface)] opacity-0 group-hover:opacity-100 hover:contrast-150 hover:scale-105 active:scale-95 transition-all z-10'
				/>
			)}
		</div>
	)
}

const TestHeader = ({ isEdit }) => {
	const [searchParams, setSearchParams] = useSearchParams()

	// Достаем текущий questionId из URL (строка, содержащая UUID)
	const activeQuestionId = searchParams.get('questionId')
	const activeSection = searchParams.get('section')

	const handleBlockClick = id => {
		// Создаем копию текущих параметров, чтобы НЕ СТЕРЕТЬ существующий параметр ?section=...
		const newParams = new URLSearchParams(searchParams)

		// Добавляем или обновляем только questionId
		newParams.set('questionId', id)

		// Обновляем URL строки браузера
		setSearchParams(newParams)
	}

	const [questionsData, setQuestionsData] = useState([])

	const getQuestions = async () => {
		try {
			const res = await GetQuestions(activeSection)
			setQuestionsData(res.question_ids)
		} catch (err) {
			console.log(err)
		}
	}

	const addQuestion = async () => {
		try {
			const res = await AddQuestion(activeSection)
			if (res) {
				handleBlockClick(res.question_id)
			}
		} catch (err) {
			console.log(err)
		} finally {
			getQuestions()
		}
	}

	useEffect(() => {
		activeSection && getQuestions()
	}, [activeSection])

	const deleteQuestion = async e => {
		// Передаем ID конкретного вопроса
		e.stopPropagation()
		try {
			await DeleteQuestion(activeQuestionId)

			// После успешного удаления сбрасываем параметры URL
			setSearchParams({})

			// Если нужно обновить список вопросов
			await getQuestions()
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<div className='flex gap-4 w-full mb-15 items-center'>
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
								isEdit={isEdit}
								key={q}
								num={idx + 1}
								questionId={q}
								// Сверяем UUID из URL с UUID текущего вопроса в цикле
								isActive={q === activeQuestionId}
								onClick={handleBlockClick}
								delQuestion={e => deleteQuestion(e)}
							/>
						</motion.div>
					))}
					{isEdit && (
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
					)}
				</div>
			)}
			<div className='flex gap-1 items-center w-fit'></div>
		</div>
	)
}

const QuestionOptionInput = ({
	id,
	initialText,
	initialIsCorrect,
	disabled,
	onOptionUpdate, // Колбэк для обновления данных в родителе (опционально)
	isEdit,
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
	}, 1000)

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

const QuestionOptionButton = ({
	id,
	initialText,
	initialIsSelected,
	onHandleAnswer,
}) => {
	const [searchParams] = useSearchParams() // Достаем хук
	const [textValue, setTextValue] = useState(initialText || '')
	const [isSelected, setIsSelected] = useState(initialIsSelected || false)

	const handleAnswer = () => {
		setIsSelected(prev => !prev)
		onHandleAnswer?.()
	}

	return (
		<div onClick={handleAnswer} className='flex gap-2 w-full'>
			{/* Инпут с дебаунсом */}
			<div className='flex-1'>
				<p
					className={`flex justify-between rounded-2xl p-3 shadow-[var(--shadow)] outline-0 transition-all cursor-pointer  hover:ring-3 ${isSelected ? 'bg-[var(--hero)] text-white ring-[var(--transparent-hero)]' : 'text-[var(--black)] bg-[var(--white)] ring-[var(--hero)]'}`}
				>
					{initialText}
					<Check
						className={`transition-all ${isSelected ? 'opacity-100' : 'opacity-0'}`}
					/>
				</p>
			</div>
		</div>
	)
}

const TestView = ({ isEdit, role }) => {
	const [searchParams] = useSearchParams() // Достаем хук
	const activeQuestionId = searchParams.get('questionId')
	const activeSectionId = searchParams.get('section')
	const [data, setData] = useState({
		question: '',
		max_score: 1,
		options: [],
		type: '',
		student_answer: '',
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
	}, 1500)

	// 4. Эффект для вызова дебаунса
	useEffect(() => {
		if (!isDataLoaded.current) return
		debouncedEditQuestion(data.question, data.max_score)
	}, [data.question, data.max_score]) // activeQuestionId здесь больше не нужен для запуска

	const [selectedOptions, setSelectedOptions] = useState(new Set())

	const toggleOption = optionCode => {
		setSelectedOptions(prev => {
			const next = new Set(prev)
			if (next.has(optionCode)) {
				next.delete(optionCode)
			} else {
				next.add(optionCode)
			}
			return next
		})
	}

	const submitAnswer = async () => {
		try {
			await SubmitAnswer(
				activeQuestionId,
				data.type,
				Array.from(selectedOptions),
				activeSectionId,
			)
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<div className='w-full flex flex-col gap-6 items-center'>
			{/* Верхняя часть с вопросом и оценкой */}
			{isEdit ? (
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
			) : (
				<p className='text-[var(--black)] font-medium text-xl'>
					{data.question || 'Вопрос не задан'}
				</p>
			)}

			{/* Блок управления типами */}
			<div className='w-full max-w-2xl flex flex-col items-center gap-4 '>
				{data?.type === 'choice' ? (
					<div className='flex flex-col items-center gap-3 w-full'>
						<div className='flex flex-col w-full items-center'>
							<p className='text-[var(--middle)] font-medium'>
								Варианты ответа
							</p>
							{/* Кнопка смены на открытый тип */}
							{isEdit && (
								<button
									onClick={() => handleChangeTypeOnOption('open')}
									className='text-xs text-red-500 opacity-75 hover:opacity-100 hover:underline self-end cursor-pointer transition-all'
								>
									Убрать варианты ответа (сделать открытым)
								</button>
							)}
						</div>

						<AnimatePresence mode='popLayout'>
							{data?.options?.map((q, i) => {
								console.log('isEdit: ', isEdit)
								return (
									<motion.div
										key={q.id} // Уникальный ключ здесь
										layout // Плавная перестановка при изменении порядка/удалении
										initial={{ scale: 0.8, opacity: 0 }}
										animate={{ scale: 1, opacity: 1 }}
										exit={{ scale: 0.5, opacity: 0 }} // Анимация при удалении
										transition={{
											duration: 0.3,
											delay: i * 0.05, // Немного уменьшил задержку для отзывчивости
											ease: 'easeOut',
										}}
										className='w-full'
									>
										{isEdit ? (
											<QuestionOptionInput
												id={q.id}
												initialText={q.name}
												initialIsCorrect={q.is_correct}
												onOptionUpdate={getQuestionDetails}
												disabled={data?.options?.length <= 2}
											/>
										) : (
											<QuestionOptionButton
												id={q.id}
												initialText={q.name}
												onHandleAnswer={() => toggleOption(q.option_code)}
												initialIsSelected={selectedOptions.has(q.option_code)}
											/>
										)}
									</motion.div>
								)
							})}
						</AnimatePresence>
						{isEdit && (
							<DefaultButton onClick={addOption} className='mt-2'>
								<Plus strokeWidth={3} />
								<p>Добавить вариант</p>
							</DefaultButton>
						)}
					</div>
				) : (
					<div className='flex flex-col items-center gap-4 w-full'>
						{isEdit ? (
							<DefaultButton onClick={() => handleChangeTypeOnOption('choice')}>
								Добавить варианты ответа
							</DefaultButton>
						) : (
							<div className={`w-full`}>
								<InputDefault
									title='Введите ответ'
									name='student_answer'
									value={data.student_answer}
									onChange={handleChange}
								/>
							</div>
						)}
					</div>
				)}
				{role === 'student' && (
					<>
						<DefaultButton onClick={submitAnswer} className='mt-2'>
							<p>Ответить на вопрос</p>
						</DefaultButton>
					</>
				)}
			</div>
		</div>
	)
}

const TestManager = () => {
	const [searchParams] = useSearchParams() // Достаем хук
	const activeQuestionId = searchParams.get('questionId')
	const activeSection = searchParams.get('section')

	const [sessionIsActive, setSessionIsActive] = useState(false)

	const [role, setRole] = useState()

	useEffect(() => {
		const getUserInfo = async e => {
			try {
				const res = await Me()
				setRole(res?.role)
			} catch (err) {}
		}
		getUserInfo()
	}, [])

	const startSession = async () => {
		try {
			await StartSession(activeSection)
		} catch (err) {
			console.log(err)
		}
	}

	useEffect(() => {
		const getSession = async () => {
			try {
				const res = await GetSession(activeSection)
				setSessionIsActive(true)
			} catch (err) {
				if (err.response.data.unique_code === 'NO_ACTIVE_TEST_SESSION_FOUND') {
					setSessionIsActive(false)
				} else {
					console.log(err)
				}
			}
		}
		if (role === 'student') {
			getSession()
		}
	}, [activeSection])
	return (
		<>
			{sessionIsActive ? (
				<>
					<TestHeader isEdit={role === 'teacher'} />
					{activeQuestionId ? (
						<>
							<TestView role={role} isEdit={role === 'teacher'} />
						</>
					) : (
						<div className='flex justify-center items-center w-full h-full text-center text-[var(--middle)] font-medium'>
							Вопрос не выбран
						</div>
					)}
				</>
			) : (
				<div className={`w-full h-150 flex justify-center items-center`}>
					<StartTestingButton
						title={'Начать тестирование'}
						onClick={startSession}
					/>
				</div>
			)}
		</>
	)
}

export default TestManager
