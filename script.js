/* jshint esversion: 6 */

let testData = {};
let profData = {};
let originalTestData = {}; // Сохраняем оригинальные данные для восстановления
let keywordsData = {}; // Данные ключевых слов для теста "Уровни-2"

const PROF_TEST_MAPPING = [
  { field: 'levels', testName: 'Уровни' },
  { field: 'warming', testName: 'Разогрев' },
  { field: 'coding_small', testName: 'Кодировки мелкие' },
  { field: 'coding_medium', testName: 'Кодировки средние' },
  { field: 'coding_large', testName: 'Кодировки крупные' }
];

const PROF_STORAGE_KEY = 'professionsDraft';

let profEditorState = {
  list: [],
  currentIndex: null,
  initialized: false
};

let dictData = {};
let currentLang = localStorage.getItem('currentLang') || 'ru';

let dictEditorState = {
  baseLang: 'ru',
  targetLang: 'en',
  initialized: false
};

//-----------------------------------------
// ЗАГРУЗКА ВСЕХ ДАННЫХ
//-----------------------------------------
Promise.all([
  fetch("data.json").then(r => r.json()),
  fetch("prof.json").then(r => r.json()).catch(() => ({professions:[]})),
  fetch("dict.json").then(r => r.json()).catch(() => ({})),
  fetch("kw.json").then(r => r.json()).catch(() => ({}))
])
.then(([tests, profs, dict, keywords]) => {
    // Сохраняем оригинальные данные (глубокая копия)
    if (tests && tests.tests) {
      originalTestData = {
        tests: tests.tests.map(test => JSON.parse(JSON.stringify(test)))
      };
    } else {
      originalTestData = { tests: [] };
    }
    
    testData = tests;
    profData = profs;
    dictData = dict || {};
    keywordsData = keywords || {};
    
    // Проверяем, что данные загружены
    if (!testData || !testData.tests || testData.tests.length === 0) {
      console.error('testData.tests is empty or undefined');
      const list = document.getElementById("test-list");
      if (list) {
        list.innerHTML = '<p>' + getUITranslation('loading_tests', 'Loading tests...') + '</p>';
      }
      return;
    }
    
    // Применяем переводы к данным
    applyTranslations();
    
    // Загружаем интерфейс (после применения переводов)
    loadIndex();
    loadTest();
    loadResult();
    loadHistory();
    loadProfEditor();
    if (document.getElementById('dict-editor')) {
      loadDictEditor();
    }
    initLanguageSelector();
    
    // Применяем переводы UI после загрузки всего контента
    setTimeout(() => {
      applyUITranslations();
    }, 100);
})
.catch(err => {
  console.error('Error loading data:', err);
  const list = document.getElementById("test-list");
  if (list) {
    list.innerHTML = '<p>Error loading tests. Please refresh the page.</p>';
  }
});


//-----------------------------------------
// INDEX: список тестов
//-----------------------------------------
function loadIndex(){
  const list = document.getElementById("test-list");
  if (!list) return;

  list.innerHTML = "";

  // Проверяем, что testData.tests существует
  if (!testData || !testData.tests || testData.tests.length === 0) {
    list.innerHTML = '<p>' + getUITranslation('loading_tests', 'Loading tests...') + '</p>';
    return;
  }

  let takenTests = new Set();
  try {
    const history = JSON.parse(localStorage.getItem("history") || "[]");
    history.forEach(entry => {
      if (entry && entry.testIndex !== undefined && entry.testIndex !== null){
        takenTests.add(Number(entry.testIndex));
      }
    });
  } catch (err){
    console.warn("history parse error", err);
  }

  // Дополнительная проверка перед отображением
  if (!testData.tests || testData.tests.length === 0) {
    list.innerHTML = '<p>' + getUITranslation('loading_tests', 'Loading tests...') + '</p>';
    return;
  }
  
  // Собираем HTML в переменную, а не используем innerHTML +=
  let htmlContent = '';
  
  testData.tests.forEach((t,i)=>{
    if (!t) return;
    
    const alreadyTaken = takenTests.has(i);
    const testName = t.name || `Test ${i + 1}`;
    
    const isDisabled = false;
    if (alreadyTaken){
      htmlContent += `
        <div class="testItem testItem--taken${isDisabled ? ' testItem--grey' : ''}">
          <span class="test-link disabled">
            <b>${testName}</b>
          </span>
          <small class="test-note" data-i18n="test_already_taken">Тест уже пройден. Очистите историю, чтобы пройти заново.</small>
        </div>
      `;
    } else {
      htmlContent += `
        <div class="testItem${isDisabled ? ' testItem--grey' : ''}">
          <a class="test-link" href="${isDisabled ? '#' : 'test.html?test=' + i}"${isDisabled ? ' onclick="return false"' : ''}>
            <b>${testName}</b>
          </a>
        </div>
      `;
    }
  });
  
  // Устанавливаем весь HTML сразу
  list.innerHTML = htmlContent;
}


//-----------------------------------------
// ТЕСТ: загрузка вопросов
//-----------------------------------------
function loadTest(){
  const container = document.getElementById('test-container');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const idx = Number(params.get("test") || 0);
  const test = testData.tests[idx];

  if (!test) return;

  // Обновляем название теста
  const titleElement = document.getElementById('test-title');
  if (titleElement && test) {
    titleElement.textContent = test.name;
  }

  container.innerHTML = "";

  // Проверяем тип теста
  if (test.type === 'levels2') {
    loadLevels2Test(test, idx);
    return;
  }

  // Обычный тест со слайдерами
  test.questions.forEach((q, qi) => {
    const block = document.createElement('div');
    block.className = "question";

    // Вопрос
    block.innerHTML = `<div class="qtext"><b>${q.text}</b></div>`;

    // Перемешиваем ответы
    let answers = q.answers.map((a, ai)=>({text: a.text, orig: ai}));
    answers.sort(()=>Math.random()-0.5);

    // Создаём слайдер для каждого ответа
    answers.forEach((a, ai)=>{
      const id = `q${qi}_a${ai}`;
      block.innerHTML += `
        <div class="slider-block">
          <label>${a.text}</label>
          <input type="range" min="0" max="10" value="0"
                 data-orig="${a.orig}"
                 class="slider"
                 id="${id}">
          <span class="slValue" id="${id}_v">0</span>
        </div>
      `;
    });

    container.appendChild(block);
  });

  // Обновление отображения значений
  container.querySelectorAll(".slider").forEach(sl=>{
    sl.addEventListener("input", e=>{
      document.getElementById(e.target.id + "_v").innerText = e.target.value;
    });
  });
}

