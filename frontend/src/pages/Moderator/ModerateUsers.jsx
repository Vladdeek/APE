import { useScroll } from 'framer-motion'
import { InputDefault } from '../../components/Inputs'
import { useEffect, useState } from 'react'
import {
	ArrowLeft,
	Camera,
	Check,
	Copy,
	Icon,
	ImageOff,
	Key,
	KeyRound,
	LibraryBig,
	Lock,
	Mail,
	PanelLeftClose,
	Plus,
	RefreshCcw,
	RefreshCw,
	Send,
	ShieldAlert,
	ShieldCheck,
	Trash,
	Trash2,
	User,
	Users,
} from 'lucide-react'
import { DefaultButton, RadioButton } from '../../components/Buttons'
import {
	AddNewUser,
	DeleteUsersById,
	EditUserInfo,
	generateNewPassword,
	GetCreatedCoursesByUserId,
	GetUsers,
	GetUsersById,
	ToSendTheMessageAgainUserById,
} from '../../../service/APIs/Moderation'
import BasicPagination from '../../components/Pagination'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import CourseCard from '../../components/Cards'
import Modal from '../../components/Modal'
import ResponsiveSidebar from '../../components/ResponsiveSidebar'

const UserCard = ({ FullName, avatar_url, email, role, onClick }) => {
	const roles = {
		student: 'Cтудент',
		teacher: 'Преподаватель',
		moderator: 'Модератор',
	}

	return (
		<>
			<div
				onClick={onClick}
				className='w-full h-fit flex gap-3 bg-[var(--white)] rounded-2xl shadow-[var(--shadow)] p-2'
			>
				{avatar_url ? (
					<img className='rounded-xl w-12.5 h-12.5' src={avatar_url} alt='' />
				) : (
					<ImageOff className='h-12 rounded-xl object-cover aspect-square w-auto p-3 text-[var(--middle)] bg-[var(--light-middle)]' />
				)}

				<div className='flex flex-col w-full'>
					<div className='flex flex-wrap w-full items-center justify-between'>
						<p className='text-lg text-[var(--black)]'>
							{FullName?.last_name} {FullName?.first_name}{' '}
							{FullName?.patronymic}
						</p>
						<p className='text-sm bg-[var(--transparent-hero)] text-[var(--hero)] px-2 rounded-full'>
							{role && <p>{roles[role]}</p>}
						</p>
					</div>

					<p className='text-sm text-[var(--middle)]'>{email}</p>
				</div>
			</div>
		</>
	)
}

const Devider = ({ icon: Icon, title }) => {
	return (
		<div className='flex items-center gap-3 mb-2 shrink-0'>
			{Icon && (
				<div className='p-2 bg-[var(--transparent-hero)] rounded-lg text-[var(--hero)] flex items-center justify-center'>
					<Icon size={20} />
				</div>
			)}
			<h3 className='text-lg font-medium text-[var(--black)]'>{title}</h3>
		</div>
	)
}

