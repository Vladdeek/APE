import { ImageOff, RussianRuble } from 'lucide-react'
import { data } from 'react-router-dom'

const CourseCard = ({ data }) => {
	// Функция для красивого форматирования дат
	const formatDate = dateStr => {
		return new Date(dateStr).toLocaleDateString('ru-RU', {
			day: 'numeric',
			month: 'long',
		})
	}

	return (
		<div className='flex flex-col bg-[var(--white)] h-full w-full p-3 rounded-4xl shadow-lg cursor-pointer transition-all hover:scale-[101.5%] hover:shadow-md'>
			<img
				className='rounded-3xl aspect-[16/9] object-cover w-full'
				src={data.preview_url}
				alt={data.name}
			/>
			<div className='flex flex-col h-full p-3 mt-3 gap-3'>
				{/* Секция Тега и Заголовка */}
				<div className='flex flex-col gap-3'>
					<p className='text-2xl font-medium' title={data.name}>
						{data.name}
					</p>
					{/* Рендерим тег, если он пришел с бэка */}
					{data.tag && (
						<p className='flex items-center text-sm font-normal border border-[var(--hero)] w-fit px-4 py-1 rounded-full text-[var(--hero)] opacity-80 group-hover:opacity-100 transition-opacity'>
							{data.tag}
						</p>
					)}
					<p
						className='text-sm font-normal text-[var(--middle)] line-clamp-2'
						title={data.description}
					>
						{data.description}
					</p>
				</div>

				{/* Характеристики курса */}
				<div className='grid grid-cols-2 gap-y-3 text-sm border-y border-[var(--light-middle)] py-4'>
					<div className='flex flex-col'>
						<span className='text-[var(--middle)]'>Формат</span>
						<span className='font-medium'>{data.format_name}</span>
					</div>
					<div className='flex flex-col'>
						<span className='text-[var(--middle)]'>Сертификат</span>
						<span
							className='font-medium truncate'
							title={data.certificate_type_name}
						>
							{data.certificate_type_name}
						</span>
					</div>
					<div className='flex flex-col'>
						<span className='text-[var(--middle)]'>Старт курса</span>
						<span className='font-medium'>{formatDate(data.start_date)}</span>
					</div>
					<div className='flex flex-col'>
						<span className='text-[var(--middle)] text-orange-500'>
							Регистрация до
						</span>
						<span className='font-medium text-orange-600'>
							{formatDate(data.registration_end)}
						</span>
					</div>
				</div>

				{/* Цена и Автор */}
				<div className='flex justify-between items-end mt-2'>
					<div className='flex gap-3 items-center'>
						{data.creator?.avatar_url ? (
							<img
								className='rounded-xl aspect-square object-cover w-12 bg-gray-100'
								src={data.creator?.avatar_url}
								alt='author'
							/>
						) : (
							<ImageOff className='rounded-xl aspect-square object-cover w-12 h-auto p-3 text-[var(--middle)] bg-gray-100' />
						)}

						<div className='flex flex-col'>
							<p className='text-md font-medium leading-tight'>
								{`${data?.creator?.first_name} ${data?.creator?.last_name[0]}. ${data?.creator?.patronymic[0]}.`}
							</p>
							<p className='text-xs font-normal text-[var(--middle)]'>
								Автор курса
							</p>
						</div>
					</div>

					<div className='text-right'>
						<p className='text-2xl flex gap-1 items-center font-medium text-[var(--hero)]'>
							{data.is_free ? 'Бесплатно' : `${data.price.toLocaleString()}`}
							<RussianRuble size={18} strokeWidth={3} />
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
export default CourseCard
