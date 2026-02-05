/* jshint esversion: 6 */
// Серия игр: Мышление - Сознание - Взаимодействие

// Данные игр из основного файла
const thinkingGameData = {
    name: 'Мышление',
    rows: 8,
    cols: 6,
    headers: ['Уровень', 'Вопрос', 'Операция внутрь', 'Операция наружу', 'Категория внутрь', 'Категория наружу'],
    elements: [
        { id: 1, content: '1' }, { id: 2, content: 'Что?' }, { id: 3, content: 'Узнавание' },
        { id: 4, content: 'Наименование' }, { id: 5, content: 'Вещь' }, { id: 6, content: 'Имя' },
        { id: 7, content: '2' }, { id: 8, content: 'Где?' }, { id: 9, content: 'Различение' },
        { id: 10, content: 'Разграничение' }, { id: 11, content: 'Пространство' }, { id: 12, content: 'Граница' },
        { id: 13, content: '3' }, { id: 14, content: 'Когда?' }, { id: 15, content: 'Предельный переход' },
        { id: 16, content: 'Упорядочение' }, { id: 17, content: 'Время' }, { id: 18, content: 'Движение' },
        { id: 19, content: '4' }, { id: 20, content: 'Как?' }, { id: 21, content: 'Ряды' },
        { id: 22, content: 'Параллельные' }, { id: 23, content: 'Роль' }, { id: 24, content: 'Способ' },
        { id: 25, content: '5' }, { id: 26, content: 'Кто?' }, { id: 27, content: 'Свобода' },
        { id: 28, content: 'Выбор' }, { id: 29, content: 'Случайность' }, { id: 30, content: 'Риск' },
        { id: 31, content: '6' }, { id: 32, content: 'Почему?' }, { id: 33, content: 'Доказательство' },
        { id: 34, content: 'Сомнение' }, { id: 35, content: 'Причина' }, { id: 36, content: 'Следствие' },
        { id: 37, content: '7' }, { id: 38, content: 'А если?' }, { id: 39, content: 'Аномалия' },
        { id: 40, content: 'Парадокс' }, { id: 41, content: 'Гений' }, { id: 42, content: 'Открытие' },
        { id: 43, content: '8' }, { id: 44, content: 'А зачем?' }, { id: 45, content: 'Гармония' },
        { id: 46, content: 'Баланс' }, { id: 47, content: 'Учет интересов всех участников, сколь угодно на нас непохожих' },
        { id: 48, content: 'Учет отдаленных последствий' }
    ]
};

const consciousnessGameData = {
    name: 'Сознание',
    rows: 8,
    cols: 4,
    headers: ['Уровень', 'Тип сознания', 'Положительное', 'Отрицательное'],
    usePairs: true, // Объединять положительное и отрицательное в пары
    pairCols: [2, 3], // Индексы столбцов для объединения (Положительное и Отрицательное)
    elements: [
        { id: 1, content: '1' }, { id: 2, content: 'Магическое' }, { id: 3, content: 'Чудо' }, { id: 4, content: 'Тайна' },
        { id: 5, content: '2' }, { id: 6, content: 'Этическое' }, { id: 7, content: 'Добро' }, { id: 8, content: 'Зло' },
        { id: 9, content: '3' }, { id: 10, content: 'Эстетическое' }, { id: 11, content: 'Красота' }, { id: 12, content: 'Уродство' },
        { id: 13, content: '4' }, { id: 14, content: 'Ролевое' }, { id: 15, content: 'Соблюдение' }, { id: 16, content: 'Нарушение' },
        { id: 17, content: '5' }, { id: 18, content: 'Свободное' }, { id: 19, content: 'Активность' }, { id: 20, content: 'Пассивность' },
        { id: 21, content: '6' }, { id: 22, content: 'Теоретическое' }, { id: 23, content: 'Истина' }, { id: 24, content: 'Ложь' },
        { id: 25, content: '7' }, { id: 26, content: 'Парадоксальное' }, { id: 27, content: 'Новое' }, { id: 28, content: 'Старое' },
        { id: 29, content: '8' }, { id: 30, content: 'Универсальное' }, { id: 31, content: 'Гармония' }, { id: 32, content: 'Какофония' }
    ]
};

