// Конфигурация игры
// Каждый уровень содержит:
// - image: путь к изображению с правильной таблицей
// - rows: количество строк
// - cols: количество столбцов
// - elements: массив элементов (можно использовать изображения или текст)

const gameLevels = [
  {
    level: 1,
    name: 'Поле внимания',
    name_en: 'Field of attention',
    rows: 8,
    cols: 2,
    headers: ['Уровень', 'Поле внимания'],
    headers_en: ['Level', 'Field of attention'],
    elements: [
      // Строка 1
      { id: 1, content: '1', content_en: '1' },
      { id: 2, content: 'один объект', content_en: 'one object' },
      // Строка 2
      { id: 3, content: '2', content_en: '2' },
      { id: 4, content: 'много объектов', content_en: 'many objects' },
      // Строка 3
      { id: 5, content: '3', content_en: '3' },
      { id: 6, content: 'один процесс', content_en: 'one process' },
      // Строка 4
      { id: 7, content: '4', content_en: '4' },
      { id: 8, content: 'много процессов', content_en: 'many processes' },
      // Строка 5
      { id: 9, content: '5', content_en: '5' },
      { id: 10, content: 'одна карта', content_en: 'one map' },
      // Строка 6
      { id: 11, content: '6', content_en: '6' },
      { id: 12, content: 'много карт', content_en: 'many maps' },
      // Строка 7
      { id: 13, content: '7', content_en: '7' },
      { id: 14, content: 'одна система', content_en: 'one system' },
      // Строка 8
      { id: 15, content: '8', content_en: '8' },
      { id: 16, content: 'много систем', content_en: 'many systems' }
    ]
  },
  {
    level: 2,
    name: 'Геометрия',
    name_en: 'Geometry',
    rows: 8,
    cols: 2,
    headers: ['Уровень', 'Геометрия'],
    headers_en: ['Level', 'Geometry'],
    elements: [
      // Строка 1
      { id: 1, content: '1', content_en: '1' },
      { id: 2, content: 'Точка', content_en: 'Point' },
      // Строка 2
      { id: 3, content: '2', content_en: '2' },
      { id: 4, content: 'Куча точек', content_en: 'A heap of points' },
      // Строка 3
      { id: 5, content: '3', content_en: '3' },
      { id: 6, content: 'линия', content_en: 'line' },
      // Строка 4
      { id: 7, content: '4', content_en: '4' },
      { id: 8, content: 'пучок линий', content_en: 'a bundle of lines' },
      // Строка 5
      { id: 9, content: '5', content_en: '5' },
      { id: 10, content: 'плоскость', content_en: 'plane' },
      // Строка 6
      { id: 11, content: '6', content_en: '6' },
      { id: 12, content: 'пачка плоскостей', content_en: 'a stack of planes' },
      // Строка 7
      { id: 13, content: '7', content_en: '7' },
      { id: 14, content: 'универсум', content_en: 'universe' },
      // Строка 8
      { id: 15, content: '8', content_en: '8' },
      { id: 16, content: 'мультиверсум', content_en: 'multiverse' }
    ]
  },
  {
    level: 3,
    name: 'Мышление',
    name_en: 'Thinking',
    rows: 8,
    cols: 6,
    headers: ['Уровень', 'Вопрос', 'Операция внутрь', 'Операция наружу', 'Категория внутрь', 'Категория наружу'],
    headers_en: ['Level', 'Question', 'Operation inward', 'Operation outward', 'Category inward', 'Category outward'],
    elements: [
      // Строка 1
      { id: 1, content: '1', content_en: '1' },
      { id: 2, content: 'Что?', content_en: 'What?' },
      { id: 3, content: 'Узнавание', content_en: 'Recognition' },
      { id: 4, content: 'Наименование', content_en: 'Naming' },
      { id: 5, content: 'Вещь', content_en: 'Thing' },
      { id: 6, content: 'Имя', content_en: 'Name' },
      // Строка 2
      { id: 7, content: '2', content_en: '2' },
      { id: 8, content: 'Где?', content_en: 'Where?' },
      { id: 9, content: 'Различение', content_en: 'Distinction' },
      { id: 10, content: 'Разграничение', content_en: 'Demarcation' },
      { id: 11, content: 'Пространство', content_en: 'Space' },
      { id: 12, content: 'Граница', content_en: 'Boundary' },
      // Строка 3
      { id: 13, content: '3', content_en: '3' },
      { id: 14, content: 'Когда?', content_en: 'When?' },
      { id: 15, content: 'Целедостижение', content_en: 'Goal attainment' },
      { id: 16, content: 'Целеполагание', content_en: 'Goal setting' },
      { id: 17, content: 'Время', content_en: 'Time' },
      { id: 18, content: 'Движение', content_en: 'Movement' },
      // Строка 4
      { id: 19, content: '4', content_en: '4' },
      { id: 20, content: 'Как?', content_en: 'How?' },
      { id: 21, content: 'Ряды', content_en: 'Series' },
      { id: 22, content: 'Параллельные', content_en: 'Parallels' },
      { id: 23, content: 'Роль', content_en: 'Role' },
      { id: 24, content: 'Способ', content_en: 'Method' },
      // Строка 5
      { id: 25, content: '5', content_en: '5' },
      { id: 26, content: 'Кто?', content_en: 'Who?' },
      { id: 27, content: 'Свобода', content_en: 'Freedom' },
      { id: 28, content: 'Выбор', content_en: 'Choice' },
      { id: 29, content: 'Случайность', content_en: 'Chance' },
      { id: 30, content: 'Риск', content_en: 'Risk' },
      // Строка 6
      { id: 31, content: '6', content_en: '6' },
      { id: 32, content: 'Почему?', content_en: 'Why?' },
      { id: 33, content: 'Доказательство', content_en: 'Proof' },
      { id: 34, content: 'Сомнение', content_en: 'Doubt' },
      { id: 35, content: 'Причина', content_en: 'Cause' },
      { id: 36, content: 'Следствие', content_en: 'Effect' },
      // Строка 7
      { id: 37, content: '7', content_en: '7' },
      { id: 38, content: 'А если?', content_en: 'What if?' },
      { id: 39, content: 'Аномалия', content_en: 'Anomaly' },
      { id: 40, content: 'Парадокс', content_en: 'Paradox' },
      { id: 41, content: 'Гений', content_en: 'Genius' },
      { id: 42, content: 'Открытие', content_en: 'Discovery' },
      // Строка 8
      { id: 43, content: '8', content_en: '8' },
      { id: 44, content: 'А зачем?', content_en: 'What for?' },
      { id: 45, content: 'Гармония', content_en: 'Harmony' },
      { id: 46, content: 'Баланс', content_en: 'Balance' },
      { id: 47, content: 'Учет интересов всех участников, сколь угодно на нас непохожих', content_en: 'Considering the interests of all participants, however unlike us' },
      { id: 48, content: 'Учет отдаленных последствий', content_en: 'Considering distant consequences' }
    ]
  },
  {
    level: 4,
    name: 'Сознание',
    name_en: 'Co-knowledge',
    rows: 8,
    cols: 4,
    headers: ['Уровень', 'Тип сознания', 'Положительное', 'Отрицательное'],
    headers_en: ['Level', 'Type of co-knowledge', 'Positive', 'Negative'],
    elements: [
      // Строка 1
      { id: 1, content: '1', content_en: '1' },
      { id: 2, content: 'Магическое', content_en: 'Magical' },
      { id: 3, content: 'Чудо', content_en: 'Miracle' },
      { id: 4, content: 'Тайна', content_en: 'Mystery' },
      // Строка 2
      { id: 5, content: '2', content_en: '2' },
      { id: 6, content: 'Этическое', content_en: 'Ethical' },
      { id: 7, content: 'Добро', content_en: 'Good' },
      { id: 8, content: 'Зло', content_en: 'Evil' },
      // Строка 3
      { id: 9, content: '3', content_en: '3' },
      { id: 10, content: 'Эстетическое', content_en: 'Aesthetic' },
      { id: 11, content: 'Красота', content_en: 'Beauty' },
      { id: 12, content: 'Уродство', content_en: 'Ugliness' },
      // Строка 4
      { id: 13, content: '4', content_en: '4' },
      { id: 14, content: 'Ролевое', content_en: 'Role-based' },
      { id: 15, content: 'Соблюдение', content_en: 'Compliance' },
      { id: 16, content: 'Нарушение', content_en: 'Violation' },
      // Строка 5
      { id: 17, content: '5', content_en: '5' },
      { id: 18, content: 'Свободное', content_en: 'Free' },
      { id: 19, content: 'Активность', content_en: 'Activity' },
      { id: 20, content: 'Пассивность', content_en: 'Passivity' },
      // Строка 6
      { id: 21, content: '6', content_en: '6' },
      { id: 22, content: 'Теоретическое', content_en: 'Theoretical' },
      { id: 23, content: 'Истина', content_en: 'Truth' },
      { id: 24, content: 'Ложь', content_en: 'Falsehood' },
      // Строка 7
      { id: 25, content: '7', content_en: '7' },
      { id: 26, content: 'Парадоксальное', content_en: 'Paradoxical' },
      { id: 27, content: 'Новое', content_en: 'New' },
      { id: 28, content: 'Старое', content_en: 'Old' },
      // Строка 8
      { id: 29, content: '8', content_en: '8' },
      { id: 30, content: 'Универсальное', content_en: 'Universal' },
      { id: 31, content: 'Гармония', content_en: 'Harmony' },
      { id: 32, content: 'Какофония', content_en: 'Cacophony' }
    ]
  },
  {
    level: 5,
    name: 'Взаимодействие',
    name_en: 'Interaction',
    rows: 8,
    cols: 6,
    headers: ['Уровень', 'нейтрально', 'положительно', 'отрицательно', 'Другой', 'Отношение к детям'],
    headers_en: ['Level', 'neutral', 'positive', 'negative', 'The Other', 'Attitude to children'],
    elements: [
      // Строка 1
      { id: 1, content: '1', content_en: '1' },
      { id: 2, content: 'фиксация', content_en: 'fixation' },
      { id: 3, content: 'концентрация', content_en: 'concentration' },
      { id: 4, content: 'изоляция', content_en: 'isolation' },
      { id: 5, content: 'как вещь', content_en: 'as a thing' },
      { id: 6, content: 'как вещь', content_en: 'as a thing' },
      // Строка 2
      { id: 7, content: '2', content_en: '2' },
      { id: 8, content: 'семья', content_en: 'family' },
      { id: 9, content: 'свои', content_en: 'ours' },
      { id: 10, content: 'чужие', content_en: 'strangers' },
      { id: 11, content: 'как одна из вещей', content_en: 'as one of the things' },
      { id: 12, content: 'как одна из вещей', content_en: 'as one of the things' },
      // Строка 3
      { id: 13, content: '3', content_en: '3' },
      { id: 14, content: 'борьба', content_en: 'struggle' },
      { id: 15, content: 'доминирование', content_en: 'domination' },
      { id: 16, content: 'подчинение', content_en: 'submission' },
      { id: 17, content: 'как средство', content_en: 'as a means' },
      { id: 18, content: 'как помеха', content_en: 'as an obstacle' },
      // Строка 4
      { id: 19, content: '4', content_en: '4' },
      { id: 20, content: 'правила', content_en: 'rules' },
      { id: 21, content: 'координация', content_en: 'coordination' },
      { id: 22, content: 'взаимозависимость', content_en: 'interdependence' },
      { id: 23, content: 'как партнер', content_en: 'as a partner' },
      { id: 24, content: 'как роль в ролевой системе', content_en: 'as a role in a role system' },
      // Строка 5
      { id: 25, content: '5', content_en: '5' },
      { id: 26, content: 'импровизация', content_en: 'improvisation' },
      { id: 27, content: 'свобода', content_en: 'freedom' },
      { id: 28, content: 'непредсказуемость', content_en: 'unpredictability' },
      { id: 29, content: 'конкурент', content_en: 'competitor' },
      { id: 30, content: 'как фактор неопределенности', content_en: 'as a factor of uncertainty' },
      // Строка 6
      { id: 31, content: '6', content_en: '6' },
      { id: 32, content: 'диалог', content_en: 'dialogue' },
      { id: 33, content: 'обоснование', content_en: 'justification' },
      { id: 34, content: 'опровержение', content_en: 'refutation' },
      { id: 35, content: 'собеседник', content_en: 'interlocutor' },
      { id: 36, content: 'коллега', content_en: 'colleague' },
      // Строка 7
      { id: 37, content: '7', content_en: '7' },
      { id: 38, content: 'оригинальность подхода', content_en: 'originality of approach' },
      { id: 39, content: 'новаторство', content_en: 'innovation' },
      { id: 40, content: 'разрушение традиции', content_en: 'breaking tradition' },
      { id: 41, content: 'мыслитель', content_en: 'thinker' },
      { id: 42, content: 'мыслящее существо', content_en: 'a thinking being' },
      // Строка 8
      { id: 43, content: '8', content_en: '8' },
      { id: 44, content: 'моделирование чужого сознания', content_en: "modeling another's co-knowledge" },
      { id: 45, content: 'Мультиверсум', content_en: 'Multiverse' },
      { id: 46, content: 'Абсолютная эмпатия', content_en: 'Absolute empathy' },
      { id: 47, content: 'Другая вселенная', content_en: 'Another universe' },
      { id: 48, content: 'Другая вселенная', content_en: 'Another universe' }
    ]
  },
  {
    level: 6,
    name: 'Эпоха',
    name_en: 'Era',
    rows: 8,
    cols: 2,
    headers: ['Уровень', 'Эпоха'],
    headers_en: ['Level', 'Era'],
    elements: [
      // Строка 1
      { id: 1, content: '1', content_en: '1' },
      { id: 2, content: 'Охотники', content_en: 'Hunters' },
      // Строка 2
      { id: 3, content: '2', content_en: '2' },
      { id: 4, content: 'Аграрии', content_en: 'Agrarians' },
      // Строка 3
      { id: 5, content: '3', content_en: '3' },
      { id: 6, content: 'Античные империи', content_en: 'Ancient empires' },
      // Строка 4
      { id: 7, content: '4', content_en: '4' },
      { id: 8, content: 'Средневековье', content_en: 'The Middle Ages' },
      // Строка 5
      { id: 9, content: '5', content_en: '5' },
      { id: 10, content: 'Возрождение-Реформация', content_en: 'Renaissance-Reformation' },
      // Строка 6
      { id: 11, content: '6', content_en: '6' },
      { id: 12, content: 'индустриальный век', content_en: 'Industrial age' },
      // Строка 7
      { id: 13, content: '7', content_en: '7' },
      { id: 14, content: 'XX век', content_en: '20th century' },
      // Строка 8
      { id: 15, content: '8', content_en: '8' },
      { id: 16, content: 'Наше время', content_en: 'Our time' }
    ]
  },
  {
    level: 7,
    name: 'Темперамент',
    name_en: 'Temperament',
    rows: 4,
    cols: 5,
    headers: ['Темперамент', 'Самый-самый', 'Смех - слезы', 'Агрессия - депрессия', 'Самооценка'],
    headers_en: ['Temperament', 'The most', 'Laughter - tears', 'Aggression - depression', 'Self-esteem'],
    elements: [
      // Строка 1
      { id: 1, content: 'Холерик', content_en: 'Choleric' },
      { id: 2, content: 'Быстрый', content_en: 'Fast' },
      { id: 3, content: 'Сарказм', content_en: 'Sarcasm' },
      { id: 4, content: 'Агрессия', content_en: 'Aggression' },
      { id: 5, content: 'завышенная', content_en: 'inflated' },
      // Строка 2
      { id: 6, content: 'Сангвиник', content_en: 'Sanguine' },
      { id: 7, content: 'Доброжелательный', content_en: 'Friendly' },
      { id: 8, content: 'Юмор', content_en: 'Humor' },
      { id: 9, content: 'Бодрость', content_en: 'Cheerfulness' },
      { id: 10, content: 'положительная', content_en: 'positive' },
      // Строка 3
      { id: 11, content: 'Флегматик', content_en: 'Phlegmatic' },
      { id: 12, content: 'Выносливый', content_en: 'Enduring' },
      { id: 13, content: 'Нейтрален', content_en: 'Neutral' },
      { id: 14, content: 'Невозмутимость', content_en: 'Composure' },
      { id: 15, content: 'непонятно какая', content_en: 'unclear' },
      // Строка 4
      { id: 16, content: 'Меланхолик', content_en: 'Melancholic' },
      { id: 17, content: 'Чувствительный', content_en: 'Sensitive' },
      { id: 18, content: 'Слезы', content_en: 'Tears' },
      { id: 19, content: 'Депрессия', content_en: 'Depression' },
      { id: 20, content: 'неустойчивая', content_en: 'unstable' }
    ]
  },
  {
    level: 8,
    name: 'Кодировки',
    name_en: 'Encodings',
    rows: 3,
    cols: 7,
    headers: ['Кодировки', '1', '2', '3', '12', '23', '13'],
    headers_en: ['Encodings', '1', '2', '3', '12', '23', '13'],
    elements: [
      // Строка 1
      { id: 1, content: 'мелкие', content_en: 'small' },
      { id: 2, content: 'ухо', content_en: 'ear' },
      { id: 3, content: 'глаз', content_en: 'eye' },
      { id: 4, content: 'рука', content_en: 'hand' },
      { id: 5, content: 'обоняние', content_en: 'smell' },
      { id: 6, content: 'вкус', content_en: 'taste' },
      { id: 7, content: 'интуиция', content_en: 'intuition' },
      // Строка 2
      { id: 8, content: 'средние', content_en: 'medium' },
      { id: 9, content: 'текст', content_en: 'text' },
      { id: 10, content: 'картинка', content_en: 'picture' },
      { id: 11, content: 'схема', content_en: 'diagram' },
      { id: 12, content: 'таблица', content_en: 'table' },
      { id: 13, content: 'диаграмма', content_en: 'chart' },
      { id: 14, content: 'иллюстрация', content_en: 'illustration' },
      // Строка 3
      { id: 15, content: 'крупные', content_en: 'large' },
      { id: 16, content: 'образы', content_en: 'images' },
      { id: 17, content: 'смыслы', content_en: 'meanings' },
      { id: 18, content: 'сценарии', content_en: 'scenarios' },
      { id: 19, content: 'видения', content_en: 'visions' },
      { id: 20, content: 'метафоры', content_en: 'metaphors' },
      { id: 21, content: 'эвристики', content_en: 'heuristics' }
    ]
  }
  // Добавьте больше уровней здесь
];

