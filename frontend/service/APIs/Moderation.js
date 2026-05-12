import api, { API } from '../../src/API'

export const GetUsers = async role => {
	const response = await api.get(`${API}/users?role_name=${role}`)
	return response.data
}
export const GetUsersById = async id => {
	const response = await api.get(`${API}/users/${id}`)
	return response.data
}
export const GetCreatedCoursesByUserId = async id => {
	const response = await api.get(`${API}/users/created-courses/${id}`)
	return response.data
}
export const GetModerationCourses = async () => {
	const response = await api.get(`${API}/courses`)
	return response.data
}