const interactionGameData = {
    name: 'Взаимодействие',
    rows: 8,
    cols: 6,
    headers: ['Уровень', 'нейтрально', 'положительно', 'отрицательно', 'Другой', 'Отношение к детям'],
    usePairs: true, // Объединять положительно и отрицательно в пары
    pairCols: [2, 3], // Индексы столбцов для объединения (положительно и отрицательно)
    elements: [
        { id: 1, content: '1' }, { id: 2, content: 'фиксация' }, { id: 3, content: 'концентрация' },
        { id: 4, content: 'изоляция' }, { id: 5, content: 'другой как вещь' }, { id: 6, content: 'ребенок как вещь' },
        { id: 7, content: '2' }, { id: 8, content: 'семья' }, { id: 9, content: 'свои' },
        { id: 10, content: 'чужие' }, { id: 11, content: 'другой как одна из вещей' }, { id: 12, content: 'ребенок как одна из вещей' },
        { id: 13, content: '3' }, { id: 14, content: 'борьба' }, { id: 15, content: 'доминирование' },
        { id: 16, content: 'подчинение' }, { id: 17, content: 'другой как средство' }, { id: 18, content: 'ребенок как помеха' },
        { id: 19, content: '4' }, { id: 20, content: 'правила' }, { id: 21, content: 'координация' },
        { id: 22, content: 'взаимозависимость' }, { id: 23, content: 'другой как партнер' }, { id: 24, content: 'ребенок как роль в ролевой системе' },
        { id: 25, content: '5' }, { id: 26, content: 'импровизация' }, { id: 27, content: 'свобода' },
        { id: 28, content: 'непредсказуемость' }, { id: 29, content: 'другой как конкурент' }, { id: 30, content: 'ребенок как фактор неопределенности' },
        { id: 31, content: '6' }, { id: 32, content: 'диалог' }, { id: 33, content: 'обоснование' },
        { id: 34, content: 'опровержение' }, { id: 35, content: 'другой как собеседник' }, { id: 36, content: 'ребенок как коллега' },
        { id: 37, content: '7' }, { id: 38, content: 'оригинальность подхода' }, { id: 39, content: 'новаторство' },
        { id: 40, content: 'разрушение традиции' }, { id: 41, content: 'другой как мыслитель' }, { id: 42, content: 'ребенок как мыслящее существо' },
        { id: 43, content: '8' }, { id: 44, content: 'моделирование чужого сознания как неоднородного своему' }, { id: 45, content: 'чужая боль' },
        { id: 46, content: 'эмпатия' }, { id: 47, content: 'другой человек - Другая вселенная' }, { id: 48, content: 'ребенок - Другая вселенная' }
    ]
};

// Веса для вариантов ответа
const ANSWER_WEIGHTS = {
    'no': -2,
    'probably_no': -1,
    'dont_know': 0,
    'probably_yes': 1,
    'yes': 2
};

// Функция для вычисления максимального веса на основе количества столбцов
function getMaxWeight(game) {
    if (game.usePairs) {
        // Если используются пары, считаем пары как один элемент
        // Количество элементов = (общее количество столбцов - 1 для уровня) - 1 (пара заменяет два столбца на один элемент)
        // Например, для Сознания: 4 столбца - 1 уровень = 3 столбца данных, но пара заменяет 2 столбца на 1 элемент
        // Итого: 3 - 1 = 2 элемента (Тип сознания + Пара)
        const dataCols = (game.cols - 1) - 1; // -1 для уровня, -1 потому что пара заменяет 2 столбца на 1 элемент
        return dataCols * 2;
    } else {
        // Обычный расчет: количество столбцов данных * максимальный ответ (+2)
        const dataCols = game.cols - 1;
        return dataCols * 2;
    }
}