// ==== Мультиязычность (RU/EN) ====
const I18N = {
  ru: {
    title: 'Расставь элементы правильно',
    desc: 'ОПИСАНИЕ СИСТЕМЫ',
    series: 'Мышление - Со-знание - Взаимодействие',
    btnStart: 'ИГРА',
    btnCheck: 'ГОТОВО',
    btnRestart: 'СНАЧАЛА',
    btnPrev: '← Предыдущий',
    btnNext: 'Следующий →',
    refDefault: 'Правильное расположение:',
    sufxPlace: ' - Поставь на место:',
    sufxCorrect: ' - Правильное расположение:',
    congrats: '🎉 Поздравляем!',
    congratsText: 'Вы правильно расставили все элементы!',
    resultTitle: 'Результат:',
    correctOf: (c, t) => `Правильно: ${c} из ${t}`,
    incorrect: (n) => `Неправильно: ${n}`,
    hintRed: 'Неправильно поставленные элементы подсвечены красным.',
    switchLabel: 'EN',
    backAria: 'Вернуться в Дискурс',
    backTitle: 'Вернуться в Дискурс'
  },
  en: {
    title: 'Arrange the elements correctly',
    desc: 'SYSTEM DESCRIPTION',
    series: 'Thinking - Co-knowledge - Interaction',
    btnStart: 'PLAY',
    btnCheck: 'DONE',
    btnRestart: 'RESTART',
    btnPrev: '← Previous',
    btnNext: 'Next →',
    refDefault: 'Correct arrangement:',
    sufxPlace: ' - Put in place:',
    sufxCorrect: ' - Correct arrangement:',
    congrats: '🎉 Congratulations!',
    congratsText: 'You arranged all the elements correctly!',
    resultTitle: 'Result:',
    correctOf: (c, t) => `Correct: ${c} of ${t}`,
    incorrect: (n) => `Incorrect: ${n}`,
    hintRed: 'Incorrectly placed elements are highlighted in red.',
    switchLabel: 'RU',
    backAria: 'Back to Discourse',
    backTitle: 'Back to Discourse'
  }
};

