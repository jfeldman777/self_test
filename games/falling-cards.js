/**
 * Игра "Падающие карточки"
 * Карточки с цифрами и эквивалентами (группы 1 и 2).
 * Внизу — все карточки в случайном порядке.
 * Одна карточка падает сверху. Нужно успеть нажать на неё и все эквиваленты внизу.
 * Успел = +1, не успел = -1.
 */

// Карточки: группа по первой цифре в строке (1, 2, 3...)
// Сейчас группы 1 и 2
const CARDS_DATA = [
  { id: 1, content: '1', group: 1 },
  { id: 2, content: 'один объект', group: 1 },
  { id: 3, content: '2', group: 2 },
  { id: 4, content: 'много объектов', group: 2 }
];

const FALL_DURATION_MS = 6000; // 6 секунд на падение
const GAME_AREA_ID = 'game-area';
const FALLING_CARD_ID = 'falling-card';
const BOTTOM_CARDS_ID = 'bottom-cards';

let state = {
  score: 0,
  started: false,
  falling: false,
  fallingCard: null,
  bottomCards: [],
  clickedIds: new Set(),
  animFrame: null,
  fallStartTime: 0
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getCardsByGroup(group) {
  return CARDS_DATA.filter(c => c.group === group);
}

function renderBottomCards() {
  const container = document.getElementById(BOTTOM_CARDS_ID);
  container.innerHTML = '';
  state.bottomCards = shuffle(CARDS_DATA);
  state.bottomCards.forEach(card => {
    const el = document.createElement('button');
    el.className = 'bottom-card';
    el.textContent = card.content;
    el.dataset.id = card.id;
    el.dataset.group = card.group;
    el.addEventListener('click', () => onBottomCardClick(card));
    container.appendChild(el);
  });
}

function showFallingCard(card) {
  const el = document.getElementById(FALLING_CARD_ID);
  el.textContent = card.content;
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
  state.fallingCard = null;
}

function onBottomCardClick(card) {
  if (!state.started || !state.falling || !state.fallingCard) return;
  if (card.group !== state.fallingCard.group) return; // не та группа
  state.clickedIds.add(card.id);
  const targetGroup = getCardsByGroup(state.fallingCard.group);
  const allClicked = targetGroup.every(c => state.clickedIds.has(c.id));
  if (allClicked) {
    success();
  }
}

function success() {
  if (!state.falling) return;
  cancelFall();
  state.score += 1;
  updateScore();
  hideFallingCard();
  nextRound();
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

  function tick(now) {
    const elapsed = now - state.fallStartTime;
    const progress = Math.min(1, elapsed / FALL_DURATION_MS);
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

function nextRound() {
  if (!state.started) return;
  renderBottomCards();
  const card = state.bottomCards[Math.floor(Math.random() * state.bottomCards.length)];
  state.falling = true;
  showFallingCard(card);
  animateFall();
}

function updateScore() {
  const el = document.getElementById('score');
  if (el) el.textContent = state.score;
}

function start() {
  state.started = true;
  state.score = 0;
  updateScore();
  document.getElementById('btn-start').disabled = true;
  nextRound();
}

function reset() {
  cancelFall();
  state.started = false;
  state.score = 0;
  state.falling = false;
  state.fallingCard = null;
  state.clickedIds.clear();
  hideFallingCard();
  updateScore();
  document.getElementById('btn-start').disabled = false;
  document.getElementById(BOTTOM_CARDS_ID).innerHTML = '';
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-start').addEventListener('click', start);
  document.getElementById('btn-reset').addEventListener('click', reset);
  updateScore();
});
