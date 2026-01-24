// Массив флэш-карточек
let flashcards = [];
let currentCardIndex = -1;
let stats = {
  total: 0,
  correct: 0,
  incorrect: 0
};

// Элементы интерфейса
let questionTextEl;
let answerTextEl;
let answerAreaEl;
let showAnswerBtn;
let feedbackButtons;
let correctBtn;
let incorrectBtn;
let nextBtn;
let statsElements;

document.addEventListener('DOMContentLoaded', function() {
  // Инициализация элементов
  questionTextEl = document.getElementById('question-text');
  answerTextEl = document.getElementById('answer-text');
  answerAreaEl = document.getElementById('answer-area');
  showAnswerBtn = document.getElementById('show-answer-btn');
  feedbackButtons = document.getElementById('feedback-buttons');
  correctBtn = document.getElementById('correct-btn');
  incorrectBtn = document.getElementById('incorrect-btn');
  nextBtn = document.getElementById('next-btn');
  
  statsElements = {
    total: document.getElementById('total-count'),
    correct: document.getElementById('correct-count'),
    incorrect: document.getElementById('incorrect-count'),
    accuracy: document.getElementById('accuracy')
  };
  
  // Обработчики событий
  showAnswerBtn.addEventListener('click', showAnswer);
  correctBtn.addEventListener('click', () => markAnswer(true));
  incorrectBtn.addEventListener('click', () => markAnswer(false));
  nextBtn.addEventListener('click', nextQuestion);
  
  // Загрузка данных
  loadFlashcards();
});

// Загрузка флэш-карточек из CSV файла
async function loadFlashcards() {
  try {
    const response = await fetch('flashcards.csv');
    const text = await response.text();
    parseCSV(text);
    
    if (flashcards.length > 0) {
      nextQuestion();
    } else {
      questionTextEl.textContent = 'Не удалось загрузить карточки';
    }
  } catch (error) {
    console.error('Ошибка загрузки файла:', error);
    questionTextEl.textContent = 'Ошибка загрузки файла flashcards.csv';
  }
}

// Парсинг CSV файла
function parseCSV(text) {
  const lines = text.split('\n').filter(line => line.trim());
  
  flashcards = lines.map((line, index) => {
    // Обработка CSV с учетом кавычек
    const parts = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        parts.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    parts.push(current.trim()); // Последняя часть
    
    if (parts.length >= 2) {
      return {
        question: parts[0].replace(/^"|"$/g, ''), // Убираем кавычки
        answer: parts[1].replace(/^"|"$/g, '')
      };
    }
    return null;
  }).filter(card => card !== null);
}

// Показать следующий вопрос
function nextQuestion() {
  if (flashcards.length === 0) {
    questionTextEl.textContent = 'Нет доступных карточек';
    return;
  }
  
  // Выбираем случайную карточку
  currentCardIndex = Math.floor(Math.random() * flashcards.length);
  const card = flashcards[currentCardIndex];
  
  // Показываем вопрос
  questionTextEl.textContent = card.question;
  
  // Скрываем ответ и кнопки
  answerAreaEl.style.display = 'none';
  feedbackButtons.style.display = 'none';
  nextBtn.style.display = 'none';
  
  // Показываем кнопку "Показать ответ"
  showAnswerBtn.style.display = 'block';
}

// Показать ответ
function showAnswer() {
  const card = flashcards[currentCardIndex];
  answerTextEl.textContent = card.answer;
  answerAreaEl.style.display = 'block';
  
  // Скрываем кнопку "Показать ответ", показываем кнопки обратной связи
  showAnswerBtn.style.display = 'none';
  feedbackButtons.style.display = 'flex';
}

// Отметить ответ как верный или неверный
function markAnswer(isCorrect) {
  stats.total++;
  
  if (isCorrect) {
    stats.correct++;
  } else {
    stats.incorrect++;
  }
  
  // Обновляем статистику
  updateStats();
  
  // Скрываем кнопки обратной связи, показываем кнопку "Следующий вопрос"
  feedbackButtons.style.display = 'none';
  nextBtn.style.display = 'block';
}

// Обновить статистику
function updateStats() {
  statsElements.total.textContent = stats.total;
  statsElements.correct.textContent = stats.correct;
  statsElements.incorrect.textContent = stats.incorrect;
  
  const accuracy = stats.total > 0 
    ? Math.round((stats.correct / stats.total) * 100) 
    : 0;
  statsElements.accuracy.textContent = accuracy + '%';
}
