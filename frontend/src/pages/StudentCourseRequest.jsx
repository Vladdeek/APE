import { useScroll } from 'framer-motion'
import {
	InputDefault,
	OptionInput,
	FileInput,
	useInput,
	DateInput,
	MaskInput,
} from '../components/Inputs'
import { useState } from 'react'
import { ChevronDown, CircleCheck } from 'lucide-react'

const StudentCourseRequest = () => {
	const [input1, setInput1] = useState('')
	const [input2, setInput2] = useState('')
	const [input3, setInput3] = useState('')
	const [input4, setInput4] = useState('')
	const [input5, setInput5] = useState('')
	const [input6, setInput6] = useState('')
	const [input7, setInput7] = useState('')
	const [input8, setInput8] = useState('')
	const [input9, setInput9] = useState('')
	const [input10, setInput10] = useState('')
	const [input11, setInput11] = useState('')
	const [input12, setInput12] = useState('')
	const [input13, setInput13] = useState('')
	const [input14, setInput14] = useState('')
	const [input15, setInput15] = useState('')
	const [input16, setInput16] = useState('')
	const [input17, setInput17] = useState('')
	const [input18, setInput18] = useState('')
	const [input19, setInput19] = useState('')
	const [input20, setInput20] = useState('')
	const [input21, setInput21] = useState('')
	const [input22, setInput22] = useState('')
	const [input23, setInput23] = useState('')
	const [input24, setInput24] = useState('')
	const [input25, setInput25] = useState('')
	const [input26, setInput26] = useState('')
	const [input27, setInput27] = useState('')
	const [input28, setInput28] = useState('')
	const [input29, setInput29] = useState('')
	const [input30, setInput30] = useState('')

	return (
		<div className='w-[50vw] mx-auto pt-25 mb-25 flex flex-col gap-3'>
			<p className='text-3xl text-[var(--black)] font-semibold'>
				Заявка на обучение по программе "Проблемы и возможности использования
				технологий искусственного интеллекта в образовании"
			</p>
			<div className='grid grid-cols-3 w-full gap-3'>
				<InputDefault
					title='Фамилия (в именительном падеже)'
					value={input1}
					onChange={e => setInput1(e.target.value)}
					validate={val => val.length >= 0}
				/>
				<InputDefault
					title='Имя (в именительном падеже)'
					value={input2}
					onChange={e => setInput2(e.target.value)}
					validate={val => val.length >= 0}
				/>
				<InputDefault
					title='Отчество (в именительном падеже)'
					value={input3}
					onChange={e => setInput3(e.target.value)}
					validate={val => val.length >= 0}
				/>
				<InputDefault
					title='Фамилия (в родительном падеже)'
					description={'Иванов(-а)'}
					value={input4}
					onChange={e => setInput4(e.target.value)}
					validate={val => val.length >= 0}
					required={true}
				/>
				<InputDefault
					title='Имя (в родительном падеже)'
					description={'Иван(-а)'}
					value={input5}
					onChange={e => setInput5(e.target.value)}
					validate={val => val.length >= 0}
					required={true}
				/>
				<InputDefault
					title='Отчество (в родительном падеже)'
					description={'Иванович(-а)'}
					value={input6}
					onChange={e => setInput6(e.target.value)}
					validate={val => val.length >= 0}
				/>
			</div>
			<div className='w-full'>
				<InputDefault
					title='Фамилия, указанная в дипломе о ВО или СПО (без инициалов)'
					description={
						'Указать фамилию из диплома о высшем или среднем профессиональном образования который Вы прикрепите к данной заявке на обучение, например: Иванов'
					}
					value={input7}
					onChange={e => setInput7(e.target.value)}
					validate={val => val.length >= 0}
					required={true}
				/>
			</div>
			<div className='w-full'>
				<FileInput
					title='Фамилия, указанная в дипломе о ВО или СПО (без инициалов)'
					description={
						'Указать фамилию из диплома о высшем или среднем профессиональном образования который Вы прикрепите к данной заявке на обучение, например: Иванов'
					}
					value={input8}
					onChange={e => setInput8(e.target.value)}
					validate={val => val.length >= 0}
					accept='application/pdf,image/jpeg,image/png, .pdf, .jpg, .jpeg, .png'
				/>
			</div>
			<div className='grid grid-cols-2 gap-3'>
				<OptionInput
					title={'Гражданство'}
					required={true}
					options={[
						{ label: 'Вариант 1', value: 1 },
						{ label: 'Вариант 2', value: 2 },
					]}
					onChange={val => setInput9(val)}
				/>
				<OptionInput
					title={'Пол'}
					required={true}
					options={[
						{ label: 'Мужской', value: 1 },
						{ label: 'Женский', value: 2 },
					]}
					onChange={val => setInput10(val)}
				/>
				<DateInput
					title='Дата рождения'
					required
					value={input11}
					onChange={val => setInput11(val)}
				/>
				<MaskInput
					title='СНИЛС'
					mask='XXX-XXX-XXX XX'
					required
					onChange={val => setInput12(val)}
				/>
			</div>
			<div className='w-full'>
				<FileInput
					title='Скан-копия СНИЛС'
					description={'Допустимые форматы файлов: PDF, JPEG, PNG'}
					required
					value={input13}
					onChange={e => setInput13(e.target.value)}
					validate={val => val.length >= 0}
					accept='application/pdf,image/jpeg,image/png, .pdf, .jpg, .jpeg, .png'
				/>
			</div>
			<div className='grid grid-cols-3 w-full gap-3'>
				<InputDefault
					title='Регион места работы'
					required
					value={input14}
					onChange={e => setInput14(e.target.value)}
					validate={val => val.length >= 0}
				/>
				<InputDefault
					title='Место работы (или учебное заведение для обучающихся)'
					required
					description={
						'Указать краткое или полное официальное название места работы, например: НИЯУ, МИФИ'
					}
					value={input15}
					onChange={e => setInput15(e.target.value)}
					validate={val => val.length >= 0}
				/>
				<InputDefault
					title='Должность (курс обучения)'
					required
					value={input16}
					onChange={e => setInput16(e.target.value)}
					validate={val => val.length >= 0}
				/>
			</div>
			<p className='text-xl text-[var(--black)]'>Сведения об образовании</p>
			<div className='grid grid-cols-2 gap-3'>
				<InputDefault
					title='Серия диплома об образовании'
					required
					description={'Указать серию диплома об образовании поступающего'}
					value={input17}
					onChange={e => setInput17(e.target.value)}
					validate={val => val.length >= 0}
				/>
				<InputDefault
					title='Номер диплома об образовании'
					required
					description={'Указать номер диплома об образовании поступающего'}
					value={input18}
					onChange={e => setInput18(e.target.value)}
					validate={val => val.length >= 0}
				/>
			</div>
			<div className='w-full'>
				<FileInput
					title='Скан-копия диплома об образовании'
					description={
						'Загрузите скан-копию диплома об образовании для подтверждения Допустимые форматы файлов: PDE, JPEG, PNG'
					}
					required
					value={input19}
					onChange={e => setInput19(e.target.value)}
					validate={val => val.length >= 0}
					accept='application/pdf,image/jpeg,image/png, .pdf, .jpg, .jpeg, .png'
				/>
			</div>
			<div className='grid grid-cols-2 gap-3'>
				<OptionInput
					title={'Уровень образования'}
					required={true}
					options={[
						{ label: 'Вариант 1', value: 1 },
						{ label: 'Вариант 2', value: 2 },
					]}
					onChange={val => setInput20(val)}
				/>
				<InputDefault
					title='Квалификация по диплому'
					required
					value={input21}
					onChange={e => setInput21(e.target.value)}
					validate={val => val.length >= 0}
				/>
				<OptionInput
					title={'Полное наименование учебного заведения'}
					required={true}
					options={[
						{ label: 'Вариант 1', value: 1 },
						{ label: 'Вариант 2', value: 2 },
					]}
					onChange={val => setInput22(val)}
				/>
				<InputDefault
					title='Если Вашего учебного заведения нет в списке, укажите его название здесь:'
					required
					value={input23}
					onChange={e => setInput23(e.target.value)}
					validate={val => val.length >= 0}
				/>
			</div>
			<p className='text-xl text-[var(--black)]'>Удостоверение личности</p>
			<div className='grid grid-cols-2 gap-3'>
				<InputDefault
					title='Тип документа, удостоверяющего личность'
					required
					value={input24}
					onChange={e => setInput24(e.target.value)}
					validate={val => val.length >= 0}
				/>
				<InputDefault
					title='Серия и номер документа'
					required
					value={input25}
					onChange={e => setInput25(e.target.value)}
					validate={val => val.length >= 0}
				/>
				<InputDefault
					title='Кем выдан документ'
					required
					value={input26}
					onChange={e => setInput26(e.target.value)}
					validate={val => val.length >= 0}
				/>
				<DateInput
					title='Дата выдачи документа'
					required
					value={input27}
					onChange={val => setInput27(val)}
				/>
			</div>
			<div className='w-full'>
				<InputDefault
					title='Адрес регистрации'
					required
					value={input28}
					onChange={e => setInput28(e.target.value)}
					validate={val => val.length >= 0}
				/>
			</div>
			<p className='text-xl text-[var(--black)]'>Контакты</p>
			<div className='grid grid-cols-2 gap-3'>
				<MaskInput
					title='СНИЛС'
					mask='+X (XXX) XXX-XX-XX'
					required
					onChange={val => setInput29(val)}
				/>
				<InputDefault
					title='Действующий адрес электронной почти (e-mail)'
					required
					value={input30}
					onChange={e => setInput30(e.target.value)}
					validate={val => val.length >= 0}
				/>
			</div>
			<div className='flex gap-3 w-full items-center justify-start'>
				<button className='px-6 py-3 bg-[var(--hero)] text-white rounded-2xl shadow-[var(--shadow)]  active:scale-99 active:shadow-inner active:brightness-90 transition-all cursor-pointer'>
					Создать
				</button>
				<button className='px-6 py-3 text-[var(--black)] bg-[var(--light-middle)] rounded-2xl active:shadow-inner active:brightness-90 active:scale-99 transition-all cursor-pointer'>
					Отмена
				</button>
			</div>
		</div>
	)
}
export default StudentCourseRequest