//-----------------------------------------
// ТЕСТ УРОВНИ-2: загрузка пар ключевых слов
//-----------------------------------------
function loadLevels2Test(test, testIndex){
  const container = document.getElementById('test-container');
  if (!container || !keywordsData.keywords) return;

  container.innerHTML = "";

  // Собираем все ключевые слова с их уровнями
  const allKeywords = [];
  Object.keys(keywordsData.keywords).forEach(level => {
    const keywords = keywordsData.keywords[level];
    if (Array.isArray(keywords)) {
      keywords.forEach(keyword => {
        const normalizedKeyword = normalizeLevels2Keyword(keyword);
        allKeywords.push({
          keyword: normalizedKeyword,
          level: level
        });
      });
    }
  });

  if (allKeywords.length < 2) {
    container.innerHTML = '<p>' + getUITranslation('levels2_not_enough_keywords', 'Недостаточно ключевых слов для теста') + '</p>';
    return;
  }

  const uniqueLevels = Array.from(new Set(allKeywords.map(item => item.level)));
  if (uniqueLevels.length < 2) {
    container.innerHTML = '<p>' + getUITranslation('levels2_need_two_levels', 'Нужны ключевые слова минимум двух уровней') + '</p>';
    return;
  }

  // Генерируем случайные пары (минимум 20 пар для хорошего теста)
  const pairs = [];
  const numPairs = Math.max(20, Math.floor(allKeywords.length / 2));
  
  const pairTitle = getUITranslation('levels2_pair_title', 'Что бы ты выбрал');
  const bothLabel = getUITranslation('levels2_option_both', 'Оба');
  const noneLabel = getUITranslation('levels2_option_none', 'Ни одно');

  for (let i = 0; i < numPairs; i++) {
    let idx1 = -1;
    let idx2 = -1;
    let attempts = 0;
    const maxAttempts = 50;
    let found = false;

    while (attempts < maxAttempts && !found) {
      idx1 = Math.floor(Math.random() * allKeywords.length);
      idx2 = Math.floor(Math.random() * allKeywords.length);
      if (idx1 !== idx2 && allKeywords[idx1].level !== allKeywords[idx2].level) {
        found = true;
      }
      attempts++;
    }

    if (!found) {
      break;
    }
    
    pairs.push({
      keyword1: allKeywords[idx1],
      keyword2: allKeywords[idx2],
      pairIndex: i
    });
  }

  // Отображаем пары
  pairs.forEach((pair, pi) => {
    const block = document.createElement('div');
    block.className = "question levels2-pair";
    
    const pairName = `pair_${pi}`;
    
    const keyword1Label = getLevels2KeywordLabel(pair.keyword1.keyword);
    const keyword2Label = getLevels2KeywordLabel(pair.keyword2.keyword);
    const keyword1Base = getLevels2KeywordBase(pair.keyword1.keyword);
    const keyword2Base = getLevels2KeywordBase(pair.keyword2.keyword);
    
    block.innerHTML = `
      <div class="qtext"><b>${pairTitle} ${pi + 1}</b></div>
      <div class="levels2-options">
        <label class="levels2-option">
          <input type="radio" name="${pairName}" class="levels2-radio" 
                 value="1"
                 data-pair="${pi}" 
                 data-keyword="${keyword1Base}" 
                 data-level="${pair.keyword1.level}">
          <span>${keyword1Label}</span>
        </label>
        <label class="levels2-option">
          <input type="radio" name="${pairName}" class="levels2-radio" 
                 value="2"
                 data-pair="${pi}" 
                 data-keyword="${keyword2Base}" 
                 data-level="${pair.keyword2.level}">
          <span>${keyword2Label}</span>
        </label>
        <label class="levels2-option">
          <input type="radio" name="${pairName}" class="levels2-radio" 
                 value="both"
                 data-pair="${pi}">
          <span>${bothLabel}</span>
        </label>
        <label class="levels2-option">
          <input type="radio" name="${pairName}" class="levels2-radio" 
                 value="none"
                 data-pair="${pi}">
          <span>${noneLabel}</span>
        </label>
      </div>
    `;
    
    container.appendChild(block);
  });

  // Добавляем обработчики для обновления стилей при выборе
  container.querySelectorAll('.levels2-radio').forEach(radio => {
    radio.addEventListener('change', function() {
      const pairBlock = this.closest('.levels2-pair');
      pairBlock.querySelectorAll('.levels2-option').forEach(opt => {
        opt.classList.remove('checked');
      });
      if (this.checked) {
        this.closest('.levels2-option').classList.add('checked');
      }
    });
  });
}
 
function normalizeLevels2Keyword(keywordEntry) {
  if (!keywordEntry) return { ru: '' };
  if (typeof keywordEntry === 'string') {
    return { ru: keywordEntry };
  }
  const normalized = Object.assign({}, keywordEntry);
  if (!normalized.ru && normalized.en) {
    normalized.ru = normalized.en;
  }
  return normalized;
}

function getLevels2KeywordLabel(keywordEntry) {
  if (!keywordEntry) return '';
  if (typeof keywordEntry === 'string') return keywordEntry;
  const langKey = currentLang || 'ru';
  return keywordEntry[langKey] || keywordEntry.ru || '';
}

function getLevels2KeywordBase(keywordEntry) {
  if (!keywordEntry) return '';
  if (typeof keywordEntry === 'string') return keywordEntry;
  return keywordEntry.ru || keywordEntry.en || '';
}

//-----------------------------------------
// ТЕСТ УРОВНИ-2: расчет результатов
//-----------------------------------------
function finishLevels2Test(test, testIndex){
  // Инициализируем счетчики и карту соответствия уровней
  let score = {};
  const levelKeyMap = {};
  Object.keys(test.answersMeaning).forEach(k => {
    score[k] = 0;
    const levelLabel = String(test.answersMeaning[k]);
    levelKeyMap[levelLabel] = k;
  });

  // Собираем все пары
  const pairs = [];
  const pairBlocks = document.querySelectorAll('.levels2-pair');
  
  pairBlocks.forEach(block => {
    const radios = block.querySelectorAll('.levels2-radio');
    if (radios.length >= 4) {
      const selected = block.querySelector('.levels2-radio:checked');
      if (selected) {
        const value = selected.value;
        const level1 = levelKeyMap[radios[0].dataset.level] || radios[0].dataset.level;
        const level2 = levelKeyMap[radios[1].dataset.level] || radios[1].dataset.level;
        
        pairs.push({
          level1: level1,
          level2: level2,
          choice: value // "1", "2", "both", "none"
        });
      }
    }
  });

  // Подсчитываем баллы по правилам:
  // - выбрано первое (value="1"): первое +1, второе -1
  // - выбрано второе (value="2"): второе +1, первое -1
  // - выбраны оба (value="both"): оба +1
  // - не выбрано ни одно (value="none"): оба 0
  pairs.forEach(pair => {
    if (pair.choice === 'both') {
      // Оба выбраны - оба +1
      score[pair.level1] = (score[pair.level1] || 0) + 1;
      score[pair.level2] = (score[pair.level2] || 0) + 1;
    } else if (pair.choice === '1') {
      // Выбрано первое - первое +1, второе -1
      score[pair.level1] = (score[pair.level1] || 0) + 1;
      score[pair.level2] = (score[pair.level2] || 0) - 1;
    } else if (pair.choice === '2') {
      // Выбрано второе - второе +1, первое -1
      score[pair.level1] = (score[pair.level1] || 0) - 1;
      score[pair.level2] = (score[pair.level2] || 0) + 1;
    } else {
      // Не выбрано ни одно (value="none") - оба 0 (ничего не делаем)
    }
  });

  // Обнуляем все отрицательные и нулевые значения
  Object.keys(score).forEach(k => {
    if (!score[k] || score[k] <= 0) {
      score[k] = 0;
    }
  });

  // Нормируем на 100%
  let total = 0;
  Object.keys(score).forEach(k => {
    total += score[k] || 0;
  });

  let result = {};
  Object.keys(score).forEach(k => {
    result[k] = total === 0 ? 0 : Math.round((score[k] || 0) * 100 / total);
  });

  // Сохраняем результат
  localStorage.setItem("lastResult", JSON.stringify({
    testIndex: testIndex,
    result
  }));

  // Сохраняем историю
  let history = JSON.parse(localStorage.getItem("history") || "[]");
  history.push({
    test: test.name,
    testIndex: testIndex,
    time: new Date().toLocaleString(),
    result
  });
  localStorage.setItem("history", JSON.stringify(history));

  window.location = "result.html";
}


//-----------------------------------------
// Финиш теста
//-----------------------------------------
function finishTest(){
  const params = new URLSearchParams(window.location.search);
  const idx = Number(params.get("test") || 0);
  const test = testData.tests[idx];

  if (!test) return;

  // Проверяем тип теста
  if (test.type === 'levels2') {
    finishLevels2Test(test, idx);
    return;
  }

  // Обычный тест со слайдерами
  let score = {};
  Object.keys(test.answersMeaning).forEach(k => score[k] = 0);

  // Суммируем баллы
  test.questions.forEach((q,qi)=>{
    const sliders = document.querySelectorAll(`[id^=q${qi}_a]`);
    sliders.forEach(sl=>{
      const orig = sl.dataset.orig;
      const val = Number(sl.value);
      score[orig] += val;
    });
  });

  // Нормируем
  let total = 0;
  for (let k in score) total += score[k] || 0;

  let result = {};
  for (let k in score){
    result[k] = total === 0 ? 0 : Math.round(score[k] * 100 / total);
  }

  // сохраняем результат
  localStorage.setItem("lastResult", JSON.stringify({
    testIndex: idx,
    result
  }));

  // сохраняем историю
  let history = JSON.parse(localStorage.getItem("history") || "[]");
  history.push({
    test: test.name,
    testIndex: idx,
    time: new Date().toLocaleString(),
    result
  });
  localStorage.setItem("history", JSON.stringify(history));

  window.location = "result.html";
}


