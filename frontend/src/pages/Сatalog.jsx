import CourseCard from '../components/Cards'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowBigDown, ArrowDown, Blocks, X } from 'lucide-react'
import {
	DateInput,
	FileInput,
	FileInputZone,
	InputDefault,
	InputPrice,
	OptionInputWithSearch,
	OptionSearch,
	TextArea,
} from '../components/Inputs'
import { useEffect, useState } from 'react'
import { Checkbox } from '../components/Buttons'
import { AddTag, GetTags } from '../../service/APIs/CourseTagsSpecific'
import {
	CreateCourse,
	GetAllCourses,
	GetAllCoursesForTeacher,
	GetCertificates,
	GetFormats,
} from '../../service/APIs/Couses'
import Modal from '../components/Modal'
import { useNavigate } from 'react-router-dom'

const CreateModal = ({ onChange }) => {
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [img, setImg] = useState(null)
	const [categories, setCategories] = useState(null)
	const [selectedCategory, setSelectedCategory] = useState(null)
	const [isFree, setIsFree] = useState(null)
	const [price, setPrice] = useState(null)
	const [regStartDate, setRegStartDate] = useState(null)
	const [regEndDate, setRegEndDate] = useState(null)
	const [startDate, setStartDate] = useState(null)
	const [endDate, setEndDate] = useState(null)
	const [certificate, setCertificate] = useState([])
	const [selectedCertificate, setSelectedCertificate] = useState(null)
	const [format, setFormat] = useState([])
	const [selectedFormat, setSelectedFormat] = useState(null)

	const [isTitleValid, setIsTitleValid] = useState(false)
	const [isDescriptionValid, setIsDescriptionValid] = useState(false)
	const [isCategoryValid, setIsCategoryValid] = useState(false)
	const [isFileValid, setIsFileValid] = useState(false)
	const [isPriceValid, setIsPriceValid] = useState(false)
	const [isCertificateValid, setIsCertificateValid] = useState(false)
	const [isFormatValid, setIsFormatValid] = useState(false)

	const isDateValid = Boolean(
		regStartDate && regEndDate && startDate && endDate,
	)

	const isFormValid =
		isTitleValid &&
		isDescriptionValid &&
		isCategoryValid &&
		isFileValid &&
		isCertificateValid &&
		isFormatValid &&
		isDateValid

	useEffect(() => {
		const getTags = async () => {
			try {
				const res = await GetTags()
				setCategories(res)
			} catch (err) {}
		}
		const getCertificates = async name => {
			try {
				const res = await GetCertificates()
				setCertificate(res)
			} catch (err) {}
		}
		const getFormats = async name => {
			try {
				const res = await GetFormats()
				setFormat(res)
			} catch (err) {}
		}
		getCertificates()
		getFormats()
		getTags()
	}, [])

	const addTag = async name => {
		try {
			const res = await AddTag(name)
		} catch (err) {}
	}

	const handleSubmit = async e => {
		if (e && typeof e.preventDefault === 'function') {
			e.preventDefault()
		}

		// Собираем объект в строгом соответствии с тем, что ждет бэкенд
		const dataToSend = {
			name: title, // У тебя стейт 'title', а бэкенд ждет 'name'
			description: description,
			preview_image: img, // Твой стейт 'img' идет в 'preview_image'

			is_free: isFree,
			price: price,

			registration_start: regStartDate,
			registration_end: regEndDate,

			start_date: startDate,
			end_date: endDate,

			// Вытаскиваем id, если объект выбран, иначе передаем null
			tag_id: selectedCategory ? selectedCategory.id : null,
			certificate_type_id: selectedCertificate ? selectedCertificate.id : null,
			format_id: selectedFormat ? selectedFormat.id : null,
		}

		try {
			// Отправляем собранный объект в нашу функцию
			const result = await CreateCourse(dataToSend)
			console.log('Курс успешно создан:', result)
			onChange?.()
		} catch (error) {
			console.error('Ошибка при создании курса:', error)
		}
	}

	return (
		<div className=''>
			<h2 className='text-2xl font-medium text-[var(--black)] mb-5 text-center'>
				Создание курса
			</h2>

			<form
				action={() => handleSubmit()}
				className='w-[600px] max-md:w-[80vw] inline-flex flex-col items-center gap-5'
			>
				<InputDefault
					title='Название курса'
					placeholder='Введите название...'
					value={title}
					onChange={e => setTitle(e.target.value)}
					validate={val => val.length >= 3}
					onStatusChange={setIsTitleValid}
					required
				/>
				<TextArea
					title='Описание курса'
					placeholder='Введите описание...'
					value={description}
					onChange={e => setDescription(e.target.value)}
					validate={val => val.length >= 10}
					onStatusChange={setIsDescriptionValid}
					required
				/>
				<OptionInputWithSearch
					title='Категория'
					required
					options={categories}
					placeholder='Выберите категорию'
					labelKey='name'
					value={selectedCategory}
					onSelect={item => {
						setSelectedCategory(item)
						setIsCategoryValid(true)
					}}
					onCreate={name => addTag(name)}
					CreateOrNot={true}
				/>
				<div className='grid grid-cols-2 gap-3 w-full'>
					<DateInput
						text={'text-md'}
						title='Дата начала регистрации'
						required
						value={regStartDate}
						onChange={val => setRegStartDate(val)}
					/>
					<DateInput
						text={'text-md'}
						title='Дата окончания регистрации'
						required
						value={regEndDate}
						onChange={val => setRegEndDate(val)}
					/>
					<DateInput
						text={'text-md'}
						title='Дата начала курса'
						required
						value={startDate}
						onChange={val => setStartDate(val)}
					/>
					<DateInput
						text={'text-md'}
						title='Дата конца курса'
						required
						value={endDate}
						onChange={val => setEndDate(val)}
					/>
				</div>
				<Checkbox text={'Платный курс'} onChange={data => setIsFree(!data)}>
					<InputPrice
						step={Number(import.meta.env.VITE_PRICE_STEP)}
						value={price}
						onChange={e => setPrice(e.target.value)}
					/>
				</Checkbox>
				<OptionInputWithSearch
					title='Сертификат'
					required
					options={certificate}
					placeholder='Выберите сертификат'
					labelKey='name'
					value={selectedCertificate}
					onSelect={item => {
						setSelectedCertificate(item)
						setIsCertificateValid(true)
					}}
					CreateOrNot={true}
				/>
				<OptionInputWithSearch
					title='Формат'
					required
					options={format}
					placeholder='Выберите формат'
					labelKey='name'
					value={selectedFormat}
					onSelect={item => {
						setSelectedFormat(item)
						setIsFormatValid(true)
					}}
					CreateOrNot={true}
				/>
				<FileInputZone
					onFileChange={file => setImg(file)}
					onStatusChange={setIsFileValid}
				/>
				<input
					className={`px-12 py-3 font-medium text-xl rounded-2xl w-fit  transition ${
						isFormValid
							? 'bg-[var(--black)] text-[var(--white)] cursor-pointer hover:bg-[var(--hero)]  active:shadow-inner active:brightness-75 active:scale-99 '
							: 'bg-[var(--light-middle)] text-[var(--middle)] cursor-not-allowed'
					}`}
					type='submit'
					value='Создать курс'
					disabled={!isFormValid}
				/>
			</form>
		</div>
	)
}

