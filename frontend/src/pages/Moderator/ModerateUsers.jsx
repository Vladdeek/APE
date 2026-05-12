import { useScroll } from 'framer-motion'
import { InputDefault } from '../../components/Inputs'
import { useEffect, useState } from 'react'
import { ImageOff, Plus } from 'lucide-react'
import { DefaultButton } from '../../components/Buttons'
import {
	GetCreatedCoursesByUserId,
	GetUsers,
	GetUsersById,
} from '../../../service/APIs/Moderation'
import BasicPagination from '../../components/Pagination'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'

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

const UserForm = ({ mode, userId }) => {
	const [formData, setFormData] = useState({
		first_name: '',
		last_name: '',
		patronymic: '',
		email: '',
	})
	const [avatarUrl, setAvatarUrl] = useState('')

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

				setAvatarUrl(res.avatar_url)
			} catch (err) {
				console.error(err)
			}
		}
		userId && getUsersById()
	}, [userId])
	return (
		<div className='grid grid-cols-3 gap-5'>
			<div className='col-span-1 flex flex-col gap-3'>
				<img
					className='w-full h-auto aspect-square rounded-2xl'
					src={avatarUrl}
					alt=''
				/>
				<p className='text-xl text-[var(--black)]'>
					{formData.last_name.length !== 0 ? formData.last_name : 'Фамилия'}{' '}
					{formData.first_name.length !== 0 ? formData.first_name : 'Имя'}{' '}
					{formData.patronymic.length !== 0 ? formData.patronymic : 'Отчество'}
				</p>
				<p className='text-md text-[var(--middle)]'>
					{formData.email.length !== 0 ? formData.email : 'Почта'}
				</p>
			</div>
			<div className=' col-span-2 flex flex-col gap-3'>
				<InputDefault
					title='Почта'
					name='email'
					placeholder='Введите почту...'
					value={formData.email}
					onChange={handleChange}
				/>
				<div className='grid grid-cols-3 max-lg:grid-cols-1 gap-3'>
					<InputDefault
						title='Фамилия'
						name='first_name'
						placeholder='Введите фамилию...'
						value={formData.first_name}
						onChange={handleChange}
					/>
					<InputDefault
						title='Имя'
						name='last_name'
						placeholder='Введите имя...'
						value={formData.last_name}
						onChange={handleChange}
					/>
					<InputDefault
						title='Отчество'
						name='patronymic'
						placeholder='Введите отчество...'
						value={formData.patronymic}
						onChange={handleChange}
					/>
				</div>

				<div className='flex w-full justify-center'>
					<DefaultButton width='w-fit' onClick={() => setMode('create')}>
						<div className='flex items-center justify-center gap-3 w-full'>
							<span style={{ fontSize: '16px' }}>
								{mode === 'create'
									? 'Зарегистрировать пользователя'
									: mode === 'edit' && 'Сохранить изменения'}
							</span>
						</div>
					</DefaultButton>
				</div>
			</div>
		</div>
	)
}
const ModerateUsers = () => {
	const [mode, setMode] = useState(null)
	const [page, setPage] = useState(1)
	const [users, setUsers] = useState([])
	const [courses, setCourses] = useState([])

	const [searchParams, setSearchParams] = useSearchParams()
	const activeUserId = searchParams.get('user_id')
	const handleUserClick = id => {
		// Обновляем query-параметр.
		// { replace: true } нужен, чтобы не спамить в историю браузера при каждом клике
		setSearchParams({ user_id: id }, { replace: true })
	}

	useEffect(() => {
		if (activeUserId !== null) {
			setMode('edit')
		} else {
			setMode(null)
		}
	}, [activeUserId])

	useEffect(() => {
		const getUsers = async () => {
			try {
				const res = await GetUsers('teacher')
				setUsers(res)
			} catch (err) {}
		}
		getUsers()
	}, [])

	useEffect(() => {
		const getCreatedCoursesByUserId = async () => {
			try {
				const res = await GetCreatedCoursesByUserId(activeUserId)
				setCourses(res)
			} catch (err) {}
		}
		activeUserId && getCreatedCoursesByUserId()
	}, [])

	return (
		<>
			<div className='grid grid-cols-[500px_1fr] h-screen gap-6 pt-30 pb-10 '>
				{/* Боковая панель (Sidebar) */}
				<div className='w-full h-full overflow-y-auto bg-[var(--white)] shadow-lg rounded-3xl p-4 flex flex-col justify-between'>
					<h2 className='text-xl font-bold mb-3 px-2 text-[var(--black)]'>
						Существующие пользователи
					</h2>
					<div className='flex flex-col gap-3 h-full overflow-y-auto p-2'>
						{users?.items?.map((user, index) => (
							<motion.div
								initial={{ scale: 0.9, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{
									duration: 0.125,
									ease: 'easeOut',
								}}
							>
								<UserCard
									FullName={user?.full_name}
									avatar_url={user?.avatar_url}
									email={user?.email}
									role={user?.role}
									onClick={() => {
										handleUserClick(user.id)
									}}
								/>
							</motion.div>
						))}
					</div>

					<BasicPagination
						count={users?.total_pages}
						page={page}
						onPageChange={setPage}
						siblingCount={0}
					/>
				</div>

				{/* Основной контент */}
				<div className='w-full h-full bg-[var(--white)] shadow-lg rounded-3xl p-4'>
					{mode === null ? (
						<div className='flex items-center justify-center w-full h-full'>
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
							<UserForm mode={mode} userId={activeUserId} />
							<p className='text-center text-2xl text-[var(--black)]'>
								Список курсов
							</p>
							{courses?.length === 0 ? (
								<div className='flex w-full h-full items-center justify-center'>
									<p className='text-[var(--middle)] font-light'>
										У этого пользователя пока что нет курсов
									</p>
								</div>
							) : (
								<div className='grid grid-cols-2 gap-3 h-full overflow-y-auto'>
									{courses?.map((course, index) => (
										<motion.div
											initial={{ scale: 0.9, opacity: 0 }}
											animate={{ scale: 1, opacity: 1 }}
											transition={{
												duration: 0.125,
												ease: 'easeOut',
											}}
										>
											<CourseCard data={course} />
										</motion.div>
									))}
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</>
	)
}
export default ModerateUsers
