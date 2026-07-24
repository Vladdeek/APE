import { useLocation, useNavigate } from 'react-router-dom'
import { GradientButton } from '../components/Buttons'
import { InputDefault } from '../components/Inputs'
import { useState } from 'react'
import { Login } from '../../service/APIs/Authorization'
import { executeWithAuthCheck } from '../../service/utils/apiHelper'

const AuthForm = ({ linkClick }) => {
	const location = useLocation()
	const navigate = useNavigate()

	const [rememberMe, setRememberMe] = useState(false)

	const [formData, setFormData] = useState({
		email: '',
		password: '',
	})
	const handleChange = e => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const isValidEmailStructure = email => {
		const trimmed = email.trim()
		return trimmed.length > 5 && trimmed.includes('@') && trimmed.includes('.')
	}

	const validateAuthForm = formData => {
		return (
			isValidEmailStructure(formData.email) &&
			formData.password.trim().length >= 6
		)
	}

	const isAuthFormValid = validateAuthForm(formData)

	const handleSubmitLogin = async e => {
		e.preventDefault()

		if (formData.email.trim().endsWith('.ru')) {
			try {
				await executeWithAuthCheck(() =>
					Login(formData.email, formData.password),
				)

				navigate('/')
			} catch (err) {
				console.log('LOGIN ERROR:', err)
				// Здесь можно вывести ошибку пользователю в UI
			}
		} else {
			toast.error('Пожалуйста, используйте почту, заканчивающуюся на .ru')
		}
	}

	return (
		<form
			onSubmit={handleSubmitLogin}
			className='bg-[var(--white)] rounded-4xl w-full h-full flex flex-col gap-5 lg:pt-[33%] p-10'
		>
			<h2 className='font-bold text-4xl text-[var(--text-primary)] mb-5'>
				Войти в систему
			</h2>

			<InputDefault
				title='Почта'
				name='email'
				placeholder='Введите почту...'
				value={formData.email}
				onChange={handleChange}
			/>

			<InputDefault
				title='Пароль'
				name='password'
				type='password'
				placeholder='Введите пароль...'
				value={formData.password}
				onChange={handleChange}
			/>

			{/* <div className='flex justify-between items-center'>
				<Checkbox
					title='Запомнить меня'
					checked={rememberMe}
					onChange={() => setRememberMe(!rememberMe)}
				/>
				<Link onClick={linkClick} text='Не могу войти / Не помню пароль' />
			</div> */}
			<input
				disabled={!isAuthFormValid}
				type='submit'
				value={'Войти'}
				className={`p-3 rounded-2xl w-full ${!isAuthFormValid ? 'bg-[var(--light-middle)] text-[var(--middle)]' : 'bg-gradient-to-r from-[var(--hero)] to-[var(--darkness-hero)] '}  transition-all text-white hover:opacity-90`}
			/>

			{/* <div className='flex items-center justify-between gap-3 my-3'>
				<div className='bg-[var(--middle)] h-[1px] w-full'></div>
				<p className='text-[var(--middle)]'>или</p>
				<div className='bg-[var(--middle)] h-[1px] w-full'></div>
			</div> */}
		</form>
	)
}

const AlternativeAuthorization = () => {
	return (
		<div className='px-[2.5%] xl:px-[10%] 2xl:px-[18%] py-5 w-full h-screen grid lg:grid-cols-2 gap-5 max-lg:pb-[15%]'>
			<div className='col-span-1 w-full h-full flex flex-col justify-between'>
				<div className='flex gap-2 items-center'>
					<img className={'w-15 h-15'} src='./logo.png' alt='' />
					<p
						className={`flex flex-col text-[var(--text-primary)] text-4xl font-bold `}
					>
						<span>МелГУ.ДПО</span>
						{/* <span className='uppercase'>Университет</span> */}
					</p>
				</div>
				<img
					className='h-full object-contain aspect-square max-lg:hidden'
					src='/image.png'
					alt=''
				/>
			</div>
			<div className='col-span-1 w-full h-full'>
				<AuthForm />
			</div>
		</div>
	)
}
export default AlternativeAuthorization
