import api, { API } from '../../src/API'

export const ReadLectureContent = async id => {
	const response = await api.get(`${API}/lecture-content/${id}`)
	return response.data
}
export const GetPresignedUrlToUploadMedia = async id => {
	const response = await api.get(`${API}/lecture-content/upload-url/${id}`)
	return response.data
}
export const AppendLectureContent = async (id, type) => {
	const response = await api.post(`${API}/lecture-content/append/${id}`, {
		data: { type },
	})
	return response.data
}
export const UpdateLectureContent = async (
	lecture_content_id,
	block_content_id,
	body,
	type,
) => {
	const response = await api.put(
		`${API}/lecture-content/${lecture_content_id}/block-content/${block_content_id}`,
		{
			data: {
				type,
				...body, // Разворачиваем все свойства из body на один уровень с type
			},
		},
	)
	return response.data
}