//-----------------------------------------
// РЕЗУЛЬТАТ
//-----------------------------------------
function loadResult(){
  const div = document.getElementById('result-container');
  if (!div) return;

  const saved = JSON.parse(localStorage.getItem('lastResult'));
  if (!saved){
    div.innerHTML = "<p>" + getUITranslation('no_result', 'No result.') + "</p>";
    return;
  }

  const test = testData.tests[saved.testIndex];
  if (!test || !test.answersMeaning) {
    div.innerHTML += "<p>" + getUITranslation('no_result', 'No result.') + "</p>";
    return;
  }
  const meanings = test.answersMeaning;
  const r = saved.result;

  div.innerHTML = `<h3>${test.name}</h3>`;

  const isLevelsTest = test.name === 'Уровни' && Object.keys(LEVEL_MARKERS).length >= 8;
  if (isLevelsTest) {
    const verdictData = getLevelsVerdict(r, meanings);
    const top3 = Object.keys(r)
      .filter(k => meanings[k] && r[k] != null && r[k] > 0)
      .map(k => ({ key: k, level: parseInt(meanings[k], 10) || parseInt(k, 10) + 1, pct: r[k] }))
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 3);
    const rowStyles = { 1: 'font-weight:bold;color:#003366', 2: 'font-weight:bold;color:#1a5fb4', 3: 'font-weight:bold;color:#62a0ea' };
    const keys = Object.keys(meanings).sort((a, b) => Number(a) - Number(b));
    let tableHtml = '<table class="result-levels-table levels-list"><tbody>';
    keys.forEach(k => {
      if (!meanings[k] || (r[k] == null && r[k] !== 0)) return;
      const level = parseInt(meanings[k], 10) || parseInt(k, 10) + 1;
      const rank = top3.findIndex(t => t.level === level) + 1;
      const marker = (r[k] > 0 && rank) ? (LEVEL_NAMES[level] || '') : '';
      const trStyle = rank ? rowStyles[rank] : (r[k] === 0 ? 'color:#bbb' : '');
      const trClass = r[k] === 0 ? 'zero' : '';
      tableHtml += `<tr class="${trClass}" style="${trStyle}"><td class="rl-lvl">${level}</td><td class="rl-word">${marker}</td><td class="rl-num percent">${r[k]}%</td></tr>`;
    });
    tableHtml += '</tbody></table>';
    let cardHtml = '<div class="result-block">';
    if (verdictData && verdictData.dominant) {
      cardHtml += '<div class="result-dominant">' + verdictData.dominant + '</div>';
        // '<div class="result-subdominant">' + verdictData.subdominant + '</div>' +
        // '<div class="result-profile">' + verdictData.profile + '</div>';
    }
    cardHtml += tableHtml + '</div>';
    div.innerHTML += cardHtml;
  } else {
    for (let k in r){
      if (meanings[k] && r[k] !== null && r[k] !== undefined) {
        const translatedLabel = getTranslatedAnswersMeaning(saved.testIndex, k);
        div.innerHTML += `<p>${translatedLabel}: <b>${r[k]}%</b></p>`;
      }
    }
  }

  // кнопка вернуться
  div.innerHTML += `<a class="btn home-button" href="index.html">${getUITranslation('btn_home', 'Домой')}</a>`;

  // отрисовка диаграммы — для всех тестов (Уровни, Разогрев и др.)
  const chartDiv = document.getElementById('chart');
  if (chartDiv && typeof drawRadarChart === 'function') {
    chartDiv.innerHTML = '';
    chartDiv.style.minHeight = '420px';
    const keys = Object.keys(meanings).sort((a, b) => Number(a) - Number(b));
    const labels = keys.map(k => getTranslatedAnswersMeaning(saved.testIndex, k));
    const values = keys.map(k => (r[k] !== undefined && r[k] !== null ? r[k] : 0));
    if (keys.length > 0) {
      drawRadarChart('chart', labels, values);
      initChartHintPanel();
    }
  }
}

const LEVEL_MARKERS = {
  1: 'солдат', 2: 'студент', 3: 'офицер', 4: 'преподаватель',
  5: 'генерал', 6: 'автор учебника', 7: 'изобретатель', 8: 'интегратор'
};

const LEVEL_NAMES = {
  1: 'Солдат', 2: 'Студент', 3: 'Офицер', 4: 'Преподаватель',
  5: 'Генерал', 6: 'Автор учебника', 7: 'Изобретатель', 8: 'Интегратор'
};

const LEVEL_PROFILES = {
  '5-6': 'системный управленец с теоретическим усилением',
  '5-7': 'стратег с инновационным уклоном',
  '5-4': 'управленец с педагогической опорой',
  '6-5': 'теоретик с управленческими способностями',
  '6-7': 'систематизатор с творческим потенциалом',
  '6-4': 'автор методик, передающий знания',
  '7-6': 'инноватор с теоретической базой',
  '7-5': 'изобретатель со стратегическим мышлением',
  '4-5': 'педагог с управленческими амбициями',
  '4-6': 'преподаватель-теоретик',
  '3-5': 'тактик со стратегическим резервом',
  '3-4': 'офицер-наставник',
  '2-3': 'практик с организационными навыками',
  '1-2': 'исполнитель в процессе обучения'
};

function getLevelsVerdict(r, meanings) {
  let data = r;
  let levelFromKey = k => (meanings && meanings[k] != null) ? parseInt(meanings[k], 10) : parseInt(k, 10);
  if (r && r.levels) {
    data = r.levels;
    levelFromKey = k => parseInt(k, 10);
  }
  const sorted = Object.keys(data)
    .filter(k => data[k] != null)
    .map(k => ({ level: levelFromKey(k), pct: data[k] }))
    .sort((a, b) => b.pct - a.pct);
  if (sorted.length < 2) return null;
  const dom = sorted[0];
  const sub = sorted[1];
  const diff = dom.pct - sub.pct;
  const mixed = diff < 5;
  const domName = LEVEL_NAMES[dom.level] || LEVEL_MARKERS[dom.level] || 'Уровень ' + dom.level;
  const subName = LEVEL_NAMES[sub.level] || LEVEL_MARKERS[sub.level] || 'Уровень ' + sub.level;
  const key = dom.level + '-' + sub.level;
  const profile = LEVEL_PROFILES[key] || domName.toLowerCase() + ' с опорой на ' + subName.toLowerCase();
  const title = mixed ? 'СМЕШАННЫЙ ПРОФИЛЬ' : 'ДОМИНАНТА';
  return {
    dominant: '<span class="label">' + title + '</span>: ' + dom.level + ' — ' + domName + ' (<span class="percent">' + dom.pct + '%</span>)',
    subdominant: 'СУБДОМИНАНТА: ' + sub.level + ' — ' + subName + ' (' + sub.pct + '%)',
    profile: 'Профиль: ' + profile + '.'
  };
}

const LEVEL_HINTS = {
  1: '<strong>Сознание</strong> магическое (чудо, тайна). <strong>Мышление</strong>: что? вещь, имя, узнавание, наименование. <strong>Взаимодействие</strong>: концентрация, изоляция, медитация. <strong>Возраст</strong> 0–3. <strong>Эпоха</strong>: охотники. <strong>Функция</strong>: раб, солдат, простейший исполнитель. Один объект в поле внимания.',
  2: '<strong>Сознание</strong> этическое (добро, зло). <strong>Мышление</strong>: где, пространство, граница, различение, разграничение. <strong>Взаимодействие</strong>: свой, чужой. <strong>Возраст</strong> 3–6. <strong>Эпоха</strong>: аграрии. <strong>Функция</strong>: студент, крестьянин. Много объектов в поле внимания.',
  3: '<strong>Сознание</strong> эстетическое (красота, уродство). <strong>Мышление</strong>: когда? время, движение, упорядочение, уточнение. <strong>Взаимодействие</strong>: борьба, сила, цель, доминирование, подчинение. <strong>Функция</strong>: офицер, люмпен-пролетарий. <strong>Возраст</strong> 6–9. <strong>Эпоха</strong>: античные империи. Один процесс в поле внимания.',
  4: '<strong>Сознание</strong> ролевое (способы, правила). <strong>Мышление</strong>: как? алгоритм, шаблон, координация, синхронизация. <strong>Взаимодействие</strong>: обещания, обязательства. <strong>Функция</strong>: преподаватель, священник. <strong>Возраст</strong> 9–12. <strong>Эпоха</strong>: средневековье. Много процессов в поле внимания.',
  5: '<strong>Сознание</strong> свободное (выбор, произвол). <strong>Мышление</strong>: кто? пробы и ошибки, случайность, импровизация, риск. <strong>Взаимодействие</strong>: поступок, принятие решения. <strong>Функция</strong>: буржуа, капитан, генерал, судья. <strong>Возраст</strong> 12–15. <strong>Эпоха</strong>: Возрождение, Реформация. Одна карта в поле внимания.',
  6: '<strong>Сознание</strong> теоретическое (истина, ложь). <strong>Мышление</strong>: почему? причина, следствие, сомнение, доказательство. <strong>Взаимодействие</strong>: дискуссия, диалог. <strong>Функция</strong>: автор учебника, учёный, финансист, юрист. <strong>Возраст</strong> 15–18. <strong>Эпоха</strong>: индустриализация. Много карт в поле внимания.',
  7: '<strong>Сознание</strong> парадоксальное (гений, безумец). <strong>Мышление</strong>: а если? инновация, революция, аномалия, парадокс. <strong>Взаимодействие</strong>: научная революция, смена парадигмы. <strong>Функция</strong>: изобретатель, генератор инноваций. <strong>Возраст</strong> 18–21. <strong>Эпоха</strong>: ХХ век. Одна система в поле внимания.',
  8: '<strong>Сознание</strong> универсальное (экология, учёт отдалённых последствий). <strong>Мышление</strong>: а зачем? мультиверсум, гармония, баланс. <strong>Взаимодействие</strong>: эмпатия, моделирование чужого сознания как неоднородного своему. <strong>Функция</strong>: интегратор, модератор, переводчик-полиглот. <strong>Возраст</strong> 21+. <strong>Эпоха</strong>: наше время. Много систем в поле внимания.'
};

