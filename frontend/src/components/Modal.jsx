import { X } from 'lucide-react'
import React from 'react'
import ReactDOM from 'react-dom'

const Modal = ({ isOpen, onClose, children, width }) => {
	if (!isOpen) return null

	return ReactDOM.createPortal(
		<div
			className='bg-[#00000050] fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center'
			onClick={onClose}
		>
			<div
				className={`bg-[var(--white)] ${width} p-5 relative rounded-3xl text-[var(--black)]`}
				onClick={e => e.stopPropagation()}
			>
				<X
					className='text-[var(--black)] absolute top-2 right-2 hover:scale-115 cursor-pointer transition-all'
					onClick={onClose}
				/>
				{children}
			</div>
		</div>,
		document.body,
	)
}

export default Modal
