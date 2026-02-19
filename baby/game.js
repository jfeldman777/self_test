/**
 * Игра "Падающие карточки"
 * Карточки из img/ (1a, 1b, 2a — группы 1 и 2).
 * Внизу — все карточки в случайном порядке.
 * Одна карточка падает сверху. Нужно успеть нажать на неё и все эквиваленты внизу.
 * Успел = +1, не успел = -1.
 */

// Карточки: img/1a.png, 1b.png, 2a.png (группа = первая цифра в имени)
const CARDS_DATA = [
  { id: '1a', img: 'img/1a.png', group: 1 },
  { id: '1b', img: 'img/1b.png', group: 1 },
  { id: '2a', img: 'img/2a.png', group: 2 },
  { id: '2b', img: 'img/2b.png', group: 2 }
];

const FALL_DURATION_MS = 6000;
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
  removedCardIds: new Set(),
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
  const available = CARDS_DATA.filter(c => !state.removedCardIds.has(c.id));
  if (available.length === 0) state.removedCardIds.clear();
  state.bottomCards = shuffle(available.length > 0 ? available : [...CARDS_DATA]);
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
    fail(); // нажата неправильно — завершить падение
    return;
  }
  state.clickedIds.add(card.id);
  state.removedCardIds.add(card.id);
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
  document.getElementById('btn-stop').disabled = false;
  nextRound();
}

function stop() {
  cancelFall();
  hideFallingCard();
  document.getElementById('btn-start').disabled = false;
  document.getElementById('btn-stop').disabled = true;
}

function reset() {
  cancelFall();
  state.started = false;
  state.score = 0;
  state.falling = false;
  state.fallingCard = null;
  state.clickedIds.clear();
  state.removedCardIds.clear();
  hideFallingCard();
  updateScore();
  document.getElementById('btn-start').disabled = false;
  document.getElementById('btn-stop').disabled = true;
  document.getElementById(BOTTOM_CARDS_ID).innerHTML = '';
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-start').addEventListener('click', start);
  document.getElementById('btn-stop').addEventListener('click', stop);
  document.getElementById('btn-reset').addEventListener('click', reset);
  updateScore();
});