function initChartHintPanel() {
  const hintPanel = document.getElementById('hint-panel');
  if (!hintPanel) return;
  hintPanel.innerHTML = '<p class="hint-placeholder">Кликните цифру на диаграмме для расшифровки</p>';
  window.addEventListener('chartHintClick', function(e) {
    const index = e.detail && e.detail.index;
    if (index) {
      const text = LEVEL_HINTS[index] || 'Подсказка ' + index;
      const html = '<div class="level-details"><p class="level-details-title">Уровень ' + index + '</p>' +
        '<p class="hint-content">' + text.replace(/\.\s+/g, '.<br>') + '</p></div>';
      hintPanel.innerHTML = html;
    }
  });
}



//-----------------------------------------
// ИСТОРИЯ + СРАВНЕНИЕ С ПРОФЕССИЯМИ
//-----------------------------------------
function loadHistory(){
  const div = document.getElementById('history-container');
  if (!div) return;

  // Очищаем контейнер перед заполнением
  div.innerHTML = '';

  const history = JSON.parse(localStorage.getItem("history") || "[]");

  if (history.length === 0){
    div.innerHTML = "<p>No history yet.</p>";
    return;
  }

  // Сортируем историю по времени (новые сначала)
  // Преобразуем время в Date для корректной сортировки
  const sortedHistory = history.slice().sort((a, b) => {
    const timeA = new Date(a.time).getTime();
    const timeB = new Date(b.time).getTime();
    return timeB - timeA; // новые сначала
  });

  // Берем только последний результат каждого теста (первый в отсортированном массиве)
  let lastForTest = {};
  sortedHistory.forEach(h => {
    // Проверяем, что запись валидна
    if (h && h.testIndex !== undefined && h.testIndex !== null && h.result && Object.keys(h.result).length > 0) {
      if (!lastForTest[h.testIndex]) {
        lastForTest[h.testIndex] = h;
      }
    }
  });

  // Создаем заголовок секции только если есть результаты
  if (Object.keys(lastForTest).length > 0) {
    const h2 = document.createElement('h2');
    h2.textContent = getUITranslation('your_charts', 'Ваши диаграммы');
    div.appendChild(h2);

    // Создаем контейнер для горизонтального расположения диаграмм
    const chartsContainer = document.createElement('div');
    chartsContainer.className = 'charts-grid';
    div.appendChild(chartsContainer);

    // рисуем диаграммы пользователя
    Object.values(lastForTest).forEach(entry=>{
      // Дополнительная проверка перед созданием элементов
      if (!entry || !entry.result || !entry.test || entry.testIndex === undefined || entry.testIndex === null) {
        return;
      }
      
      const canvasId = "canvas_" + entry.testIndex;
      
      // Создаем карточку для каждой диаграммы
      const chartCard = document.createElement('div');
      chartCard.className = 'chart-card';
      
      // Создаем заголовок
      const h3 = document.createElement('h3');
      h3.className = 'chart-title';
      // Переводим название теста
      const testIndex = entry.testIndex;
      h3.textContent = testIndex !== undefined && testIndex !== null ? getTranslatedTestName(testIndex) : entry.test;
      chartCard.appendChild(h3);
      
      // Создаем canvas
      const canvas = document.createElement('canvas');
      canvas.id = canvasId;
      canvas.width = 450;
      canvas.height = 450;
      chartCard.appendChild(canvas);
      
      chartsContainer.appendChild(chartCard);
      
      // Рисуем диаграмму после добавления в DOM
      setTimeout(() => {
        drawRadar(canvasId, entry.result, entry.testIndex);
      }, 0);
    });
  }

  //-----------------------------------------
  // список профессий
  //-----------------------------------------
  const h2Prof = document.createElement('h2');
  h2Prof.textContent = getUITranslation('compare_with_prof', 'Сравнить с профессией');
  div.appendChild(h2Prof);

  // Создаем контейнер для горизонтального расположения профессий
  const profContainer = document.createElement('div');
  profContainer.className = 'professions-list';
  div.appendChild(profContainer);

  // Сортируем профессии по алфавиту
  const sortedProfs = profData.professions.map((p, pi) => ({ prof: p, index: pi }))
    .sort((a, b) => (a.prof.name || '').localeCompare(b.prof.name || '', 'ru'));
  
  sortedProfs.forEach(({ prof, index }) => {
    const label = document.createElement('label');
    label.className = 'prof-option';
    label.innerHTML = `
      <input type="radio" name="prof" value="${index}">
      ${prof.name}
    `;
    profContainer.appendChild(label);
  });

  // Создаем кнопку сравнения
  const compareBtn = document.createElement('button');
  compareBtn.className = 'btn';
  compareBtn.textContent = getUITranslation('btn_compare', 'Сравнить');
  compareBtn.disabled = true;
  compareBtn.onclick = compareProfession;
  div.appendChild(compareBtn);

  // Создаем контейнер для результатов
  const profResultsDiv = document.createElement('div');
  profResultsDiv.id = 'prof-results';
  div.appendChild(profResultsDiv);

  // Добавляем обработчики на радио-кнопки для обновления состояния кнопки
  const radioButtons = profContainer.querySelectorAll('input[type="radio"]');
  radioButtons.forEach(radio => {
    radio.addEventListener('change', () => {
      compareBtn.disabled = !document.querySelector('input[name="prof"]:checked');
    });
  });
}



