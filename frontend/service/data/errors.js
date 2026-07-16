export const BACKEND_ERRORS = {
	// --- СИСТЕМНЫЕ И СЛУЖЕБНЫЕ ОШИБКИ ---
	UNHANDLED:
		'Критический сбой архитектуры: Необработанное исключение (Application/Infrastructure/Domain/DB Error). Смотри бэктрейс бэкенда.',
	REDIS_SERVICE_UNAVAILABLE:
		'Сбой RedisConnectionError: Нет связи с Redis. Проверь запущен ли redis-server / контейнер и параметры подключения.',
	S3_SERVICE_UNAVAILABLE:
		'Сбой PutObjectError: Ошибка загрузки в S3 хранилище. Проверь бакет, права доступа (IAM) или сетевой доступ к S3.',
	BROKER_SERVICE_UNAVAILABLE:
		'Сбой BrokerUnavailableError: Очередь сообщений (RabbitMQ/Kafka) недоступна. Фоновые задачи не могут быть обработаны.',

	// --- АВТОРИЗАЦИЯ, ПРАВА И ПРОФИЛЬ ---
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
	PERMISSION_DENIED_ERROR:
		'PermissionDeniedError: RBAC/ABAC проверка провалена. У текущего пользователя нет нужной роли/разрешения.',
	ROLE_PERMISSION_APPEND_ERROR:
		'RolePermissionAppendError: Ошибка при связывании роли с новым разрешением в таблице связей.',

	// --- ТЕСТЫ И СЕCСИИ СТУДЕНТОВ ---
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
		'StudentTestSessionIsNotYetAssessed: Попытка получить оценку/просмотр ошибок до того, как тест был проверен (автоматически или преподавателем).',

	// --- КОНСТРУКТОР ТЕСТОВ И ВОПРОСЫ ---
	TEST_NOT_FOUND_BY_ID_ERROR:
		'TestNotFoundByIdError: Ошибка выборки теста. Проверь переданный test_id.',
	QUESTION_NOT_FOUND_BY_ID_ERROR:
		'QuestionNotFoundByID: Не удалось найти вопрос по переданному ID.',
	QUESTION_ALREADY_EXISTS_ERROR:
		'QuestionAlreadyExistsInTheTestError: Нарушение уникальности. Вопрос уже привязан к данному тесту.',
	QUESTION_TYPE_DOESNT_MATCH:
		'QuestionTypeDoesntMatch: Переданный тип ответа/структуры не соответствует объявленному типу вопроса (например, Single Choice вместо Multi).',
	QUESTION_OPTIONS_DEOSNT_MATCH:
		'QuestionOptionsDoesntMatch: Валидация вариантов ответов провалена. Количество или формат опций некорректны.',
	OPTION_NOT_FOUND_BY_ID:
		'OptionNotFoundById: Запрошенный ID варианта ответа (option_id) отсутствует в базе.',
	OPTION_ALREADY_EXISTS_ERROR:
		'OptionAlreadyExistsInTheQuestion: Дублирование варианта ответа в одном вопросе.',
	OPEN_QUESTION_TYPE_OPTION_ERROR:
		'OpenQuestionTypeOptionError: Для вопроса с открытым ответом переданы некорректные параметры или опции выбора, которых быть не должно.',

	// --- КУРСЫ, МОДУЛИ И ЛЕКЦИИ ---
	COURSE_NOT_FOUND:
		'CourseNotFoundError: В таблице courses нет записи с таким ID.',
	COURSE_ALREADY_EXISTS:
		'CourseAlreadyExistsError: Конфликт уникальности названия курса.',
	COURSE_READ_PERMISSION_ERROR:
		'CourseReadContentPermissionError: Студент не записан на курс или его подписка/доступ истекли.',
	COURSE_OWNERSHIP_ERROR:
		'CourseOwnershipRequiredError: Ошибка прав. Текущий пользователь не является владельцем (автором) курса.',
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
	MODULE_PRESENTATION_ALREADY_EXISTS:
		'ModulePresentationAlreadyExistsError: Для одного модуля можно загрузить только одну основную презентацию.',

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

export const STATUS_ERRORS = {
	// 4xx: Ошибки на стороне клиента
	400: 'Неверный запрос (проверьте введенные данные)',
	401: 'Ошибка авторизации',
	403: 'Доступ запрещён',
	404: 'Ничего не найдено',
	405: 'Метод запроса не поддерживается',
	408: 'Время ожидания запроса истекло',
	409: 'Конфликт состояния данных',
	422: 'Ошибка валидации (некорректные данные)',
	429: 'Слишком много запросов (подождите немного)',

	// 5xx: Ошибки на стороне сервера
	500: 'Сервер временно умер',
	501: 'Функционал еще не реализован на сервере',
	502: 'Плохой шлюз (ошибка проксирования)',
	503: 'Сервис временно недоступен',
	504: 'Шлюз не ответил вовремя (таймаут сервера)',
	507: 'На сервере закончилось свободное место',
}