function discourseUrl() {
  return currentLang === 'en'
    ? 'https://jfeldman777.github.io/gala/en.html?p=10.3.3'
    : 'https://jfeldman777.github.io/gala/index.html?p=10.3.3';
}

function getLang() {
  try {
    const url = new URLSearchParams(window.location.search).get('lang');
    if (url === 'en' || url === 'ru') return url;
    const saved = localStorage.getItem('selfTestLang');
    if (saved === 'en' || saved === 'ru') return saved;
  } catch (e) { /* ignore */ }
  return 'ru';
}

let currentLang = getLang();
function t() { return I18N[currentLang] || I18N.ru; }
function levelName(level) {
  return (currentLang === 'en' && level.name_en) ? level.name_en : level.name;
}
function levelHeaders(level) {
  return (currentLang === 'en' && level.headers_en) ? level.headers_en : level.headers;
}
function cellContent(element) {
  if (!element) return '';
  return (currentLang === 'en' && element.content_en != null) ? element.content_en : element.content;
}

function applyStaticI18n() {
  const s = t();
  document.documentElement.lang = currentLang;
  document.title = currentLang === 'en' ? ('Game: ' + s.title) : ('Игра: ' + s.title);
  const setText = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
  setText('start-game-btn', s.btnStart);
  setText('check-btn', s.btnCheck);
  setText('restart-btn', s.btnRestart);
  setText('prev-level-btn', s.btnPrev);
  setText('next-level-btn', s.btnNext);
  const h1 = document.querySelector('.container h1'); if (h1) h1.textContent = s.title;
  const descBtn = document.querySelector('.desc-btn');
  if (descBtn) { descBtn.textContent = s.desc; descBtn.setAttribute('href', 'help.html?lang=' + currentLang); }
  const seriesEl = document.querySelector('a[href^="thinking-series"]');
  if (seriesEl) {
    seriesEl.textContent = s.series;
    // Игра «Мышление-Сознание-Взаимодействие» ещё не переведена — прячем ссылку в EN
    seriesEl.parentElement.style.display = currentLang === 'en' ? 'none' : '';
  }
  const langBtn = document.getElementById('lang-switch');
  if (langBtn) langBtn.textContent = s.switchLabel;
  const backBtn = document.getElementById('discourse-back');
  if (backBtn) {
    backBtn.href = discourseUrl();
    backBtn.setAttribute('aria-label', s.backAria);
    backBtn.setAttribute('title', s.backTitle);
  }
}