//-----------------------------------------
// Рисуем радар с возможностью сравнения
//-----------------------------------------
function drawRadar(canvasId, valuesObj, testIndexOrLabels, compareValuesObj){
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  
  // Проверяем, что есть данные для отрисовки
  if (!valuesObj || Object.keys(valuesObj).length === 0) {
    return;
  }

  const ctx = canvas.getContext("2d");

  // Получаем labels из testData, если передан testIndex (число)
  // или используем переданные labels напрямую (массив)
  let labels = [];
  if (testIndexOrLabels !== undefined) {
    if (Array.isArray(testIndexOrLabels)) {
      // Передан массив labels напрямую
      labels = testIndexOrLabels;
    } else if (typeof testIndexOrLabels === 'number' && testData.tests && testData.tests[testIndexOrLabels]) {
      // Передан testIndex - получаем labels из testData с переводами
      const test = testData.tests[testIndexOrLabels];
      const meanings = test.answersMeaning;
      const keys = Object.keys(meanings).sort((a, b) => Number(a) - Number(b));
      labels = keys.map(k => getTranslatedAnswersMeaning(testIndexOrLabels, k));
    }
  }

  // Определяем количество осей на основе labels, если они есть, иначе из valuesObj
  let count;
  let keys;
  let values;
  
  if (labels.length > 0) {
    // Используем labels для определения количества осей
    count = labels.length;
    // Создаем keys на основе индексов labels (0, 1, 2, ...)
    keys = Array.from({length: count}, (_, i) => String(i));
    // Получаем values, используя все ключи из labels
    values = keys.map(k => valuesObj[k] || 0);
  } else {
    // Если labels нет, используем valuesObj
    keys = Object.keys(valuesObj).sort((a, b) => Number(a) - Number(b));
    values = keys.map(k => valuesObj[k] || 0);
    count = values.length;
  }

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const maxR = 150;
  const cx = canvasWidth / 2;
  const cy = canvasHeight / 2;

  ctx.clearRect(0,0,canvasWidth,canvasHeight);

  // сетка
  ctx.strokeStyle = "#bbb";
  ctx.beginPath();
  for (let r of [50,100,150]){
    ctx.moveTo(cx+r, cy);
    ctx.arc(cx,cy,r,0,Math.PI*2);
  }
  ctx.stroke();

  // углы
  const angleStep = 2 * Math.PI / count;

  // Рисуем оси и подписи
  if (labels.length > 0) {
    labels.forEach((label, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const x = cx + Math.cos(angle) * maxR;
      const y = cy + Math.sin(angle) * maxR;

      // Ось
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.strokeStyle = "#aaa";
      ctx.stroke();

      // Подпись оси (немного дальше от центра)
      const labelX = cx + Math.cos(angle) * (maxR + 30);
      const labelY = cy + Math.sin(angle) * (maxR + 30);
      ctx.font = "18px Arial";
      ctx.fillStyle = "#333";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, labelX, labelY);
    });
  }

  // Рисуем первую диаграмму (профессия) - синий цвет
  ctx.beginPath();
  ctx.strokeStyle = "#0066ff";
  ctx.fillStyle = "rgba(0,100,255,0.25)";

  values.forEach((v,i)=>{
    const ang = i * angleStep - Math.PI/2;
    const R = maxR * (v/100);
    const x = cx + R * Math.cos(ang);
    const y = cy + R * Math.sin(ang);
    if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });

  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Рисуем вторую диаграмму (пользователь) - красный/оранжевый цвет, если есть
  if (compareValuesObj) {
    const compareKeys = Object.keys(compareValuesObj).sort((a, b) => Number(a) - Number(b));
    const compareValues = compareKeys.map(k => compareValuesObj[k] || 0);
    
    ctx.beginPath();
    ctx.strokeStyle = "#ff6600";
    ctx.fillStyle = "rgba(255,100,0,0.15)";

    compareValues.forEach((v,i)=>{
      const ang = i * angleStep - Math.PI/2;
      const R = maxR * (v/100);
      const x = cx + R * Math.cos(ang);
      const y = cy + R * Math.sin(ang);
      if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    });

    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // Рисуем значения (цифры) на точках первой диаграммы
  values.forEach((v,i)=>{
    // Пропускаем null/undefined значения
    if (v === null || v === undefined || isNaN(v)) return;
    
    const ang = i * angleStep - Math.PI/2;
    const R = maxR * (v/100);
    const x = cx + R * Math.cos(ang);
    const y = cy + R * Math.sin(ang);

    // Сдвигаем текст дальше от центра по направлению оси
    const offset = 20; // расстояние от точки
    const textX = x + Math.cos(ang) * offset;
    const textY = y + Math.sin(ang) * offset;

    ctx.fillStyle = compareValuesObj ? "#0066ff" : "#000";
    ctx.font = compareValuesObj ? "bold 14px Arial" : "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(v + "%", textX, compareValuesObj ? textY - 8 : textY);
  });

  // Рисуем значения (цифры) на точках второй диаграммы, если есть
  if (compareValuesObj) {
    const compareKeys = Object.keys(compareValuesObj).sort((a, b) => Number(a) - Number(b));
    const compareValues = compareKeys.map(k => compareValuesObj[k] || 0);
    
    compareValues.forEach((v,i)=>{
      // Пропускаем null/undefined значения
      if (v === null || v === undefined || isNaN(v)) return;
      
      const ang = i * angleStep - Math.PI/2;
      const R = maxR * (v/100);
      const x = cx + R * Math.cos(ang);
      const y = cy + R * Math.sin(ang);

      // Сдвигаем текст дальше от центра по направлению оси
      const offset = 20; // расстояние от точки
      const textX = x + Math.cos(ang) * offset;
      const textY = y + Math.sin(ang) * offset;

      ctx.fillStyle = "#ff6600";
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(v + "%", textX, textY + 8);
    });
  }
}

function getProfMappingWithIndexes(){
  return PROF_TEST_MAPPING.map(item => {
    // Ищем тест по оригинальному названию из константы
    let testIndex = -1;
    if (testData.tests) {
      testIndex = testData.tests.findIndex(t => {
        // Проверяем оригинальное название
        const originalName = getOriginalTestName(t);
        return originalName === item.testName || t.name === item.testName;
      });
    }
    return Object.assign({}, item, { testIndex: testIndex >= 0 ? testIndex : null });
  });
}

function getTestMeaningLabels(testName){
  if (!testData.tests) return [];
  // Ищем тест по оригинальному или переведенному названию
  const test = testData.tests.find(t => {
    const originalName = getOriginalTestName(t);
    return originalName === testName || t.name === testName;
  });
  if (!test || !test.answersMeaning) return [];
  const keys = Object.keys(test.answersMeaning).sort((a, b) => Number(a) - Number(b));
  return keys.map(k => test.answersMeaning[k]);
}

function cloneProfession(prof){
  const clone = Object.assign({}, prof);
  PROF_TEST_MAPPING.forEach(mapping => {
    const source = Array.isArray(prof[mapping.field]) ? prof[mapping.field] : [];
    clone[mapping.field] = source.map(v => Number(v) || 0);
  });
  clone.name = clone.name || '';
  return clone;
}

function createEmptyProfession(name){
  const prof = { name: name || `Новая профессия ${profEditorState.list.length + 1}` };
  PROF_TEST_MAPPING.forEach(mapping => {
    const labels = getTestMeaningLabels(mapping.testName);
    prof[mapping.field] = Array(labels.length).fill(0);
  });
  return prof;
}




//-----------------------------------------
// Сравнение с профессией
//-----------------------------------------
function compareProfession(){
  const checked = document.querySelector("input[name=prof]:checked");
  const profIndex = checked ? Number(checked.value) : NaN;
  if (isNaN(profIndex)) return;

  const div = document.getElementById("prof-results");
  div.innerHTML = "<h3>" + getUITranslation('profession_charts', 'Диаграммы профессии') + "</h3>";

  const p = profData.professions[profIndex];

  // Создаем контейнер для горизонтального расположения диаграмм
  const chartsContainer = document.createElement('div');
  chartsContainer.className = 'charts-grid';
  div.appendChild(chartsContainer);

  // Получаем последние результаты пользователя для каждого теста
  const history = JSON.parse(localStorage.getItem("history") || "[]");
  const sortedHistory = history.slice().sort((a, b) => {
    const timeA = new Date(a.time).getTime();
    const timeB = new Date(b.time).getTime();
    return timeB - timeA; // новые сначала
  });
  
  let lastUserResults = {};
  sortedHistory.forEach(h => {
    if (!lastUserResults[h.testIndex]) {
      lastUserResults[h.testIndex] = h.result;
    }
  });

  const testMapping = getProfMappingWithIndexes();

  // Рисуем диаграммы для каждого теста профессии
  testMapping.forEach((mapping, ti) => {
    if (!p[mapping.field] || !Array.isArray(p[mapping.field])) return;

    const valuesArray = p[mapping.field];
    
    // Вычисляем сумму для нормализации
    const sum = valuesArray.reduce((acc, val) => acc + val, 0);
    
    // Преобразуем массив в объект {0: val0, 1: val1, ...} с нормализацией на 100%
    const valuesObj = {};
    valuesArray.forEach((val, i) => {
      valuesObj[i] = sum === 0 ? 0 : Math.round(val * 100 / sum);
    });

    // Получаем результаты пользователя для этого теста, если есть
    let userValuesObj = null;
    if (mapping.testIndex !== null && lastUserResults[mapping.testIndex]) {
      userValuesObj = lastUserResults[mapping.testIndex];
      
      // Для теста "Уровни-2" нужно преобразовать ключи результата
      // в правильные индексы для сопоставления с массивом профессии
      if (mapping.testName === 'Уровни-2' && testData.tests && testData.tests[mapping.testIndex]) {
        const test = testData.tests[mapping.testIndex];
        const transformedUserValues = {};
        // Ключи в userValuesObj уже соответствуют индексам answersMeaning (0-7),
        // которые соответствуют индексам массива профессии (0-7)
        // Так что просто копируем значения
        Object.keys(userValuesObj).forEach(key => {
          const numKey = Number(key);
          if (!isNaN(numKey) && numKey >= 0 && numKey < valuesArray.length) {
            transformedUserValues[key] = userValuesObj[key];
          }
        });
        userValuesObj = transformedUserValues;
      }
    }

    // Получаем labels из testData, если testIndex найден
    let labels = [];
    if (mapping.testIndex !== null && testData.tests && testData.tests[mapping.testIndex]) {
      const test = testData.tests[mapping.testIndex];
      const meanings = test.answersMeaning;
      const keys = Object.keys(meanings).sort((a, b) => Number(a) - Number(b));
      labels = keys.map(k => getTranslatedAnswersMeaning(mapping.testIndex, k));
    }

    // Создаем карточку для каждой диаграммы
    const chartCard = document.createElement('div');
    chartCard.className = 'chart-card';
    
    // Создаем заголовок
    const h4 = document.createElement('h4');
    h4.className = 'chart-title';
    // Переводим название теста
    if (mapping.testIndex !== null && mapping.testIndex !== undefined) {
      h4.textContent = getTranslatedTestName(mapping.testIndex);
    } else {
      // Если testIndex не найден, ищем тест по названию
      const test = testData.tests ? testData.tests.find(t => t.name === mapping.testName || getOriginalTestName(t) === mapping.testName) : null;
      h4.textContent = test ? test.name : mapping.testName;
    }
    chartCard.appendChild(h4);
    
    // Создаем легенду, если есть данные пользователя
    if (userValuesObj) {
      const legend = document.createElement('div');
      legend.style.marginBottom = '10px';
      legend.style.fontSize = '12px';
      legend.style.textAlign = 'center';
      legend.innerHTML = `
        <span style="color: #0066ff;">●</span> ${getUITranslation('profession', 'Профессия')} 
        <span style="color: #ff6600; margin-left: 15px;">●</span> ${getUITranslation('you', 'Вы')}
      `;
      chartCard.appendChild(legend);
    }
    
    // Создаем canvas
    const canvas = document.createElement('canvas');
    const canvasId = "prof_"+profIndex+"_"+ti;
    canvas.id = canvasId;
    canvas.width = 450;
    canvas.height = 450;
    chartCard.appendChild(canvas);
    
    chartsContainer.appendChild(chartCard);
    
    // Рисуем диаграмму после добавления в DOM
    setTimeout(() => {
      drawRadar(canvasId, valuesObj, labels.length > 0 ? labels : mapping.testIndex, userValuesObj);
    }, 0);
  });
}