const UserForm = ({ mode, userId, onChange }) => {
	const [isModalOpen, setIsModalOpen] = useState(null)
	const [isCreatedModalOpen, setIsCreatedModalOpen] = useState(false)
	const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
	const [formData, setFormData] = useState({
		first_name: '',
		last_name: '',
		patronymic: '',
		email: '',
		password: '',
	})
	const [avatarUrl, setAvatarUrl] = useState('')
	const [resData, setResData] = useState('')
	const [role, setRole] = useState()

	const [logined, setLogined] = useState(null)

	const [copied, setCopied] = useState(false)

	const handleCopy = async whatCopy => {
		// Формируем шаблон строки для копирования
		const textToCopy =
			whatCopy === 'password'
				? `Пароль: ${resData.password}`
				: `Почта: ${resData.email}\nПароль: ${resData.password}`

		navigator.clipboard
			.writeText(textToCopy)
			.then(() => {
				setCopied(true)

				// Сбрасываем статус "Скопировано" через 2 секунды
				setTimeout(() => setCopied(false), 2000)
			})
			.catch(err => {
				console.error('Не удалось скопировать текст: ', err)
			})
	}

	const handleChange = e => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	useEffect(() => {
		const getUsersById = async () => {
			try {
				const res = await GetUsersById(userId)

				setFormData(prev => ({
					...prev,
					first_name: res.full_name.first_name,
					last_name: res.full_name.last_name,
					patronymic: res.full_name.patronymic,
					email: res.email,
				}))
				setRole(res.role)

				setAvatarUrl(res.avatar_url)
				setLogined(res.last_login_at)
			} catch (err) {
				console.error(err)
			}
		}
		userId && getUsersById()
	}, [userId])

	const addNewUser = async () => {
		try {
			const res = await AddNewUser(
				formData.first_name,
				formData.last_name,
				formData.patronymic,
				formData.email,
				role,
			)
			onChange?.(res.id)
			if (res) {
				setResData(res)
				setIsCreatedModalOpen(true)
			}
		} catch (err) {}
	}

	const editUserInfo = async () => {
		try {
			const res = await EditUserInfo(
				formData.first_name,
				formData.last_name,
				formData.patronymic,
				formData.email,
				userId,
			)
			onChange?.(userId)
		} catch (err) {}
	}

	const deleteUsersById = async () => {
		try {
			const res = await DeleteUsersById(userId)
			onChange?.('delete')
		} catch (err) {}
	}

	const toSendTheMessageAgainUserById = async () => {
		try {
			const res = await ToSendTheMessageAgainUserById(userId)
		} catch (err) {}
	}

	const generatePassword = async () => {
		try {
			const res = await generateNewPassword(userId)
			if (res) {
				setResData(res)
				setIsPasswordModalOpen(true)
			}
		} catch (err) {}
	}

	const states = [
		'to-send-the-message-again',
		'generate-new-password',
		'delete-user',
	]

	const MODAL_CONFIG = {
		'to-send-the-message-again': {
			title: 'Повторная отправка',
			text: 'Вы уверены, что хотите отправить письмо еще раз? Проверьте папку "Спам".',
			confirmLabel: 'Отправить',
			confirmClass: 'bg-[var(--green-base)] hover:bg-[var(--green-hover)]',
			action: () => toSendTheMessageAgainUserById(),
		},
		'generate-new-password': {
			title: 'Новый пароль',
			text: 'Старый пароль перестанет действовать. Сгенерировать новый?',
			confirmLabel: 'Создать',
			confirmClass: 'bg-[var(--green-base)] hover:bg-[var(--green-hover)]',
			action: () => generatePassword(),
		},
		'delete-user': {
			title: 'Удаление аккаунта',
			text: 'Это действие нельзя отменить. Все данные будут удалены навсегда.',
			confirmLabel: 'Удалить',
			confirmClass: 'bg-[var(--red-base)] hover:bg-[var(--red-hover)]',
			action: () => deleteUsersById(),
		},
	}

	const options = [
		{ value: 'teacher', title: 'Преподаватель' },
		{ value: 'student', title: 'Студент' },
	]

	const ROLES = {
		teacher: 'Преподаватель',
		student: 'Студент',
	}

	return (
		<>
			<Modal width={'w-130'} isOpen={isCreatedModalOpen}>
				<div className='flex flex-col gap-6 p-1'>
					{' '}
					{/* Немного увеличили gap для воздуха */}
					{/* Блок профиля */}
					<div className='flex items-start gap-5'>
						{/* Аватар с мягкой двойной тенью */}
						<div className='relative w-20 h-20 rounded-2xl overflow-hidden bg-[var(--light-middle)] flex items-center justify-center border-2 border-[var(--white)] shadow-md shrink-0'>
							{resData.avatar_url ? (
								<img
									src={resData.avatar_url}
									alt='Avatar'
									className='w-full h-full object-cover transition-transform duration-500 hover:scale-105'
								/>
							) : (
								<User
									size={48}
									strokeWidth={1.5}
									className='text-[var(--middle)]'
								/>
							)}
						</div>

						{/* Информация о пользователе */}
						<div className='flex flex-col gap-1.5 pt-1'>
							<p className='text-lg font-bold text-[var(--black)] leading-snug flex flex-wrap gap-x-1.5'>
								<span>{resData.last_name}</span>
								<span>{resData.first_name}</span>
								<span>{resData.patronymic}</span>
							</p>

							<div className='flex items-center gap-2 flex-wrap'>
								<span className='px-2.5 py-0.5 text-[var(--hero)] bg-[var(--hero-pale)] rounded-full text-xs font-semibold tracking-wide uppercase'>
									{ROLES[resData.role]}
								</span>
								<span className='text-[var(--middle)] text-sm font-normal'>
									• {resData.email}
								</span>
							</div>
						</div>
					</div>
					{/* Карточка с данными для входа */}
					<div className='w-full bg-[var(--bg)]/50 border border-[var(--black)]/5 rounded-2xl p-4 flex flex-col gap-4 shadow-inner'>
						{/* Шапка карточки */}
						<div className='flex justify-between items-center pb-2 border-b border-[var(--black)]/5'>
							<h3 className='text-[var(--black)] text-sm font-bold uppercase tracking-wider opacity-80'>
								Данные для входа
							</h3>
							<button
								onClick={() => handleCopy('fullInfo')}
								className={`text-[var(--hero)] ${copied ? 'bg-[var(--green-status-bg)] hover:bg-[var(--green-status-middle-text)]' : 'hover:bg-[var(--hero-pale)]'}  flex gap-1.5 items-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer active:scale-95`}
							>
								{copied ? (
									<>
										<Check
											size={14}
											className='text-[var(--green-status-text)]'
										/>
										<span>Скопировано!</span>
									</>
								) : (
									<>
										<Copy size={14} />
										<span>Скопировать всё</span>
									</>
								)}
							</button>
						</div>

						{/* Контентная часть */}
						<div className='grid grid-cols-2 gap-4'>
							<div className='flex flex-col gap-1.5'>
								<span className='text-[var(--middle)] text-[11px] font-bold uppercase tracking-wider'>
									Электронная почта
								</span>
								<span className='text-[var(--black)] text-sm font-medium break-all select-all bg-[var(--white)] py-1.5 px-2.5 rounded-lg border border-[var(--black)]/5 shadow-sm'>
									{resData.email}
								</span>
							</div>

							<div className='flex flex-col gap-1.5'>
								<span className='text-[var(--middle)] text-[11px] font-bold uppercase tracking-wider'>
									Пароль
								</span>
								<span className='text-[var(--black)] text-sm font-mono font-bold break-all select-all bg-[var(--white)] py-1.5 px-2.5 rounded-lg border border-[var(--black)]/5 shadow-sm text-center tracking-wide'>
									{resData.password}
								</span>
							</div>
						</div>
					</div>
					{/* Кнопка действия (Завершение) */}
					<div className='flex flex-col gap-2 pt-2 border-t border-[var(--black)]/5'>
						<button
							onClick={() => {
								setIsCreatedModalOpen(false)
							}}
							className='w-full bg-[var(--hero)] hover:bg-[var(--hero)]/90 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg hover:shadow-[var(--hero)]/15 transition-all duration-200 active:scale-[0.99] cursor-pointer text-center text-sm'
						>
							Готово, данные отправлены
						</button>
					</div>
				</div>
			</Modal>
			<Modal width={'w-130'} isOpen={isPasswordModalOpen}>
				<div className='flex flex-col gap-6'>
					{/* Карточка с сгенерированным паролем */}
					<div className='w-full bg-[var(--bg)]/50 rounded-2xl p-4 flex flex-col gap-4 '>
						{/* Шапка карточки */}
						<div className='flex justify-between items-center pb-2 border-b border-[var(--black)]/5'>
							<p className='text-[var(--black)] text-sm font-bold uppercase tracking-wider'>
								Новый пароль
							</p>

							<button
								onClick={() => handleCopy('password')}
								className={`text-[var(--hero)] ${
									copied
										? 'bg-[var(--green-status-bg)] text-[var(--green-status-text)] hover:bg-[var(--green-status-middle-text)]'
										: 'hover:bg-[var(--hero-pale)]'
								} flex gap-1.5 items-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer active:scale-95`}
							>
								{copied ? (
									<>
										<Check size={14} />
										<span>Скопировано!</span>
									</>
								) : (
									<>
										<Copy size={14} />
										<span>Скопировать</span>
									</>
								)}
							</button>
						</div>

						{/* Поле с паролем */}
						<div className='flex flex-col gap-1.5'>
							<span className='text-[var(--black)] text-base font-mono font-bold break-all select-all bg-[var(--white)] py-2.5 px-3 rounded-lg border border-[var(--black)]/5 shadow-inner text-center tracking-wide min-h-[44px] flex items-center justify-center'>
								{resData.password}
							</span>
							<span className='text-[var(--black)]/40 text-[11px] text-center'>
								Нажмите на текст или кнопку выше, чтобы скопировать
							</span>
						</div>
					</div>

					{/* Кнопка действия (Закрытие) */}
					<div className='flex flex-col gap-2 pt-2 border-t border-[var(--black)]/5'>
						<button
							onClick={() => setIsPasswordModalOpen(false)}
							className='w-full bg-[var(--hero)] hover:bg-[var(--hero)]/90 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg hover:shadow-[var(--hero)]/15 transition-all duration-200 active:scale-[0.99] cursor-pointer text-center text-sm'
						>
							Данные отправлены, закрыть
						</button>
					</div>
				</div>
			</Modal>
			<Modal width={'w-100'} isOpen={isModalOpen !== null}>
				{isModalOpen && (
					<div className='flex flex-col gap-4'>
						{/* 1. Заголовок и Предупреждение */}
						<div>
							<h2 className='text-xl text-[var(--black)] font-semibold mb-2'>
								{MODAL_CONFIG[isModalOpen].title}
							</h2>
							<p className='text-[var(--middle)]'>
								{MODAL_CONFIG[isModalOpen].text}
							</p>
						</div>

						{/* 2. Кнопки */}
						<div className='flex justify-end gap-3 mt-4'>
							{/* Кнопка отмены всегда одинаковая */}
							<button
								onClick={() => setIsModalOpen(null)}
								className='px-4 py-2 text-[var(--middle)] hover:bg-[var(--light-middle)] cursor-pointer rounded-xl transition-all'
							>
								Отмена
							</button>

							{/* Кнопка подтверждения берет данные из конфига */}
							<button
								onClick={() => {
									MODAL_CONFIG[isModalOpen].action()
									setIsModalOpen(null)
								}}
								className={`px-4 py-2 text-white rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer ${MODAL_CONFIG[isModalOpen].confirmClass}`}
							>
								{MODAL_CONFIG[isModalOpen].confirmLabel}
							</button>
						</div>
					</div>
				)}
			</Modal>
			<div className='max-w-5xl mx-auto p-8 rounded-[32px]'>
				<div className='grid grid-cols-12 gap-10'>
					{/* ЛЕВАЯ КОЛОНКА: Виджет профиля */}
					<div className='col-span-12 lg:col-span-4 flex flex-col items-center text-center space-y-6 border-r border-gray-100/50 pr-4'>
						<div className='relative group'>
							<div className='w-48 h-48 rounded-[24px] overflow-hidden bg-[var(--light-middle)] flex items-center justify-center border-4 border-[var(--white)] shadow-lg'>
								{avatarUrl ? (
									<img
										src={avatarUrl}
										alt='Avatar'
										className='w-full h-full object-cover transition-transform duration-500 '
									/>
								) : (
									<User
										size={64}
										strokeWidth={1}
										className='text-[var(--middle)]'
									/>
								)}
							</div>
						</div>

						<div className='space-y-1'>
							<h2 className='text-2xl font-semibold text-[var(--black)] break-words leading-tight'>
								{formData.last_name || 'Фамилия'} {formData.first_name || 'Имя'}
								<br /> {formData.patronymic || 'Отчество'}
							</h2>
							<p className='text-sm text-[var(--middle)] font-medium'>
								{formData.email || 'example@mail.com'}
							</p>
						</div>

						{/* Управление доступом */}
						<div className='w-full pt-6 space-y-2 border-t border-gray-100/50'>
							{/* 1. Повторная отправка письма (если не пришло) */}
							{/* <button
								onClick={() => setIsModalOpen(states[0])}
								disabled={logined !== null || mode === 'create'}
								className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-sm font-medium transition-all text-[var(--black)] ${logined !== null || mode === 'create' ? 'opacity-40 cursor-not-allowed' : ' hover:bg-[var(--light-middle)] hover:shadow-[var(--shadow)] active:scale-[0.98] cursor-pointer'}`}
							>
								<Mail size={16} className='text-[var(--hero)]' />
								Повторить отправку письма
							</button> */}

							{/* 2. Генерация нового пароля (если забыл) */}
							<button
								onClick={() => setIsModalOpen(states[1])}
								disabled={mode === 'create'}
								className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-sm font-medium transition-all text-[var(--black)] ${mode === 'create' ? 'opacity-40 cursor-not-allowed' : ' hover:bg-[var(--light-middle)]/25 hover:shadow-[var(--shadow)] active:scale-[0.98] cursor-pointer'}`}
							>
								<Key size={16} className='text-[var(--middle-correct-lvl)]' />
								Сгенерировать новый пароль
							</button>

							{/* 3. Удаление аккаунта */}
							<button
								onClick={() => setIsModalOpen(states[2])}
								disabled={mode === 'create'}
								className={`w-full group flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-sm font-medium transition-all ${mode === 'create' ? 'opacity-40 cursor-not-allowed' : 'text-[var(--red-base)] bg-[var(--red-surface)] hover:text-[var(--red-surface)] hover:bg-[var(--red-base)] hover:scale-101 hover:shadow-[var(--shadow)] active:scale-[0.98] cursor-pointer'}`}
							>
								<Trash2
									size={16}
									className='text-[var(--red-base)] group-hover:text-[var(--red-surface)] transition-all'
								/>
								Удалить аккаунт
							</button>
						</div>
					</div>

					{/* ПРАВАЯ КОЛОНКА: Основные поля */}
					<div className='col-span-12 lg:col-span-8 flex flex-col justify-between space-y-8'>
						<div className='space-y-6'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
								<div className='md:col-span-2'>
									<Devider icon={User} title={'Личные данные'} />
								</div>
								<div className='md:col-span-2 flex items-center gap-3 w-full'>
									{options?.map(option => (
										<RadioButton
											key={option.value}
											name='catalog-type'
											value={option.value}
											title={option.title}
											icon={option.icon}
											checked={role === option.value}
											onChange={() => setRole(option.value)}
											wfull
											fill
										/>
									))}
								</div>

								<InputDefault
									title='Фамилия'
									name='last_name'
									placeholder='Иванов'
									value={formData.last_name}
									onChange={handleChange}
									required
								/>
								<InputDefault
									title='Имя'
									name='first_name'
									placeholder='Иван'
									value={formData.first_name}
									onChange={handleChange}
									required
								/>
								<div className='md:col-span-2'>
									<InputDefault
										title='Отчество'
										name='patronymic'
										placeholder='Иванович'
										value={formData.patronymic}
										onChange={handleChange}
										required
									/>
								</div>

								{/* РАЗДЕЛ 3: ДАННЫЕ ДЛЯ ВХОДА (Иконка: Ключ / Доступ) */}
								{/* Цвет иконки/текста: рекомендуется предупреждающий или строгий (например, оранжевый или янтарный) */}
								<div className='md:col-span-2'>
									<Devider icon={KeyRound} title={'Данные для авторизации'} />
								</div>

								{/* Адаптивный блок авторизации: на мобилках в колонку, на md+ в одну линию */}
								<div className='md:col-span-2 flex flex-col gap-5 '>
									{/* Блок Email + кнопка генерации */}
									<div className='flex gap-3 items-end w-full'>
										<div className='flex-grow'>
											<InputDefault
												title='Электронная почта'
												name='email'
												placeholder='mail@example.com'
												value={formData.email}
												onChange={handleChange}
											/>
											{/* Информационный текст-предупреждение */}
											<p className='mt-2 text-xs text-[var(--middle)] leading-relaxed'>
												Если оставить поле пустым, система создаст случайную
												почту для входа, но пользователь{' '}
												<strong>не получит пароль</strong>, так как этого ящика
												физически не существует. Пароль генерируется{' '}
												<strong>автоматически</strong>.
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Главная кнопка внизу */}
						<div className='flex justify-end pt-4 border-t border-zinc-100 dark:border-zinc-800 md:border-transparent'>
							<DefaultButton
								width='w-full md:w-auto px-12 py-4'
								onClick={() =>
									mode === 'create' ? addNewUser() : editUserInfo()
								}
							>
								<span className='text-base font-semibold'>
									{mode === 'create'
										? 'Создать аккаунт'
										: 'Сохранить изменения'}
								</span>
							</DefaultButton>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

const ModerateUsers = () => {
	const [isOpen, setIsOpen] = useState(false)
	const [mode, setMode] = useState(null)
	const [page, setPage] = useState(1)
	const [users, setUsers] = useState([])
	const [courses, setCourses] = useState([])

	const [searchParams, setSearchParams] = useSearchParams()
	const activeUserId = searchParams.get('user_id')

	const handleUserClick = id => {
		setSearchParams({ user_id: id }, { replace: true })
	}

	const clearParams = () => {
		setSearchParams({}, { replace: true })
		setMode(null)
	}

	useEffect(() => {
		if (activeUserId !== null) {
			setMode('edit')
		} else {
			setMode(null)
		}
	}, [activeUserId])

	const getUsers = async () => {
		try {
			const res = await GetUsers('teacher')
			setUsers(res)
		} catch (err) {}
	}

	useEffect(() => {
		getUsers()
	}, [])

	return (
		<>
			<div className='lg:grid grid-cols-[450px_1fr] h-screen gap-6 lg:pl-0 pl-18 pt-25'>
				<ResponsiveSidebar
					title='Существующие пользователи'
					triggerTitle='Пользователи'
					triggerIcon={Users}
					isOpen={isOpen}
					setIsOpen={setIsOpen}
				>
					<div className='flex flex-col justify-between h-full overflow-hidden'>
						<div className='flex flex-col gap-3 h-full overflow-y-auto p-2'>
							{users?.items?.map((user, index) => (
								<motion.div
									key={user.id || index}
									initial={{ scale: 0.9, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={{ duration: 0.125, ease: 'easeOut' }}
								>
									<UserCard
										FullName={user?.full_name}
										avatar_url={user?.avatar_url}
										email={user?.email}
										role={user?.role}
										onClick={() => {
											handleUserClick(user.id)
											setIsOpen(false) // Закрываем шторку на мобилках
										}}
									/>
								</motion.div>
							))}
						</div>
						<div className='pt-4 mt-auto shrink-0'>
							<BasicPagination
								count={users?.total_pages}
								page={page}
								onPageChange={setPage}
								siblingCount={0}
							/>
						</div>
					</div>
				</ResponsiveSidebar>

				{/* Основной контент */}
				<div className='w-full h-full bg-[var(--white)] shadow-lg rounded-3xl p-4 overflow-y-auto'>
					{mode === null ? (
						<div className='flex items-center justify-center w-full h-full min-h-[300px]'>
							<DefaultButton width='w-fit' onClick={() => setMode('create')}>
								<div className='flex items-center justify-center gap-3 w-full'>
									<Plus />
									<span style={{ fontSize: '16px' }}>
										Зарегистрировать пользователя
									</span>
								</div>
							</DefaultButton>
						</div>
					) : (
						<div className='flex flex-col gap-5 h-full w-full'>
							<div className='flex items-center w-full justify-between'>
								<DefaultButton
									paddings='p-3'
									width='w-fit aspect-square'
									flexParams='items-center'
									invert={true}
									onClick={() => {
										clearParams()
									}}
								>
									<ArrowLeft className='text-[var(--black)]' />
								</DefaultButton>
								<p className='text-[var(--black)] text-xl font-medium'>
									{mode === 'edit'
										? 'Редактирование пользователя'
										: 'Регистрация пользователя'}
								</p>
								<div className='w-10'></div>
							</div>

							<UserForm
								mode={mode}
								userId={activeUserId}
								onChange={data => {
									if (data === 'delete') {
										clearParams()
									} else {
										// handleUserClick(data)
									}
									getUsers()
								}}
							/>
						</div>
					)}
				</div>
			</div>
		</>
	)
}

export default ModerateUsers
