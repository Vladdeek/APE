import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Header } from '../../components/Header'
import { use, useContext, useEffect, useState } from 'react'
import { GraduationCap, ShieldAlert } from 'lucide-react'
import { Me } from '../../../service/APIs/Authorization'

export default function DashboardLayout({ onChange }) {
	const location = useLocation()
	const navigate = useNavigate()
	const HeaderLinkInfo = [
		{
			user: [
				{
					title: 'Мои курсы',
					icon: GraduationCap,
					to: '/catalog',
				},
			],
			moderator: [
				{
					title: 'Проверка курсов',
					icon: ShieldAlert,
					to: '/moderation',
				},
			],
		},
	]

	const links = HeaderLinkInfo[0]['user']

	const [userInfo, setUserInfo] = useState([])
	const getUserInfo = async e => {
		try {
			const res = await Me()
			setUserInfo(res)
		} catch (err) {}
	}

	useEffect(() => {
		getUserInfo()
	}, [])

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
