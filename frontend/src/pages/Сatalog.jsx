import CourseCard from '../components/Cards'
import { motion, AnimatePresence } from 'framer-motion'
import { Blocks, X } from 'lucide-react'
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
import { GetAllCourses } from '../../service/APIs/Couses'

const CreateModal = ({ onClose }) => {
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
	const [certificate, setCertificate] = useState([
		{ id: 1, name: 'Сертификат программиста' },
		{ id: 2, name: 'Сертификат дизайнера' },
		{ id: 3, name: 'Сертификат пидора' },
	])
	const [selectedCertificate, setSelectedCertificate] = useState(null)
	const [format, setFormat] = useState([
		{ id: 1, name: 'Очка' },
		{ id: 2, name: 'ЗаОчка' },
		{ id: 3, name: 'ОчкаЗаОчка' },
		{ id: 4, name: 'Дистант' },
	])
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

	console.log(isFree)

	useEffect(() => {
		const getTags = async () => {
			try {
				const res = await GetTags()
				setCategories(res)
			} catch (err) {}
		}
		getTags()
	}, [])

	const addTag = async name => {
		try {
			const res = await AddTag(name)
		} catch (err) {}
	}

	return (
		<div className='fixed inset-0 flex items-center justify-center backdrop-blur-xs z-1000'>
			<motion.div
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{
					duration: 0.125,
					ease: 'easeOut',
				}}
			>
				<div className='bg-[var(--white)] relative p-5 rounded-4xl shadow-[0_2px_8px_rgba(0,0,0,0.125)] h-fit overflow-visible hide-scrollbar  z-1001'>
					<X
						onClick={onClose}
						size={36}
						strokeWidth={1.5}
						className='absolute top-3 right-3 text-[var(--middle)] cursor-pointer hover:text-red-100  hover:bg-red-500 hover:rounded-full hover:p-0.5  transition-all'
					/>
					<h2 className='text-2xl font-medium text-[var(--black)] mb-5 text-center'>
						Создание курса
					</h2>

					<form className='w-[600px] max-md:w-[80vw] inline-flex flex-col items-center gap-5'>
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
			</motion.div>
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

const Catalog = ({}) => {
	const [isOpen, setIsOpen] = useState(false)
	const [courses, setCourses] = useState(null)
	const [role, setRole] = useState('')

	useEffect(() => {
		const getAllCourses = async () => {
			try {
				const res = await GetAllCourses()
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

	return (
		<>
			{isOpen && <CreateModal onClose={() => setIsOpen(false)} />}

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
						<CourseCard data={course} />
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
							onClick={() => setIsOpen(true)}
							title='Создать новый курс'
						/>
					</motion.div>
				)}
			</div>
		</>
	)
}

export default Catalog
