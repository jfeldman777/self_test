/* jshint esversion: 8 */

const LAB_VIEWS = {
  OVERVIEW: 'overview',
  DEMO: 'demo',
  EXAM_INTRO: 'exam-intro',
  EXAM: 'exam',
  SUMMARY: 'summary'
};

const state = {
  keywords: null,
  currentView: LAB_VIEWS.OVERVIEW,
  demoIndex: 0,
  demoChecked: false,
  examOrder: [],
  examIndex: 0,
  examResults: [],
  examAwaitingNext: false
};

const LEVEL_DEMOS = [
  {
    level: 1,
    title: 'Уровень 1 — Обозначения',
    scenario: 'Заготовка: опишите событие уровня 1 (выделение, имя, знак).',
    options: ['символ', 'узнавание', 'фиксация'],
    correct: ['символ', 'узнавание', 'фиксация'],
    hint: 'Уровень 1 всегда о выделении и именовании явления.'
  },
  {
    level: 2,
    title: 'Уровень 2 — Границы',
    scenario: 'Заготовка: опишите событие уровня 2 (свои, чужие, граница).',
    options: ['граница', 'семья', 'чужие'],
    correct: ['граница', 'семья', 'чужие'],
    hint: 'Второй уровень описывает принадлежность и разграничение.'
  },
  {
    level: 3,
    title: 'Уровень 3 — Силовые события',
    scenario: 'Заготовка: опишите событие уровня 3 (борьба, скорость, доминирование).',
    options: ['борьба', 'доминирование', 'движение'],
    correct: ['борьба', 'доминирование', 'движение'],
    hint: 'Преодоление, скорость и конкуренция — признаки третьего уровня.'
  },
  {
    level: 4,
    title: 'Уровень 4 — Правила',
    scenario: 'Заготовка: опишите событие уровня 4 (регламент, роль, координация).',
    options: ['правила', 'координация', 'взаимозависимость'],
    correct: ['правила', 'координация', 'взаимозависимость'],
    hint: 'Четвёртый уровень — о регламенте и согласованной совместной работе.'
  },
  {
    level: 5,
    title: 'Уровень 5 — Иррациональный выбор',
    scenario: 'Заготовка: опишите событие уровня 5 (риск, свобода, импровизация).',
    options: ['импровизация', 'свобода', 'риск'],
    correct: ['импровизация', 'свобода', 'риск'],
    hint: 'Если многое держится на импровизации и риске — это пятый уровень.'
  },
  {
    level: 6,
    title: 'Уровень 6 — Диалог и доказательства',
    scenario: 'Заготовка: опишите событие уровня 6 (логика, причинность, доказательства).',
    options: ['диалог', 'обоснование', 'доказательство'],
    correct: ['диалог', 'обоснование', 'доказательство'],
    hint: 'Шестой уровень ориентирован на логику и аргументацию.'
  },
  {
    level: 7,
    title: 'Уровень 7 — Новаторство',
    scenario: 'Заготовка: опишите событие уровня 7 (парадокс, новаторство, оригинальность).',
    options: ['новаторство', 'оригинальность подхода', 'парадокс'],
    correct: ['новаторство', 'оригинальность подхода', 'парадокс'],
    hint: 'Расшатать устоявшееся и придумать новое — признаки седьмого уровня.'
  },
  {
    level: 8,
    title: 'Уровень 8 — Мультиверсум',
    scenario: 'Заготовка: опишите событие уровня 8 (гармония, много систем, мультиверсум).',
    options: ['мультиверсум', 'гармония', 'много систем'],
    correct: ['мультиверсум', 'гармония', 'много систем'],
    hint: 'Восьмой уровень — это интеграция и удержание разных вселенных.'
  }
];

const EXAM_CASES = [
  { level: 1, scenario: 'Заготовка экзамена: событие уровня 1 (замените на свой кейс).' },
  { level: 2, scenario: 'Заготовка экзамена: событие уровня 2 (замените на свой кейс).' },
  { level: 3, scenario: 'Заготовка экзамена: событие уровня 3 (замените на свой кейс).' },
  { level: 4, scenario: 'Заготовка экзамена: событие уровня 4 (замените на свой кейс).' },
  { level: 5, scenario: 'Заготовка экзамена: событие уровня 5 (замените на свой кейс).' },
  { level: 6, scenario: 'Заготовка экзамена: событие уровня 6 (замените на свой кейс).' },
  { level: 7, scenario: 'Заготовка экзамена: событие уровня 7 (замените на свой кейс).' },
  { level: 8, scenario: 'Заготовка экзамена: событие уровня 8 (замените на свой кейс).' }
];

