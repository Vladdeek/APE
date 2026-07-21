import { useEffect, useState } from 'react'
import {
	ChangeStatus,
	GetCourseInfoById,
	GetModerationCourses,
} from '../../../service/APIs/Moderation'
import BasicPagination from '../../components/Pagination'
import {
	Checkbox,
	ColoredButton,
	DefaultButton,
	RadioButton,
} from '../../components/Buttons'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CourseMiniCard } from '../../components/Cards'
import {
	ArrowLeft,
	BookOpen,
	Calendar,
	CheckCircle2,
	CreditCard,
	Edit3,
	ImageOff,
	Save,
	ShieldAlert,
	Tag,
	User,
	XCircle,
} from 'lucide-react'
import Modal from '../../components/Modal'
import ResponsiveSidebar from '../../components/ResponsiveSidebar'
import {
	DateInput,
	InputDefault,
	InputPrice,
	OptionInputWithSearch,
	TextArea,
} from '../../components/Inputs'
import { GetTags } from '../../../service/APIs/CourseTagsSpecific'
import {
	editCourse,
	GetCertificates,
	GetFormats,
} from '../../../service/APIs/Couses'

// Компонент отображения строки данных
const TextStroke = ({ title, value, textarea }) => {
	return (
		<div className='flex flex-col gap-1 w-full'>
			{title && (
				<span className='text-xs md:text-sm font-medium text-[var(--middle)] ml-1 select-none'>
					{title}
				</span>
			)}
			{textarea ? (
				<div className='rounded-2xl p-4 bg-[var(--light-middle)]/10 text-[var(--black)] shadow-inner border border-[var(--middle)]/5 min-h-32 whitespace-pre-wrap break-words leading-relaxed cursor-default select-text'>
					{value || '—'}
				</div>
			) : (
				<div className='rounded-2xl p-3 bg-[var(--light-middle)]/10 text-[var(--black)] shadow-inner border border-[var(--middle)]/5 truncate cursor-default select-text font-medium'>
					{value || '—'}
				</div>
			)}
		</div>
	)
}

const formatDate = dateString => (dateString ? dateString.split('T')[0] : '')

