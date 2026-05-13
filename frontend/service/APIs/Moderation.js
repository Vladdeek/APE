import api, { API } from '../../src/API'

// --- users ---
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
export const AddNewUser = async (first_name, last_name, patronymic, email) => {
	const response = await api.post(`${API}/users/account/register`, {
		first_name,
		last_name,
		patronymic,
		email,
	})
	return response.data
}
export const EditUserInfo = async (
	first_name,
	last_name,
	patronymic,
	email,
	userId,
) => {
	const response = await api.put(`${API}/users/account/${userId}`, {
		first_name,
		last_name,
		patronymic,
		email,
	})
	return response.data
}
export const DeleteUsersById = async id => {
	const response = await api.delete(`${API}/users/account/${id}`)
	return response.data
}

export const ToSendTheMessageAgainUserById = async id => {
	const response = await api.post(`${API}/users/account/${id}/send-password`)
	return response.data
}

// --- courses ---
export const GetModerationCourses = async () => {
	const response = await api.get(`${API}/courses`)
	return response.data
}