const LEVEL_EXAMPLES = {
  1: [
    'костер',
    'флаг',
    'фокусник'
  ],
  2: [
    'враги',
    'друзья',
    'застолье'
  ],
  3: [
    'чемпион',    'часы',     'спорт',
    'буллинг',    'дуэль',    'идеал',
    'точность'
  ],
  4: [
    'регламент',
    'бюрократия',
    'процедура',
  ],
  5: [
    'хаос',
    'полководец',
    'самодержец'
  ],
  6: [
    'понимание',
    'исследоавние',
    'самосогласованность'
  ],
  7: [
    'открытие',
    'гениальный ход',
    'старт-ап'
  ],
  8: [
    'зеркальные нейроны',
    'дипломатия',
    'не-деяние'
  ]
};

document.addEventListener('DOMContentLoaded', initLab);

function initLab() {
  setupNavButtons();
  loadKeywords().finally(() => {
    renderOverview();
  });
}

function setupNavButtons() {
  document.getElementById('btn-overview').addEventListener('click', () => renderOverview());
  document.getElementById('btn-demo').addEventListener('click', () => startDemo());
  document.getElementById('btn-exam').addEventListener('click', () => showExamIntro());
}

async function loadKeywords() {
  try {
    const res = await fetch('../kw.json?_=' + Date.now());
    if (!res.ok) throw new Error('kw.json load failed');
    state.keywords = await res.json();
  } catch (err) {
    state.keywords = null;
    console.warn('Не удалось загрузить ключевые слова для лаборатории', err);
  }
}

function renderOverview() {
  state.currentView = LAB_VIEWS.OVERVIEW;
  const root = getRoot();

  const keywordsBlock = buildKeywordsSection();
  const examplesBlock = buildExamplesSection();

  root.innerHTML = `
    <h1 class="lab-section-title">Обучение уровням событий</h1>
    <p class="lab-section-subtitle">
      Этот модуль помогает понять, какие признаки отличают восемь уровней событий. Сначала изучите общие слова, затем пройдите демонстрацию и завершите экзаменом.
    </p>
    ${keywordsBlock}
    ${examplesBlock}
    <div style="margin-top:24px; display:flex; gap:12px; flex-wrap: wrap;">
      <button class="lab-btn lab-btn--primary" id="start-demo">Начать демонстрацию</button>
      <button class="lab-btn lab-btn--ghost" id="start-exam">Перейти к экзамену</button>
    </div>
  `;

  document.getElementById('start-demo').addEventListener('click', () => startDemo());
  document.getElementById('start-exam').addEventListener('click', () => showExamIntro());
}

function buildKeywordsSection() {
  if (!state.keywords || !state.keywords.keywords) {
    return '<p>Ключевые слова пока не загружены. Обновите страницу.</p>';
  }

  const cards = Object.keys(state.keywords.keywords)
    .sort((a, b) => Number(a) - Number(b))
    .map(level => {
      const words = state.keywords.keywords[level]
        .map(entry => formatKeyword(entry))
        .filter(Boolean);
      return `
        <div class="keywords-card">
          <h4>Уровень ${level}</h4>
          <ul class="keywords-list">
            ${words.map(w => `<li>${w}</li>`).join('')}
          </ul>
        </div>
      `;
    })
    .join('');

  return `
    <div>
      <h3>Общие слова</h3>
      <p>Каждый уровень узнаётся по характерным признакам. Изучите их перед практикой.</p>
      <div class="keywords-grid">${cards}</div>
    </div>
  `;
}

function formatKeyword(entry) {
  if (!entry) return '';
  if (typeof entry === 'string') return entry;
  return entry.ru || entry.en || '';
}

function buildExamplesSection() {
  const sections = Object.keys(LEVEL_EXAMPLES)
    .sort((a, b) => Number(a) - Number(b))
    .map(level => {
      const items = LEVEL_EXAMPLES[level] || [];
      return `
        <div class="keywords-card">
          <h4>Примеры уровня ${level}</h4>
          <ol class="examples-list">
            ${items.map(text => `<li>${text}</li>`).join('')}
          </ol>
        </div>
      `;
    })
    .join('');

  return `
    <div style="margin-top:32px;">
      <h3>Заготовки событий</h3>
      <p>Для каждого уровня подготовлены три места, куда можно вписать собственные описания событий.</p>
      <div class="keywords-grid">${sections}</div>
    </div>
  `;
}

function startDemo() {
  state.demoIndex = 0;
  state.demoChecked = false;
  renderDemo();
}