// Состояние игры
let gameState = {
    currentGameIndex: 0,
    games: [thinkingGameData, consciousnessGameData, interactionGameData],
    currentWordIndex: 0,
    currentWords: [],
    answers: {},
    results: {}
};

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('start-series-btn');
    const nextWordBtn = document.getElementById('next-word-btn');
    const finishGameBtn = document.getElementById('finish-game-btn');
    const restartBtn = document.getElementById('restart-series-btn');
    const viewLastResultsBtn = document.getElementById('view-last-results-btn');
    const randomFillBtn = document.getElementById('random-fill-btn');

    if (startBtn) startBtn.addEventListener('click', startSeries);
    if (nextWordBtn) nextWordBtn.addEventListener('click', nextWord);
    if (finishGameBtn) finishGameBtn.addEventListener('click', finishCurrentGame);
    if (restartBtn) restartBtn.addEventListener('click', restartSeries);
    if (viewLastResultsBtn) viewLastResultsBtn.addEventListener('click', loadLastResults);
    if (randomFillBtn) randomFillBtn.addEventListener('click', fillRandomAndShowResults);

    // Проверяем наличие сохраненных результатов
    checkForSavedResults();
});

// Проверить наличие сохраненных результатов
function checkForSavedResults() {
    const savedResults = localStorage.getItem('thinkingSeriesResults');
    const viewLastResultsBtn = document.getElementById('view-last-results-btn');
    
    if (savedResults && viewLastResultsBtn) {
        try {
            const parsed = JSON.parse(savedResults);
            if (parsed && Object.keys(parsed).length > 0) {
                viewLastResultsBtn.style.display = 'inline-block';
            }
        } catch (e) {
            console.warn('Error parsing saved results:', e);
        }
    }
}

// Загрузить последние результаты
function loadLastResults() {
    const savedResults = localStorage.getItem('thinkingSeriesResults');
    if (!savedResults) return;
    
    try {
        const parsed = JSON.parse(savedResults);
        if (parsed && Object.keys(parsed).length > 0) {
            gameState.results = parsed;
            showResults();
        }
    } catch (e) {
        console.error('Error loading saved results:', e);
        alert('Ошибка при загрузке сохраненных результатов');
    }
}

// Заполнить случайными данными и показать результаты
function fillRandomAndShowResults() {
    // Сбрасываем состояние
    gameState.currentGameIndex = 0;
    gameState.results = {};
    gameState.answers = {};
    
    // Проходим по всем играм
    gameState.games.forEach((game, gameIndex) => {
        // Извлекаем слова с уровнями
        const wordsWithLevels = extractWordsWithLevels(game);
        
        // Заполняем случайными ответами
        const answerOptions = ['no', 'probably_no', 'dont_know', 'probably_yes', 'yes'];
        wordsWithLevels.forEach(wordData => {
            if (wordData.isPair) {
                // Для пар сохраняем одинаковый ответ для обоих слов
                const randomAnswer = answerOptions[Math.floor(Math.random() * answerOptions.length)];
                gameState.answers[wordData.id1] = randomAnswer;
                gameState.answers[wordData.id2] = randomAnswer;
            } else {
                const randomAnswer = answerOptions[Math.floor(Math.random() * answerOptions.length)];
                gameState.answers[wordData.id] = randomAnswer;
            }
        });
        
        // Вычисляем вектор весов для каждого уровня
        const levelWeights = {};
        
        wordsWithLevels.forEach(wordData => {
            if (wordData.isPair) {
                const answer = gameState.answers[wordData.id1];
                if (answer) {
                    const weight = ANSWER_WEIGHTS[answer] || 0;
                    if (!levelWeights[wordData.level]) {
                        levelWeights[wordData.level] = 0;
                    }
                    levelWeights[wordData.level] += weight;
                }
            } else {
                const answer = gameState.answers[wordData.id];
                if (answer) {
                    const weight = ANSWER_WEIGHTS[answer] || 0;
                    if (!levelWeights[wordData.level]) {
                        levelWeights[wordData.level] = 0;
                    }
                    levelWeights[wordData.level] += weight;
                }
            }
        });
        
        // Вычисляем максимальный вес для этой игры
        const maxWeight = getMaxWeight(game);
        
        // Нормируем векторы
        const normalizedWeights = {};
        Object.keys(levelWeights).forEach(level => {
            normalizedWeights[level] = maxWeight > 0 ? levelWeights[level] / maxWeight : 0;
        });
        
        // Сохраняем результат
        gameState.results[game.name] = normalizedWeights;
    });
    
    // Сохраняем результаты
    saveResults();
    
    // Показываем результаты
    showResults();
}

