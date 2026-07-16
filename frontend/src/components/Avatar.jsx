import { useUser } from '../../service/context/UserContext'

export const Avatar = ({ width = 'w-12' }) => {
	const { userInfo } = useUser()
	return (
		<>
			{userInfo?.avatar_url ? (
				<img
					className={`${width} rounded-md object-cover aspect-square`}
					src={userInfo?.avatar_url}
					alt=''
				/>
			) : (
				<div
					className={`${width} rounded-md flex items-center justify-center object-cover aspect-square w-auto text-[var(--middle)] bg-[var(--light-middle)]`}
				>
					<p className='whitespace-nowrap'>
						{userInfo?.first_name[0]} {userInfo?.last_name[0]}
					</p>
				</div>
			)}
		</>
	)
}
