import {
	ChevronUp,
	Package,
	BookMarked,
	NotebookPen,
	LaptopMinimalCheck,
} from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Компонент Модуля
const Module = ({ title, index, isExpanded, onToggle, children }) => {
	return (
		<div className='flex flex-col gap-2 mb-4'>
			<div className='flex items-center justify-between bg-[var(--white)] rounded-xl shadow-[var(--shadow)] p-3 border border-gray-100'>
				<div className='flex items-center gap-3 text-[var(--black)]'>
					<Package size={20} className='text-[var(--middle)]' />
					<div>
						<p className='text-xs text-[var(--middle)]'>Модуль {index}</p>
						<h3 className='font-semibold text-sm leading-tight text-[var(--black)]'>
							{title}
						</h3>
					</div>
				</div>

				<button
					onClick={onToggle}
					className='p-1.5 hover:bg-gray-100 rounded-lg cursor-pointer transition-all'
				>
					<ChevronUp
						className={`${!isExpanded ? 'rotate-180' : ''} transition-all`}
						size={18}
					/>
				</button>
			</div>

			{/* Отрисовка внутреннего контента (секций) */}
			{isExpanded && (
				<div className='flex flex-col gap-2 pl-4 transition-all'>
					{children}
				</div>
			)}
		</div>
	)
}

// Компонент Контента (Лекция/Практика/Тест)
const Content = ({ type, title, isSelected, onClick }) => {
	const icons = {
		lecture: <BookMarked size={18} />,
		practice: <NotebookPen size={18} />,
		test: <LaptopMinimalCheck size={18} />,
	}

	const labels = {
		lecture: 'Лекция',
		practice: 'Практика',
		test: 'Тест',
	}

	return (
		<div
			onClick={onClick}
			className={`flex flex-col gap-1 w-full p-3 rounded-xl transition-all shadow-sm border 
                ${
									isSelected
										? 'border-[var(--hero)] bg-[var(--transparent-hero)]'
										: 'border-transparent bg-white hover:bg-gray-50 cursor-pointer'
								}`}
		>
			<div className='flex items-center gap-2'>
				<span
					className={isSelected ? 'text-[var(--hero)]' : 'text-[var(--middle)]'}
				>
					{icons[type]}
				</span>
				<div className='flex flex-col'>
					<span className='text-[10px] uppercase tracking-wider text-[var(--middle)] font-bold'>
						{labels[type]}
					</span>
					<p className='font-medium text-sm text-[var(--black)]'>{title}</p>
				</div>
			</div>
		</div>
	)
}

const CoursePage = () => {
	const [activeSectionId, setActiveSectionId] = useState('sec-1')
	const [modules, setModules] = useState([
		{
			id: 'mod-1',
			title: 'Основы React',
			isExpanded: true,
			sections: [
				{ id: 'sec-1', title: 'Введение в JSX', type: 'lecture' },
				{ id: 'sec-2', title: 'Props и State', type: 'practice' },
			],
		},
		{
			id: 'mod-2',
			title: 'Hooks & API',
			isExpanded: false,
			sections: [
				{ id: 'sec-3', title: 'useEffect Deep Dive', type: 'lecture' },
				{ id: 'sec-4', title: 'Итоговый тест', type: 'test' },
			],
		},
	])

	const toggleModule = id => {
		setModules(prev =>
			prev.map(m => (m.id === id ? { ...m, isExpanded: !m.isExpanded } : m)),
		)
	}

	return (
		<div className='grid grid-cols-[350px_1fr] h-screen gap-6 pt-30 pb-10 '>
			{/* Боковая панель (Sidebar) */}
			<div className='w-full h-full overflow-y-auto bg-white shadow-lg rounded-2xl p-4'>
				<h2 className='text-xl font-bold mb-6 px-2'>Содержание курса</h2>
				{modules.map((module, idx) => (
					<Module
						key={module.id}
						title={module.title}
						index={idx + 1}
						isExpanded={module.isExpanded}
						onToggle={() => toggleModule(module.id)}
					>
						{module.sections.map((section, index) => (
							<motion.div
								key={index}
								initial={{ scale: 0.8, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{
									duration: 0.3,
									delay: index * 0.1,
									ease: 'easeOut',
								}}
							>
								<Content
									key={section.id}
									title={section.title}
									type={section.type}
									isSelected={activeSectionId === section.id}
									onClick={() => setActiveSectionId(section.id)}
								/>
							</motion.div>
						))}
					</Module>
				))}
			</div>

			{/* Основной контент */}
			<div className='w-full h-full bg-white shadow-lg rounded-2xl p-8 flex items-center justify-center border border-gray-100'></div>
		</div>
	)
}

export default CoursePage
