import React, { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileUploaderZone } from './FileUploaderZone'

// Модалка просмотра (без изменений по логике)
const FullScreenModal = ({ photos, index, close, setIndex }) => {
	if (index === null) return null
	const next = () => setIndex((index + 1) % photos.length)
	const prev = () => setIndex((index - 1 + photos.length) % photos.length)

	return (
		<div className='fixed inset-0 bg-black/80 backdrop-blur-md z-[1000] flex items-center justify-center p-4'>
			<button
				onClick={close}
				className='absolute top-5 right-5 z-[1001] bg-white/20 hover:bg-red-500 text-white p-2 rounded-full transition-all'
			>
				<X size={24} />
			</button>
			<div className='relative max-w-7xl w-full h-full flex items-center justify-center'>
				{photos.length > 1 && (
					<>
						<button
							onClick={prev}
							className='absolute left-4 bg-white/10 hover:bg-white/20 p-4 rounded-full text-white transition-all'
						>
							<ChevronLeft size={40} />
						</button>
						<button
							onClick={next}
							className='absolute right-4 bg-white/10 hover:bg-white/20 p-4 rounded-full text-white transition-all'
						>
							<ChevronRight size={40} />
						</button>
					</>
				)}
				<img
					src={photos[index]}
					className='max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl'
					alt=''
				/>
			</div>
		</div>
	)
}

export const PhotoBlock = ({ data = [], isEdit, onChange, onDelete }) => {
	const [uploading, setUploading] = useState(false)
	const [progress, setProgress] = useState(0)
	const [fullScreenIdx, setFullScreenIdx] = useState(null)

	// Приводим данные к массиву строк (URL)
	const photos = Array.isArray(data) ? data : []

	const handleUpload = async file => {
		setUploading(true)
		setProgress(0)

		try {
			// Имитация загрузки (потом заменишь на свой S3 сервис)
			const mockInterval = setInterval(() => {
				setProgress(prev => (prev >= 100 ? 100 : prev + 15))
			}, 150)

			await new Promise(resolve => setTimeout(resolve, 1500))
			clearInterval(mockInterval)

			const newPhotoUrl = URL.createObjectURL(file) // Временно, пока нет S3
			onChange([...photos, newPhotoUrl])
		} catch (error) {
			console.error('Ошибка загрузки фото:', error)
		} finally {
			setUploading(false)
			setProgress(0)
		}
	}

	const removePhoto = index => {
		const newPhotos = photos.filter((_, i) => i !== index)
		onChange(newPhotos)
	}

	// Твоя логика размеров сетки
	const getGridClass = index => {
		if (photos.length === 1) return 'col-span-2 aspect-[32/9]'
		if (photos.length === 3 && index === 2) return 'col-span-2 aspect-video'
		return 'col-span-1 aspect-video'
	}

	return (
		<div className='flex gap-4 w-full items-start outline outline-red-500'>
			{isEdit && (
				<button
					onClick={onDelete}
					className='self-start p-2 bg-white shadow-md rounded-xl hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer border border-gray-100'
				>
					<X size={20} />
				</button>
			)}

			<div className='grid grid-cols-2 w-full gap-4'>
				{photos.map((url, idx) => (
					<motion.div
						key={url}
						layout
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.8 }}
						className={`relative rounded-2xl overflow-hidden shadow-sm group ${getGridClass(idx)}`}
					>
						<img
							src={url}
							onClick={() => !isEdit && setFullScreenIdx(idx)}
							className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer'
							alt=''
						/>
						{isEdit && (
							<button
								onClick={() => removePhoto(idx)}
								className=' p-2 bg-white/90 backdrop-blur-md rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg opacity-0 group-hover:opacity-100'
							>
								<X size={16} strokeWidth={3} />
							</button>
						)}
					</motion.div>
				))}

				{isEdit && photos.length < 4 && (
					<motion.div
						layout
						className={` ${
							photos.length === 0
								? 'col-span-2'
								: photos.length === 2
									? 'col-span-2' // Чтобы загрузчик на 3-м месте не ломал ряд
									: 'col-span-1'
						}`}
					>
						<FileUploaderZone
							type='image'
							onFilesSelected={handleUpload}
							isUploading={uploading}
							uploadProgress={progress}
						/>
					</motion.div>
				)}
			</div>

			{fullScreenIdx !== null && (
				<FullScreenModal
					photos={photos}
					index={fullScreenIdx}
					setIndex={setFullScreenIdx}
					close={() => setFullScreenIdx(null)}
				/>
			)}
		</div>
	)
}
