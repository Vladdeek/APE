import { Ban, ChevronsRight, GripVertical } from 'lucide-react'
import { useEffect, useRef, useState, useCallback, memo } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RadioButton } from '../components/Buttons'
import { SearchInput } from '../components/Inputs'
import BasicPagination from '../components/Pagination'
import { ACCESS } from '../../service/APIs/Access'

// Мемоизированный компонент для отображения соавтора (преподавателя)
const CoauthorComponent = memo(
	({
		id,
		name,
		onRemove,
		onAdd,
		dragged,
		Accessed,
		onDragStart,
		onDragEnd,
		isCreator,
	}) => {
		const ActionIcon = Accessed ? Ban : ChevronsRight
		const handleAction = () =>
			!isCreator && (Accessed ? onRemove?.(id) : onAdd?.(id))

		const containerClass = `${
			isCreator ? 'opacity-50 pointer-events-none' : ''
		} bg-[var(--white)] shadow-[var(--shadow)] rounded-lg text-[var(--black)]`

		return (
			<>
				{/* Desktop */}
				<div
					className={`${containerClass} max-xl:hidden flex items-center justify-between py-3 px-5`}
					draggable={!isCreator}
					onDragStart={!isCreator ? onDragStart : undefined}
					onDragEnd={!isCreator ? onDragEnd : undefined}
				>
					<p className='text-base font-medium'>
						{name}{' '}
						{isCreator && (
							<span className='text-[var(--middle)] ml-2 text-sm'>
								(создатель)
							</span>
						)}
					</p>
					<div className='flex items-center gap-4'>
						<GripVertical
							className={dragged === id ? 'cursor-grabbing' : 'cursor-grab'}
						/>
						<ActionIcon className='cursor-pointer' onClick={handleAction} />
					</div>
				</div>

				{/* Mobile */}
				<div
					className={`${containerClass} min-xl:hidden flex items-center justify-between p-4`}
					draggable={!isCreator}
					onDragStart={!isCreator ? onDragStart : undefined}
					onDragEnd={!isCreator ? onDragEnd : undefined}
				>
					<p className='text-xl'>
						{name}{' '}
						{isCreator && (
							<span className='text-[var(--middle)] block text-sm'>
								(создатель)
							</span>
						)}
					</p>
					<ActionIcon className='cursor-pointer' onClick={handleAction} />
				</div>
			</>
		)
	},
)

const AccessBlock = ({
	Accessed = false,
	mass,
	onAdd,
	onRemove,
	onDropGroup,
	onSearchChange,
	searchValue,
	loading = false,
	searchLoading = false,
	onChangeChapter,
	onChangePage,
	pagecounts,
	page,
}) => {
	const [dragged, setDragged] = useState(null)
	const [selectedChapter, setSelectedChapter] = useState(0)

	useEffect(() => {
		onChangeChapter?.(selectedChapter)
	}, [selectedChapter, onChangeChapter])

	const renderItem = (item, index) => (
		<motion.div
			key={item.id}
			initial={{ scale: 0.8, opacity: 0 }}
			animate={{ scale: 1, opacity: 1 }}
			transition={{ duration: 0.3, delay: index * 0.05 }}
		>
			<CoauthorComponent
				id={item.id}
				name={`${item.last_name} ${item.first_name} ${item.patronymic}`}
				onAdd={() => onAdd?.(item.id)}
				onRemove={() => onRemove?.(item.id)}
				dragged={dragged}
				Accessed={Accessed}
				onDragStart={e => {
					e.dataTransfer.setData('itemId', item.id)
					setDragged(item.id)
				}}
				onDragEnd={() => setDragged(null)}
				isCreator={item.is_creator}
			/>
		</motion.div>
	)

	return (
		<div
			className='w-full bg-[var(--white)] h-[72.5vh] rounded-xl shadow-[var(--shadow)] p-5 flex flex-col gap-5'
			onDrop={e => {
				e.preventDefault()
				const id = e.dataTransfer.getData('itemId')
				if (id) onDropGroup?.(id)
				setDragged(null)
			}}
			onDragOver={e => e.preventDefault()}
		>
			{/* Mobile Tabs */}
			<div className='flex gap-3 min-lg:hidden'>
				{['Без доступа', 'Соавторы'].map((t, i) => (
					<RadioButton
						key={i}
						value={i}
						title={t}
						style='solid'
						checked={selectedChapter === i}
						onChange={() => setSelectedChapter(i)}
						width='100%'
					/>
				))}
			</div>

			{/* Search */}
			{/* <SearchInput
				width='100%'
				height={48}
				onChange={onSearchChange}
				value={searchValue}
				loading={searchLoading}
			/> */}

			{/* Header */}
			<div className='max-xl:hidden bg-[var(--white)] shadow-[var(--shadow)] flex justify-between rounded-lg py-3 px-5'>
				<p className='text-[var(--black)] text-sm font-semibold'>
					ФИО преподавателя
				</p>
				<p className='text-[var(--black)] text-sm font-semibold w-20 text-center'>
					Действие
				</p>
			</div>

			{/* List Container */}
			{loading ? (
				<div className='w-full h-full flex justify-center items-center text-[var(--middle)]'>
					Загрузка...
				</div>
			) : (
				<div className='flex flex-col gap-3 overflow-y-scroll h-full hide-scrollbar p-2'>
					{mass?.length > 0 ? (
						mass.map(renderItem)
					) : (
						<p className='text-center text-[var(--middle)] mt-4'>Нет данных</p>
					)}
				</div>
			)}

			{/* <BasicPagination
				count={pagecounts || 1}
				onPageChange={onChangePage}
				page={page}
			/> */}
		</div>
	)
}

