export const BACKEND_ERRORS = {
	// --- СИСТЕМНЫЕ И СЛУЖЕБНЫЕ ОШИБКИ ---
	UNHANDLED: {
		prod: 'Произошла непредвиденная ошибка. Мы уже работаем над её устранением.',
		dev: 'Критический сбой архитектуры: Необработанное исключение (Application/Infrastructure/Domain/DB Error). Смотри бэктрейс бэкенда.',
	},
	REDIS_SERVICE_UNAVAILABLE: {
		prod: 'Временный сбой базы данных. Пожалуйста, попробуйте позже.',
		dev: 'Сбой RedisConnectionError: Нет связи с Redis. Проверь запущен ли redis-server / контейнер и параметры подключения.',
	},
	S3_SERVICE_UNAVAILABLE: {
		prod: 'Не удалось сохранить файл. Попробуйте ещё раз.',
		dev: 'Сбой PutObjectError: Ошибка загрузки в S3 хранилище. Проверь бакет, права доступа (IAM) или сетевой доступ к S3.',
	},
	BROKER_SERVICE_UNAVAILABLE: {
		prod: 'Сервис временно перегружен. Пожалуйста, подождите.',
		dev: 'Сбой BrokerUnavailableError: Очередь сообщений (RabbitMQ/Kafka) недоступна. Фоновые задачи не могут быть обработаны.',
	},

	// --- АВТОРИЗАЦИЯ, ПРАВА И ПРОФИЛЬ ---
	AUTHENTICATION_ERROR: {
		prod: 'Ошибка входа. Неверные учетные данные.',
		dev: 'AuthenticationError: Не удалось аутентифицировать пользователя (неверный токен, сессия или подпись).',
	},
	INVALID_USER_PASSWORD: {
		prod: 'Ошибка входа. Неверные учетные данные.',
		dev: 'PasswordDoesntMatchError: Хэш переданного пароля не совпал с хэшем из базы данных.',
	},
	USER_ALREADY_AUTHENTICATED: {
		prod: 'Вы уже вошли в систему.',
		dev: 'AlreadyAuthenticatedError: Попытка повторной авторизации при наличии активной сессии/токена.',
	},
	USER_EMAIL_NOT_FOUND: {
		prod: 'Пользователь с таким email не найден.',
		dev: 'UserNotFoudByEmailError: Запрос к БД по email вернул null. Такого юзера нет в базе.',
	},
	USERNAME_ALREADY_EXIST: {
		prod: 'Имя пользователя уже занято.',
		dev: 'UsernameAlreadyExistsError: Нарушение уникальности (Unique Constraint) поля username в БД.',
	},
	EMAIL_ALREADY_EXISTS: {
		prod: 'Пользователь с таким email уже зарегистрирован.',
		dev: 'EmailAlreadyExistsError: Нарушение уникальности поля email. Такой аккаунт уже создан.',
	},
	PERMISSION_DENIED_ERROR: {
		prod: 'У вас недостаточно прав для выполнения этого действия.',
		dev: 'PermissionDeniedError: RBAC/ABAC проверка провалена. У текущего пользователя нет нужной роли/разрешения.',
	},
	ROLE_PERMISSION_APPEND_ERROR: {
		prod: 'Не удалось обновить права роли.',
		dev: 'RolePermissionAppendError: Ошибка при связывании роли с новым разрешением в таблице связей.',
	},

	// --- ТЕСТЫ И СЕCСИИ СТУДЕНТОВ ---
	STUDENT_TEST_SESSION_NOT_FOUND: {
		prod: 'Тестовая сессия не найдена.',
		dev: 'StudentTestSessionNotFound: В БД отсутствует запись о сессии тестирования по указанному ID.',
	},
	NO_ACTIVE_TEST_SESSION_FOUND: {
		prod: 'У вас нет активного тестирования.',
		dev: 'NoActiveTestSessionFound: Запрос ожидал запущенную сессию теста, но у студента сейчас нет активных прохождений.',
	},
	STUDENT_ALREADY_PASSING_CURRENT_TEST: {
		prod: 'Вы уже проходите это тестирование.',
		dev: 'StudentAlreadyPassingCurrentTest: Попытка начать новый тест, хотя старая сессия этого же теста ещё не закрыта.',
	},
	ACTIVE_STUDENT_TEST_SESSION_ALREADY_ENDED: {
		prod: 'Время на прохождение теста истекло.',
		dev: 'ActiveStudentTestSessionAlreadyEnded: Попытка совершить действие в тесте, время на который вышло (expired).',
	},
	STUDENT_ANSWER_ALREADY_SUBMITTED: {
		prod: 'Ответ на этот вопрос уже отправлен.',
		dev: 'StudentAnswerAlreadySubmitted: Повторная отправка (double submit) ответа на один и тот же вопрос в рамках сессии.',
	},
	STUDENT_ANSWER_NOT_FOUND: {
		prod: 'Ответ студента не найден.',
		dev: 'StudentAnswerNotFound: Запрос на модификацию или проверку ответа вернул фейл, ответа нет в базе.',
	},
	STUDENT_TEST_SESSION_IS_NOT_YET_ASSESSED: {
		prod: 'Результаты теста еще проверяются.',
		dev: 'StudentTestSessionIsNotYetAssessed: Попытка получить оценку/просмотр ошибок до того, как тест был проверен (автоматически или преподавателем).',
	},

	// --- КОНСТРУКТОР ТЕСТОВ И ВОПРОСЫ ---
	TEST_NOT_FOUND_BY_ID_ERROR: {
		prod: 'Тест не найден.',
		dev: 'TestNotFoundByIdError: Ошибка выборки теста. Проверь переданный test_id.',
	},
	QUESTION_NOT_FOUND_BY_ID_ERROR: {
		prod: 'Вопрос не найден.',
		dev: 'QuestionNotFoundByID: Не удалось найти вопрос по переданному ID.',
	},
	QUESTION_ALREADY_EXISTS_ERROR: {
		prod: 'Этот вопрос уже добавлен в тест.',
		dev: 'QuestionAlreadyExistsInTheTestError: Нарушение уникальности. Вопрос уже привязан к данному тесту.',
	},
	QUESTION_TYPE_DOESNT_MATCH: {
		prod: 'Неверный тип вопроса.',
		dev: 'QuestionTypeDoesntMatch: Переданный тип ответа/структуры не соответствует объявленному типу вопроса (например, Single Choice вместо Multi).',
	},
	QUESTION_OPTIONS_DEOSNT_MATCH: {
		prod: 'Варианты ответов не совпадают со структурой вопроса.',
		dev: 'QuestionOptionsDoesntMatch: Валидация вариантов ответов провалена. Количество или формат опций некорректны.',
	},
	OPTION_NOT_FOUND_BY_ID: {
		prod: 'Вариант ответа не найден.',
		dev: 'OptionNotFoundById: Запрошенный ID варианта ответа (option_id) отсутствует в базе.',
	},
	OPTION_ALREADY_EXISTS_ERROR: {
		prod: 'Такой вариант ответа уже есть в вопросе.',
		dev: 'OptionAlreadyExistsInTheQuestion: Дублирование варианта ответа в одном вопросе.',
	},
	OPEN_QUESTION_TYPE_OPTION_ERROR: {
		prod: 'Ошибка настройки открытого вопроса.',
		dev: 'OpenQuestionTypeOptionError: Для вопроса с открытым ответом переданы некорректные параметры или опции выбора, которых быть не должно.',
	},

	// --- КУРСЫ, МОДУЛИ И ЛЕКЦИИ ---
	COURSE_NOT_FOUND: {
		prod: 'Курс не найден.',
		dev: 'CourseNotFoundError: В таблице courses нет записи с таким ID.',
	},
	COURSE_ALREADY_EXISTS: {
		prod: 'Курс с таким названием уже существует.',
		dev: 'CourseAlreadyExistsError: Конфликт уникальности названия курса.',
	},
	COURSE_READ_PERMISSION_ERROR: {
		prod: 'У вас нет доступа к содержимому этого курса.',
		dev: 'CourseReadContentPermissionError: Студент не записан на курс или его подписка/доступ истекли.',
	},
	COURSE_OWNERSHIP_ERROR: {
		prod: 'Редактирование доступно только автору курса.',
		dev: 'CourseOwnershipRequiredError: Ошибка прав. Текущий пользователь не является владельцем (автором) курса.',
	},
	COURSE_FORMAT_NOT_FOUND_ERROR: {
		prod: 'Формат курса не найден.',
		dev: 'CourseFormatNotFoundError: Указанный format_id отсутствует в справочнике форматов.',
	},
	COURSE_FORMAT_ALREADY_EXISTS_ERROR: {
		prod: 'Такой формат курса уже зарегистрирован.',
		dev: 'CourseFormatAlreadyExistsError: Попытка продублировать существующий формат курса.',
	},
	COURSE_MODULE_NOT_FOUND: {
		prod: 'Модуль курса не найден.',
		dev: 'CourseModuleNotFoundError: Ошибка поиска модуля по ID.',
	},
	COURSE_MODULE_ALREADY_EXISTS: {
		prod: 'Такой модуль уже есть в курсе.',
		dev: 'CourseModuleAlreadyExistsError: Нарушение уникальности модуля внутри одного курса.',
	},
	COURSE_MODULE_INDEX_ORDER_TAKEN: {
		prod: 'Ошибка сортировки модулей.',
		dev: 'CourseModuleIndexOrderErrorTakenError: Порядковый номер модуля (index/order) уже занят другим модулем в этом курсе.',
	},
	MODULE_PRESENTATION_ALREADY_EXISTS: {
		prod: 'Презентация для этого модуля уже загружена.',
		dev: 'ModulePresentationAlreadyExistsError: Для одного модуля можно загрузить только одну основную презентацию.',
	},

	// --- КОНТЕНТ ЛЕКЦИЙ И ФАЙЛЫ ---
	LECTURE_CONTENT_NOT_FOUND: {
		prod: 'Контент лекции не найден.',
		dev: 'LectureContentNotFoundError: Отсутствует корневой контент или метаданные лекции.',
	},
	LECTURE_CONTENT_BLOCK_NOT_FOUND_ERROR: {
		prod: 'Блок лекции не найден.',
		dev: 'LectureContentBlockNotFoundError: Запрошенный блок (текст, видео, файл) по ID не найден в структуре лекции.',
	},
	INCORRECT_LECTURE_CONTENT_BLOCK_TYPE_ERROR: {
		prod: 'Неверный тип блока лекции.',
		dev: 'IncorrectLectureContentBlockTypeError: Передан тип блока, который не поддерживается схемой лекции.',
	},
	FILE_NOT_FOUND_ERROR: {
		prod: 'Прикрепленный файл не найден на сервере.',
		dev: 'AppendLectureAudio/Images/FilesBlockError: Файл физически отсутствует на сервере или повреждены связи в БД.',
	},
	FILE_METADATA_NOT_FOUND_ERROR: {
		prod: 'Информация о файле не найдена.',
		dev: 'FileMetadataNotFoundError: В таблице метаданных файлов нет записи о данном файле.',
	},

	// --- ЗАЯВКИ СТУДЕНТОВ И СЕРТИФИКАТЫ ---
	STUDENT_ALREADY_REGISTERED: {
		prod: 'Вы уже зарегистрированы на этот курс.',
		dev: 'StudentAlreadyRegisteredToCourse: Повторная запись студента на курс, где он уже обучается.',
	},
	STUDENT_COURSE_REQUEST_NOT_FOUND_ERROR: {
		prod: 'Заявка на курс не найдена.',
		dev: 'StudentCourseRequestNotFoundError: Запись заявки отсутствует по переданному ID.',
	},
	STUDENT_COURSE_REQUEST_ALREADY_EXISTS: {
		prod: 'Вы уже подали заявку на этот курс.',
		dev: 'StudentCourseRequestAlreadyExists: Попытка создать дубликат заявки, которая находится на рассмотрении.',
	},
	STUDENT_COURSE_CREATION_ERROR: {
		prod: 'Не удалось записаться на курс. Попробуйте позже.',
		dev: 'StudentCourseRequestCreationError: Ошибка бизнес-логики при автоматическом создании/одобрении записи на курс.',
	},
	COURSE_CERTIFICATE_TYPE_NOT_FOUND: {
		prod: 'Тип сертификата не найден.',
		dev: 'CertificateTypeNotFoundError: Указанный certificate_type_id отсутствует в системе.',
	},
	COURSE_CERTIFICATE_TYPES_ALREADY_EXISTS: {
		prod: 'Такой тип сертификата уже существует.',
		dev: 'CourseCertificateTypeAlreadyExists: Конфликт уникальности при создании нового типа сертификата.',
	},

	// --- ВЕБИНАРЫ И СПИКЕРЫ ---
	WEBINAR_NOT_FOUND: {
		prod: 'Вебинар не найден.',
		dev: 'WebinarNotFoundError: Запрос вебинара по ID вернул пустой результат.',
	},
	WEBINAR_ALREADY_EXISTS: {
		prod: 'Вебинар с такими параметрами уже запланирован.',
		dev: 'WebinarAlreadyExistsError: Конфликт расписания или названия вебинара.',
	},
	WEBINAR_SPEAKER_ALREADY_EXISTS: {
		prod: 'Этот спикер уже назначен на вебинар.',
		dev: 'WebinarSpeakerAlreadyExistsError: Попытка повторно привязать одного и того же спикера к вебинару.',
	},
	WEBINAR_TAG_ASSOCIATION_ERROR: {
		prod: 'Не удалось связать тег с вебинаром.',
		dev: 'WebinarTagAssociationError: Ошибка записи в промежуточную таблицу связей вебинаров и тегов.',
	},
	WEBINAR_TAG_ASSOCIATION_ALREADY_EXISTS: {
		prod: 'Этот тег уже добавлен к вебинару.',
		dev: 'WebinarTagAssociationAlreadyExists: Попытка продублировать связь тега и вебинара.',
	},
	TAG_ALREADY_EXISTS: {
		prod: 'Такой тег уже существует.',
		dev: 'TagsAlreadyExistsError: Попытка создать сущность тега с уже занятым именем.',
	},

	// --- УЧЕБНЫЕ ЗАВЕДЕНИЯ И ГРАЖДАНСТВО ---
	EDUCATION_NOT_FOUND_ERROR: {
		prod: 'Учебное заведение не найдено.',
		dev: 'EducationInstitutionNotFoundError: Ошибка поиска учебного заведения по ID.',
	},
	EDUCATION_INSTITUTION_ALREADY_EXISTS: {
		prod: 'Это учебное заведение уже внесено в базу.',
		dev: 'EducationInstitutionAlreadyExists: Найдено совпадение по названию/аккредитации учебного заведения.',
	},
	CITIZENSHIP_ALREADY_EXISTS: {
		prod: 'Такое гражданство уже есть в списке.',
		dev: 'CitizenshipAlreadyExistsError: Попытка добавить дублирующую запись в справочник стран/гражданств.',
	},

	// --- УВЕДОМЛЕНИЯ ---
	NOTIFICATION_NOT_FOUND_BY_ID: {
		prod: 'Уведомление не найдено.',
		dev: 'NotificationNotFoundByID: Запрошенное уведомление отсутствует в базе данных.',
	},
	NOTIFICATION_TYPE_NOT_FOUND_ERROR: {
		prod: 'Тип уведомления не поддерживается.',
		dev: 'NotificationTypeNotFoundError: Указанный тип нотификации отсутствует в системе.',
	},
	NOTIFICATION_TYPE_ALREADY_EXISTS: {
		prod: 'Такой тип уведомлений уже зарегистрирован.',
		dev: 'NotificationTypeAlreadyExistsError: Попытка создать дублирующий тип уведомления.',
	},
	NOTIFICATION_ACTIVE_CONNECTION_NOT_FOUND: {
		prod: 'Не удалось доставить уведомление в реальном времени.',
		dev: 'NotificationActiveConnectionNotFound: У пользователя нет активного WebSocket/SSE соединения в данный момент.',
	},

	// --- API КЛЮЧИ ---
	API_KEY_NOT_FOUND_ERROR: {
		prod: 'Токен доступа не найден или недействителен.',
		dev: 'APIKeyNotFoundError: Переданный API-ключ отсутствует в таблице валидных токенов интеграции.',
	},
	API_KEY_ALREADY_EXISTS: {
		prod: 'Интеграция с таким описанием уже существует.',
		dev: 'APIKeyCommentAlreadyExistsError: Найдено совпадение по комментарию/имени для создаваемого API ключа.',
	},
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
