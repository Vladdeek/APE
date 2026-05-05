import { data } from 'react-router-dom'

const CourseCard = ({ data }) => {
	return (
		<div className='flex flex-col bg-[var(--white)] h-fit w-full p-3 rounded-4xl shadow-lg cursor-pointer transition-all hover:scale-[101.5%] hover:shadow-md'>
			<img
				className='rounded-3xl aspect-[16/9] object-cover w-full'
				src={data.image_url}
				alt=''
			/>
			<div className='flex flex-col gap-6 p-3 mt-3'>
				<p className='flex items-center text-md font-normal border-1 w-fit px-5 pt-2 pb-1 rounded-full text-[var(--hero)]'>
					{data.tag}
				</p>
				<p
					title={data.title}
					className='text-2xl font-medium line-clamp-2 h-15'
				>
					{data.title}
				</p>
				<p
					title={data.description}
					className='text-sm font-normal text-[var(--middle)] line-clamp-3 h-15'
				>
					{data.description}
				</p>
				<div className='bg-[var(--light-middle)] h-[2px] rounded-full w-full'></div>
				<div className='flex gap-3 items-center'>
					<img
						className='rounded-xl aspect-[1/1] object-cover w-12'
						src={data.author.image_url}
						alt=''
					/>
					<div className='flex flex-col'>
						<p className='text-md font-medium'>{data.author.name}</p>
						<p className='text-sm font-normal text-[var(--middle)]'>
							{data.create_date}
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
export default CourseCard