const CreateBtn = ({ onClick, title }) => {
	return (
		<button
			onClick={onClick}
			className={`flex flex-col w-full items-center justify-center border-1 border-[var(--middle)] text-[var(--middle)] rounded-4xl group hover:border-[var(--hero-epta)] hover:text-[var(--hero-epta)] transition-all cursor-pointer h-full min-h-157 max-md:mb-30`}
		>
			<Blocks size={112} strokeWidth={0.5} />
			<span className='text-base font-medium px-4 py-3 rounded-lg mt-4 transition-all'>
				{title}
			</span>
		</button>
	)
}

const Catalog = ({ role }) => {
	const navigate = useNavigate()

	const [courses, setCourses] = useState(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [showArrow, setShowArrow] = useState(true)

	const [selectedCourse, setSelectedCourse] = useState(null)

	useEffect(() => {
		const getAllCourses = async () => {
			try {
				const res = await GetAllCoursesForTeacher()
				setCourses(res)
			} catch (err) {}
		}
		getAllCourses()
	}, [])

	const getUserInfo = async e => {
		try {
			const res = await Me()
			setRole(res?.role)
		} catch (err) {}
	}

	const handleScroll = e => {
		const { scrollTop, scrollHeight, clientHeight } = e.currentTarget

		// Формула: полная высота контента минус прокрученная часть сверху
		// должна быть равна видимой высоте экрана (с погрешностью в 5px)
		const isAtBottom = scrollHeight - scrollTop <= clientHeight + 5

		if (isAtBottom) {
			setShowArrow(false)
		} else {
			setShowArrow(true)
		}
	}

	return (
		<>
			<Modal
				width={'w-fit'}
				isOpen={selectedCourse !== null || isModalOpen}
				onClose={() => {
					setSelectedCourse(null)
					setIsModalOpen(false)
					setShowArrow(true)
				}}
			>
				{selectedCourse ? (
					<div className='p-4'>
						<CourseCard data={selectedCourse} />
					</div>
				) : (
					/* Обертка с relative, чтобы зафиксировать градиент внизу */
					<div className='relative h-[75vh]'>
						{/* Градиентный слой, который всегда "висит" внизу модалки */}
						<div className='pointer-events-none absolute top-0 left-0 right-0 h-10 bg-gradient-to-t to-[var(--white)] from-transparent' />
						{/* Контентный блок со скроллом — добавили onScroll */}
						<div
							className='px-4 pt-4 pb-12 h-full overflow-y-scroll hide-scrollbar'
							onScroll={handleScroll}
						>
							<CreateModal
								onChange={() => {
									setIsModalOpen(false)
									getAllCourses()
								}}
							/>
						</div>

						{/* Градиентный слой, который всегда "висит" внизу модалки */}
						<div className='pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[var(--white)] to-transparent' />

						{/* Стрелочка с динамическим классом видимости */}
						<ArrowDown
							className={`absolute bottom-2 text-[var(--black)] left-1/2 -translate-x-1/2 transition-opacity duration-300 pointer-events-none ${
								showArrow ? 'opacity-50' : 'opacity-0'
							}`}
						/>
					</div>
				)}
			</Modal>

			<div
				className={`grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-5 py-30`}
			>
				{courses?.map((course, index) => (
					<motion.div
						key={course.id}
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{
							duration: 0.3,
							delay: index * 0.1,
							ease: 'easeOut',
						}}
					>
						<CourseCard
							onClick={() =>
								role === 'teacher'
									? navigate(`/course/${course.id}`)
									: setSelectedCourse(course)
							}
							data={course}
						/>
					</motion.div>
				))}
				{role === 'teacher' && (
					<motion.div
						key={courses?.length + 1}
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{
							duration: 0.3,
							delay: courses?.length * 0.1,
							ease: 'easeOut',
						}}
					>
						<CreateBtn
							onClick={() => setIsModalOpen(true)}
							title='Создать новый курс'
						/>
					</motion.div>
				)}
			</div>
		</>
	)
}

export default Catalog
