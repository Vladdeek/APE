export const DEVELOPER_BACKEND_ERRORS = {
	// --- СИСТЕМНЫЕ И СЛУЖЕБНЫЕ ОШИБКИ ---
	UNHANDLED:
		'Критический сбой архитектуры: Необработанное исключение (Application/Infrastructure/Domain/Commit/Rollback/Flush Error). Смотри бэктрейс бэкенда.',
	REDIS_SERVICE_UNAVAILABLE:
		'Сбой RedisConnectionError: Нет связи с Redis. Проверь запущен ли redis-server / контейнер и параметры подключения.',
	S3_SERVICE_UNAVAILABLE:
		'Сбой PutObjectError / StorageUnavailableError: Ошибка работы с S3 хранилищем. Проверь бакет, IAM или сетевой доступ.',
	BROKER_SERVICE_UNAVAILABLE:
		'Сбой BrokerUnavailableError: Очередь сообщений (RabbitMQ/Kafka) недоступна. Фоновые задачи не могут быть обработаны.',
	OBJECT_NOT_FOUND_ERROR:
		'HeadObjectNotFoundError: Запрошенный объект или файл отсутствует в S3 / хранилище.',

	// --- АВТОРИЗАЦИЯ, ПРАВА И РОЛИ ---
	AUTHENTICATION_ERROR:
		'AuthenticationError: Не удалось аутентифицировать пользователя (неверный токен, сессия или подпись).',
	INVALID_USER_PASSWORD:
		'PasswordDoesntMatchError: Хэш переданного пароля не совпал с хэшем из базы данных.',
	USER_ALREADY_AUTHENTICATED:
		'AlreadyAuthenticatedError: Попытка повторной авторизации при наличии активной сессии/токена.',
	USER_EMAIL_NOT_FOUND:
		'UserNotFoudByEmailError: Запрос к БД по email вернул null. Такого юзера нет в базе.',
	USERNAME_ALREADY_EXIST:
		'UsernameAlreadyExistsError: Нарушение уникальности (Unique Constraint) поля username в БД.',
	EMAIL_ALREADY_EXISTS:
		'EmailAlreadyExistsError: Нарушение уникальности поля email. Такой аккаунт уже создан.',
	EMAIL_DOMAIN_ALREADY_EXISTS:
		'EmailDomainAlreadyExistsError: Email-домен уже зарегистрирован в системе.',
	EMAIL_PROCESSING_DOMAIN_ERROR:
		'EmailParsingDomainError: Ошибка парсинга или валидации email-домена.',
	PERMISSION_DENIED_ERROR:
		'PermissionDeniedError: RBAC/ABAC проверка провалена. У текущего пользователя нет нужной роли/разрешения.',
	ROLE_PERMISSION_APPEND_ERROR:
		'RolePermissionAppendError: Ошибка при связывании роли с новым разрешением в таблице связей.',
	ROLE_NOT_FOUND_ERROR:
		'RoleNotFoundByName / RoleNotFoundByID: Запрошенная роль не найдена в базе данных по имени или ID.',

	// --- ТЕСТЫ И СЕССИИ СТУДЕНТОВ ---
	STUDENT_TEST_SESSION_NOT_FOUND:
		'StudentTestSessionNotFound: В БД отсутствует запись о сессии тестирования по указанному ID.',
	NO_ACTIVE_TEST_SESSION_FOUND:
		'NoActiveTestSessionFound: Запрос ожидал запущенную сессию теста, но у студента сейчас нет активных прохождений.',
	STUDENT_ALREADY_PASSING_CURRENT_TEST:
		'StudentAlreadyPassingCurrentTest: Попытка начать новый тест, хотя старая сессия этого же теста ещё не закрыта.',
	ACTIVE_STUDENT_TEST_SESSION_ALREADY_ENDED:
		'ActiveStudentTestSessionAlreadyEnded: Попытка совершить действие в тесте, время на который вышло (expired).',
	STUDENT_ANSWER_ALREADY_SUBMITTED:
		'StudentAnswerAlreadySubmitted: Повторная отправка (double submit) ответа на один и тот же вопрос в рамках сессии.',
	STUDENT_ANSWER_NOT_FOUND:
		'StudentAnswerNotFound: Запрос на модификацию или проверку ответа вернул фейл, ответа нет в базе.',
	STUDENT_TEST_SESSION_IS_NOT_YET_ASSESSED:
		'StudentTestSessionIsNotYetAssessed: Попытка получить оценку/просмотр ошибок до того, как тест был проверен.',
	STUDENT_TEST_SESSION_OWNERSHIP:
		'StudentTestSessionOwnershipError: Попытка доступа или выполнения действий в чужой сессии тестирования.',

	// --- КОНСТРУКТОР ТЕСТОВ И ВОПРОСЫ ---
	TEST_NOT_FOUND_BY_ID_ERROR:
		'TestNotFoundByIdError: Ошибка выборки теста. Проверь переданный test_id.',
	QUESTION_NOT_FOUND_BY_ID_ERROR:
		'QuestionNotFoundByID: Не удалось найти вопрос по переданному ID.',
	QUESTION_ALREADY_EXISTS_ERROR:
		'QuestionAlreadyExistsInTheTestError: Нарушение уникальности. Вопрос уже привязан к данному тесту.',
	QUESTION_TYPE_DOESNT_MATCH:
		'QuestionTypeDoesntMatch: Переданный тип ответа/структуры не соответствует объявленному типу вопроса.',
	QUESTION_OPTIONS_DEOSNT_MATCH:
		'QuestionOptionsDoesntMatch: Валидация вариантов ответов провалена. Количество или формат опций некорректны.',
	OPTION_NOT_FOUND_BY_ID:
		'OptionNotFoundById: Запрошенный ID варианта ответа (option_id) отсутствует в базе.',
	OPTION_ALREADY_EXISTS_ERROR:
		'OptionAlreadyExistsInTheQuestion: Дублирование варианта ответа в одном вопросе.',
	OPEN_QUESTION_TYPE_OPTION_ERROR:
		'OpenQuestionTypeOptionError: Для вопроса с открытым ответом переданы некорректные параметры или лишние опции.',

	// --- КУРСЫ, МОДУЛИ И ЛЕКЦИИ ---
	COURSE_NOT_FOUND:
		'CourseNotFoundError: В таблице courses нет записи с таким ID.',
	COURSE_ALREADY_EXISTS:
		'CourseAlreadyExistsError: Конфликт уникальности названия курса.',
	COURSE_READ_PERMISSION_ERROR:
		'CourseReadContentPermissionError: Студент не записан на курс или его подписка/доступ истекли.',
	COURSE_OWNERSHIP_ERROR:
		'CourseOwnershipRequiredError: Ошибка прав. Текущий пользователь не является владельцем (автором) курса.',
	COURSE_MEMBERSHIP_ERROR:
		'UserIsAlreadyCourseMember: Пользователь уже является участником данного курса.',
	COURSE_FORMAT_NOT_FOUND_ERROR:
		'CourseFormatNotFoundError: Указанный format_id отсутствует в справочнике форматов.',
	COURSE_FORMAT_ALREADY_EXISTS_ERROR:
		'CourseFormatAlreadyExistsError: Попытка продублировать существующий формат курса.',
	COURSE_MODULE_NOT_FOUND:
		'CourseModuleNotFoundError: Ошибка поиска модуля по ID.',
	COURSE_MODULE_ALREADY_EXISTS:
		'CourseModuleAlreadyExistsError: Нарушение уникальности модуля внутри одного курса.',
	COURSE_MODULE_INDEX_ORDER_TAKEN:
		'CourseModuleIndexOrderErrorTakenError: Порядковый номер модуля (index/order) уже занят другим модулем в этом курсе.',
	COURSE_MODULE_POSITION_ERROR:
		'UpdateCourseModulePositionError: Ошибка при обновлении позиции или порядка следования модуля.',
	MODULE_PRESENTATION_ALREADY_EXISTS:
		'ModulePresentationAlreadyExistsError: Конфликт уникальности. Элемент (лекция, тест или практика) с таким названием уже существует в данном модуле.',
	MODULE_PRESENTATION_NOT_FOUND:
		'ModulePresentationNotFoundByIndexOrder / ModulePresentationNotFoundByID: Запрошенный элемент модуля (лекция, тест или практика) не найден по ID или порядковому номеру.',

	// --- КОНТЕНТ ЛЕКЦИЙ И ФАЙЛЫ ---
	LECTURE_CONTENT_NOT_FOUND:
		'LectureContentNotFoundError: Отсутствует корневой контент или метаданные лекции.',
	LECTURE_CONTENT_BLOCK_NOT_FOUND_ERROR:
		'LectureContentBlockNotFoundError: Запрошенный блок (текст, видео, файл) по ID не найден в структуре лекции.',
	INCORRECT_LECTURE_CONTENT_BLOCK_TYPE_ERROR:
		'IncorrectLectureContentBlockTypeError: Передан тип блока, который не поддерживается схемой лекции.',
	FILE_NOT_FOUND_ERROR:
		'AppendLectureAudio/Images/FilesBlockError: Файл физически отсутствует на сервере или повреждены связи в БД.',
	FILE_METADATA_NOT_FOUND_ERROR:
		'FileMetadataNotFoundError: В таблице метаданных файлов нет записи о данном файле.',

	// --- ЗАЯВКИ СТУДЕНТОВ И СЕРТИФИКАТЫ ---
	STUDENT_ALREADY_REGISTERED:
		'StudentAlreadyRegisteredToCourse: Повторная запись студента на курс, где он уже обучается.',
	STUDENT_COURSE_REQUEST_NOT_FOUND_ERROR:
		'StudentCourseRequestNotFoundError: Запись заявки отсутствует по переданному ID.',
	STUDENT_COURSE_REQUEST_ALREADY_EXISTS:
		'StudentCourseRequestAlreadyExists: Попытка создать дубликат заявки, которая находится на рассмотрении.',
	STUDENT_COURSE_CREATION_ERROR:
		'StudentCourseRequestCreationError: Ошибка бизнес-логики при автоматическом создании/одобрении записи на курс.',
	COURSE_CERTIFICATE_TYPE_NOT_FOUND:
		'CertificateTypeNotFoundError: Указанный certificate_type_id отсутствует в системе.',
	COURSE_CERTIFICATE_TYPES_ALREADY_EXISTS:
		'CourseCertificateTypeAlreadyExists: Конфликт уникальности при создании нового типа сертификата.',

	// --- ВЕБИНАРЫ И СПИКЕРЫ ---
	WEBINAR_NOT_FOUND:
		'WebinarNotFoundError: Запрос вебинара по ID вернул пустой результат.',
	WEBINAR_ALREADY_EXISTS:
		'WebinarAlreadyExistsError: Конфликт расписания или названия вебинара.',
	WEBINAR_SPEAKER_ALREADY_EXISTS:
		'WebinarSpeakerAlreadyExistsError: Попытка повторно привязать одного и того же спикера к вебинару.',
	WEBINAR_TAG_ASSOCIATION_ERROR:
		'WebinarTagAssociationError: Ошибка записи в промежуточную таблицу связей вебинаров и тегов.',
	WEBINAR_TAG_ASSOCIATION_ALREADY_EXISTS:
		'WebinarTagAssociationAlreadyExists: Попытка продублировать связь тега и вебинара.',
	TAG_ALREADY_EXISTS:
		'TagsAlreadyExistsError: Попытка создать сущность тега с уже занятым именем.',

	// --- УЧЕБНЫЕ ЗАВЕДЕНИЯ И ГРАЖДАНСТВО ---
	EDUCATION_NOT_FOUND_ERROR:
		'EducationInstitutionNotFoundError: Ошибка поиска учебного заведения по ID.',
	EDUCATION_INSTITUTION_ALREADY_EXISTS:
		'EducationInstitutionAlreadyExists: Найдено совпадение по названию/аккредитации учебного заведения.',
	CITIZENSHIP_ALREADY_EXISTS:
		'CitizenshipAlreadyExistsError: Попытка добавить дублирующую запись в справочник стран/гражданств.',

	// --- УВЕДОМЛЕНИЯ ---
	NOTIFICATION_NOT_FOUND_BY_ID:
		'NotificationNotFoundByID: Запрошенное уведомление отсутствует в базе данных.',
	NOTIFICATION_TYPE_NOT_FOUND_ERROR:
		'NotificationTypeNotFoundError: Указанный тип нотификации отсутствует в системе.',
	NOTIFICATION_TYPE_ALREADY_EXISTS:
		'NotificationTypeAlreadyExistsError: Попытка создать дублирующий тип уведомления.',
	NOTIFICATION_ACTIVE_CONNECTION_NOT_FOUND:
		'NotificationActiveConnectionNotFound: У пользователя нет активного WebSocket/SSE соединения в данный момент.',

	// --- API КЛЮЧИ ---
	API_KEY_NOT_FOUND_ERROR:
		'APIKeyNotFoundError: Переданный API-ключ отсутствует в таблице валидных токенов интеграции.',
	API_KEY_ALREADY_EXISTS:
		'APIKeyCommentAlreadyExistsError: Найдено совпадение по комментарию/имени для создаваемого API ключа.',
}