//-----------------------------------------
// Режим корректировки профессий
//-----------------------------------------
function loadProfEditor(){
  const editor = document.getElementById('prof-editor');
  if (!editor) return;

  if (!profEditorState.initialized) {
    const stored = localStorage.getItem(PROF_STORAGE_KEY);
    let existing = [];
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          existing = parsed.map(cloneProfession);
        } else if (parsed.professions && Array.isArray(parsed.professions)) {
          existing = parsed.professions.map(cloneProfession);
        }
      } catch (err) {
        console.warn('professionsDraft parse error', err);
      }
    }
    if (!existing.length) {
      existing = (profData.professions || []).map(cloneProfession);
    }
    profEditorState.list = existing;
    profEditorState.currentIndex = existing.length ? 0 : null;
    profEditorState.initialized = true;
  }

  const addBtn = document.getElementById('add-prof-btn');
  if (addBtn) addBtn.onclick = addProfession;

  const saveBtn = document.getElementById('save-prof-btn');
  if (saveBtn){
    saveBtn.onclick = saveProfessions;
  }

  const exportBtn = document.getElementById('export-prof-btn');
  if (exportBtn) exportBtn.onclick = exportProfessions;

  renderProfessionsList();
  renderProfForm();
}

function renderProfessionsList(){
  const listContainer = document.getElementById('prof-list');
  if (!listContainer) return;

  listContainer.innerHTML = '';

  if (profEditorState.list.length === 0){
    listContainer.innerHTML = '<p>Нет профессий. Добавьте новую.</p>';
    return;
  }

  // Сортируем профессии по алфавиту, сохраняя оригинальные индексы
  const sortedProfs = profEditorState.list.map((prof, idx) => ({ prof, originalIdx: idx }))
    .sort((a, b) => (a.prof.name || '').localeCompare(b.prof.name || '', 'ru'));

  sortedProfs.forEach(({ prof, originalIdx }) => {
    const btn = document.createElement('button');
    const isActive = originalIdx === profEditorState.currentIndex;
    btn.className = 'prof-select-btn' + (isActive ? ' active' : '');
    btn.textContent = prof.name || `Профессия ${originalIdx + 1}`;
    btn.addEventListener('click', () => {
      profEditorState.currentIndex = originalIdx;
      renderProfessionsList();
      renderProfForm();
    });
    listContainer.appendChild(btn);
  });
}

function renderProfForm(){
  const formContainer = document.getElementById('prof-form');
  if (!formContainer) return;

  formContainer.innerHTML = '';

  if (profEditorState.currentIndex === null || !profEditorState.list[profEditorState.currentIndex]){
    formContainer.innerHTML = '<p>Выберите профессию слева или добавьте новую.</p>';
    return;
  }

  const prof = profEditorState.list[profEditorState.currentIndex];

  const nameLabel = document.createElement('label');
  nameLabel.className = 'prof-name-label';
  nameLabel.textContent = 'Название профессии';
  formContainer.appendChild(nameLabel);

  const nameInput = document.createElement('input');
  nameInput.className = 'prof-name-input';
  nameInput.value = prof.name || '';
  nameInput.placeholder = 'Введите название';
  nameInput.addEventListener('input', e => {
    prof.name = e.target.value;
    renderProfessionsList();
    markProfChanges();
  });
  formContainer.appendChild(nameInput);

  const testsWrap = document.createElement('div');
  testsWrap.className = 'prof-tests';
  formContainer.appendChild(testsWrap);

  const mapping = getProfMappingWithIndexes();

  mapping.forEach(map => {
    const section = document.createElement('div');
    section.className = 'prof-test-card';
    const title = document.createElement('h3');
    title.textContent = map.testName;
    section.appendChild(title);

    const labels = getTestMeaningLabels(map.testName);
    if (labels.length === 0){
      const empty = document.createElement('p');
      empty.textContent = 'Нет данных для этого теста.';
      section.appendChild(empty);
      testsWrap.appendChild(section);
      return;
    }

    if (!Array.isArray(prof[map.field])) {
      prof[map.field] = Array(labels.length).fill(0);
    }

    if (prof[map.field].length < labels.length){
      for (let i = prof[map.field].length; i < labels.length; i++){
        prof[map.field][i] = 0;
      }
    }

    labels.forEach((labelText, idx) => {
      const row = document.createElement('div');
      row.className = 'prof-slider-row';

      const labelEl = document.createElement('label');
      labelEl.textContent = labelText;
      labelEl.htmlFor = `prof-${map.field}-${idx}`;
      row.appendChild(labelEl);

      const slider = document.createElement('input');
      slider.type = 'range';
      slider.min = '0';
      slider.max = '10';
      slider.step = '1';
      slider.value = Number(prof[map.field][idx]) || 0;
      slider.id = `prof-${map.field}-${idx}`;
      slider.className = 'prof-slider';

      const valueSpan = document.createElement('span');
      valueSpan.className = 'prof-value';
      valueSpan.textContent = slider.value;

      slider.addEventListener('input', e => {
        const val = Number(e.target.value);
        prof[map.field][idx] = val;
        valueSpan.textContent = val;
        markProfChanges();
      });

      row.appendChild(slider);
      row.appendChild(valueSpan);

      section.appendChild(row);
    });

    testsWrap.appendChild(section);
  });

  markProfChanges();
  const stored = localStorage.getItem(PROF_STORAGE_KEY);
  if (stored){
    try {
      const parsed = JSON.parse(stored);
      const current = profEditorState.list.map(cloneProfession);
      if (JSON.stringify(parsed) === JSON.stringify(current)){
        markProfChanges(true);
      }
    } catch(e){}
  }
}

function addProfession(){
  if (!testData.tests) return;
  const newProf = createEmptyProfession();
  profEditorState.list.push(newProf);
  profEditorState.currentIndex = profEditorState.list.length - 1;
  renderProfessionsList();
  renderProfForm();
}