function setLang(lang) {
  if (lang !== 'en' && lang !== 'ru') return;
  currentLang = lang;
  try { localStorage.setItem('selfTestLang', lang); } catch (e) { /* ignore */ }
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url);
  } catch (e) { /* ignore */ }
  applyStaticI18n();
  initLevel(currentLevel);
}

let currentLevel = 0;
let correctOrder = [];
let gameOrder = [];
let draggedElement = null;
let draggedIndex = null;
let gameStarted = false;
let gameChecked = false;

document.addEventListener('DOMContentLoaded', function() {
  const startGameBtn = document.getElementById('start-game-btn');
  const checkBtn = document.getElementById('check-btn');
  const restartBtn = document.getElementById('restart-btn');
  const prevLevelBtn = document.getElementById('prev-level-btn');
  const nextLevelBtn = document.getElementById('next-level-btn');
  
  startGameBtn.addEventListener('click', function() {
    startGame();
  });
  
  checkBtn.addEventListener('click', function() {
    checkGame();
  });
  
  restartBtn.addEventListener('click', function() {
    restartGame();
  });
  
  prevLevelBtn.addEventListener('click', function() {
    if (currentLevel > 0) {
      currentLevel--;
      initLevel(currentLevel);
    }
  });
  
  nextLevelBtn.addEventListener('click', function() {
    if (currentLevel < gameLevels.length - 1) {
      currentLevel++;
      initLevel(currentLevel);
    }
  });
  
  const langBtn = document.getElementById('lang-switch');
  if (langBtn) {
    langBtn.addEventListener('click', function() {
      setLang(currentLang === 'en' ? 'ru' : 'en');
    });
  }

  applyStaticI18n();
  initLevel(0);
  updateLevelButtons();
});

