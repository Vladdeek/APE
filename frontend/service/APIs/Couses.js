import api, { API } from '../../src/API'

export const CreateCourse = async (
	name,
	description,
	registration_start,
	registration_end,
	tag,
	start_date,
	end_date,
	if_free,
	price,
	certificate_type_id,
	format_id,
) => {
	const response = await api.post(`${API}/auth/signup`, {
		username,
		password,
		repeat_password,
		first_name,
		last_name,
		patronymic,
		email,
	})
	return response.data
}

export const GetAllCourses = async () => {
	const response = await api.get(`${API}/course`)
	return response.data
}
