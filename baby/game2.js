/**
 * Игра "Сложение"
 * Карточка + карточка = ? — кликнуть правильный ответ внизу.
 * Режим ТОЧКИ (1b, 2b...), потом режим ЦИФРЫ (1a, 2a...).
 */

const CARDS_DATA = [
  { id: '1a', img: 'img/1a.png', group: 1 },
  { id: '1b', img: 'img/1b.png', group: 1 },
  { id: '2a', img: 'img/2a.png', group: 2 },
  { id: '2b', img: 'img/2b.png', group: 2 },
  { id: '3a', img: 'img/3a.png', group: 3 },
  { id: '3b', img: 'img/3b.png', group: 3 },
  { id: '4a', img: 'img/4a.png', group: 4 },
  { id: '4b', img: 'img/4b.png', group: 4 },
  { id: '5a', img: 'img/5a.png', group: 5 },
  { id: '5b', img: 'img/5b.png', group: 5 }
];

let state = {
  score: 0,
  phaseIndex: 0,
  phaseCorrectCount: 0,
  enabledModes: [0],
  isHardMode: false,
  phaseConfig: { card1Points: true, card2Points: true, answerPoints: true, answerMixed: false },
  bottomCardStyles: [],
  started: false,
  stopped: false,
  a: 0,
  b: 0,
  answer: 0,
  answerOptions: []
};

const TASKS_PER_PHASE = 5;

const HARD_PHASE_NAMES = [
  'Цифры→Точки',
  'Точки→Цифры',
  'Смешанный, ответ точки',
  'Смешанный, ответ цифры',
  'Смешанный, внизу цифры и точки'
];

function getMaxDigit() {
  const el = document.getElementById('max-digit');
  return el ? Math.min(5, Math.max(1, parseInt(el.value, 10) || 3)) : 3;
}

function getEnabledModes() {
  const hard = document.getElementById('mode-hard')?.checked ?? false;
  if (hard) return { isHard: true, phases: [0, 1, 2, 3, 4] };
  const points = document.getElementById('mode-points')?.checked ?? true;
  const digits = document.getElementById('mode-digits')?.checked ?? false;
  const modes = [];
  if (points) modes.push(0);
  if (digits) modes.push(1);
  return { isHard: false, phases: modes.length ? modes : [0] };
}

function getCardId(num, usePoints) {
  const suffix = usePoints ? 'b' : 'a';
  return num + suffix;
}