// Начать серию игр
function startSeries() {
    gameState.currentGameIndex = 0;
    gameState.results = {};
    showScreen('game-screen');
    startCurrentGame();
}

// Начать текущую игру
function startCurrentGame() {
    const game = gameState.games[gameState.currentGameIndex];
    if (!game) {
        showResults();
        return;
    }

    // Обновляем заголовок
    document.getElementById('game-title').textContent = game.name;

    // Извлекаем слова с уровнями (исключаем первый столбец)
    const wordsWithLevels = extractWordsWithLevels(game);
    
    // Перемешиваем слова
    gameState.currentWords = shuffleArray([...wordsWithLevels]);
    gameState.currentWordIndex = 0;
    gameState.answers = {};

    // Обновляем счетчики
    document.getElementById('total-words').textContent = gameState.currentWords.length;
    
    // Показываем первое слово
    showCurrentWord();
}

// Извлечь слова с уровнями из данных игры
function extractWordsWithLevels(game) {
    const words = [];
    
    for (let row = 0; row < game.rows; row++) {
        // Первый элемент строки - это уровень
        const levelIndex = row * game.cols;
        const levelElement = game.elements[levelIndex];
        const level = levelElement ? levelElement.content : String(row + 1);
        
        if (game.usePairs && game.pairCols) {
            // Режим пар: объединяем указанные столбцы в пары
            const pairCol1 = game.pairCols[0];
            const pairCol2 = game.pairCols[1];
            const pairIndex1 = row * game.cols + pairCol1;
            const pairIndex2 = row * game.cols + pairCol2;
            const element1 = game.elements[pairIndex1];
            const element2 = game.elements[pairIndex2];
            
            if (element1 && element2 && element1.content && element2.content) {
                words.push({
                    word: `${element1.content}/${element2.content}`,
                    word1: element1.content,
                    word2: element2.content,
                    level: level,
                    id1: element1.id,
                    id2: element2.id,
                    isPair: true
                });
            }
            
            // Добавляем остальные столбцы (кроме пары)
            for (let col = 1; col < game.cols; col++) {
                if (col !== pairCol1 && col !== pairCol2) {
                    const elementIndex = row * game.cols + col;
                    const element = game.elements[elementIndex];
                    if (element && element.content) {
                        words.push({
                            word: element.content,
                            level: level,
                            id: element.id,
                            isPair: false
                        });
                    }
                }
            }
        } else {
            // Обычный режим: все столбцы отдельно
            for (let col = 1; col < game.cols; col++) {
                const elementIndex = row * game.cols + col;
                const element = game.elements[elementIndex];
                if (element && element.content) {
                    words.push({
                        word: element.content,
                        level: level,
                        id: element.id,
                        isPair: false
                    });
                }
            }
        }
    }
    
    return words;
}