// Форма просмотра курса (теперь чистая презентационная логика)
const CourseForm = ({ courseId, isEdit = false, onIsEditChange }) => {
	const [courseInfo, setCourseInfo] = useState({})

	// Опции для выпадающих списков
	const [categories, setCategories] = useState(null)
	const [certificate, setCertificate] = useState([])
	const [format, setFormat] = useState([])

	// Валидация списков
	const [isCategoryValid, setIsCategoryValid] = useState(true)
	const [isFormatValid, setIsFormatValid] = useState(true)
	const [isCertificateValid, setIsCertificateValid] = useState(true)

	// ЕДИНЫЙ СТЕЙТ ФОРМЫ
	const [formData, setFormData] = useState({
		title: '',
		description: '',
		selectedCategory: null,
		isFree: true,
		price: '',
		regStartDate: '',
		regEndDate: '',
		startDate: '',
		endDate: '',
		selectedCertificate: null,
		selectedFormat: null,
	})

	const getCourse = async () => {
		try {
			const res = await GetCourseInfoById(courseId)
			setCourseInfo(res)
		} catch (err) {
			console.error('Ошибка при загрузке курса:', err)
		}
	}

	// Загрузка курса
	useEffect(() => {
		if (courseId) getCourse()
	}, [courseId])

	// Синхронизация formData с пришедшими данными courseInfo
	useEffect(() => {
		if (courseInfo && Object.keys(courseInfo).length > 0) {
			setFormData({
				title: courseInfo.name || '',
				description: courseInfo.description || '',
				selectedCategory: courseInfo.category || null,
				isFree: courseInfo.is_free ?? true,
				price: courseInfo.price || '',
				regStartDate: formatDate(courseInfo.registration_start),
				regEndDate: formatDate(courseInfo.registration_end),
				startDate: formatDate(courseInfo.start_date),
				endDate: formatDate(courseInfo.end_date),
				selectedCertificate:
					{
						id: courseInfo.certificate_id,
						name: courseInfo.certificate_type_name,
					} || null,
				selectedFormat:
					{
						id: courseInfo.format_id,
						name: courseInfo.format_name,
					} || null,
				selectedCategory:
					{
						id: courseInfo.tag_id,
						name: courseInfo.tag,
					} || null,
			})
		}
	}, [courseInfo])

	// Хэндлеры для изменения полей
	const handleChange = (field, value) => {
		setFormData(prev => ({ ...prev, [field]: value }))
	}

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

	const editCourseInfo = async () => {
		const dataToSend = {
			name: formData.title, // У тебя стейт 'title', а бэкенд ждет 'name'
			description: formData.description,

			is_free: formData.isFree,
			price: formData.price,

			registration_start: formData.regStartDate,
			registration_end: formData.regEndDate,

			start_date: formData.startDate,
			end_date: formData.endDate,

			// Вытаскиваем id, если объект выбран, иначе передаем null
			tag_id: formData.selectedCategory ? formData.selectedCategory.id : null,
			certificate_type_id: formData.selectedCertificate
				? formData.selectedCertificate.id
				: null,
			format_id: formData.selectedFormat ? formData.selectedFormat.id : null,
		}
		try {
			await editCourse(dataToSend, courseId)
		} catch (err) {
		} finally {
			onIsEditChange?.(false)
			getCourse()
		}
	}

	const [imageError, setImageError] = useState(false)

	return (
		<div className='2xl:mx-20 mx-2 pb-24'>
			{/* Отступ снизу под Action Bar */}
			<div className='grid grid-cols-12 gap-8'>
				{/* ЛЕВАЯ КОЛОНКА */}
				<div className='col-span-12 lg:col-span-4 flex flex-col space-y-6 border-r border-[var(--light-middle)]/10 pr-6'>
					<div className='relative group h-64 w-full rounded-3xl overflow-hidden shadow-md bg-[var(--light-gray)]/50'>
						{courseInfo.preview_url && !imageError ? (
							<img
								src={courseInfo.preview_url}
								alt='Preview'
								className='w-full h-full object-cover'
								onError={() => setImageError(true)}
							/>
						) : (
							<div className='w-full h-full flex items-center justify-center text-[var(--middle)]'>
								<ImageOff className='w-full h-full p-[25%]' />
							</div>
						)}
						{courseInfo.id && (
							<div className='absolute top-4 left-4 px-3 py-1 bg-white/95 backdrop-blur rounded-lg text-xs font-bold text-[var(--hero)] shadow-sm'>
								ID: {courseInfo.id.slice(0, 8)}...
							</div>
						)}
					</div>

					<div className='space-y-4 border-t border-[var(--light-middle)]/20 pt-5'>
						<div className='flex items-center gap-3 p-3 bg-[var(--white)] shadow-sm rounded-2xl border border-[var(--light-middle)]/10'>
							<div className='w-12 h-12 rounded-lg overflow-hidden shrink-0 shadow-inner'>
								{courseInfo.creator?.avatar_url ? (
									<img
										src={courseInfo.creator.avatar_url}
										alt='Avatar'
										className='w-full h-full object-cover'
									/>
								) : (
									<User className='p-2 bg-[var(--light-gray)]/50 text-[var(--middle)] w-full h-full' />
								)}
							</div>
							<div className='overflow-hidden'>
								<p className='text-[10px] text-[var(--middle)] uppercase tracking-wider font-semibold'>
									Создатель курса
								</p>
								<p className='text-sm font-semibold truncate text-[var(--black)]'>
									{courseInfo.creator
										? `${courseInfo.creator.last_name || ''} ${courseInfo.creator.first_name || ''}`.trim()
										: 'Не указан'}
								</p>
							</div>
						</div>

						<div className='flex items-center gap-2 px-3 py-2 bg-[var(--transparent-hero)] text-[var(--hero)] rounded-xl w-fit text-sm font-medium'>
							<Tag size={14} />
							{courseInfo.tag || 'Без тега'}
						</div>
					</div>
				</div>

				{/* ПРАВАЯ КОЛОНКА */}
				<div className='col-span-12 lg:col-span-8 flex flex-col space-y-8'>
					{/* ОСНОВНАЯ ИНФОРМАЦИЯ */}
					<section className='space-y-5'>
						<div className='flex items-center gap-3'>
							<div className='p-2 bg-[var(--transparent-hero)] rounded-lg text-[var(--hero)]'>
								<BookOpen size={20} />
							</div>
							<h3 className='text-lg font-bold text-[var(--black)]'>
								Основная информация
							</h3>
						</div>
						{isEdit ? (
							<InputDefault
								title='Название курса'
								placeholder='Введите название...'
								value={formData.title}
								onChange={e => handleChange('title', e.target.value)}
								validate={val => val.length >= 3}
								width='w-full'
							/>
						) : (
							<TextStroke title='Название курса' value={courseInfo.name} />
						)}
						{isEdit ? (
							<TextArea
								title='Описание курса'
								placeholder='Введите описание...'
								value={formData.description}
								onChange={e => handleChange('description', e.target.value)}
								validate={val => val.length >= 10}
							/>
						) : (
							<TextStroke
								title='Описание'
								value={courseInfo.description}
								textarea
							/>
						)}
						{isEdit && (
							<OptionInputWithSearch
								title='Категория'
								options={categories}
								placeholder='Выберите категорию'
								labelKey='name'
								value={formData.selectedCategory}
								onSelect={item => {
									handleChange('selectedCategory', item)
									setIsCategoryValid(true)
								}}
								onCreate={name => addTag(name)}
								CreateOrNot={true}
							/>
						)}
					</section>

					{/* ДАТЫ */}
					<section className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div className='space-y-4'>
							<div className='flex items-center gap-2 text-[var(--hero)] font-semibold text-xs uppercase tracking-wider mb-1'>
								<Calendar size={14} /> Регистрация
							</div>

							{isEdit ? (
								<DateInput
									text={'text-sm'}
									title='Начало'
									value={formData.regStartDate}
									onChange={val => handleChange('regStartDate', val)}
								/>
							) : (
								<TextStroke
									title='Начало'
									value={formatDate(courseInfo.registration_start)}
								/>
							)}

							{isEdit ? (
								<DateInput
									text={'text-sm'}
									title='Конец'
									value={formData.regEndDate}
									onChange={val => handleChange('regEndDate', val)}
								/>
							) : (
								<TextStroke
									title='Конец'
									value={formatDate(courseInfo.registration_end)}
								/>
							)}
						</div>

						<div className='space-y-4'>
							<div className='flex items-center gap-2 text-[var(--hero)] font-semibold text-xs uppercase tracking-wider mb-1'>
								<Calendar size={14} /> Обучение
							</div>
							{isEdit ? (
								<DateInput
									text={'text-sm'}
									title='Дата старта'
									value={formData.startDate}
									onChange={val => handleChange('startDate', val)}
								/>
							) : (
								<TextStroke
									title='Дата старта'
									value={formatDate(courseInfo.start_date)}
								/>
							)}
							{isEdit ? (
								<DateInput
									text={'text-sm'}
									title='Дата завершения'
									value={formData.endDate}
									onChange={val => handleChange('endDate', val)}
								/>
							) : (
								<TextStroke
									title='Дата завершения'
									value={formatDate(courseInfo.end_date)}
								/>
							)}
						</div>
					</section>

					{/* ФОРМАТ, СЕРТИФИКАТ И ЦЕНА */}
					<section className='grid grid-cols-1 md:grid-cols-3 gap-6 items-end'>
						<div className='md:col-span-2 flex flex-col gap-4 w-full'>
							{isEdit ? (
								<OptionInputWithSearch
									title='Формат'
									options={format}
									placeholder='Выберите формат'
									labelKey='name'
									value={formData.selectedFormat}
									onSelect={item => {
										handleChange('selectedFormat', item)
										setIsFormatValid(true)
									}}
								/>
							) : (
								<TextStroke
									title='Формат обучения'
									value={courseInfo.format_name}
								/>
							)}
							{isEdit ? (
								<OptionInputWithSearch
									title='Сертификат'
									options={certificate}
									placeholder='Выберите сертификат'
									labelKey='name'
									value={formData.selectedCertificate}
									onSelect={item => {
										handleChange('selectedCertificate', item)
										setIsCertificateValid(true)
									}}
								/>
							) : (
								<TextStroke
									title='Тип сертификата'
									value={courseInfo.certificate_type_name}
								/>
							)}
						</div>

						{isEdit ? (
							<Checkbox
								text={'Платный курс'}
								value={!formData.isFree}
								onChange={isPaid => handleChange('isFree', !isPaid)}
							>
								<InputPrice
									step={Number(import.meta.env.VITE_PRICE_STEP)}
									value={formData.price}
									onChange={e => handleChange('price', e.target.value)}
								/>
							</Checkbox>
						) : (
							<div className='flex flex-col gap-1 w-full'>
								<span className='flex items-center gap-2 text-xs font-semibold text-[var(--middle)] mb-1 uppercase tracking-wider'>
									<CreditCard size={14} /> Цена
								</span>
								<TextStroke
									value={
										courseInfo.is_free
											? 'Бесплатно'
											: `${courseInfo.price || 0} ₽`
									}
								/>
							</div>
						)}
					</section>
					{isEdit && (
						<DefaultButton
							onClick={() => editCourseInfo()}
							width='flex items-center w-fit self-end'
						>
							<Save size={18} />
							Сохранить
						</DefaultButton>
					)}
				</div>
			</div>
		</div>
	)
}

