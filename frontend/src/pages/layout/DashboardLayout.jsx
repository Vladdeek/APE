import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Header } from '../../components/Header'
import { use, useContext, useEffect, useState } from 'react'
import {
	BookText,
	BookUser,
	FileUser,
	GraduationCap,
	ShieldAlert,
} from 'lucide-react'
import { Me } from '../../../service/APIs/Authorization'

export default function DashboardLayout({ onChange }) {
	const location = useLocation()
	const navigate = useNavigate()
	const HeaderLinkInfo = [
		{
			student: [
				{
					title: 'Мои курсы',
					icon: GraduationCap,
					to: '/catalog',
				},
			],
			teacher: [
				{
					title: 'Мои курсы',
					icon: GraduationCap,
					to: '/catalog',
				},
			],
			moderator: [
				{
					title: 'Пользователи',
					icon: BookUser,
					to: '/moderation-users',
				},
				{
					title: 'Курсы',
					icon: BookText,
					to: '/moderation-courses',
				},
				{
					title: 'Заявки',
					icon: FileUser,
					to: '/moderation-courses',
				},
			],
		},
	]

	const [userInfo, setUserInfo] = useState([])

	useEffect(() => {
		const getUserInfo = async e => {
			try {
				const res = await Me()
				setUserInfo(res)
			} catch (err) {}
		}
		getUserInfo()
	}, [])

	const links = HeaderLinkInfo[0][userInfo?.role]

	return (
		<>
			<div className='md:mx-10 mx-2 relative'>
				<Header links={links} userInfo={userInfo} />
				<Outlet />
			</div>
			{/* <div className='md:hidden'>
				<MobileMenuBar links={HeaderLinkInfo} />
			</div> */}
		</>
	)
}
