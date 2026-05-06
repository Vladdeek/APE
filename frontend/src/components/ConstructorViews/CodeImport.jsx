import { useState, useEffect } from 'react'
import { X, Copy, Trash } from 'lucide-react'
import { CodeBlock, github, a11yDark } from 'react-code-blocks'
import { FileUploaderZone } from './FileUploaderZone' // Импортируем твой готовый компонент

export const CodeUploader = ({
	isEdit = true,
	value = null, // { code: string, language: string }
	onFileChange,
	onDeleteComponent,
	isUploading = false,
	uploadProgress = 0,
}) => {
	const [codeData, setCodeData] = useState(value)
	const [copied, setCopied] = useState(false)

	const themeAttr = document.documentElement.getAttribute('data-theme')
	const themes = { light: github, dark: a11yDark }

	useEffect(() => {
		setCodeData(value)
	}, [value])

	const getLanguage = filename => {
		const ext = filename.split('.').pop().toLowerCase()
		const map = {
			js: 'javascript',
			ts: 'typescript',
			py: 'python',
			cpp: 'cpp',
			cs: 'csharp',
			rb: 'ruby',
			rs: 'rust',
		}
		return map[ext] || ext
	}

	const handleCopy = async () => {
		if (!codeData?.code) return
		await navigator.clipboard.writeText(codeData.code)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	const handleFileSelected = file => {
		const reader = new FileReader()
		reader.onload = e => {
			const result = {
				code: e.target.result,
				language: getLanguage(file.name),
				fileName: file.name,
			}
			setCodeData(result)
			onFileChange?.(result)
		}
		reader.readAsText(file)
	}

	if (!isEdit && !codeData) return null

	return (
		<div className='flex gap-2 w-full my-4'>
			{isEdit && onDeleteComponent && (
				<button
					onClick={onDeleteComponent}
					className='self-start bg-[var(--white)] shadow-[var(--shadow)] p-1.5 rounded-lg hover:text-red-500 transition-all cursor-pointer'
				>
					<X size={20} />
				</button>
			)}

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
											onFileChange?.(null)
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
							type='code' // Убедись, что в FileUploaderZone есть этот тип
							onFilesSelected={handleFileSelected}
							isUploading={isUploading}
							uploadProgress={uploadProgress}
						/>
					)
				)}
			</div>
		</div>
	)
}
