const env = import.meta.env.VITE_ENV
const config = {
	dev: {
		API: import.meta.env.VITE_API_URL,
		FILE_API: import.meta.env.VITE_IMG_URL,
	},
	prod: {
		API: import.meta.env.VITE_API_URL_VDS,
		FILE_API: import.meta.env.VITE_IMG_URL_VDS,
	},
}

if (!config[env]) {
	throw new Error(`Неизвестное окружение: ${env}`)
}
export const { API, FILE_API } = config[env]

//====================== Axios API Error Context ===========================//

import axios from 'axios'
import { toast } from 'sonner'
import {
	DEVELOPER_BACKEND_ERRORS,
	DEVELOPER_STATUS_ERRORS,
	USER_FRIENDLY_BACKEND_ERRORS,
	USER_FRIENDLY_STATUS_ERRORS,
} from '../service/data/errors'

const api = axios.create({
	withCredentials: true,
})

export const showError = err => {
	const uniqueCode = err?.data?.unique_code
	const status = err?.status
	const mode = import.meta.env.VITE_ENV

	// ---------- РЕЖИМ РАЗРАБОТКИ (DEV) ----------
	if (mode === 'dev') {
		// Формируем заголовок: Код ошибки + расшифровка статуса
		const statusText = DEVELOPER_STATUS_ERRORS[status] || 'Неизвестный статус'
		const title = status
			? `${status}: ${statusText}`
			: 'Ошибка соединения с сервером'

		// Описание: забираем дев-текст по unique_code
		const devMessage =
			DEVELOPER_BACKEND_ERRORS[uniqueCode] ||
			err?.data?.message ||
			'Описание от бэкенда отсутствует'

		// Лог в консоль
		console.error('🛠 [DEV API ERROR]:', {
			status,
			uniqueCode,
			backendDescription: DEVELOPER_BACKEND_ERRORS[uniqueCode],
			rawError: err,
		})

		toast.error(title, {
			description: uniqueCode ? `[${uniqueCode}]\n${devMessage}` : devMessage,
			id: 'api-error',
			duration: 16000,
		})
		return
	}

	// ---------- ПРОДАКШЕН (PROD) ----------
	const title = USER_FRIENDLY_STATUS_ERRORS[status] || 'Произошла ошибка'

	const userDescription =
		USER_FRIENDLY_BACKEND_ERRORS[uniqueCode] ||
		(status >= 500
			? 'Сервис временно недоступен. Мы уже чиним проблему, попробуйте позже.'
			: 'Что-то пошло не так. Проверьте данные и попробуйте ещё раз.')

	toast.error(title, {
		description: `${userDescription}`,
		id: 'api-error',
		duration: 10000,
	})
}

const getCookie = name => {
	const cookies = document.cookie ? document.cookie.split('; ') : []
	for (let c of cookies) {
		const [k, ...v] = c.split('=')
		if (k === name) return decodeURIComponent(v.join('='))
	}
	return null
}

api.interceptors.request.use(config => {
	const csrf = getCookie('csrftoken')

	if (csrf) {
		config.headers['X-CSRFToken'] = csrf
	}

	config.headers['X-API-KEY'] = import.meta.env.VITE_API_KEY

	return config
})

api.interceptors.response.use(
	r => r,
	error => {
		if (axios.isCancel(error)) {
			return Promise.reject(error)
		}

		if (error.response?.status === 401) {
			window.location.href = '/authorization'
			return Promise.reject(error)
		}

		const status = error.response
		showError(status)

		return Promise.reject(error)
	},
)

export default api