const ModerateCourses = () => {
	const [isOpen, setIsOpen] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState(false)

	const navigate = useNavigate()

	const [searchParams, setSearchParams] = useSearchParams()
	const activeCourseId = searchParams.get('course_id')

	const [page, setPage] = useState(1)
	const [courses, setCourses] = useState([])

	const [isEdit, setIsEdit] = useState(false)

	const clearParams = () => {
		setSearchParams({})
	}

	const handleCourseClick = id => {
		setIsEdit(false)
		setSearchParams({ course_id: id })
	}

	const options = [
		{ value: 'pending_review', title: 'На рассмотрении' },
		{ value: 'approved', title: 'Одобренные' },
	]

	const [activeStatus, setActiveStatus] = useState('pending_review')
	const [courseStatus, setCourseStatus] = useState(null)

	const fetchCourses = async () => {
		try {
			const res = await GetModerationCourses(activeStatus)
			setCourses(res)
		} catch (err) {
			console.error(err)
		}
	}

	useEffect(() => {
		fetchCourses()
	}, [activeStatus])

	const accessCourse = async status => {
		try {
			await ChangeStatus(activeCourseId, status)
			setIsModalOpen(false)
			clearParams()
			fetchCourses() // Обновляем список курсов в сайдбаре после модерации
		} catch (err) {
			console.error(err)
		}
	}

	useEffect(() => {
		const getCourse = async () => {
			try {
				const res = await GetCourseInfoById(activeCourseId)
				setCourseStatus(res.status)
			} catch (err) {
				console.error('Ошибка при загрузке курса:', err)
			}
		}
		if (activeCourseId) getCourse()
	}, [activeCourseId])

	return (
		<>
			{/* Модалка вынесена на уровень родителя */}
			<Modal width={'w-110'} isOpen={isModalOpen}>
				<div className='flex flex-col gap-6 p-2'>
					<div className='flex flex-col items-center text-center gap-3'>
						<div className='p-4 bg-[var(--transparent-hero)] rounded-full text-[var(--hero)]'>
							<ShieldAlert size={40} />
						</div>
						<h2 className='text-2xl font-bold text-[var(--black)]'>
							Вынесение вердикта
						</h2>
						<p className='text-[var(--middle)] text-sm'>
							Выберите статус для курса после проверки данных. Автору придет
							соответствующее уведомление.
						</p>
					</div>

					<div className='grid grid-cols-2 gap-4'>
						<button
							onClick={() => accessCourse('draft')}
							className='flex flex-col items-center gap-2 p-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-600 transition-all cursor-pointer border border-red-500/20'
						>
							<XCircle size={24} />
							<span className='font-semibold text-sm'>Отклонить</span>
						</button>
						<button
							onClick={() => accessCourse('approved')}
							className='flex flex-col items-center gap-2 p-4 rounded-2xl bg-green-500/10 hover:bg-green-500/20 text-green-600 transition-all cursor-pointer border border-green-500/20'
						>
							<CheckCircle2 size={24} />
							<span className='font-semibold text-sm'>Одобрить</span>
						</button>
					</div>

					<button
						onClick={() => setIsModalOpen(false)}
						className='w-full py-3 text-[var(--middle)] font-medium hover:bg-[var(--light-middle)]/10 rounded-xl transition-all text-sm'
					>
						Вернуться к просмотру
					</button>
				</div>
			</Modal>

			<div className='lg:grid grid-cols-[400px_1fr] h-screen gap-6 lg:pl-0 pl-18 pt-25 bg-[var(--light-gray)]/30'>
				<ResponsiveSidebar
					title='Курсы на проверку'
					triggerTitle='Курсы'
					triggerIcon={BookOpen}
					isOpen={isOpen}
					setIsOpen={setIsOpen}
				>
					<div className='flex flex-col justify-between h-full overflow-hidden'>
						{/* <div className='flex gap-1'>
							{options?.map(option => (
								<RadioButton
									key={option.value}
									name='catalog-type'
									value={option.value}
									title={option.title}
									icon={option.icon}
									checked={activeStatus === option.value}
									onChange={() => {
										setActiveStatus(option.value)
									}}
									wfull
									fill
								/>
							))}
						</div> */}
						<div className='flex flex-col gap-3 h-full overflow-y-auto p-2'>
							{courses?.map((course, index) => (
								<motion.div
									key={course.id || index}
									initial={{ scale: 0.9, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={{ duration: 0.125, ease: 'easeOut' }}
								>
									<CourseMiniCard
										data={course}
										onClick={() => {
											handleCourseClick(course.id)
											setIsOpen(false)
										}}
									/>
								</motion.div>
							))}
						</div>
						<div className='pt-4 mt-auto shrink-0'>
							<BasicPagination
								count={1}
								page={page}
								onPageChange={setPage}
								siblingCount={0}
							/>
						</div>
					</div>
				</ResponsiveSidebar>

				{/* Основной контент */}
				<div className='w-full h-full bg-[var(--white)] overflow-y-auto shadow-lg rounded-t-3xl border-t border-x border-[var(--light-middle)]/10 p-6 relative'>
					{!activeCourseId ? (
						<div className='flex items-center justify-center w-full h-full'>
							<p className='text-[var(--middle)] font-light text-xl'>
								Выберите курс из списка для проведения модерации
							</p>
						</div>
					) : (
						<div className='flex flex-col gap-6 h-full w-full'>
							{/* ВЕРХНЯЯ ПАНЕЛЬ: Навигация и Редактирование */}
							<div className='flex items-center w-full justify-between border-b border-[var(--light-middle)]/10 pb-4 shrink-0'>
								<DefaultButton
									paddings='p-3'
									width='w-fit aspect-square'
									flexParams='items-center'
									invert={true}
									onClick={clearParams}
								>
									<ArrowLeft className='text-[var(--black)]' size={20} />
								</DefaultButton>

								<div className='flex gap-3'>
									<ColoredButton
										width='px-5 py-2.5 text-sm flex items-center'
										onClick={() => setIsEdit(prev => !prev)}
										color={{
											bg: isEdit ? 'var(--hero)' : 'var(--white)',
											text: isEdit ? 'white' : 'var(--black)',
										}}
									>
										{isEdit ? (
											<>
												<Edit3 size={16} />
												Редактирование
											</>
										) : (
											<>
												<Edit3 size={16} />
												Редактировать
											</>
										)}
									</ColoredButton>

									{courseStatus === 'pending_review' && (
										<DefaultButton
											width='px-6 py-2.5 text-sm flex items-center'
											onClick={() => setIsModalOpen(true)}
										>
											<ShieldAlert size={16} />
											Рецензировать
										</DefaultButton>
									)}
								</div>
							</div>

							{/* Сама анкета данных курса */}
							<CourseForm
								courseId={activeCourseId}
								isEdit={isEdit}
								onIsEditChange={setIsEdit}
							/>
						</div>
					)}
				</div>
			</div>
		</>
	)
}

export default ModerateCourses
