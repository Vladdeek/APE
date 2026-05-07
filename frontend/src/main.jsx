import { createRoot } from 'react-dom/client'
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
	useNavigate,
	BrowserRouter,
} from 'react-router-dom'
import {
	StrictMode,
	Suspense,
	use,
	useContext,
	useEffect,
	useState,
} from 'react'
import './index.css'
import './themes.css'
import DashboardLayout from './pages/layout/DashboardLayout'
import Catalog from './pages/Сatalog'
import Authorization from './pages/Authorization'
import StudentCourseRequest from './pages/StudentCourseRequest'
import CoursePage from './pages/CoursePage'
import { Me } from '../service/APIs/Authorization'

function MainApp() {
	const [role, setRole] = useState('teacher')

	useEffect(() => {
		const getUserInfo = async e => {
			try {
				const res = await Me()
				setRole(res.role)
			} catch (err) {}
		}
		// getUserInfo()
	}, [])

	return (
		<Suspense>
			<Routes>
				<Route path='/authorization' element={<Authorization />}></Route>
				<Route path='/' element={<DashboardLayout />}>
					<Route path='/catalog' element={<Catalog />}></Route>
					<Route path='/form' element={<StudentCourseRequest />}></Route>
					<Route
						path='/course/:courseId?'
						element={<CoursePage role={role} />}
					/>
				</Route>
			</Routes>
		</Suspense>
	)
}

createRoot(document.getElementById('root')).render(
	<BrowserRouter>
		<MainApp />
	</BrowserRouter>,
)
