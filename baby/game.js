/**
 * Игра "Падающие карточки"
 * Карточки из img/ (1a, 1b, 2a — группы 1 и 2).
 * Внизу — все карточки в случайном порядке.
 * Одна карточка падает сверху. Нужно успеть нажать на неё и все эквиваленты внизу.
 * Успел = +1, не успел = -1.
 */

// Карточки: 1a..9c (a=цифры, b=точки, c=звери)
const CARDS_DATA = [
  { id: '1a', img: 'img/1a.png', group: 1 },
  { id: '1b', img: 'img/1b.png', group: 1 },
  { id: '1c', img: 'img/1c.png', group: 1 },
  { id: '2a', img: 'img/2a.png', group: 2 },
  { id: '2b', img: 'img/2b.png', group: 2 },
  { id: '2c', img: 'img/2c.png', group: 2 },
  { id: '3a', img: 'img/3a.png', group: 3 },
  { id: '3b', img: 'img/3b.png', group: 3 },
  { id: '3c', img: 'img/3c.png', group: 3 },
  { id: '4a', img: 'img/4a.png', group: 4 },
  { id: '4b', img: 'img/4b.png', group: 4 },
  { id: '4c', img: 'img/4c.png', group: 4 },
  { id: '5a', img: 'img/5a.png', group: 5 },
  { id: '5b', img: 'img/5b.png', group: 5 },
  { id: '5c', img: 'img/5c.png', group: 5 },
  { id: '6a', img: 'img/6a.png', group: 6 },
  { id: '6b', img: 'img/6b.png', group: 6 },
  { id: '6c', img: 'img/6c.png', group: 6 },
  { id: '7a', img: 'img/7a.png', group: 7 },
  { id: '7b', img: 'img/7b.png', group: 7 },
  { id: '7c', img: 'img/7c.png', group: 7 },
  { id: '8a', img: 'img/8a.png', group: 8 },
  { id: '8b', img: 'img/8b.png', group: 8 },
  { id: '8c', img: 'img/8c.png', group: 8 },
  { id: '9a', img: 'img/9a.png', group: 9 },
  { id: '9b', img: 'img/9b.png', group: 9 },
  { id: '9c', img: 'img/9c.png', group: 9 }
];

const MAX_DIGIT_ID = 'max-digit';
const SPEED_ID = 'speed';

const FALL_DURATION_MIN = 2000;
const FALL_DURATION_MAX = 10000;
const GAME_AREA_ID = 'game-area';
const FALLING_CARD_ID = 'falling-card';
const BOTTOM_CARDS_ID = 'bottom-cards';

