import { useEffect, useState } from 'react'
import {
	ChangeStatus,
	GetCourseInfoById,
	GetModerationCourses,
} from '../../../service/APIs/Moderation'
import BasicPagination from '../../components/Pagination'
import { DefaultButton, RadioButton } from '../../components/Buttons'
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
	ShieldAlert,
	Tag,
	User,
	XCircle,
} from 'lucide-react'
import Modal from '../../components/Modal'
import ResponsiveSidebar from '../../components/ResponsiveSidebar'

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

// Форма просмотра курса (теперь чистая презентационная логика)
const CourseForm = ({ courseId }) => {
	const [courseInfo, setCourseInfo] = useState({})

	useEffect(() => {
		const getCourse = async () => {
			try {
				const res = await GetCourseInfoById(courseId)
				setCourseInfo(res)
			} catch (err) {
				console.error('Ошибка при загрузке курса:', err)
			}
		}
		if (courseId) getCourse()
	}, [courseId])

	return (
		<div className='2xl:mx-20 mx-2 pb-24'>
			{' '}
			{/* Отступ снизу под Action Bar */}
			<div className='grid grid-cols-12 gap-8'>
				{/* ЛЕВАЯ КОЛОНКА */}
				<div className='col-span-12 lg:col-span-4 flex flex-col space-y-6 border-r border-[var(--light-middle)]/10 pr-6'>
					<div className='relative group h-64 w-full rounded-3xl overflow-hidden shadow-md bg-[var(--light-gray)]/50'>
						{courseInfo.preview_url ? (
							<img
								src={courseInfo.preview_url}
								alt='Preview'
								className='w-full h-full object-cover'
							/>
						) : (
							<div className='w-full h-full flex items-center justify-center text-[var(--middle)]'>
								<BookOpen size={48} />
							</div>
						)}
						<div className='absolute top-4 left-4 px-3 py-1 bg-white/95 backdrop-blur rounded-lg text-xs font-bold text-[var(--hero)] shadow-sm'>
							ID: {courseInfo.id?.slice(0, 8)}...
						</div>
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
									{courseInfo.creator?.last_name}{' '}
									{courseInfo.creator?.first_name}
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
					<section className='space-y-5'>
						<div className='flex items-center gap-3'>
							<div className='p-2 bg-[var(--transparent-hero)] rounded-lg text-[var(--hero)]'>
								<BookOpen size={20} />
							</div>
							<h3 className='text-lg font-bold text-[var(--black)]'>
								Основная информация
							</h3>
						</div>
						<TextStroke title='Название курса' value={courseInfo.name} />
						<TextStroke
							title='Описание'
							value={courseInfo.description}
							textarea
						/>
					</section>

					<section className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div className='space-y-4'>
							<div className='flex items-center gap-2 text-[var(--hero)] font-semibold text-xs uppercase tracking-wider mb-1'>
								<Calendar size={14} /> Регистрация
							</div>
							<TextStroke
								title='Начало'
								value={courseInfo.registration_start?.split('T')[0]}
							/>
							<TextStroke
								title='Конец'
								value={courseInfo.registration_end?.split('T')[0]}
							/>
						</div>
						<div className='space-y-4'>
							<div className='flex items-center gap-2 text-[var(--hero)] font-semibold text-xs uppercase tracking-wider mb-1'>
								<Calendar size={14} /> Обучение
							</div>
							<TextStroke
								title='Дата старта'
								value={courseInfo.start_date?.split('T')[0]}
							/>
							<TextStroke
								title='Дата завершения'
								value={courseInfo.end_date?.split('T')[0]}
							/>
						</div>
					</section>

					<section className='grid grid-cols-1 md:grid-cols-3 gap-6 items-end'>
						<div className='md:col-span-2 flex flex-col gap-4 w-full'>
							<TextStroke
								title='Формат обучения'
								value={courseInfo.format_name}
							/>
							<TextStroke
								title='Тип сертификата'
								value={courseInfo.certificate_type_name}
							/>
						</div>
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
					</section>
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

	const clearParams = () => {
		setSearchParams({})
	}

	const handleCourseClick = id => {
		setSearchParams({ course_id: id })
	}

	const options = [
		{ value: 'pending_review', title: 'На рассмотрении' },
		{ value: 'approved', title: 'Одобренные' },
	]

	const [activeStatus, setActiveStatus] = useState('pending_review')

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
						<div className='flex gap-1'>
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
										clearParams()
									}}
									wfull
									fill
								/>
							))}
						</div>
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
									<DefaultButton
										width='px-5 py-2.5 text-sm flex items-center'
										invert={activeStatus === 'pending_review'}
										onClick={() => navigate(`/course/${activeCourseId}`)}
									>
										<Edit3 size={16} />
										Редактировать
									</DefaultButton>
									{activeStatus === 'pending_review' && (
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
							<CourseForm courseId={activeCourseId} />
						</div>
					)}
				</div>
			</div>
		</>
	)
}

export default ModerateCourses