// Показать текущее слово
function showCurrentWord() {
    const wordData = gameState.currentWords[gameState.currentWordIndex];
    if (!wordData) {
        finishCurrentGame();
        return;
    }

    const container = document.getElementById('word-container');
    const currentNum = gameState.currentWordIndex + 1;
    const totalNum = gameState.currentWords.length;

    // Обновляем прогресс
    document.getElementById('current-word-num').textContent = currentNum;
    const progressPercent = (currentNum / totalNum) * 100;
    document.getElementById('progress-fill').style.width = progressPercent + '%';

    // Проверяем, есть ли уже ответ для этого слова (для пар используем id1)
    const answerKey = wordData.isPair ? wordData.id1 : wordData.id;
    const existingAnswer = gameState.answers[answerKey];

    // Форматируем текст для пары
    let displayHTML = '';
    if (wordData.isPair) {
        displayHTML = `<h3 class="word-text"><span class="pair-word pair-positive">${wordData.word1}</span> / <span class="pair-word pair-negative">${wordData.word2}</span></h3>`;
    } else {
        displayHTML = `<h3 class="word-text">${wordData.word}</h3>`;
    }
    
    container.innerHTML = `
        <div class="word-card">
            ${displayHTML}
            <div class="answer-options">
                <label class="answer-option ${existingAnswer === 'no' ? 'selected' : ''}">
                    <input type="radio" name="word-answer" value="no" ${existingAnswer === 'no' ? 'checked' : ''}>
                    <span>Нет (-2)</span>
                </label>
                <label class="answer-option ${existingAnswer === 'probably_no' ? 'selected' : ''}">
                    <input type="radio" name="word-answer" value="probably_no" ${existingAnswer === 'probably_no' ? 'checked' : ''}>
                    <span>Скорее нет (-1)</span>
                </label>
                <label class="answer-option ${existingAnswer === 'dont_know' ? 'selected' : ''}">
                    <input type="radio" name="word-answer" value="dont_know" ${existingAnswer === 'dont_know' ? 'checked' : ''}>
                    <span>Не знаю (0)</span>
                </label>
                <label class="answer-option ${existingAnswer === 'probably_yes' ? 'selected' : ''}">
                    <input type="radio" name="word-answer" value="probably_yes" ${existingAnswer === 'probably_yes' ? 'checked' : ''}>
                    <span>Скорее да (+1)</span>
                </label>
                <label class="answer-option ${existingAnswer === 'yes' ? 'selected' : ''}">
                    <input type="radio" name="word-answer" value="yes" ${existingAnswer === 'yes' ? 'checked' : ''}>
                    <span>Да (+2)</span>
                </label>
            </div>
        </div>
    `;

    // Добавляем обработчики для радио-кнопок
    const radioButtons = container.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            // Сохраняем ответ
            // Для пар сохраняем ответ для обоих слов
            if (wordData.isPair) {
                gameState.answers[wordData.id1] = this.value;
                gameState.answers[wordData.id2] = this.value;
            } else {
                gameState.answers[wordData.id] = this.value;
            }
            
            // Обновляем визуальное состояние
            container.querySelectorAll('.answer-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.closest('.answer-option').classList.add('selected');

            // Показываем кнопку "Следующее слово" или "Завершить игру"
            if (gameState.currentWordIndex < gameState.currentWords.length - 1) {
                document.getElementById('next-word-btn').style.display = 'inline-block';
                document.getElementById('finish-game-btn').style.display = 'none';
            } else {
                document.getElementById('next-word-btn').style.display = 'none';
                document.getElementById('finish-game-btn').style.display = 'inline-block';
            }
        });
    });

    // Показываем кнопку, если ответ уже был выбран
    if (existingAnswer) {
        if (gameState.currentWordIndex < gameState.currentWords.length - 1) {
            document.getElementById('next-word-btn').style.display = 'inline-block';
        } else {
            document.getElementById('finish-game-btn').style.display = 'inline-block';
        }
    } else {
        document.getElementById('next-word-btn').style.display = 'none';
        document.getElementById('finish-game-btn').style.display = 'none';
    }
}

// Следующее слово
function nextWord() {
    gameState.currentWordIndex++;
    showCurrentWord();
}

// Завершить текущую игру
function finishCurrentGame() {
    const game = gameState.games[gameState.currentGameIndex];
    
    // Вычисляем вектор весов для каждого уровня
    const levelWeights = {};
    
    gameState.currentWords.forEach(wordData => {
        if (wordData.isPair) {
            // Для пар берем ответ по id1 (оба слова имеют одинаковый ответ)
            const answer = gameState.answers[wordData.id1];
            if (answer) {
                const weight = ANSWER_WEIGHTS[answer] || 0;
                if (!levelWeights[wordData.level]) {
                    levelWeights[wordData.level] = 0;
                }
                // Для пары добавляем вес один раз (пара считается за один элемент)
                levelWeights[wordData.level] += weight;
            }
        } else {
            // Обычное слово
            const answer = gameState.answers[wordData.id];
            if (answer) {
                const weight = ANSWER_WEIGHTS[answer] || 0;
                if (!levelWeights[wordData.level]) {
                    levelWeights[wordData.level] = 0;
                }
                levelWeights[wordData.level] += weight;
            }
        }
    });

    // Вычисляем максимальный вес для этой игры на основе количества столбцов
    const maxWeight = getMaxWeight(game);
    
    // Нормируем векторы (делим на максимальный вес для этой игры)
    const normalizedWeights = {};
    Object.keys(levelWeights).forEach(level => {
        normalizedWeights[level] = maxWeight > 0 ? levelWeights[level] / maxWeight : 0;
    });

    // Сохраняем результат
    gameState.results[game.name] = normalizedWeights;

    // Переходим к следующей игре или показываем результаты
    gameState.currentGameIndex++;
    if (gameState.currentGameIndex < gameState.games.length) {
        startCurrentGame();
    } else {
        // Сохраняем результаты в localStorage перед показом
        saveResults();
        showResults();
    }
}