const AccessManagement = ({ onChange }) => {
	const { courseId } = useParams()

	const [selectedChapter, setSelectedChapter] = useState(0)

	const [linked, setLinked] = useState([])
	const [unlinked, setUnlinked] = useState([])

	const [searchLinked, setSearchLinked] = useState('')
	const [searchUnlinked, setSearchUnlinked] = useState('')

	const [loading, setLoading] = useState(null)
	const [linkedPage, setLinkedPage] = useState(1)
	const [unlinkedPage, setUnlinkedPage] = useState(1)

	const getUnlinkedMembers = async () => {
		try {
			const res = await ACCESS.getUnlinkedAuthors(courseId)
			res && setUnlinked(res.data)
		} catch (err) {
			console.log(err)
		}
	}
	const getLinkedMembers = async () => {
		try {
			const res = await ACCESS.getLinkedAuthors(courseId)
			res && setLinked(res.data)
		} catch (err) {
			console.log(err)
		}
	}

	useEffect(() => {
		getLinkedMembers()
		getUnlinkedMembers()
	}, [])

	const addUser = async user_id => {
		console.log('add: ', user_id)
		try {
			const res = await ACCESS.addUserToCourseMembers(courseId, user_id)
			if (res) {
				getLinkedMembers()
				getUnlinkedMembers()
			}
		} catch (err) {
			console.log(err)
		}
	}
	const removeUser = async user_id => {
		console.log('remove: ', user_id)
		try {
			const res = await ACCESS.removeUser(courseId, user_id)
			if (res) {
				getLinkedMembers()
				getUnlinkedMembers()
			}
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<>
			{/* Desktop View */}
			<div className='grid grid-cols-2 gap-5 max-lg:hidden'>
				<AccessBlock
					mass={unlinked}
					onAdd={data => addUser(data)}
					onDropGroup={data => removeUser(data)}
					onSearchChange={e => setSearchUnlinked(e.target.value)}
					searchValue={searchUnlinked}
					loading={loading === 0}
					onChangePage={setUnlinkedPage}
					pagecounts={unlinked?.pages}
					page={unlinkedPage}
				/>

				<AccessBlock
					mass={linked}
					Accessed
					onRemove={data => removeUser(data)}
					onDropGroup={data => addUser(data)}
					onSearchChange={e => setSearchLinked(e.target.value)}
					searchValue={searchLinked}
					loading={loading === 1}
					onChangePage={setLinkedPage}
					pagecounts={linked?.pages}
					page={linkedPage}
				/>
			</div>

			{/* Mobile View */}
			<div className='min-lg:hidden'>
				<AccessBlock
					mass={selectedChapter === 0 ? unlinked : linked}
					Accessed={selectedChapter === 1}
					onAdd={data => addUser(data)}
					onRemove={data => removeUser(data)}
					onSearchChange={e =>
						selectedChapter === 0
							? setSearchUnlinked(e.target.value)
							: setSearchLinked(e.target.value)
					}
					searchValue={selectedChapter === 0 ? searchUnlinked : searchLinked}
					loading={selectedChapter === 0 ? loading === 0 : loading === 1}
					onChangeChapter={setSelectedChapter}
					onChangePage={selectedChapter === 0 ? setUnlinkedPage : setLinkedPage}
					pagecounts={selectedChapter === 0 ? unlinked?.pages : linked?.pages}
					page={selectedChapter === 0 ? unlinkedPage : linkedPage}
				/>
			</div>
		</>
	)
}

export default AccessManagement
