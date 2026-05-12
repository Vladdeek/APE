import { useEffect, useState } from 'react'
import { GetModerationCourses } from '../../../service/APIs/Moderation'
import BasicPagination from '../../components/Pagination'

const ModerateCourses = () => {
	const [page, setPage] = useState(1)
	const [courses, setCourses] = useState([])
	useEffect(() => {
		const getModerateCourses = async () => {
			try {
				const res = await GetModerationCourses()
				setCourses(res)
			} catch (err) {}
		}
		getModerateCourses()
	}, [])

	return (
		<>
			<div className='grid grid-cols-[500px_1fr] h-screen gap-6 pt-30 pb-10 '>
				{/* Боковая панель (Sidebar) */}
				<div className='w-full h-full overflow-y-auto bg-[var(--white)] overflow-hidden shadow-lg rounded-3xl p-4'>
					<h2 className='text-xl font-bold mb-3 px-2 text-[var(--black)]'>
						Существующие пользователи
					</h2>
					<div className='w-full h-[95.75%] relative'>
						<div className='flex flex-col gap-3 overflow-y-auto'></div>

						<div className='absolute flex items-center justify-center w-full bottom-0'>
							<BasicPagination
								count={1}
								page={page}
								onPageChange={setPage}
								siblingCount={0}
							/>
						</div>
					</div>
				</div>

				{/* Основной контент */}
				<div className='w-full h-full bg-[var(--white)] shadow-lg rounded-3xl p-4'>
					<div className='flex items-center justify-center w-full h-full'>
						<p className='text-[var(--middle)] text-xl font-light'>
							Выберите курс для модерации
						</p>
					</div>
				</div>
			</div>
		</>
	)
}
export default ModerateCourses