export const DEVELOPER_STATUS_ERRORS = {
	400: 'Некорректный запрос',
	401: 'Требуется авторизация',
	403: 'Доступ ограничен',
	404: 'Информация не найдена',
	405: 'Действие недоступно',
	408: 'Превышено время ожидания',
	409: 'Конфликт данных',
	422: 'Проверьте введенные данные',
	429: 'Слишком много запросов',

	500: 'Ошибка на сервере',
	501: 'В разработке',
	502: 'Сервер временно недоступен',
	503: 'Ведутся технические работы',
	504: 'Сервер не отвечает',
	507: 'Недостаточно памяти на сервере',
}

// ==========================================
// 2. ДЛЯ ОБЫЧНОГО ПОЛЬЗОВАТЕЛЯ (PROD)
// ==========================================

// Человечные Заголовки по HTTP-кодам
export const USER_FRIENDLY_STATUS_ERRORS = {
	400: 'Некорректный запрос',
	401: 'Требуется авторизация',
	403: 'Доступ ограничен',
	404: 'Информация не найдена',
	405: 'Действие недоступно',
	408: 'Превышено время ожидания',
	409: 'Конфликт данных',
	422: 'Проверьте введенные данные',
	429: 'Слишком много запросов',

	500: 'Ошибка на сервере',
	501: 'В разработке',
	502: 'Сервер временно недоступен',
	503: 'Ведутся технические работы',
	504: 'Сервер не отвечает',
	507: 'Недостаточно памяти на сервере',
}

