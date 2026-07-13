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
import { BACKEND_ERRORS, STATUS_ERRORS } from '../service/data/errors'

const api = axios.create({
	withCredentials: true,
})

const showError = err => {
	const uniqueCode = err.data?.unique_code
	const status = err?.status

	const env = import.meta.env.VITE_ENV || 'prod'

	const errorObject = BACKEND_ERRORS[uniqueCode]

	let uniqueCode_message = errorObject[env] || errorObject.prod
	let httpStatus_message = STATUS_ERRORS[status]

	toast.error(`${status}: ${httpStatus_message}`, {
		description: `${uniqueCode_message}`,
		id: 'api-error',
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
		config.headers['X-CSRF-TOKEN'] = csrf
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
			//window.location.href = '/authorization'
			//return Promise.reject(error)
		}

		const status = error.response
		showError(status)

		return Promise.reject(error)
	},
)

export default api