function initLevel(levelIndex) {
  currentLevel = levelIndex;
  gameStarted = false;
  gameChecked = false;
  const level = gameLevels[levelIndex];
  
  // Создаем правильный порядок
  correctOrder = [...level.elements];
  
  // Создаем неправильный порядок (перемешиваем только данные ячейки, не заголовок и первый столбец)
  gameOrder = shuffleGameData([...level.elements], level);
  
  // Скрываем кнопки и результат
  document.getElementById('check-btn').style.display = 'none';
  document.getElementById('restart-btn').style.display = 'none';
  document.getElementById('result-section').style.display = 'none';
  document.getElementById('start-game-btn').style.display = 'block';
  
  // Обновляем кнопки переключения уровней
  updateLevelButtons();
  
  // Создаем справочную таблицу (правильное расположение)
  createReferenceTable(level, false);
}

function updateLevelButtons() {
  const prevBtn = document.getElementById('prev-level-btn');
  const nextBtn = document.getElementById('next-level-btn');
  
  if (currentLevel > 0) {
    prevBtn.style.display = 'inline-block';
  } else {
    prevBtn.style.display = 'none';
  }
  
  if (currentLevel < gameLevels.length - 1) {
    nextBtn.style.display = 'inline-block';
  } else {
    nextBtn.style.display = 'none';
  }
}