// Человечные Описания по unique_code
export const USER_FRIENDLY_BACKEND_ERRORS = {
	// --- СИСТЕМНЫЕ И СЛУЖЕБНЫЕ ОШИБКИ ---
	UNHANDLED:
		'Произошла непредвиденная ошибка. Мы уже работаем над её исправлением. Попробуйте обновить страницу.',
	REDIS_SERVICE_UNAVAILABLE:
		'Сервис временных данных недоступен. Пожалуйста, повторите попытку позже.',
	S3_SERVICE_UNAVAILABLE:
		'Не удалось загрузить или сохранить файл. Попробуйте еще раз через несколько минут.',
	BROKER_SERVICE_UNAVAILABLE:
		'Сервис обработки фоновых задач временно недоступен. Попробуйте позже.',
	OBJECT_NOT_FOUND_ERROR: 'Запрошенный файл или документ не найден.',

	// --- АВТОРИЗАЦИЯ, ПРАВА И РОЛИ ---
	AUTHENTICATION_ERROR:
		'Ошибка авторизации. Пожалуйста, войдите в систему заново.',
	INVALID_USER_PASSWORD:
		'Неверный пароль. Проверьте правильность ввода и повторите попытку.',
	USER_ALREADY_AUTHENTICATED: 'Вы уже вошли в систему.',
	USER_EMAIL_NOT_FOUND: 'Пользователь с таким email не найден.',
	USERNAME_ALREADY_EXIST: 'Пользователь с таким именем уже зарегистрирован.',
	EMAIL_ALREADY_EXISTS: 'Пользователь с таким email уже существует.',
	EMAIL_DOMAIN_ALREADY_EXISTS:
		'Этот почтовый домен уже зарегистрирован в системе.',
	EMAIL_PROCESSING_DOMAIN_ERROR:
		'Некорректный формат адреса электронной почты.',
	PERMISSION_DENIED_ERROR:
		'У вас недостаточно прав для выполнения этого действия.',
	ROLE_PERMISSION_APPEND_ERROR: 'Не удалось обновить права доступа роли.',
	ROLE_NOT_FOUND_ERROR: 'Запрошенная роль не найдена в системе.',

	// --- ТЕСТЫ И СЕССИИ СТУДЕНТОВ ---
	STUDENT_TEST_SESSION_NOT_FOUND:
		'Сессия тестирования не найдена. Возможно, она была завершена.',
	NO_ACTIVE_TEST_SESSION_FOUND: 'У вас нет активных прохождений тестов.',
	STUDENT_ALREADY_PASSING_CURRENT_TEST:
		'Вы уже проходите этот тест. Завершите текущую попытку перед началом новой.',
	ACTIVE_STUDENT_TEST_SESSION_ALREADY_ENDED:
		'Время на прохождение теста истекло. Ответы больше не принимаются.',
	STUDENT_ANSWER_ALREADY_SUBMITTED: 'Вы уже отправили ответ на этот вопрос.',
	STUDENT_ANSWER_NOT_FOUND:
		'Ваш ответ не найден. Попробуйте ответить на вопрос заново.',
	STUDENT_TEST_SESSION_IS_NOT_YET_ASSESSED:
		'Результаты теста еще проверяются. Пожалуйста, подождите.',
	STUDENT_TEST_SESSION_OWNERSHIP:
		'У вас нет доступа к этой сессии тестирования.',

	// --- КОНСТРУКТОР ТЕСТОВ И ВОПРОСЫ ---
	TEST_NOT_FOUND_BY_ID_ERROR: 'Запрошенный тест не найден.',
	QUESTION_NOT_FOUND_BY_ID_ERROR: 'Вопрос не найден или был удален.',
	QUESTION_ALREADY_EXISTS_ERROR: 'Этот вопрос уже добавлен в тест.',
	QUESTION_TYPE_DOESNT_MATCH: 'Формат ответа не соответствует типу вопроса.',
	QUESTION_OPTIONS_DEOSNT_MATCH:
		'Пожалуйста, проверьте правильность заполнения вариантов ответов.',
	OPTION_NOT_FOUND_BY_ID: 'Выбранный вариант ответа не найден.',
	OPTION_ALREADY_EXISTS_ERROR:
		'Такой вариант ответа уже существует в этом вопросе.',
	OPEN_QUESTION_TYPE_OPTION_ERROR:
		'Для вопросов с открытым ответом не требуются варианты выбора.',

	// --- КУРСЫ, МОДУЛИ И ЛЕКЦИИ ---
	COURSE_NOT_FOUND: 'Запрошенный курс не найден.',
	COURSE_ALREADY_EXISTS: 'Курс с таким названием уже существует.',
	COURSE_READ_PERMISSION_ERROR: 'У вас нет доступа к материалам этого курса.',
	COURSE_OWNERSHIP_ERROR: 'Только автор курса может совершать это действие.',
	COURSE_MEMBERSHIP_ERROR: 'Вы уже записаны на этот курс.',
	COURSE_FORMAT_NOT_FOUND_ERROR: 'Выбранный формат курса не найден.',
	COURSE_FORMAT_ALREADY_EXISTS_ERROR: 'Такой формат курса уже создан.',
	COURSE_MODULE_NOT_FOUND: 'Модуль курса не найден.',
	COURSE_MODULE_ALREADY_EXISTS:
		'Модуль с таким названием уже есть в этом курсе.',
	COURSE_MODULE_INDEX_ORDER_TAKEN:
		'Модуль с таким порядковым номером уже существует.',
	COURSE_MODULE_POSITION_ERROR:
		'Не удалось изменить порядок модулей. Попробуйте еще раз.',
	MODULE_PRESENTATION_ALREADY_EXISTS:
		'Материал с таким названием уже есть в этом модуле.',
	MODULE_PRESENTATION_NOT_FOUND: 'Запрошенный материал модуля не найден.',

	// --- КОНТЕНТ ЛЕКЦИЙ И ФАЙЛЫ ---
	LECTURE_CONTENT_NOT_FOUND: 'Материалы лекции не найдены.',
	LECTURE_CONTENT_BLOCK_NOT_FOUND_ERROR: 'Запрошенный блок контента не найден.',
	INCORRECT_LECTURE_CONTENT_BLOCK_TYPE_ERROR:
		'Неподдерживаемый тип блока контента.',
	FILE_NOT_FOUND_ERROR: 'Файл не найден. Попробуйте загрузить его заново.',
	FILE_METADATA_NOT_FOUND_ERROR: 'Информация о файле недоступна.',

	// --- ЗАЯВКИ СТУДЕНТОВ И СЕРТИФИКАТЫ ---
	STUDENT_ALREADY_REGISTERED: 'Вы уже зачислены на этот курс.',
	STUDENT_COURSE_REQUEST_NOT_FOUND_ERROR: 'Заявка на курс не найдена.',
	STUDENT_COURSE_REQUEST_ALREADY_EXISTS:
		'Ваша заявка на этот курс уже находится на рассмотрении.',
	STUDENT_COURSE_CREATION_ERROR:
		'Не удалось оформить запись на курс. Обратитесь в поддержку.',
	COURSE_CERTIFICATE_TYPE_NOT_FOUND: 'Указанный тип сертификата не найден.',
	COURSE_CERTIFICATE_TYPES_ALREADY_EXISTS:
		'Такой тип сертификата уже существует.',

	// --- ВЕБИНАРЫ И СПИКЕРЫ ---
	WEBINAR_NOT_FOUND: 'Запрошенный вебинар не найден.',
	WEBINAR_ALREADY_EXISTS:
		'Вебинар с таким названием или временем уже существует.',
	WEBINAR_SPEAKER_ALREADY_EXISTS: 'Этот спикер уже добавлен к вебинару.',
	WEBINAR_TAG_ASSOCIATION_ERROR: 'Не удалось привязать тег к вебинару.',
	WEBINAR_TAG_ASSOCIATION_ALREADY_EXISTS: 'Этот тег уже прикреплен к вебинару.',
	TAG_ALREADY_EXISTS: 'Тег с таким названием уже существует.',

	// --- УЧЕБНЫЕ ЗАВЕДЕНИЯ И ГРАЖДАНСТВО ---
	EDUCATION_NOT_FOUND_ERROR: 'Учебное заведение не найдено.',
	EDUCATION_INSTITUTION_ALREADY_EXISTS:
		'Учебное заведение с таким названием уже добавлено.',
	CITIZENSHIP_ALREADY_EXISTS:
		'Данное гражданство/страна уже есть в справочнике.',

	// --- УВЕДОМЛЕНИЯ ---
	NOTIFICATION_NOT_FOUND_BY_ID: 'Уведомление не найдено.',
	NOTIFICATION_TYPE_NOT_FOUND_ERROR: 'Тип уведомления не найден.',
	NOTIFICATION_TYPE_ALREADY_EXISTS: 'Такой тип уведомления уже существует.',
	NOTIFICATION_ACTIVE_CONNECTION_NOT_FOUND:
		'Соединение для мгновенных уведомлений разорвано. Попробуйте обновить страницу.',

	// --- API КЛЮЧИ ---
	API_KEY_NOT_FOUND_ERROR: 'Переданный API-ключ недействителен или удален.',
	API_KEY_ALREADY_EXISTS: 'API-ключ с таким описанием уже существует.',
}
