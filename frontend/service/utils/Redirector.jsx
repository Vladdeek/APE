import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useUser } from '../context/UserContext'

export const Redirector = () => {
	const navigate = useNavigate()
	const { pathname } = useLocation()
	const { role } = useUser()

	useEffect(() => {
		if (pathname === '/') {
			if (role === 'moderator') {
				navigate('/moderation-users')
			} else if (role === 'teacher' || role === 'student') {
				navigate('/catalog')
			}
		}
	}, [pathname, role, navigate])

	return null
}
