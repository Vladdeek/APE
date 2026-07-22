import React, { useEffect, useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { FileUploaderZone, RemoveButton } from './FileUploaderZone'

// Модалка полноэкранного просмотра
const FullScreenModal = ({ photos, index, close, setIndex }) => {
	if (index === null || !photos[index]) return null

	const next = () => setIndex((index + 1) % photos.length)
	const prev = () => setIndex((index - 1 + photos.length) % photos.length)

	// Получаем правильный URL изображения (поддержка объектов и строк)
	const getSrc = item => (typeof item === 'string' ? item : item?.file_path)

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
							className='absolute left-4 bg-white/10 hover:bg-white/20 p-4 rounded-full text-white transition-all z-10'
						>
							<ChevronLeft size={40} />
						</button>
						<button
							onClick={next}
							className='absolute right-4 bg-white/10 hover:bg-white/20 p-4 rounded-full text-white transition-all z-10'
						>
							<ChevronRight size={40} />
						</button>
					</>
				)}

				<img
					src={getSrc(photos[index])}
					className='max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl'
					alt=''
				/>
			</div>
		</div>
	)
}

export const PhotoBlock = ({
	data,
	isEdit,
	onChange,
	onDelete,
	sectionId,
	onDeleteFile,
}) => {
	const [uploading, setUploading] = useState(false)
	const [progress, setProgress] = useState(0)
	const [fullScreenIdx, setFullScreenIdx] = useState(null)
	const [photos, setPhotos] = useState([])

	useEffect(() => {
		if (data?.files) {
			setPhotos(data.files)
		} else {
			setPhotos([])
		}
	}, [data])

	const handleUpload = async file => {
		setUploading(true)
		setProgress(0)

		try {
			const mockInterval = setInterval(() => {
				setProgress(prev => (prev >= 100 ? 100 : prev + 15))
			}, 150)

			await new Promise(resolve => setTimeout(resolve, 1500))
			clearInterval(mockInterval)

			const newPhotoUrl = URL.createObjectURL(file)
			onChange([...photos, { file_path: newPhotoUrl }])
		} catch (error) {
			console.error('Ошибка загрузки фото:', error)
		} finally {
			setUploading(false)
			setProgress(0)
		}
	}

	// Определение колонок контейнера под фото
	const getContainerClass = (index, total) => {
		if (total === 1) return 'col-span-2'
		if (total === 3 && index === 2) return 'col-span-2'
		return 'col-span-1'
	}

	// Определение колонок для блока загрузки в зависимости от количества фото
	const getUploaderClass = total => {
		if (total === 0 || total === 2) return 'col-span-2'
		return 'col-span-1'
	}

	return (
		<div className='flex gap-4 w-full items-start'>
			{isEdit && <RemoveButton onDelete={onDelete} />}

			<div className='grid grid-cols-2 w-full gap-4 items-center'>
				{photos.map((item, idx) => {
					const photoSrc = typeof item === 'string' ? item : item.file_path

					return (
						<motion.div
							key={item.id || item.file_path || idx}
							layout
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							/* 
							   Контейнер задает размер в сетке и фиксирует max-высоту (h-[350px]), 
							   чтобы вертикальные 9x16 фото не растягивали сетку до бесконечности.
							*/
							className={`relative ${isEdit ? 'bg-[var(--middle)]/5 rounded-2xl' : 'bg-transparent'}   flex items-center justify-center h-[350px] w-full group ${getContainerClass(
								idx,
								photos.length,
							)}`}
						>
							{/* Картинка с h-full, max-w-full и object-contain — без единого обреза */}
							<img
								src={photoSrc}
								onClick={() => !isEdit && setFullScreenIdx(idx)}
								className={`h-full max-w-full object-contain ${!isEdit && 'rounded-2xl'} transition-transform duration-300 group-hover:scale-[1.02] cursor-pointer`}
								alt=''
							/>

							{isEdit && (
								<button
									onClick={() => onDeleteFile?.('image', item.id)}
									className='absolute top-3 right-3 p-2 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg opacity-0 group-hover:opacity-100 z-10'
								>
									<X size={16} strokeWidth={3} />
								</button>
							)}
						</motion.div>
					)
				})}

				{isEdit && photos.length < 4 && (
					<motion.div
						layout
						className={`h-[350px] ${getUploaderClass(photos.length)}`}
					>
						<FileUploaderZone
							sectionId={sectionId}
							type='image'
							onFilesSelected={handleUpload}
							isUploading={uploading}
							uploadProgress={progress}
							onChange={onChange}
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