function renderDemo() {
  state.currentView = LAB_VIEWS.DEMO;
  const root = getRoot();
  const demo = LEVEL_DEMOS[state.demoIndex];
  if (!demo) {
    showExamIntro();
    return;
  }

  const options = demo.options
    .map((opt, idx) => {
      const inputId = `demo-option-${idx}`;
      const checkedAttr = '';
      const disabledAttr = state.demoChecked ? 'disabled' : '';
      return `
        <label for="${inputId}">
          <input type="checkbox" id="${inputId}" value="${opt}" ${disabledAttr}>
          <span>${opt}</span>
        </label>
      `;
    })
    .join('');

  root.innerHTML = `
    <div class="progress-indicator">Класс ${demo.level} из ${LEVEL_DEMOS.length}</div>
    <h2 class="lab-section-title">${demo.title}</h2>
    <p class="lab-section-subtitle">Выберите признаки, по которым событие относится к этому классу.</p>
    <div class="demo-scenario">
      <strong>Ситуация:</strong> ${demo.scenario}
    </div>
    <div>
      <ul class="options-list">
        ${options}
      </ul>
    </div>
    <div id="demo-feedback"></div>
    <div style="margin-top:24px; display:flex; gap:12px; flex-wrap:wrap;">
      <button class="lab-btn lab-btn--primary" id="btn-demo-check"${state.demoChecked ? ' disabled' : ''}>Проверить</button>
      <button class="lab-btn lab-btn--ghost" id="btn-demo-next" ${state.demoChecked ? '' : 'disabled'}>
        ${state.demoIndex === LEVEL_DEMOS.length - 1 ? 'К экзамену' : 'Следующий класс'}
      </button>
    </div>
  `;

  document.getElementById('btn-demo-check').addEventListener('click', handleDemoCheck);
  document.getElementById('btn-demo-next').addEventListener('click', () => {
    state.demoIndex += 1;
    state.demoChecked = false;
    if (state.demoIndex >= LEVEL_DEMOS.length) {
      showExamIntro();
    } else {
      renderDemo();
    }
  });
}

function handleDemoCheck() {
  if (state.demoChecked) return;
  const demo = LEVEL_DEMOS[state.demoIndex];
  const checkboxes = Array.from(document.querySelectorAll('.options-list input[type="checkbox"]'));
  const selected = checkboxes.filter(cb => cb.checked).map(cb => cb.value);
  const result = evaluateFeatures(selected, demo.correct);
  state.demoChecked = true;

  checkboxes.forEach(cb => {
    cb.disabled = true;
    const parent = cb.closest('label');
    parent.classList.remove('correct-option', 'incorrect-option');
    if (demo.correct.includes(cb.value)) {
      parent.classList.add('correct-option');
    }
    if (cb.checked && !demo.correct.includes(cb.value)) {
      parent.classList.add('incorrect-option');
    }
  });

  const feedbackEl = document.getElementById('demo-feedback');
  if (result.isPerfect) {
    feedbackEl.innerHTML = `<div class="feedback">Отлично! Вы выбрали все правильные признаки. ${demo.hint}</div>`;
  } else {
    const missed = result.missed.length ? `Не хватило: ${result.missed.join(', ')}.` : '';
    const extra = result.extra.length ? `Лишние: ${result.extra.join(', ')}.` : '';
    feedbackEl.innerHTML = `<div class="feedback feedback--error">
      Есть что уточнить. ${missed} ${extra} ${demo.hint}
    </div>`;
  }

  document.getElementById('btn-demo-check').disabled = true;
  document.getElementById('btn-demo-next').disabled = false;
}

function evaluateFeatures(selected, correct) {
  const selectedSet = new Set(selected);
  const correctSet = new Set(correct);
  const missed = correct.filter(item => !selectedSet.has(item));
  const extra = selected.filter(item => !correctSet.has(item));
  return {
    missed,
    extra,
    isPerfect: missed.length === 0 && extra.length === 0
  };
}

function showExamIntro() {
  state.currentView = LAB_VIEWS.EXAM_INTRO;
  const root = getRoot();
  root.innerHTML = `
    <h2 class="lab-section-title">Экзамен</h2>
    <p class="lab-section-subtitle">
      Сейчас будут появляться случайные ситуации. Ваша задача — указать, к какому уровню (1-8) относится событие.
    </p>
    <ul class="keywords-list">
      <li>Всего вопросов: ${EXAM_CASES.length}</li>
      <li>Случайный порядок выдачи</li>
      <li>После ответа сразу увидите правильный уровень</li>
    </ul>
    <div style="margin-top:24px;">
      <button class="lab-btn lab-btn--primary" id="btn-start-exam">Начать экзамен</button>
    </div>
  `;

  document.getElementById('btn-start-exam').addEventListener('click', () => startExam());
}

