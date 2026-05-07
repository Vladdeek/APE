import { X } from 'lucide-react'
import { useState } from 'react'
import { FileUploaderZone, RemoveButton } from './FileUploaderZone'
import VideoPlayer from '../VideoPlayer'

export const VideoImport = ({
	onStatusChange,
	DelComponent,
	onChange,
	value, // Текущий URL видео (строка)
}) => {
	const [uploading, setUploading] = useState(false)
	const [progress, setProgress] = useState(0)

	const handleUpload = async file => {
		setUploading(true)
		setProgress(0)

		try {
			// --- ЛОГИКА БУДУЩЕГО БЭКЕНДА ---
			// Пример того, как это будет выглядеть:
			// const uploadedUrl = await s3Service.upload(file, (p) => setProgress(p))

			// Имитация загрузки для теста:
			const mockInterval = setInterval(() => {
				setProgress(prev => {
					if (prev >= 100) {
						clearInterval(mockInterval)
						return 100
					}
					return prev + 10
				})
			}, 200)

			// Ждем завершения "загрузки"
			await new Promise(resolve => setTimeout(resolve, 2500))

			const mockUrl = 'https://sample-videos.com/video123.mp4'

			onChange?.(mockUrl) // Передаем URL в родительский компонент/стейт
			onStatusChange?.(true)
		} catch (error) {
			console.error('Ошибка при загрузке видео:', error)
			// Здесь можно добавить уведомление об ошибке
		} finally {
			setUploading(false)
			// Не обнуляем прогресс мгновенно, чтобы пользователь увидел 100%
			setTimeout(() => setProgress(0), 1000)
		}
	}

	const handleRemove = async () => {
		// Если нужно удалять файл с сервера при очистке:
		// if (value) await s3Service.delete(value)

		onChange?.('')
		onStatusChange?.(false)
	}

	return (
		<div className='flex gap-4 w-full items-start'>
			{/* Кнопка удаления всего компонента из списка конструктора */}
			<RemoveButton onDelete={DelComponent} />

			<div className='flex justify-center w-full min-h-[350px]'>
				{value ? (
					// Если видео уже загружено — показываем плеер
					<div className='relative w-full group'>
						<VideoPlayer url={value} />

						{/* Кнопка "Удалить видео и загрузить заново" */}
						<button
							type='button'
							onClick={handleRemove}
							className='absolute top-3 right-3 z-10 bg-white/90 backdrop-blur text-black p-2 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-xl opacity-0 group-hover:opacity-100'
							title='Удалить видео'
						>
							<X size={18} strokeWidth={3} />
						</button>
					</div>
				) : (
					// Если видео нет — показываем зону загрузки
					<FileUploaderZone
						type='video'
						onFilesSelected={handleUpload}
						isUploading={uploading}
						uploadProgress={progress}
					/>
				)}
			</div>
		</div>
	)
}
