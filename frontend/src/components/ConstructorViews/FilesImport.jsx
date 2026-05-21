import {
	FileArchive,
	FileCode,
	FileImage,
	FileMusic,
	FilePlay,
	FileQuestionMark,
	FileSpreadsheet,
	FileText,
	Trash2,
	Download,
} from 'lucide-react'
import { FileUploaderZone, RemoveButton } from './FileUploaderZone' // Путь к вашему новому компоненту

/**
 * @param {Array} files - Список объектов { name, size, type, file_path }
 * @param {Boolean} isEdit - Режим редактирования или только просмотр
 * @param {Function} onUpload - Колбэк для загрузки (принимает File)
 * @param {Function} onDelete - Колбэк для удаления (принимает index или path)
 * @param {Function} onDownload - Колбэк для скачивания (принимает file объект)
 * @param {Boolean} isUploading - Состояние загрузки из родителя
 * @param {Number} progress - Процент загрузки из родителя
 */
export const FileManager = ({
	files = [],
	isEdit = false,
	onUpload,
	onDelete,
	onDownload,
	sectionId,
	isUploading = false,
	progress = 0,
}) => {
	const formatFileSize = bytes => {
		if (!bytes || bytes === 0) return '0 Bytes'
		const k = 1024
		const sizes = ['Bytes', 'KB', 'MB', 'GB']
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
	}

	const getFileIcon = (fileName, fileType) => {
		const extension =
			fileName?.split('.').pop().toLowerCase() || fileType?.split('/').pop()

		const formatMap = {
			image: {
				formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
				icon: (
					<FileImage
						size={24}
						className='text-[var(--black)]'
						strokeWidth={1.75}
					/>
				),
			},
			document: {
				formats: ['pdf', 'doc', 'docx', 'txt', 'rtf'],
				icon: (
					<FileText
						size={24}
						className='text-[var(--black)]'
						strokeWidth={1.75}
					/>
				),
			},
			spreadsheet: {
				formats: ['xls', 'xlsx', 'csv'],
				icon: (
					<FileSpreadsheet
						size={24}
						className='text-[var(--black)]'
						strokeWidth={1.75}
					/>
				),
			},
			archive: {
				formats: ['zip', 'rar', '7z', 'tar'],
				icon: (
					<FileArchive
						size={24}
						className='text-[var(--black)]'
						strokeWidth={1.75}
					/>
				),
			},
			video: {
				formats: ['mp4', 'avi', 'mov', 'webm'],
				icon: (
					<FilePlay
						size={24}
						className='text-[var(--black)]'
						strokeWidth={1.75}
					/>
				),
			},
			audio: {
				formats: ['mp3', 'wav', 'flac', 'm4a'],
				icon: (
					<FileMusic
						size={24}
						className='text-[var(--black)]'
						strokeWidth={1.75}
					/>
				),
			},
			code: {
				formats: ['js', 'ts', 'py', 'html', 'css', 'json', 'php'],
				icon: (
					<FileCode
						size={24}
						className='text-[var(--black)]'
						strokeWidth={1.75}
					/>
				),
			},
		}

		for (const category in formatMap) {
			if (formatMap[category].formats.includes(extension)) {
				return formatMap[category].icon
			}
		}
		return (
			<FileQuestionMark
				size={24}
				className='text-[var(--black)]'
				strokeWidth={1.75}
			/>
		)
	}

	return (
		<div className='flex flex w-full gap-4'>
			{isEdit && <RemoveButton onDelete={() => console.log('2')} />}
			{/* Список файлов */}
			{files.length > 0 && (
				<div className='w-full flex flex-col border border-[var(--light-middle)] rounded-xl overflow-hidden shadow-[var(--shadow)]'>
					{files.map((file, index) => (
						<div
							key={index}
							className={`flex items-center justify-between p-3 border-b last:border-0 ${
								index % 2 === 0 ? 'bg-[var(--white)]' : 'bg-[var(--light-gray)]'
							}`}
						>
							<div className='flex items-center gap-3 overflow-hidden'>
								{getFileIcon(file.name, file.type)}
								<div className='overflow-hidden'>
									<p className='text-sm font-medium truncate text-[var(--black)] max-w-[200px] md:max-w-md'>
										{file.name}
									</p>
									<p className='text-xs text-[var(--middle)]'>
										{formatFileSize(file.size)}
									</p>
								</div>
							</div>

							<div className='flex items-center gap-2'>
								{/* Кнопка скачивания доступна всегда */}
								<button
									onClick={() => onDownload?.(file)}
									className='p-2 hover:bg-[var(--green-status-bg)] hover:text-[var(--green-status-text)] rounded-lg transition-all text-[var(--black)]'
									title='Скачать'
								>
									<Download size={20} />
								</button>

								{/* Кнопка удаления только в режиме редактирования */}
								{isEdit && (
									<button
										onClick={() => onDelete?.(index, file)}
										className='p-2 hover:bg-red-500 hover:text-white rounded-lg transition-all text-[var(--black)]'
										title='Удалить'
									>
										<Trash2 size={20} />
									</button>
								)}
							</div>
						</div>
					))}
				</div>
			)}

			{/* Зона загрузки только в режиме редактирования */}
			{isEdit && (
				<div className='w-full'>
					<FileUploaderZone
						sectionId={sectionId}
						type='files'
						onFilesSelected={selectedFiles => {
							// Если FileUploaderZone возвращает массив, берем первый или итерируем
							if (selectedFiles.length > 0) {
								onUpload?.(selectedFiles[0])
							}
						}}
						isUploading={isUploading}
						uploadProgress={progress}
					/>
				</div>
			)}
		</div>
	)
}