function startExam() {
  state.examOrder = shuffleArray(EXAM_CASES.slice());
  state.examIndex = 0;
  state.examResults = [];
  state.examAwaitingNext = false;
  renderExamQuestion();
}

function renderExamQuestion() {
  state.currentView = LAB_VIEWS.EXAM;
  state.examAwaitingNext = false;
  const root = getRoot();
  const total = state.examOrder.length;
  const question = state.examOrder[state.examIndex];

  const options = Array.from({ length: 8 }).map((_, idx) => {
    const level = idx + 1;
    const inputId = `exam-level-${level}`;
    return `
      <label for="${inputId}">
        <input type="radio" id="${inputId}" name="exam-level" value="${level}">
        <span>Уровень ${level}</span>
      </label>
    `;
  }).join('');

  root.innerHTML = `
    <div class="progress-indicator">Вопрос ${state.examIndex + 1} из ${total}</div>
    <h2 class="lab-section-title">Экзамен: определите уровень</h2>
    <div class="exam-question">
      ${question.scenario}
    </div>
    <form id="exam-form">
      <ul class="options-list">
        ${options}
      </ul>
    </form>
    <div id="exam-feedback"></div>
    <div style="margin-top:24px;">
      <button class="lab-btn lab-btn--primary" id="btn-exam-action">Ответить</button>
    </div>
  `;

  document.getElementById('btn-exam-action').addEventListener('click', handleExamAction);
}

function handleExamAction(event) {
  event.preventDefault();
  const question = state.examOrder[state.examIndex];
  const feedbackEl = document.getElementById('exam-feedback');
  const button = document.getElementById('btn-exam-action');
  const form = document.getElementById('exam-form');

  if (!state.examAwaitingNext) {
    const selected = form.querySelector('input[name="exam-level"]:checked');
    if (!selected) {
      feedbackEl.innerHTML = `<div class="feedback feedback--error">Выберите уровень, прежде чем продолжить.</div>`;
      return;
    }

    const answerLevel = Number(selected.value);
    const isCorrect = answerLevel === question.level;
    state.examResults.push({
      scenario: question.scenario,
      answer: answerLevel,
      correct: question.level
    });

    form.querySelectorAll('input').forEach(input => input.disabled = true);

    if (isCorrect) {
      feedbackEl.innerHTML = `<div class="feedback">Верно! Это уровень ${question.level}.</div>`;
    } else {
      feedbackEl.innerHTML = `<div class="feedback feedback--error">
        Неверно. Правильный ответ — уровень ${question.level}.
      </div>`;
    }

    state.examAwaitingNext = true;
    button.textContent = state.examIndex === state.examOrder.length - 1 ? 'Завершить' : 'Следующий вопрос';
    return;
  }

  if (state.examIndex === state.examOrder.length - 1) {
    renderExamSummary();
  } else {
    state.examIndex += 1;
    renderExamQuestion();
  }
}

function renderExamSummary() {
  state.currentView = LAB_VIEWS.SUMMARY;
  const root = getRoot();
  const correctCount = state.examResults.filter(item => item.answer === item.correct).length;
  const total = state.examResults.length;

  const rows = state.examResults.map(result => `
    <tr>
      <td>${result.scenario}</td>
      <td>${result.answer}</td>
      <td>${result.correct}</td>
    </tr>
  `).join('');

  root.innerHTML = `
    <h2 class="lab-section-title">Итоги экзамена</h2>
    <p class="lab-section-subtitle">
      Правильных ответов: ${correctCount} из ${total} (${Math.round((correctCount / total) * 100)}%)
    </p>
    <table class="summary-table">
      <thead>
        <tr>
          <th>Сценарий</th>
          <th>Ваш ответ</th>
          <th>Правильный уровень</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
    <div style="margin-top:24px; display:flex; gap:12px; flex-wrap:wrap;">
      <button class="lab-btn lab-btn--primary" id="btn-repeat-demo">Повторить демонстрацию</button>
      <button class="lab-btn lab-btn--ghost" id="btn-repeat-exam">Ещё раз экзамен</button>
      <button class="lab-btn lab-btn--ghost" id="btn-overview-return">К общим словам</button>
    </div>
  `;

  document.getElementById('btn-repeat-demo').addEventListener('click', () => startDemo());
  document.getElementById('btn-repeat-exam').addEventListener('click', () => startExam());
  document.getElementById('btn-overview-return').addEventListener('click', () => renderOverview());
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getRoot() {
  return document.getElementById('lab-root');
}