// Сохранить результаты в localStorage
function saveResults() {
    try {
        localStorage.setItem('thinkingSeriesResults', JSON.stringify(gameState.results));
    } catch (e) {
        console.warn('Error saving results:', e);
    }
}

// Показать результаты
function showResults() {
    showScreen('results-screen');
    drawCorrelations();
    drawResultsChart();
    drawResultsTable();
}

// Вычислить корреляцию Пирсона между двумя векторами
function calculateCorrelation(vector1, vector2) {
    // Получаем общие ключи (уровни)
    const keys = Object.keys(vector1).filter(key => vector2.hasOwnProperty(key));
    
    if (keys.length === 0) return 0;
    
    // Преобразуем в массивы значений
    const values1 = keys.map(key => vector1[key] || 0);
    const values2 = keys.map(key => vector2[key] || 0);
    
    // Вычисляем средние значения
    const mean1 = values1.reduce((sum, val) => sum + val, 0) / values1.length;
    const mean2 = values2.reduce((sum, val) => sum + val, 0) / values2.length;
    
    // Вычисляем числитель: Σ((xi - x̄)(yi - ȳ))
    let numerator = 0;
    for (let i = 0; i < values1.length; i++) {
        numerator += (values1[i] - mean1) * (values2[i] - mean2);
    }
    
    // Вычисляем знаменатель: √(Σ(xi - x̄)² * Σ(yi - ȳ)²)
    let sumSqDiff1 = 0;
    let sumSqDiff2 = 0;
    for (let i = 0; i < values1.length; i++) {
        sumSqDiff1 += Math.pow(values1[i] - mean1, 2);
        sumSqDiff2 += Math.pow(values2[i] - mean2, 2);
    }
    
    const denominator = Math.sqrt(sumSqDiff1 * sumSqDiff2);
    
    // Если знаменатель равен нулю, корреляция не определена
    if (denominator === 0) return 0;
    
    return numerator / denominator;
}

// Нарисовать корреляции между парами игр
function drawCorrelations() {
    const container = document.getElementById('correlations-container');
    if (!container) return;
    
    const results = gameState.results;
    const gameNames = Object.keys(results);
    
    if (gameNames.length < 2) {
        container.innerHTML = '';
        return;
    }
    
    // Вычисляем корреляции для всех пар
    const correlations = [];
    for (let i = 0; i < gameNames.length; i++) {
        for (let j = i + 1; j < gameNames.length; j++) {
            const game1 = gameNames[i];
            const game2 = gameNames[j];
            const correlation = calculateCorrelation(results[game1], results[game2]);
            correlations.push({
                game1: game1,
                game2: game2,
                value: correlation
            });
        }
    }
    
    // Форматируем HTML
    let html = '<div class="correlations-box"><h3>Корреляции между играми</h3><div class="correlations-list">';
    
    correlations.forEach(corr => {
        const percentage = (corr.value * 100).toFixed(1);
        const colorClass = corr.value > 0.7 ? 'high' : corr.value > 0.3 ? 'medium' : corr.value > -0.3 ? 'low' : 'negative';
        html += `
            <div class="correlation-item ${colorClass}">
                <span class="correlation-pair">${corr.game1} ↔ ${corr.game2}</span>
                <span class="correlation-value">${percentage}%</span>
            </div>
        `;
    });
    
    html += '</div></div>';
    container.innerHTML = html;
}