function getCard(num, usePoints) {
  const id = getCardId(num, usePoints);
  return CARDS_DATA.find(c => c.id === id);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getCurrentPhaseIndex() {
  return state.enabledModes.phases[state.phaseIndex] ?? 0;
}

function applyPhaseConfig() {
  const phase = getCurrentPhaseIndex();
  if (!state.isHardMode) {
    const usePoints = phase === 0;
    state.phaseConfig = { card1Points: usePoints, card2Points: usePoints, answerPoints: usePoints, answerMixed: false };
    return;
  }
  switch (phase) {
    case 0:
      state.phaseConfig = { card1Points: false, card2Points: false, answerPoints: true, answerMixed: false };
      break;
    case 1:
      state.phaseConfig = { card1Points: true, card2Points: true, answerPoints: false, answerMixed: false };
      break;
    case 2:
    case 3: {
      const firstPoints = Math.random() < 0.5;
      state.phaseConfig = {
        card1Points: firstPoints,
        card2Points: !firstPoints,
        answerPoints: phase === 2,
        answerMixed: false
      };
      break;
    }
    case 4: {
      const firstPoints = Math.random() < 0.5;
      state.phaseConfig = {
        card1Points: firstPoints,
        card2Points: !firstPoints,
        answerPoints: false,
        answerMixed: true
      };
      break;
    }
    default:
      state.phaseConfig = { card1Points: true, card2Points: true, answerPoints: true, answerMixed: false };
  }
}

function generateTask() {
  const max = getMaxDigit();
  applyPhaseConfig();
  const cfg = state.phaseConfig;
  let a, b;
  do {
    a = 1 + Math.floor(Math.random() * max);
    b = 1 + Math.floor(Math.random() * max);
  } while (a + b > max);
  state.a = a;
  state.b = b;
  state.answer = state.a + state.b;
  const maxAns = max;
  const wrongOptions = [];
  for (let i = 1; i <= maxAns; i++) {
    if (i !== state.answer && getCard(i, cfg.answerPoints)) wrongOptions.push(i);
  }
  const pickWrong = Math.min(3, wrongOptions.length);
  const shuffled = shuffle(wrongOptions);
  state.answerOptions = [state.answer];
  for (let i = 0; i < pickWrong; i++) {
    state.answerOptions.push(shuffled[i]);
  }
  state.answerOptions = shuffle(state.answerOptions);
}

function showEquation() {
  const cfg = state.phaseConfig;
  const card1 = getCard(state.a, cfg.card1Points);
  const card2 = getCard(state.b, cfg.card2Points);
  document.getElementById('card1').innerHTML = card1 ? `<img src="${card1.img}" alt="${state.a}">` : '';
  document.getElementById('card2').innerHTML = card2 ? `<img src="${card2.img}" alt="${state.b}">` : '';
  document.getElementById('card-answer').innerHTML = '';
  document.getElementById('card-answer').dataset.value = state.answer;
}

function showAnswer() {
  const cfg = state.phaseConfig;
  let usePoints = cfg.answerPoints;
  if (cfg.answerMixed && state.bottomCardStyles.length) {
    const idx = state.answerOptions.indexOf(state.answer);
    if (idx >= 0) usePoints = state.bottomCardStyles[idx];
  }
  const card = getCard(state.answer, usePoints);
  document.getElementById('card-answer').innerHTML = card ? `<img src="${card.img}" alt="${state.answer}">` : '';
}

function renderBottomCards() {
  const container = document.getElementById('bottom-cards');
  container.innerHTML = '';
  const cfg = state.phaseConfig;
  state.bottomCardStyles = [];
  state.answerOptions.forEach(val => {
    const usePoints = cfg.answerMixed ? Math.random() < 0.5 : cfg.answerPoints;
    state.bottomCardStyles.push(usePoints);
    const card = getCard(val, usePoints);
    if (!card) return;
    const el = document.createElement('button');
    el.className = 'add-bottom-card';
    el.innerHTML = `<img src="${card.img}" alt="${val}">`;
    el.dataset.value = val;
    el.addEventListener('click', () => onAnswerClick(val, el));
    container.appendChild(el);
  });
}

function onAnswerClick(val, el) {
  if (!state.started || state.stopped) return;
  if (val === state.answer) {
    state.score += 1;
    state.phaseCorrectCount += 1;
    updateScore();
    showAnswer();
    el.style.visibility = 'hidden';
    el.style.pointerEvents = 'none';
    setTimeout(nextTask, 800);
  } else {
    state.score -= 1;
    updateScore();
    const area = document.getElementById('equation-area');
    if (area) area.classList.add('add-error');
    setTimeout(() => {
      if (area) area.classList.remove('add-error');
    }, 1000);
  }
}

function nextTask() {
  if (!state.started || state.stopped) return;
  if (state.phaseCorrectCount >= TASKS_PER_PHASE) {
    if (state.phaseIndex + 1 < state.enabledModes.phases.length) {
      state.phaseIndex += 1;
      state.phaseCorrectCount = 0;
      updateModeLabel();
    } else {
      gameOver();
      return;
    }
  }
  generateTask();
  showEquation();
  renderBottomCards();
}

function updateScore() {
  const el = document.getElementById('score');
  if (el) el.textContent = state.score;
}

function updateModeLabel() {
  const el = document.getElementById('mode-label');
  if (!el) return;
  if (state.isHardMode) {
    el.textContent = HARD_PHASE_NAMES[getCurrentPhaseIndex()] || 'Трудный';
  } else {
    const phase = getCurrentPhaseIndex();
    el.textContent = phase === 0 ? 'Точки' : 'Цифры';
  }
}

function start() {
  removeBlink();
  state.started = true;
  state.stopped = false;
  state.score = 0;
  const modes = getEnabledModes();
  state.enabledModes = modes;
  state.isHardMode = modes.isHard ?? false;
  state.phaseIndex = 0;
  state.phaseCorrectCount = 0;
  updateScore();
  updateModeLabel();
  document.getElementById('btn-start').disabled = true;
  document.getElementById('btn-stop').disabled = false;
  nextTask();
}

function stop() {
  state.stopped = true;
  document.getElementById('btn-start').disabled = false;
  document.getElementById('btn-stop').disabled = true;
}

function gameOver() {
  state.started = false;
  state.stopped = true;
  document.getElementById('btn-start').disabled = false;
  document.getElementById('btn-stop').disabled = true;
  const container = document.getElementById('game-container');
  if (container) container.classList.add('level-complete-blink');
}

function removeBlink() {
  const container = document.getElementById('game-container');
  if (container) container.classList.remove('level-complete-blink');
}

function reset() {
  removeBlink();
  state.started = false;
  state.stopped = false;
  state.score = 0;
  state.phaseIndex = 0;
  state.phaseCorrectCount = 0;
  updateScore();
  updateModeLabel();
  document.getElementById('btn-start').disabled = false;
  document.getElementById('btn-stop').disabled = true;
  document.getElementById('card1').innerHTML = '';
  document.getElementById('card2').innerHTML = '';
  document.getElementById('card-answer').innerHTML = '';
  document.getElementById('bottom-cards').innerHTML = '';
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('screen-active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('screen-active');
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-start').addEventListener('click', start);
  document.getElementById('btn-stop').addEventListener('click', stop);
  document.getElementById('btn-reset').addEventListener('click', reset);
  document.getElementById('btn-play').addEventListener('click', () => showScreen('screen-game'));
  document.getElementById('btn-back').addEventListener('click', () => {
    removeBlink();
    reset();
    showScreen('screen-instructions');
  });
  document.getElementById('max-digit')?.addEventListener('input', () => {
    document.getElementById('max-digit-value').textContent = document.getElementById('max-digit').value;
  });
  document.getElementById('max-digit-value').textContent = document.getElementById('max-digit')?.value || '3';
  updateScore();
});
