// Конфигурация игры
// Каждый уровень содержит:
// - image: путь к изображению с правильной таблицей
// - rows: количество строк
// - cols: количество столбцов
// - elements: массив элементов (можно использовать изображения или текст)

const gameLevels = [
  {
    level: 1,
    name: 'Мышление',
    rows: 8,
    cols: 6,
    headers: ['Уровень', 'Вопрос', 'Операция внутрь', 'Операция наружу', 'Категория внутрь', 'Категория наружу'],
    elements: [
      // Строка 1
      { id: 1, content: '1' },
      { id: 2, content: 'Что?' },
      { id: 3, content: 'Узнавание' },
      { id: 4, content: 'Наименование' },
      { id: 5, content: 'Вещь' },
      { id: 6, content: 'Имя' },
      // Строка 2
      { id: 7, content: '2' },
      { id: 8, content: 'Где?' },
      { id: 9, content: 'Различение' },
      { id: 10, content: 'Разграничение' },
      { id: 11, content: 'Пространство' },
      { id: 12, content: 'Граница' },
      // Строка 3
      { id: 13, content: '3' },
      { id: 14, content: 'Когда?' },
      { id: 15, content: 'Предельный переход' },
      { id: 16, content: 'Упорядочение' },
      { id: 17, content: 'Время' },
      { id: 18, content: 'Движение' },
      // Строка 4
      { id: 19, content: '4' },
      { id: 20, content: 'Как?' },
      { id: 21, content: 'Ряды' },
      { id: 22, content: 'Параллельные' },
      { id: 23, content: 'Роль' },
      { id: 24, content: 'Способ' },
      // Строка 5
      { id: 25, content: '5' },
      { id: 26, content: 'Кто?' },
      { id: 27, content: 'Свобода' },
      { id: 28, content: 'Выбор' },
      { id: 29, content: 'Случайность' },
      { id: 30, content: 'Риск' },
      // Строка 6
      { id: 31, content: '6' },
      { id: 32, content: 'Почему?' },
      { id: 33, content: 'Доказательство' },
      { id: 34, content: 'Сомнение' },
      { id: 35, content: 'Причина' },
      { id: 36, content: 'Следствие' },
      // Строка 7
      { id: 37, content: '7' },
      { id: 38, content: 'А если?' },
      { id: 39, content: 'Аномалия' },
      { id: 40, content: 'Парадокс' },
      { id: 41, content: 'Гений' },
      { id: 42, content: 'Открытие' },
      // Строка 8
      { id: 43, content: '8' },
      { id: 44, content: 'А зачем?' },
      { id: 45, content: 'Гармония' },
      { id: 46, content: 'Баланс' },
      { id: 47, content: 'Учет интересов всех участников, сколь угодно на нас непохожих' },
      { id: 48, content: 'Учет отдаленных последствий' }
    ]
  },
  {
    level: 2,
    name: 'Сознание',
    rows: 8,
    cols: 4,
    headers: ['Уровень', 'Тип сознания', 'Положительное', 'Отрицательное'],
    elements: [
      // Строка 1
      { id: 1, content: '1' },
      { id: 2, content: 'Магическое' },
      { id: 3, content: 'Чудо' },
      { id: 4, content: 'Тайна' },
      // Строка 2
      { id: 5, content: '2' },
      { id: 6, content: 'Этическое' },
      { id: 7, content: 'Добро' },
      { id: 8, content: 'Зло' },
      // Строка 3
      { id: 9, content: '3' },
      { id: 10, content: 'Эстетическое' },
      { id: 11, content: 'Красота' },
      { id: 12, content: 'Уродство' },
      // Строка 4
      { id: 13, content: '4' },
      { id: 14, content: 'Ролевое' },
      { id: 15, content: 'Соблюдение' },
      { id: 16, content: 'Нарушение' },
      // Строка 5
      { id: 17, content: '5' },
      { id: 18, content: 'Свободное' },
      { id: 19, content: 'Активность' },
      { id: 20, content: 'Пассивность' },
      // Строка 6
      { id: 21, content: '6' },
      { id: 22, content: 'Теоретическое' },
      { id: 23, content: 'Истина' },
      { id: 24, content: 'Ложь' },
      // Строка 7
      { id: 25, content: '7' },
      { id: 26, content: 'Парадоксальное' },
      { id: 27, content: 'Новое' },
      { id: 28, content: 'Старое' },
      // Строка 8
      { id: 29, content: '8' },
      { id: 30, content: 'Универсальное' },
      { id: 31, content: 'Гармония' },
      { id: 32, content: 'Какофония' }
    ]
  },
  {
    level: 3,
    name: 'Взаимодействие',
    rows: 8,
    cols: 6,
    headers: ['Уровень', 'нейтрально', 'положительно', 'отрицательно', 'Другой', 'Отношение к детям'],
    elements: [
      // Строка 1
      { id: 1, content: '1' },
      { id: 2, content: 'фиксация' },
      { id: 3, content: 'концентрация' },
      { id: 4, content: 'изоляция' },
      { id: 5, content: 'как вещь' },
      { id: 6, content: 'как вещь' },
      // Строка 2
      { id: 7, content: '2' },
      { id: 8, content: 'семья' },
      { id: 9, content: 'свои' },
      { id: 10, content: 'чужие' },
      { id: 11, content: 'как одна из вещей' },
      { id: 12, content: 'как одна из вещей' },
      // Строка 3
      { id: 13, content: '3' },
      { id: 14, content: 'борьба' },
      { id: 15, content: 'доминирование' },
      { id: 16, content: 'подчинение' },
      { id: 17, content: 'как средство' },
      { id: 18, content: 'как помеха' },
      // Строка 4
      { id: 19, content: '4' },
      { id: 20, content: 'правила' },
      { id: 21, content: 'координация' },
      { id: 22, content: 'взаимозависимость' },
      { id: 23, content: 'как партнер' },
      { id: 24, content: 'как роль в ролевой системе' },
      // Строка 5
      { id: 25, content: '5' },
      { id: 26, content: 'импровизация' },
      { id: 27, content: 'свобода' },
      { id: 28, content: 'непредсказуемость' },
      { id: 29, content: 'конкурент' },
      { id: 30, content: 'как фактор неопределенности' },
      // Строка 6
      { id: 31, content: '6' },
      { id: 32, content: 'диалог' },
      { id: 33, content: 'обоснование' },
      { id: 34, content: 'опровержение' },
      { id: 35, content: 'собеседник' },
      { id: 36, content: 'коллега' },
      // Строка 7
      { id: 37, content: '7' },
      { id: 38, content: 'оригинальность подхода' },
      { id: 39, content: 'новаторство' },
      { id: 40, content: 'разрушение традиции' },
      { id: 41, content: 'мыслитель' },
      { id: 42, content: 'мыслящее существо' },
      // Строка 8
      { id: 43, content: '8' },
      { id: 44, content: 'моделирование чужого сознания' },
      { id: 45, content: 'Мультиверсум' },
      { id: 46, content: 'Абсолютная эмпатия' },
      { id: 47, content: 'Другая вселенная' },
      { id: 48, content: 'Другая вселенная' }
    ]
  },
  {
    level: 4,
    name: 'Кодировки',
    rows: 3,
    cols: 7,
    headers: ['Кодировки', '1', '2', '3', '12', '23', '13'],
    elements: [
      // Строка 1
      { id: 1, content: 'мелкие' },
      { id: 2, content: 'ухо' },
      { id: 3, content: 'глаз' },
      { id: 4, content: 'рука' },
      { id: 5, content: 'обоняние' },
      { id: 6, content: 'вкус' },
      { id: 7, content: 'интуиция' },
      // Строка 2
      { id: 8, content: 'средние' },
      { id: 9, content: 'текст' },
      { id: 10, content: 'картинка' },
      { id: 11, content: 'схема' },
      { id: 12, content: 'таблица' },
      { id: 13, content: 'диаграмма' },
      { id: 14, content: 'иллюстрация' },
      // Строка 3
      { id: 15, content: 'крупные' },
      { id: 16, content: 'образы' },
      { id: 17, content: 'смыслы' },
      { id: 18, content: 'сценарии' },
      { id: 19, content: 'видения' },
      { id: 20, content: 'метафоры' },
      { id: 21, content: 'эвристики' }
    ]
  },
  {
    level: 5,
    name: 'Темперамент',
    rows: 4,
    cols: 5,
    headers: ['Темперамент', 'Самый-самый', 'Смех - слезы', 'Агрессия - депрессия', 'Самооценка'],
    elements: [
      // Строка 1
      { id: 1, content: 'Холерик' },
      { id: 2, content: 'Быстрый' },
      { id: 3, content: 'Сарказм' },
      { id: 4, content: 'Агрессия' },
      { id: 5, content: 'завышенная' },
      // Строка 2
      { id: 6, content: 'Сангвиник' },
      { id: 7, content: 'Доброжелательный' },
      { id: 8, content: 'Юмор' },
      { id: 9, content: 'Бодрость' },
      { id: 10, content: 'положительная' },
      // Строка 3
      { id: 11, content: 'Флегматик' },
      { id: 12, content: 'Выносливый' },
      { id: 13, content: 'Нейтрален' },
      { id: 14, content: 'Невозмутимость' },
      { id: 15, content: 'непонятно какая' },
      // Строка 4
      { id: 16, content: 'Меланхолик' },
      { id: 17, content: 'Чувствительный' },
      { id: 18, content: 'Слезы' },
      { id: 19, content: 'Депрессия' },
      { id: 20, content: 'неустойчивая' }
    ]
  },
  // Добавьте больше уровней здесь
];

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
  if (levelNameEl && level.name) {
    if (isGameMode) {
      levelNameEl.textContent = level.name + ' - Поставь на место:';
    } else {
      levelNameEl.textContent = level.name + ' - Правильное расположение:';
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
    const headers = level.headers || ['Уровень', 'Тип сознания', 'Положительное', 'Отрицательное'];
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
      td.textContent = element ? element.content : '';
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
  
  if (incorrectCount === 0) {
    resultMessage.innerHTML = '<h2>🎉 Поздравляем!</h2><p>Вы правильно расставили все элементы!</p>';
    resultMessage.className = 'result-message success';
  } else {
    resultMessage.innerHTML = `<h2>Результат:</h2><p>Правильно: ${correctCount} из ${totalDataCells}</p><p>Неправильно: ${incorrectCount}</p><p>Неправильно поставленные элементы подсвечены красным.</p>`;
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