// Нарисовать график результатов
function drawResultsChart() {
    const canvas = document.getElementById('results-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 500;

    const results = gameState.results;
    const gameNames = Object.keys(results);
    if (gameNames.length === 0) return;

    // Получаем все уровни из всех игр
    const allLevels = new Set();
    gameNames.forEach(gameName => {
        Object.keys(results[gameName]).forEach(level => allLevels.add(level));
    });
    const sortedLevels = Array.from(allLevels).sort((a, b) => {
        const numA = parseInt(a) || 0;
        const numB = parseInt(b) || 0;
        return numA - numB;
    });

    const padding = 60;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const xStep = chartWidth / (sortedLevels.length - 1 || 1);
    const yStep = chartHeight / 2; // От -1 до +1

    // Очищаем canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем сетку
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    // Горизонтальная линия в центре (y = 0)
    const centerY = padding + chartHeight / 2;
    ctx.beginPath();
    ctx.moveTo(padding, centerY);
    ctx.lineTo(padding + chartWidth, centerY);
    ctx.stroke();

    // Вертикальные линии для уровней
    sortedLevels.forEach((level, index) => {
        const x = padding + index * xStep;
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, padding + chartHeight);
        ctx.stroke();
    });

    // Подписи осей
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    
    // Подписи уровней на оси X
    sortedLevels.forEach((level, index) => {
        const x = padding + index * xStep;
        ctx.fillText(level, x, canvas.height - padding + 20);
    });

    // Подписи значений на оси Y
    ctx.textAlign = 'right';
    ctx.fillText('1.0', padding - 10, padding + 10);
    ctx.fillText('0', padding - 10, centerY + 5);
    ctx.fillText('-1.0', padding - 10, padding + chartHeight - 10);

    // Цвета для каждой игры
    const colors = ['#2563eb', '#10b981', '#f59e0b'];
    
    // Рисуем линии для каждой игры
    gameNames.forEach((gameName, gameIndex) => {
        const gameResults = results[gameName];
        const color = colors[gameIndex % colors.length];

        // Собираем координаты всех точек
        const points = [];
        sortedLevels.forEach((level, levelIndex) => {
            const value = gameResults[level] || 0;
            const x = padding + levelIndex * xStep;
            const y = centerY - (value * yStep); // Инвертируем Y (0 вверху)
            points.push({ x, y });
        });

        // Рисуем ломаную линию
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        if (points.length > 0) {
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
        }
        
        ctx.stroke();

        // Рисуем точки поверх линии
        ctx.fillStyle = color;
        points.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
            ctx.fill();
        });

        // Легенда
        ctx.fillStyle = color;
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'left';
        const legendY = padding + gameIndex * 25;
        ctx.fillRect(padding + chartWidth + 20, legendY - 10, 20, 3);
        ctx.fillText(gameName, padding + chartWidth + 45, legendY);
    });
}

// Нарисовать таблицу результатов
function drawResultsTable() {
    const container = document.getElementById('results-table');
    if (!container) return;

    const results = gameState.results;
    const gameNames = Object.keys(results);
    if (gameNames.length === 0) return;

    // Получаем все уровни
    const allLevels = new Set();
    gameNames.forEach(gameName => {
        Object.keys(results[gameName]).forEach(level => allLevels.add(level));
    });
    const sortedLevels = Array.from(allLevels).sort((a, b) => {
        const numA = parseInt(a) || 0;
        const numB = parseInt(b) || 0;
        return numA - numB;
    });

    let html = '<table class="results-table-content"><thead><tr><th>Уровень</th>';
    gameNames.forEach(gameName => {
        html += `<th>${gameName}</th>`;
    });
    html += '</tr></thead><tbody>';

    sortedLevels.forEach(level => {
        html += `<tr><td><strong>${level}</strong></td>`;
        gameNames.forEach(gameName => {
            const value = results[gameName][level] || 0;
            html += `<td>${value.toFixed(2)}</td>`;
        });
        html += '</tr>';
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

// Перезапустить серию
function restartSeries() {
    gameState.currentGameIndex = 0;
    gameState.results = {};
    gameState.answers = {};
    // Не удаляем сохраненные результаты, чтобы можно было вернуться к ним
    showScreen('intro-screen');
    // Обновляем видимость кнопки просмотра результатов
    checkForSavedResults();
}

// Показать экран
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.style.display = 'none';
    });
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.style.display = 'block';
    }
}

// Перемешать массив
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