let state = {
  score: 0,
  currentLevel: 1,
  autoMode: 'manual',
  autoPhase: 0,
  started: false,
  falling: false,
  fallingCard: null,
  bottomCards: [],
  clickedIds: new Set(),
  removedCardIds: new Set(),
  usedFallingIds: new Set(),
  animFrame: null,
  fallStartTime: 0,
  wrongClickShown: false
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getMaxDigit() {
  const el = document.getElementById(MAX_DIGIT_ID);
  return el ? Math.min(9, Math.max(1, parseInt(el.value, 10) || 1)) : 1;
}

function getFallDurationMs() {
  const el = document.getElementById(SPEED_ID);
  const speed = el ? Math.min(5, Math.max(1, parseInt(el.value, 10) || 3)) : 3;
  const t = (speed - 1) / 4;
  return FALL_DURATION_MAX - t * (FALL_DURATION_MAX - FALL_DURATION_MIN);
}

function isDigitCard(card) {
  return card.id.endsWith('a');
}

function isPointCard(card) {
  return card.id.endsWith('b');
}

function isAnimalCard(card) {
  return card.id.endsWith('c');
}

function getGameMode() {
  const el = document.querySelector('input[name="game-mode"]:checked');
  return el?.value || 'manual';
}

function getFallType() {
  const mode = state.autoMode;
  if (mode === 'hard') {
    const types = ['digit', 'point', 'animal'];
    return types[Math.floor(Math.random() * 3)];
  }
  const el = document.querySelector('input[name="fall-type"]:checked');
  const v = el?.value || 'digit';
  return v === 'point' ? 'point' : (v === 'animal' ? 'animal' : 'digit');
}

function getBottomTypes() {
  const mode = state.autoMode;
  if (mode === 'hard') {
    return { digits: true, points: true, animals: true };
  }
  const digits = document.getElementById('chk-digits')?.checked ?? true;
  const points = document.getElementById('chk-points')?.checked ?? true;
  const animals = document.getElementById('chk-animals')?.checked ?? false;
  const any = digits || points || animals;
  return { digits: digits || !any, points: points || !any, animals: animals || !any };
}

function getActiveCards() {
  return CARDS_DATA.filter(c => c.group <= state.currentLevel);
}

function getBottomCards() {
  const active = getActiveCards();
  const { digits, points, animals } = getBottomTypes();
  return active.filter(c => (digits && isDigitCard(c)) || (points && isPointCard(c)) || (animals && isAnimalCard(c)));
}

function getFallingCards() {
  const active = getActiveCards();
  const fallType = getFallType();
  return active.filter(c => fallType === 'digit' ? isDigitCard(c) : fallType === 'point' ? isPointCard(c) : isAnimalCard(c));
}

function getCardsByGroup(group) {
  return getActiveCards().filter(c => c.group === group);
}

function renderBottomCards() {
  const container = document.getElementById(BOTTOM_CARDS_ID);
  container.innerHTML = '';
  const bottomCards = getBottomCards();
  const available = bottomCards.filter(c => !state.removedCardIds.has(c.id));
  state.bottomCards = available.length > 0 ? shuffle(available) : [];
  state.bottomCards.forEach(card => {
    const el = document.createElement('button');
    el.className = 'bottom-card';
    el.dataset.id = card.id;
    el.dataset.group = card.group;
    el.innerHTML = `<img src="${card.img}" alt="${card.id}">`;
    el.addEventListener('click', () => onBottomCardClick(card, el));
    container.appendChild(el);
  });
}

function showFallingCard(card) {
  const el = document.getElementById(FALLING_CARD_ID);
  el.innerHTML = `<img src="${card.img}" alt="${card.id}">`;
  el.dataset.group = card.group;
  el.style.display = 'flex';
  el.style.top = '0';
  state.fallingCard = card;
  state.clickedIds.clear();
  state.fallStartTime = performance.now();
}

function hideFallingCard() {
  const el = document.getElementById(FALLING_CARD_ID);
  el.style.display = 'none';
  el.innerHTML = '';
  state.fallingCard = null;
}

function onBottomCardClick(card, el) {
  if (!state.started || !state.falling || !state.fallingCard) return;
  if (card.group !== state.fallingCard.group) {
    wrongClick();
    return;
  }
  state.clickedIds.add(card.id);
  state.removedCardIds.add(card.id);
  state.usedFallingIds.add(state.fallingCard.id);
  el.style.display = 'none';
  el.style.visibility = 'hidden';
  el.style.pointerEvents = 'none';
  success();
}

function success() {
  if (!state.falling) return;
  cancelFall();
  state.score += 1;
  updateScore();
  hideFallingCard();
  nextRound();
}

function wrongClick() {
  if (!state.falling || state.wrongClickShown) return;
  state.wrongClickShown = true;
  cancelFall();
  const area = document.getElementById(GAME_AREA_ID);
  if (area) area.classList.add('game-area-error');
  setTimeout(() => {
    if (area) area.classList.remove('game-area-error');
    state.wrongClickShown = false;
    state.score -= 1;
    updateScore();
    hideFallingCard();
    nextRound();
  }, 1000);
}

function fail() {
  if (!state.falling) return;
  cancelFall();
  state.score -= 1;
  updateScore();
  hideFallingCard();
  nextRound();
}

function cancelFall() {
  state.falling = false;
  if (state.animFrame) {
    cancelAnimationFrame(state.animFrame);
    state.animFrame = null;
  }
}

function animateFall() {
  const el = document.getElementById(FALLING_CARD_ID);
  const area = document.getElementById(GAME_AREA_ID);
  if (!area || !el) return;

  const duration = getFallDurationMs();
  function tick(now) {
    const elapsed = now - state.fallStartTime;
    const progress = Math.min(1, elapsed / duration);
    const areaRect = area.getBoundingClientRect();
    const maxTop = areaRect.height - el.offsetHeight;
    el.style.top = progress * maxTop + 'px';

    if (progress >= 1) {
      fail();
      return;
    }
    state.animFrame = requestAnimationFrame(tick);
  }
  state.animFrame = requestAnimationFrame(tick);
}

function removeBlink() {
  const container = document.getElementById('game-container');
  const area = document.getElementById(GAME_AREA_ID);
  if (container) container.classList.remove('level-complete-blink');
  if (area) area.classList.remove('level-complete-blink');
}

function gameOver() {
  cancelFall();
  hideFallingCard();
  state.started = false;
  const bottomEl = document.getElementById(BOTTOM_CARDS_ID);
  if (bottomEl) bottomEl.innerHTML = '';
  document.getElementById('btn-start').disabled = false;
  document.getElementById('btn-stop').disabled = true;
  updateMaxDigitControl();
}

function nextRound() {
  if (!state.started) return;
  renderBottomCards();
  if (state.bottomCards.length === 0) {
    const maxDigit = getMaxDigit();
    if (state.currentLevel < maxDigit) {
      state.currentLevel++;
      state.removedCardIds.clear();
      state.usedFallingIds.clear();
      updateLevelDisplay();
      setTimeout(nextRound, 0);
      return;
    }
    const container = document.getElementById('game-container');
    const area = document.getElementById(GAME_AREA_ID);
    if (container) container.classList.add('level-complete-blink');
    if (area) area.classList.add('level-complete-blink');
    gameOver();
    return;
  }
  let fallingCandidates = getFallingCards()
    .filter(c => !state.usedFallingIds.has(c.id))
    .filter(c => state.bottomCards.some(b => b.group === c.group));
  if (fallingCandidates.length === 0 && state.bottomCards.length > 0) {
    state.usedFallingIds.clear();
    fallingCandidates = getFallingCards()
      .filter(c => state.bottomCards.some(b => b.group === c.group));
  }
  if (fallingCandidates.length === 0) {
    gameOver();
    return;
  }
  const card = fallingCandidates[Math.floor(Math.random() * fallingCandidates.length)];
  state.falling = true;
  showFallingCard(card);
  animateFall();
}

function updateScore() {
  const el = document.getElementById('score');
  if (el) el.textContent = state.score;
}

function updateLevelDisplay() {
  const el = document.getElementById('current-level');
  if (el) el.textContent = state.currentLevel;
}

function updateMaxDigitControl() {
  const slider = document.getElementById(MAX_DIGIT_ID);
  const valueEl = document.getElementById('max-digit-value');
  if (slider && valueEl) {
    valueEl.textContent = slider.value;
    slider.disabled = state.started;
  }
}

function updateSpeedControl() {
  const slider = document.getElementById(SPEED_ID);
  const valueEl = document.getElementById('speed-value');
  if (slider && valueEl) valueEl.textContent = slider.value;
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('screen-active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('screen-active');
}

function start() {
  removeBlink();
  state.started = true;
  state.score = 0;
  state.currentLevel = 1;
  state.autoMode = getGameMode();
  state.autoPhase = 0;
  state.removedCardIds.clear();
  state.usedFallingIds.clear();
  updateScore();
  updateLevelDisplay();
  document.getElementById('btn-start').disabled = true;
  document.getElementById('btn-stop').disabled = false;
  updateMaxDigitControl();
  nextRound();
}

function stop() {
  cancelFall();
  hideFallingCard();
  document.getElementById('btn-start').disabled = false;
  document.getElementById('btn-stop').disabled = true;
  updateMaxDigitControl();
}

function reset() {
  removeBlink();
  cancelFall();
  state.started = false;
  state.score = 0;
  state.falling = false;
  state.fallingCard = null;
  state.clickedIds.clear();
  state.removedCardIds.clear();
  state.usedFallingIds.clear();
  state.currentLevel = 1;
  state.autoMode = 'manual';
  state.autoPhase = 0;
  hideFallingCard();
  updateScore();
  updateLevelDisplay();
  document.getElementById('btn-start').disabled = false;
  document.getElementById('btn-stop').disabled = true;
  document.getElementById(BOTTOM_CARDS_ID).innerHTML = '';
  updateMaxDigitControl();
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
  document.getElementById(MAX_DIGIT_ID)?.addEventListener('input', updateMaxDigitControl);
  document.getElementById(SPEED_ID)?.addEventListener('input', updateSpeedControl);
  document.querySelectorAll('input[name="game-mode"]').forEach(el => {
    el.addEventListener('change', () => {
      const manual = document.querySelector('input[name="game-mode"][value="manual"]')?.checked;
      document.querySelectorAll('.mode-manual-only').forEach(s => s.style.display = manual ? '' : 'none');
    });
  });
  document.querySelectorAll('.mode-manual-only').forEach(s => {
    s.style.display = document.querySelector('input[name="game-mode"][value="manual"]')?.checked ? '' : 'none';
  });
  updateScore();
  updateLevelDisplay();
  updateMaxDigitControl();
  updateSpeedControl();
});