function shuffleGameData(elements, level) {
  // Создаем массив только для данных ячеек (без первого столбца)
  // Первый столбец - это элементы с индексами: 0, cols, 2*cols, 3*cols, ...
  const dataElements = [];
  const firstColumnIndices = [];
  
  for (let row = 0; row < level.rows; row++) {
    firstColumnIndices.push(row * level.cols); // Индекс первого столбца в строке
  }
  
  // Разделяем элементы на первый столбец и остальные
  const firstColumn = [];
  const otherData = [];
  
  elements.forEach((element, index) => {
    if (firstColumnIndices.includes(index)) {
      firstColumn.push(element);
    } else {
      otherData.push(element);
    }
  });
  
  // Перемешиваем только остальные данные
  const shuffledOther = shuffleArray(otherData);
  
  // Собираем обратно: первый столбец остается на месте, остальное перемешано
  const result = [];
  let otherIndex = 0;
  
  for (let row = 0; row < level.rows; row++) {
    for (let col = 0; col < level.cols; col++) {
      const index = row * level.cols + col;
      if (col === 0) {
        // Первый столбец - берем из правильного порядка
        result.push(firstColumn[row]);
      } else {
        // Остальные столбцы - берем из перемешанных
        result.push(shuffledOther[otherIndex]);
        otherIndex++;
      }
    }
  }
  
  return result;
}

