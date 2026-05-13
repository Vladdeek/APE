import { useEffect, useState } from 'react'
import { GetModerationCourses } from '../../../service/APIs/Moderation'
import BasicPagination from '../../components/Pagination'
import { ToggleButton } from '../../components/Buttons'
import Help from '../../components/Help'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

const ModerateCourses = () => {
	const navigate = useNavigate()
	const { type } = useParams() // Получаем 'admit' или 'release' из URL
	const [searchParams, setSearchParams] = useSearchParams()

	const [page, setPage] = useState(1)
	const [courses, setCourses] = useState([])

	// Маппинг для удобной работы с индексами ToggleButton
	const types = ['admit', 'release']
	const selected = types.indexOf(type) !== -1 ? types.indexOf(type) : 0

	const handleSelectChange = index => {
		// При смене таба меняем URL. course_id пока сбрасываем или оставляем по логике.
		const newType = types[index]
		navigate(`/moderation-courses/${newType}`)
	}

	const handleCourseClick = id => {
		// Пример добавления query-параметра при клике на курс
		setSearchParams({ course_id: id })
	}

	useEffect(() => {
		// Если зашли просто по базовому адресу, редиректим на 'admit'
		if (!type) {
			navigate('/moderation-courses/admit', { replace: true })
		}
	}, [type, navigate])

	useEffect(() => {
		const getModerateCourses = async () => {
			try {
				// Здесь можно передавать selected или type в API
				const res = await GetModerationCourses(type)
				setCourses(res)
			} catch (err) {}
		}
		getModerateCourses()
	}, [type]) // Перезагружаем данные при смене типа в URL

	return (
		<>
			<div className='grid grid-cols-[500px_1fr] h-screen gap-6 pt-30 pb-10 '>
				<div className='flex flex-col gap-5'>
					<div className='w-full'>
						<ToggleButton
							select={selected}
							setSelect={handleSelectChange} // Используем наш обработчик
							toggles={['Допуск', 'Релиз']}
						/>
					</div>
					<div className='w-full h-full bg-[var(--white)] shadow-lg rounded-3xl p-4 flex flex-col justify-between'>
						<div className='flex items-center gap-3 mb-3'>
							<h2 className='text-xl font-bold text-[var(--black)]'>
								{selected === 0 ? 'Созданные курсы' : 'Допущенные курсы'}
							</h2>
							<Help size={18} width={'w-60'}>
								{selected === 0
									? 'Проверьте заявку и структуру курса...'
									: 'Проверьте полноту и качество...'}
							</Help>
						</div>

						<div className='flex flex-col gap-3 h-full overflow-y-auto p-2'>
							{/* Пример списка курсов */}
							{courses.map(course => (
								<div
									key={course.id}
									onClick={() => handleCourseClick(course.id)}
									className='cursor-pointer p-2 hover:bg-gray-100 rounded-lg'
								>
									{course.name}
								</div>
							))}
						</div>

						<BasicPagination
							count={1}
							page={page}
							onPageChange={setPage}
							siblingCount={0}
						/>
					</div>
				</div>

				<div className='w-full h-full bg-[var(--white)] shadow-lg rounded-3xl p-4'>
					{/* Контент для выбранного course_id: {searchParams.get('course_id')} */}
				</div>
			</div>
		</>
	)
}
export default ModerateCourses
