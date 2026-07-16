import api, { API } from '../../src/API'

export const ACCESS = {
	getUnlinkedAuthors: course_id =>
		api.get(`${API}/course/members/${course_id}/unlinked`),

	getLinkedAuthors: course_id => api.get(`${API}/course/members/${course_id}`),

	addUserToCourseMembers: (course_id, user_id) =>
		api.post(`${API}/course/members/${course_id}`, { user_id }),

	removeUser: (course_id, user_id) =>
		api.delete(`${API}/course/members/${course_id}`, { data: { user_id } }),
}
