import { useLocation, useNavigate } from 'react-router-dom'
import { GradientButton } from '../components/Buttons'
import { InputDefault } from '../components/Inputs'
import { useState } from 'react'
import { Login } from '../../service/APIs/Authorization'
import { executeWithAuthCheck } from '../../service/utils/apiHelper'
import Grainient from '../components/Backbround'

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
			className='bg-[var(--white)] rounded-4xl w-full h-full flex flex-col justify-center gap-5 p-10 shadow-2xl/10 border-1 border-[var(--middle)]/10'
		>
			<h2 className='font-bold text-4xl text-[var(--text-primary)] mb-5'>
				Войти в систему ДПО
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

const AlternativeAuthorization2 = () => {
	return (
		<div className='w-screen h-screen relative'>
			<Grainient
				color1='#FFFFFF'
				color2='#2bb4f3'
				color3='#FFFFFF'
				timeSpeed={0.25}
				colorBalance={0}
				warpStrength={1}
				warpFrequency={5}
				warpSpeed={2}
				warpAmplitude={50}
				blendAngle={0}
				blendSoftness={0.05}
				rotationAmount={500}
				noiseScale={2}
				grainAmount={0.1}
				grainScale={2}
				grainAnimated={false}
				contrast={1.5}
				gamma={1}
				saturation={1}
				centerX={0}
				centerY={0}
				zoom={0.9}
			/>
			<div className='absolute top-0 flex justify-center items-center z-100 w-full h-full'>
				<div className='w-[25vw] h-[60vh]'>
					<AuthForm />
				</div>
			</div>
		</div>
	)
}
export default AlternativeAuthorization2
