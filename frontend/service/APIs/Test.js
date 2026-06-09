import api, { API } from '../../src/API'

export const GetQuestions = async test_id => {
	const response = await api.get(`${API}/test-content/question/${test_id}`)
	return response.data
}

export const AddQuestion = async test_id => {
	const response = await api.post(`${API}/test-content/question/${test_id}`, {})
	return response.data
}

export const GetDetailQuestion = async question_id => {
	const response = await api.get(
		`${API}/test-content/question/${question_id}/details`,
	)
	return response.data
}
export const EditQuestion = async (question_id, name, max_score) => {
	const response = await api.put(
		`${API}/test-content/question/${question_id}`,
		{ name, max_score },
	)
	return response.data
}
export const DeleteOption = async option_id => {
	const response = await api.delete(
		`${API}/test-content/question/option/${option_id}`,
	)
	return response.data
}
export const EditQuestionType = async (question_id, type) => {
	const response = await api.patch(
		`${API}/test-content/question/${question_id}/type`,
		{ type },
	)
	return response.data
}

export const AddOptionOnQuestion = async (question_id, option_code) => {
	const response = await api.post(
		`${API}/test-content/question/option/${question_id}`,
		{ name: '', option_code },
	)
	return response.data
}
export const EditOptionName = async (option_id, name) => {
	const response = await api.patch(
		`${API}/test-content/question/option/${option_id}/name`,
		{ name },
	)
	return response.data
}
export const EditOptionCorrectStatus = async (
	question_id,
	correct_option_id,
) => {
	const response = await api.patch(
		`${API}/test-content/question/${question_id}/correct-options`,
		{ correct_option_id },
	)
	return response.data
}
