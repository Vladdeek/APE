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
import { Toaster } from 'react-hot-toast'
import DashboardLayout from './pages/layout/DashboardLayout'
import Catalog from './pages/Сatalog'
import Authorization from './pages/Authorization'
import StudentCourseRequest from './pages/StudentCourseRequest'
import CoursePage from './pages/CoursePage'

function MainApp() {
	return (
		<Suspense>
			<Routes>
				<Route path='/authorization' element={<Authorization />}></Route>
				<Route path='/' element={<DashboardLayout />}>
					<Route path='/catalog' element={<Catalog />}></Route>
					<Route path='/form' element={<StudentCourseRequest />}></Route>
					<Route path='/course/:courseId?' element={<CoursePage />} />
				</Route>
			</Routes>
		</Suspense>
	)
}

createRoot(document.getElementById('root')).render(
	<BrowserRouter>
		<Toaster position='top-right' />
		<MainApp />
	</BrowserRouter>,
)
