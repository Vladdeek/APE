import { useState, useEffect } from 'react'
import { X, Copy, Trash } from 'lucide-react'
import { CodeBlock, github, a11yDark } from 'react-code-blocks'
import { FileUploaderZone, RemoveButton } from './FileUploaderZone'
import { languageMap } from '../../../service/data/lanaguagesMap'

export const CodeUploader = ({
	isEdit = true,
	value = null, // { code: string, language: string }
	onChange,
	onDeleteComponent,
	isUploading = false,
	uploadProgress = 0,
	data,
}) => {
	const [codeData, setCodeData] = useState(data)
	const [copied, setCopied] = useState(false)

	const themeAttr = document.documentElement.getAttribute('data-theme')
	const themes = { light: github, dark: a11yDark }

	const getLanguage = filename => {
		const ext = filename.split('.').pop().toLowerCase()
		return languageMap[ext] || ext
	}

	const handleCopy = async () => {
		if (!codeData?.code) return
		await navigator.clipboard.writeText(codeData.code)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	// ТУТ ИСПРАВЛЕНО: Принимаем массив файлов от зоны загрузки
	const handleFilesSelected = files => {
		if (!files || files.length === 0) return

		console.log('1')

		// Так как это загрузчик ОДНОГО блока кода, берём самый первый файл из массива
		const file = files[0]

		const reader = new FileReader()
		reader.onload = e => {
			const result = {
				code: e.target.result,
				language: getLanguage(file.name),
				fileName: file.name,
			}
			console.log('2')
			setCodeData(result)
			onChange?.(result)
		}
		reader.readAsText(file)
	}

	if (!isEdit && !codeData) return null

	return (
		<div className='flex gap-4 w-full my-4'>
			{isEdit && <RemoveButton onDelete={onDeleteComponent} />}

			<div className='flex-1'>
				{codeData ? (
					/* Блок отображения кода */
					<div className='relative bg-[var(--white)] rounded-xl shadow-[var(--shadow)] overflow-hidden border border-[var(--light-middle)]'>
						<div className='flex justify-between items-center bg-[var(--white)] pr-2 pl-3 py-2 border-b border-[var(--light-middle)]'>
							<div className='flex items-center gap-3'>
								<div className='flex gap-1.5'>
									<div className='h-2.5 w-2.5 rounded-full bg-red-400' />
									<div className='h-2.5 w-2.5 rounded-full bg-yellow-400' />
									<div className='h-2.5 w-2.5 rounded-full bg-green-400' />
								</div>
								<span className='text-[var(--middle)] text-xs uppercase font-bold tracking-wider'>
									{codeData.language}
								</span>
							</div>

							<div className='flex gap-2'>
								<button
									onClick={handleCopy}
									className='flex items-center gap-2 px-3 py-1.5 bg-[var(--light-gray)] text-[var(--middle)] rounded-md text-sm hover:brightness-95 transition-all'
								>
									<Copy size={14} /> <span>{copied ? 'Готово!' : 'Копия'}</span>
								</button>

								{isEdit && (
									<button
										onClick={() => {
											setCodeData(null)
											onChange?.(null) // ТУТ ИСПРАВЛЕНО: вызываем onChange вместо onFileChange
										}}
										className='flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-500 rounded-md text-sm hover:bg-red-500 hover:text-white transition-all'
									>
										<Trash size={14} />
									</button>
								)}
							</div>
						</div>

						<div className='p-0 overflow-x-auto max-h-[34rem] text-sm'>
							<CodeBlock
								text={codeData.code}
								language={codeData.language}
								showLineNumbers={true}
								theme={themes[themeAttr] || themes.light}
								customStyle={{ background: 'transparent', padding: '1rem' }}
							/>
						</div>
					</div>
				) : (
					/* Используем твой существующий компонент */
					isEdit && (
						<FileUploaderZone
							type='code'
							onFilesSelected={handleFilesSelected} // Передаем исправленный обработчик
							isUploading={isUploading}
							uploadProgress={uploadProgress}
						/>
					)
				)}
			</div>
		</div>
	)
}