function exportProfessions(){
  if (!profEditorState.list.length) return;
  const payload = {
    professions: profEditorState.list
  };
  const dataStr = JSON.stringify(payload, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'professions-export.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function saveProfessions(){
  if (!profEditorState.list.length) return;
  const clone = profEditorState.list.map(cloneProfession);
  profData.professions = clone;
  localStorage.setItem(PROF_STORAGE_KEY, JSON.stringify(clone));
  const saveBtn = document.getElementById('save-prof-btn');
  if (saveBtn){
    saveBtn.disabled = true;
    saveBtn.textContent = 'Сохранено';
    setTimeout(()=>{
      saveBtn.disabled = false;
      saveBtn.textContent = 'Сохранить изменения';
    }, 1500);
  }
  markProfChanges(true);
}

function clearHistory(){
  localStorage.removeItem("history");
  localStorage.removeItem("lastResult");
  location.reload();
}

//-----------------------------------------
// СЛОВАРИ
//-----------------------------------------
function loadDictEditor(){
  const baseSelect = document.getElementById('base-lang-select');
  const targetSelect = document.getElementById('target-lang-select');
  const loadBtn = document.getElementById('load-dict-btn');
  const exportBtn = document.getElementById('export-dict-btn');
  
  if (!baseSelect || !targetSelect) return;
  
  // Синхронизируем селекторы - если базовый ru, то целевой en и наоборот
  baseSelect.addEventListener('change', () => {
    if (baseSelect.value === 'ru') {
      targetSelect.value = 'en';
    } else {
      targetSelect.value = 'ru';
    }
    dictEditorState.baseLang = baseSelect.value;
    dictEditorState.targetLang = targetSelect.value;
    renderDictEditor();
  });
  
  targetSelect.addEventListener('change', () => {
    if (targetSelect.value === 'ru') {
      baseSelect.value = 'en';
    } else {
      baseSelect.value = 'ru';
    }
    dictEditorState.baseLang = baseSelect.value;
    dictEditorState.targetLang = targetSelect.value;
    renderDictEditor();
  });
  
  if (loadBtn) loadBtn.onclick = () => {
    dictEditorState.baseLang = baseSelect.value;
    dictEditorState.targetLang = targetSelect.value;
    renderDictEditor();
  };
  
  if (exportBtn) exportBtn.onclick = exportDict;
  
  // Инициализация
  dictEditorState.baseLang = baseSelect.value;
  dictEditorState.targetLang = targetSelect.value;
  dictEditorState.initialized = true;
  renderDictEditor();
}

function renderDictEditor(){
  const editor = document.getElementById('dict-editor');
  if (!editor) return;
  
  editor.innerHTML = '';
  
  const base = dictEditorState.baseLang;
  const target = dictEditorState.targetLang;
  
  // Загружаем базовые данные из testData
  if (!testData.tests) return;
  
  // Секция переводов тестов
  const testsSection = document.createElement('div');
  testsSection.className = 'dict-section';
  const testsTitle = document.createElement('h3');
  testsTitle.textContent = 'Переводы тестов';
  testsSection.appendChild(testsTitle);
  
  testData.tests.forEach((test, idx) => {
    const testCard = document.createElement('div');
    testCard.className = 'dict-item-card';
    
    const testNameLabel = document.createElement('label');
    testNameLabel.textContent = `Название теста (${base}):`;
    testCard.appendChild(testNameLabel);
    
    const testNameBase = document.createElement('div');
    testNameBase.className = 'dict-base-text';
    testNameBase.textContent = test.name;
    testCard.appendChild(testNameBase);
    
    const testNameInput = document.createElement('input');
    testNameInput.className = 'dict-translation-input';
    testNameInput.type = 'text';
    testNameInput.placeholder = `Перевод на ${target}`;
    const testKey = `test_${idx}_name`;
    if (!dictData.languages) dictData.languages = {};
    if (!dictData.languages[target]) dictData.languages[target] = {};
    testNameInput.value = dictData.languages[target][testKey] || '';
    testNameInput.addEventListener('input', e => {
      if (!dictData.languages[target]) dictData.languages[target] = {};
      dictData.languages[target][testKey] = e.target.value;
    });
    testCard.appendChild(testNameInput);
    
    // Переводы вопросов
    test.questions.forEach((q, qIdx) => {
      const qLabel = document.createElement('label');
      qLabel.textContent = `Вопрос ${qIdx + 1} (${base}):`;
      testCard.appendChild(qLabel);
      
      const qBase = document.createElement('div');
      qBase.className = 'dict-base-text';
      qBase.textContent = q.text;
      testCard.appendChild(qBase);
      
      const qInput = document.createElement('input');
      qInput.className = 'dict-translation-input';
      qInput.type = 'text';
      qInput.placeholder = `Перевод на ${target}`;
      const qKey = `test_${idx}_q_${qIdx}`;
      qInput.value = dictData.languages[target][qKey] || '';
      qInput.addEventListener('input', e => {
        if (!dictData.languages[target]) dictData.languages[target] = {};
        dictData.languages[target][qKey] = e.target.value;
      });
      testCard.appendChild(qInput);
      
      // Переводы ответов
      q.answers.forEach((a, aIdx) => {
        const aLabel = document.createElement('label');
        aLabel.textContent = `Ответ ${aIdx + 1} (${base}):`;
        testCard.appendChild(aLabel);
        
        const aBase = document.createElement('div');
        aBase.className = 'dict-base-text';
        aBase.textContent = a.text;
        testCard.appendChild(aBase);
        
        const aInput = document.createElement('input');
        aInput.className = 'dict-translation-input';
        aInput.type = 'text';
        aInput.placeholder = `Перевод на ${target}`;
        const aKey = `test_${idx}_q_${qIdx}_a_${aIdx}`;
        aInput.value = dictData.languages[target][aKey] || '';
        aInput.addEventListener('input', e => {
          if (!dictData.languages[target]) dictData.languages[target] = {};
          dictData.languages[target][aKey] = e.target.value;
        });
        testCard.appendChild(aInput);
      });
    });
    
    testsSection.appendChild(testCard);
  });
  
  editor.appendChild(testsSection);
  
  // Секция переводов профессий
  const profsSection = document.createElement('div');
  profsSection.className = 'dict-section';
  const profsTitle = document.createElement('h3');
  profsTitle.textContent = 'Переводы профессий';
  profsSection.appendChild(profsTitle);
  
  if (profData.professions && profData.professions.length > 0) {
    profData.professions.forEach((prof, idx) => {
      const profCard = document.createElement('div');
      profCard.className = 'dict-item-card';
      
      const profLabel = document.createElement('label');
      profLabel.textContent = `Профессия (${base}):`;
      profCard.appendChild(profLabel);
      
      const profBase = document.createElement('div');
      profBase.className = 'dict-base-text';
      profBase.textContent = prof.name;
      profCard.appendChild(profBase);
      
      const profInput = document.createElement('input');
      profInput.className = 'dict-translation-input';
      profInput.type = 'text';
      profInput.placeholder = `Перевод на ${target}`;
      const profKey = `prof_${idx}_name`;
      if (!dictData.professions) dictData.professions = {};
      if (!dictData.professions[target]) dictData.professions[target] = {};
      profInput.value = dictData.professions[target][profKey] || '';
      profInput.addEventListener('input', e => {
        if (!dictData.professions[target]) dictData.professions[target] = {};
        dictData.professions[target][profKey] = e.target.value;
      });
      profCard.appendChild(profInput);
      
      profsSection.appendChild(profCard);
    });
  }
  
  editor.appendChild(profsSection);
}

function exportDict(){
  const dataStr = JSON.stringify(dictData, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'dict.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function applyTranslations(){
  // Восстанавливаем оригинальные данные перед применением переводов
  if (originalTestData && originalTestData.tests && originalTestData.tests.length > 0) {
    // Создаем глубокую копию оригинальных данных
    testData.tests = originalTestData.tests.map(test => {
      return JSON.parse(JSON.stringify(test));
    });
  } else if (!testData || !testData.tests || testData.tests.length === 0) {
    // Если нет оригинальных данных и нет текущих данных, выходим
    console.warn('No test data available for translation');
    return;
  }
  
  if (currentLang === 'ru' || !dictData.languages || !dictData.languages[currentLang]) {
    // Если русский язык, данные уже в оригинальном виде
    return;
  }
  
  const translations = dictData.languages[currentLang];
  if (!translations) {
    console.warn('No translations found for language:', currentLang);
    return;
  }
  
  // Применяем переводы к тестам
  if (testData && testData.tests && Array.isArray(testData.tests)) {
    testData.tests.forEach((test, idx) => {
      if (!test) return;
      
      const nameKey = `test_${idx}_name`;
      if (translations[nameKey]) {
        test.name = translations[nameKey];
      } else {
        // Если перевод не найден, оставляем оригинальное название
        console.warn('Translation not found for test:', nameKey, 'original:', test.name);
      }
      
      if (test.questions && Array.isArray(test.questions)) {
        test.questions.forEach((q, qIdx) => {
          if (!q) return;
          
          const qKey = `test_${idx}_q_${qIdx}`;
          if (translations[qKey]) q.text = translations[qKey];
          
          if (q.answers && Array.isArray(q.answers)) {
            q.answers.forEach((a, aIdx) => {
              if (!a) return;
              
              const aKey = `test_${idx}_q_${qIdx}_a_${aIdx}`;
              if (translations[aKey]) a.text = translations[aKey];
            });
          }
        });
      }
    });
  }
  
  // Применяем переводы к профессиям
  if (profData && profData.professions && Array.isArray(profData.professions) && 
      dictData.professions && dictData.professions[currentLang]) {
    const profTranslations = dictData.professions[currentLang];
    profData.professions.forEach((prof, idx) => {
      if (!prof) return;
      const profKey = `prof_${idx}_name`;
      if (profTranslations[profKey]) {
        prof.name = profTranslations[profKey];
      }
    });
  }
}

function changeLanguage(lang){
  currentLang = lang;
  localStorage.setItem('currentLang', currentLang);
  location.reload();
}

function getUITranslation(key, defaultValue) {
  if (currentLang === 'ru' || !dictData.ui || !dictData.ui[currentLang]) {
    return defaultValue;
  }
  return dictData.ui[currentLang][key] || defaultValue;
}

function getTranslatedTestName(testIndexOrName) {
  // Если передан индекс
  if (typeof testIndexOrName === 'number') {
    const test = testData.tests[testIndexOrName];
    if (!test) return '';
    return test.name; // test.name уже переведен в applyTranslations()
  }
  
  // Если передан строкой - ищем тест по оригинальному названию
  if (typeof testIndexOrName === 'string') {
    const testIndex = testData.tests ? testData.tests.findIndex(t => {
      // Проверяем оригинальное название (до перевода)
      const originalName = getOriginalTestName(t);
      return originalName === testIndexOrName || t.name === testIndexOrName;
    }) : -1;
    
    if (testIndex >= 0 && testData.tests[testIndex]) {
      return testData.tests[testIndex].name; // Уже переведено
    }
    
    return testIndexOrName; // Если не нашли, возвращаем как есть
  }
  
  return '';
}

function getOriginalTestName(test) {
  if (!test || !testData.tests) return test ? test.name : '';
  
  const testIndex = testData.tests.indexOf(test);
  if (testIndex < 0) return test.name;
  
  // Если язык русский, название уже оригинальное
  if (currentLang === 'ru') return test.name;
  
  // Используем сохраненные оригинальные данные
  if (originalTestData && originalTestData.tests && originalTestData.tests[testIndex]) {
    return originalTestData.tests[testIndex].name;
  }
  
  // Если оригинальные данные недоступны, ищем в PROF_TEST_MAPPING
  if (testIndex < PROF_TEST_MAPPING.length) {
    return PROF_TEST_MAPPING[testIndex].testName;
  }
  
  // Если не нашли, возвращаем текущее название
  return test.name;
}

function getTranslatedAnswersMeaning(testIndex, key) {
  const test = testData.tests[testIndex];
  if (!test || !test.answersMeaning) return '';
  
  const originalValue = test.answersMeaning[key];
  if (!originalValue) return '';
  
  // Если язык русский, возвращаем оригинал
  if (currentLang === 'ru') return originalValue;
  
  // Ищем перевод в словаре
  const translationKey = `answers_meaning_${testIndex}_${key}`;
  if (dictData.ui && dictData.ui[currentLang] && dictData.ui[currentLang][translationKey]) {
    return dictData.ui[currentLang][translationKey];
  }
  
  return originalValue;
}

function applyUITranslations(){
  if (currentLang === 'ru' || !dictData.ui || !dictData.ui[currentLang]) return;
  
  const uiTranslations = dictData.ui[currentLang];
  
  // Функция для получения перевода
  function t(key, defaultValue) {
    return uiTranslations[key] || defaultValue;
  }
  
  // Переводим элементы с data-i18n атрибутом (но не перезаписываем, если там уже есть контент)
  document.querySelectorAll('[data-i18n]').forEach(el => {
    // Пропускаем элементы, которые уже содержат структурированный контент (не только текст)
    if (el.children.length > 0 || el.innerHTML.trim() !== el.textContent.trim()) {
      return; // Пропускаем элементы с HTML-структурой
    }
    const key = el.getAttribute('data-i18n');
    const defaultValue = el.textContent.trim();
    el.textContent = t(key, defaultValue);
  });
  
  // Заголовки страниц
  const brandElements = document.querySelectorAll('.top-nav__brand');
  brandElements.forEach(el => {
    const text = el.textContent.trim();
    if (text === 'Познай самого себя') el.textContent = t('app_title', text);
    else if (text === 'История тестов') el.textContent = t('history_title', text);
    else if (text === 'Корректировка профессий') el.textContent = t('professions_title', text);
    else if (text === 'Словари') el.textContent = t('dict_title', text);
    else if (text === 'Результаты') el.textContent = t('results_title', text);
    else if (text === 'Тест') el.textContent = t('test_title', text);
  });
  
  // Кнопки навигации
  const navLinks = document.querySelectorAll('.top-nav__actions .btn');
  navLinks.forEach(link => {
    const text = link.textContent.trim();
    if (text === 'История') link.textContent = t('btn_history', text);
    else if (text === 'Корректировка профессий') link.textContent = t('btn_professions', text);
    else if (text === 'Словари') link.textContent = t('btn_dict', text);
    else if (text === 'Домой') link.textContent = t('btn_home', text);
    else if (text === 'Очистить историю') link.textContent = t('btn_clear_history', text);
    else if (text === 'Экспорт словаря') link.textContent = t('btn_export_dict', text);
    else if (text === 'Добавить') link.textContent = t('btn_add', text);
    else if (text === 'Сохранить' || text === 'Сохранить изменения' || text === 'Сохранено') link.textContent = t('btn_save', text);
    else if (text === 'Экспорт') link.textContent = t('btn_export', text);
  });
  
  // Кнопки в основном контенте
  const contentButtons = document.querySelectorAll('main .btn, #test-container ~ .btn');
  contentButtons.forEach(btn => {
    const text = btn.textContent.trim();
    if (text === 'Отправить') btn.textContent = t('btn_submit', text);
    else if (text === 'Сравнить') btn.textContent = t('btn_compare', text);
  });
  
  // Заголовки h1
  const h1Elements = document.querySelectorAll('h1');
  h1Elements.forEach(h1 => {
    const text = h1.textContent.trim();
    if (text === 'Познай самого себя') h1.textContent = t('app_title', text);
  });
  
  // Тексты на странице словарей
  const dictDesc = document.querySelector('main > p');
  if (dictDesc && dictDesc.textContent.includes('Выберите базовый язык')) {
    dictDesc.textContent = t('dict_description', dictDesc.textContent);
  }
  
  const dictManagement = document.querySelector('.dict-controls-panel h3');
  if (dictManagement && dictManagement.textContent === 'Управление') {
    dictManagement.textContent = t('dict_management', dictManagement.textContent);
  }
  
  const baseLangLabel = document.querySelector('.dict-lang-selector label');
  if (baseLangLabel && baseLangLabel.textContent.includes('Базовый язык')) {
    baseLangLabel.textContent = t('dict_base_lang', baseLangLabel.textContent);
  }
  
  const targetLangLabels = document.querySelectorAll('.dict-lang-selector label');
  targetLangLabels.forEach(label => {
    if (label.textContent.includes('Язык перевода')) {
      label.textContent = t('dict_target_lang', label.textContent);
    }
  });
  
  const loadDictBtn = document.getElementById('load-dict-btn');
  if (loadDictBtn && loadDictBtn.textContent === 'Загрузить словарь') {
    loadDictBtn.textContent = t('btn_load_dict', loadDictBtn.textContent);
  }
  
  // Заголовки секций в словаре
  const dictSectionTitles = document.querySelectorAll('.dict-section h3');
  dictSectionTitles.forEach(h3 => {
    if (h3.textContent === 'Переводы тестов') {
      h3.textContent = t('dict_test_translations', h3.textContent);
    } else if (h3.textContent === 'Переводы профессий') {
      h3.textContent = t('dict_prof_translations', h3.textContent);
    }
  });
  
  // Описание на странице профессий
  const profDesc = document.querySelector('main > p');
  if (profDesc && profDesc.textContent.includes('Выберите профессию')) {
    profDesc.textContent = t('prof_description', profDesc.textContent);
  }
  
  // Title атрибут для select
  const langSelect = document.getElementById('lang-select');
  if (langSelect && langSelect.title === 'Выбрать язык') {
    langSelect.title = t('select_lang', langSelect.title);
  }
  
  // Обновляем title страницы
  if (document.title) {
    const titleText = document.title;
    if (titleText === 'Познай самого себя') document.title = t('app_title', titleText);
    else if (titleText === 'История') document.title = t('history_title', titleText);
    else if (titleText === 'Корректировка профессий') document.title = t('professions_title', titleText);
    else if (titleText === 'Словари') document.title = t('dict_title', titleText);
    else if (titleText === 'Результаты') document.title = t('results_title', titleText);
    else if (titleText === 'Тест') document.title = t('test_title', titleText);
  }
}

function initLanguageSelector(){
  const select = document.getElementById('lang-select');
  if (select) {
    select.value = currentLang;
  }
}

function markProfChanges(saved){
  const saveBtn = document.getElementById('save-prof-btn');
  if (!saveBtn) return;

  if (saved){
    saveBtn.disabled = true;
    saveBtn.textContent = 'Сохранено';
    return;
  }

  saveBtn.disabled = false;
  saveBtn.textContent = 'Сохранить';
}