function startGame() {
  gameStarted = true;
  gameChecked = false;
  const level = gameLevels[currentLevel];
  
  // Скрываем кнопку ИГРА, показываем ГОТОВО
  document.getElementById('start-game-btn').style.display = 'none';
  document.getElementById('check-btn').style.display = 'inline-block';
  document.getElementById('restart-btn').style.display = 'none';
  document.getElementById('result-section').style.display = 'none';
  
  // Превращаем справочную таблицу в игровую (с перемешанными данными)
  createReferenceTable(level, true);
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createReferenceTable(level, isGameMode) {
  const referenceTable = document.getElementById('reference-table');
  referenceTable.innerHTML = '';
  
  // Обновляем название уровня
  const levelNameEl = document.getElementById('level-name');
  const name = levelName(level);
  if (levelNameEl && name) {
    if (isGameMode) {
      levelNameEl.textContent = name + t().sufxPlace;
    } else {
      levelNameEl.textContent = name + t().sufxCorrect;
    }
  }
  
  // Используем правильный порядок или игровой порядок
  const orderToUse = isGameMode ? gameOrder : correctOrder;
  
  // Создаем HTML таблицу
  const table = document.createElement('table');
  table.id = 'main-table';
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  table.style.margin = '0 auto';
  table.style.border = '2px solid #10b981';
  table.style.borderRadius = '8px';
  table.style.overflow = 'hidden';
  
    // Создаем заголовок таблицы (не перетаскивается)
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = levelHeaders(level) || ['Уровень', 'Тип сознания', 'Положительное', 'Отрицательное'];
    headers.forEach(headerText => {
    const th = document.createElement('th');
    th.textContent = headerText;
    th.style.padding = '12px';
    th.style.backgroundColor = '#10b981';
    th.style.color = 'white';
    th.style.textAlign = 'left';
    th.style.border = '1px solid #059669';
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);
  
  // Создаем тело таблицы
  const tbody = document.createElement('tbody');
  for (let row = 0; row < level.rows; row++) {
    const tr = document.createElement('tr');
    for (let col = 0; col < level.cols; col++) {
      const index = row * level.cols + col;
      const element = orderToUse[index];
      const td = document.createElement('td');
      td.textContent = cellContent(element);
      td.style.padding = '10px';
      td.style.border = '1px solid #cbd5e1';
      td.style.backgroundColor = row % 2 === 0 ? '#ffffff' : '#f8fafc';
      
      // Если это игровой режим, делаем ячейки перетаскиваемыми (кроме первого столбца и заголовка)
      if (isGameMode && col > 0) {
        td.className = 'game-cell';
        td.draggable = !gameChecked;
        td.dataset.row = row;
        td.dataset.col = col;
        td.dataset.elementId = element ? element.id : null;
        td.style.cursor = gameChecked ? 'default' : 'move';
        
        // Обработчики drag and drop только если игра не проверена
        if (!gameChecked) {
          td.addEventListener('dragstart', handleCellDragStart);
          td.addEventListener('dragend', handleCellDragEnd);
          td.addEventListener('dragover', handleCellDragOver);
          td.addEventListener('dragenter', handleCellDragEnter);
          td.addEventListener('dragleave', handleCellDragLeave);
          td.addEventListener('drop', handleCellDrop);
        }
      }
      
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  
  referenceTable.appendChild(table);
  
  // Обновляем состояния ячеек если игра проверена
  if (isGameMode && gameChecked) {
    updateTableCellStates(level);
  }
}

// Обработчики для перетаскивания ячеек таблицы
let draggedCell = null;

function handleCellDragStart(e) {
  draggedCell = this;
  this.style.opacity = '0.5';
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleCellDragEnd(e) {
  this.style.opacity = '1';
  // Убираем класс drag-over со всех ячеек
  document.querySelectorAll('.game-cell').forEach(cell => {
    cell.classList.remove('drag-over');
  });
}

function handleCellDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.dataTransfer.dropEffect = 'move';
  return false;
}

function handleCellDragEnter(e) {
  if (this !== draggedCell && this.classList.contains('game-cell')) {
    this.classList.add('drag-over');
  }
}

function handleCellDragLeave(e) {
  this.classList.remove('drag-over');
}

function handleCellDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  
  if (draggedCell !== this && this.classList.contains('game-cell') && !gameChecked) {
    const level = gameLevels[currentLevel];
    
    // Получаем координаты ячеек
    const sourceRow = parseInt(draggedCell.dataset.row);
    const sourceCol = parseInt(draggedCell.dataset.col);
    const targetRow = parseInt(this.dataset.row);
    const targetCol = parseInt(this.dataset.col);
    
    // Меняем местами элементы в массиве gameOrder
    const sourceIndex = sourceRow * level.cols + sourceCol;
    const targetIndex = targetRow * level.cols + targetCol;
    
    [gameOrder[sourceIndex], gameOrder[targetIndex]] = 
      [gameOrder[targetIndex], gameOrder[sourceIndex]];
    
    // Перерисовываем таблицу
    createReferenceTable(level, true);
  }
  
  this.classList.remove('drag-over');
  return false;
}

function updateTableCellStates(level) {
  const cells = document.querySelectorAll('.game-cell');
  cells.forEach(cell => {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    const index = row * level.cols + col;
    const elementId = parseInt(cell.dataset.elementId);
    const correctId = correctOrder[index].id;
    
    cell.classList.remove('correct', 'incorrect');
    
    if (elementId === correctId) {
      cell.classList.add('correct');
    } else {
      cell.classList.add('incorrect');
    }
  });
}

function handleDragStart(e) {
  draggedElement = this;
  draggedIndex = parseInt(this.dataset.index);
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragEnd(e) {
  this.classList.remove('dragging');
  
  // Убираем класс drag-over со всех элементов
  document.querySelectorAll('#game-table .table-cell').forEach(cell => {
    cell.classList.remove('drag-over');
  });
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.dataTransfer.dropEffect = 'move';
  return false;
}

function handleDragEnter(e) {
  if (this !== draggedElement) {
    this.classList.add('drag-over');
  }
}

function handleDragLeave(e) {
  this.classList.remove('drag-over');
}

function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  
  if (draggedElement !== this && !gameChecked) {
    const dropIndex = parseInt(this.dataset.index);
    
    // Меняем местами элементы в массиве
    [gameOrder[draggedIndex], gameOrder[dropIndex]] = 
      [gameOrder[dropIndex], gameOrder[draggedIndex]];
    
    // Перерисовываем таблицу
    const level = gameLevels[currentLevel];
    createGameTable(level);
  }
  
  this.classList.remove('drag-over');
  return false;
}

function checkGame() {
  gameChecked = true;
  const level = gameLevels[currentLevel];
  
  // Перерисовываем таблицу с отключенным drag-and-drop и подсветкой
  createReferenceTable(level, true);
  
  // Подсчитываем правильные и неправильные элементы (только данные ячейки, без первого столбца)
  let correctCount = 0;
  let incorrectCount = 0;
  
  for (let row = 0; row < level.rows; row++) {
    for (let col = 1; col < level.cols; col++) { // Начинаем с col=1, пропускаем первый столбец
      const index = row * level.cols + col;
      if (gameOrder[index].id === correctOrder[index].id) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    }
  }
  
  // Показываем результат
  const resultSection = document.getElementById('result-section');
  const resultMessage = document.getElementById('result-message');
  
  const totalDataCells = level.rows * (level.cols - 1); // Все ячейки кроме первого столбца
  
  const s = t();
  if (incorrectCount === 0) {
    resultMessage.innerHTML = `<h2>${s.congrats}</h2><p>${s.congratsText}</p>`;
    resultMessage.className = 'result-message success';
  } else {
    resultMessage.innerHTML = `<h2>${s.resultTitle}</h2><p>${s.correctOf(correctCount, totalDataCells)}</p><p>${s.incorrect(incorrectCount)}</p><p>${s.hintRed}</p>`;
    resultMessage.className = 'result-message error';
  }
  
  resultSection.style.display = 'block';
  
  // Скрываем кнопку ГОТОВО, показываем СНАЧАЛА
  document.getElementById('check-btn').style.display = 'none';
  document.getElementById('restart-btn').style.display = 'inline-block';
}

function restartGame() {
  initLevel(currentLevel);
}

function updateCellStates() {
  const cells = document.querySelectorAll('#game-table .table-cell');
  cells.forEach((cell, index) => {
    const elementId = parseInt(cell.dataset.elementId);
    const correctId = correctOrder[index].id;
    
    cell.classList.remove('correct', 'incorrect');
    
    if (elementId === correctId) {
      cell.classList.add('correct');
    } else {
      cell.classList.add('incorrect');
    }
  });
}

function checkWin() {
  const isWin = gameOrder.every((element, index) => {
    return element.id === correctOrder[index].id;
  });
  
  if (isWin) {
    setTimeout(() => {
      document.getElementById('success-message').style.display = 'block';
      updateCellStates();
    }, 300);
  } else {
    updateCellStates();
  }
}
