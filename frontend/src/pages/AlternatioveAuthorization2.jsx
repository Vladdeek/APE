import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Login } from '../../service/APIs/Authorization'
import { executeWithAuthCheck } from '../../service/utils/apiHelper'
import Grainient from '../components/Backbround'
import { InputDefault } from '../components/Inputs'

const AuthForm = () => {
	const navigate = useNavigate()

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
			}
		} else {
			toast.error('Пожалуйста, используйте почту, заканчивающуюся на .ru')
		}
	}

	return (
		<form
			onSubmit={handleSubmitLogin}
			className='w-full max-w-md mx-auto p-8 sm:p-10 bg-white backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 flex flex-col gap-6 transition-all'
		>
			{/* Header Section */}
			<div className='flex flex-col items-center gap-3 text-center'>
				{/* <div className='p-3 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner'>
					<img
						src='./logo.svg'
						alt='Логотип МелГУ.ДПО'
						className='w-16 h-16 object-contain'
					/>
				</div> */}
				<div className='space-y-1'>
					<h2 className='text-sm uppercase tracking-wider font-semibold text-[var(--black)] opacity-75'>
						Система авторизации
					</h2>
					<p className='text-3xl font-extrabold text-[var(--black)] tracking-tight'>
						МелГУ<span className='text-[var(--hero)]'>.ДПО</span>
					</p>
				</div>
			</div>

			{/* Inputs Container */}
			<div className='flex flex-col gap-4'>
				<InputDefault
					title='Электронная почта'
					name='email'
					type='email'
					placeholder='example@mail.ru'
					value={formData.email}
					onChange={handleChange}
				/>

				<InputDefault
					title='Пароль'
					name='password'
					type='password'
					placeholder='••••••••'
					value={formData.password}
					onChange={handleChange}
				/>
			</div>

			{/* Submit Button */}
			<button
				disabled={!isAuthFormValid}
				type='submit'
				className={`
					w-full py-4 px-6 rounded-xl font-semibold text-white tracking-wide transition-all duration-200 mt-2
					${
						!isAuthFormValid
							? 'bg-[var(--light-middle)] text-[var(--middle)] cursor-not-allowed shadow-none'
							: 'bg-gradient-to-r from-[var(--light-hero)] to-[var(--hero)] hover:brightness-110 active:scale-[0.98] cursor-pointer hover:shadow-[var(--hero-glow)]'
					}
				`}
			>
				Войти
			</button>
		</form>
	)
}

const AlternativeAuthorization = () => {
	return (
		<div className='w-screen h-screen relative overflow-hidden bg-[var(--bg)]'>
			<Grainient
				color1='#eeeeee'
				color2='#2bb4f3'
				color3='#dddddd'
				timeSpeed={0.5}
				colorBalance={0}
				warpStrength={1}
				warpFrequency={5}
				warpSpeed={2}
				warpAmplitude={50}
				blendAngle={0}
				blendSoftness={0.05}
				rotationAmount={500}
				noiseScale={2}
				grainAmount={0.05}
				grainScale={2}
				grainAnimated={false}
				contrast={1.5}
				gamma={1}
				saturation={1}
				centerX={0}
				centerY={0}
				zoom={0.9}
			/>

			<div className='absolute inset-0 flex justify-center items-center z-10 w-full h-full'>
				<div className='relative container mx-auto px-4 sm:px-6 lg:px-8 h-full w-full flex items-center justify-center gap-8 items-center'>
					{/* Left Decorative Side */}
					{/* <div className='absolute left-0 bottom-0 w-full h-full flex items-center justify-center'>
						<img
							className='h-[75vh] w-auto object-contain'
							src='/Spline.png'
							alt='Декоративное изображение'
						/>
					</div> */}

					{/* Right Form Side */}
					<div className='w-full flex items-center justify-center p-4'>
						<AuthForm />
					</div>
				</div>
			</div>
		</div>
	)
}

export default AlternativeAuthorization
