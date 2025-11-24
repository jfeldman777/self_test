/* jshint esversion: 6 */

let testData = {};
let profData = {};

//-----------------------------------------
// ЗАГРУЗКА ВСЕХ ДАННЫХ
//-----------------------------------------
Promise.all([
  fetch("data.json").then(r => r.json()),
  fetch("prof.json").then(r => r.json()).catch(() => ({professions:[]}))
])
.then(([tests, profs]) => {
    testData = tests;
    profData = profs;
    loadIndex();
    loadTest();
    loadResult();
    loadHistory();
});


//-----------------------------------------
// INDEX: список тестов
//-----------------------------------------
function loadIndex(){
  const list = document.getElementById("test-list");
  if (!list) return;

  list.innerHTML = "";

  testData.tests.forEach((t,i)=>{
    list.innerHTML += `
      <div class="testItem">
        <a class="test-link" href="test.html?test=${i}">
          <b>${t.name}</b>
        </a>
      </div>
    `;
  });
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

  container.innerHTML = "";

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
// Финиш теста
//-----------------------------------------
function finishTest(){
  const params = new URLSearchParams(window.location.search);
  const idx = Number(params.get("test") || 0);
  const test = testData.tests[idx];

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
    div.innerHTML = "<p>No result.</p>";
    return;
  }

  const test = testData.tests[saved.testIndex];
  const meanings = test.answersMeaning;
  const r = saved.result;

  div.innerHTML = `<h3>${test.name}</h3>`;

  // вывод результатов
  for (let k in r){
    div.innerHTML += `<p>${meanings[k]}: <b>${r[k]}%</b></p>`;
  }

  // кнопка вернуться
  div.innerHTML += `<a class="btn" href="index.html">Назад</a>`;

  // отрисовка диаграммы
  const chartDiv = document.getElementById('chart');
  if (chartDiv) {
    chartDiv.innerHTML = ''; // очищаем перед отрисовкой
    // Получаем ключи в правильном порядке (численно отсортированные)
    const keys = Object.keys(meanings).sort((a, b) => Number(a) - Number(b));
    const labels = keys.map(k => meanings[k]);
    const values = keys.map(k => r[k] || 0);
    drawRadarChart('chart', labels, values);
  }
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
    h2.textContent = 'Ваши диаграммы';
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
      h3.textContent = entry.test;
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
  h2Prof.textContent = 'Сравнить с профессией';
  div.appendChild(h2Prof);

  profData.professions.forEach((p,pi)=>{
    div.innerHTML += `
      <label>
        <input type="radio" name="prof" value="${pi}">
        ${p.name}
      </label><br>
    `;
  });

  div.innerHTML += `<button onclick="compareProfession()">Сравнить</button>`;

  div.innerHTML += `<div id="prof-results"></div>`;
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
      // Передан testIndex - получаем labels из testData
      const test = testData.tests[testIndexOrLabels];
      const meanings = test.answersMeaning;
      const keys = Object.keys(meanings).sort((a, b) => Number(a) - Number(b));
      labels = keys.map(k => meanings[k]);
    }
  }

  // Получаем values в правильном порядке
  const keys = Object.keys(valuesObj).sort((a, b) => Number(a) - Number(b));
  const values = keys.map(k => valuesObj[k] || 0);
  const count = values.length;

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
      ctx.font = "12px Arial";
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
    const ang = i * angleStep - Math.PI/2;
    const R = maxR * (v/100);
    const x = cx + R * Math.cos(ang);
    const y = cy + R * Math.sin(ang);

    ctx.fillStyle = compareValuesObj ? "#0066ff" : "#000";
    ctx.font = compareValuesObj ? "bold 10px Arial" : "bold 11px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(v + "%", x, compareValuesObj ? y - 8 : y);
  });

  // Рисуем значения (цифры) на точках второй диаграммы, если есть
  if (compareValuesObj) {
    const compareKeys = Object.keys(compareValuesObj).sort((a, b) => Number(a) - Number(b));
    const compareValues = compareKeys.map(k => compareValuesObj[k] || 0);
    
    compareValues.forEach((v,i)=>{
      const ang = i * angleStep - Math.PI/2;
      const R = maxR * (v/100);
      const x = cx + R * Math.cos(ang);
      const y = cy + R * Math.sin(ang);

      ctx.fillStyle = "#ff6600";
      ctx.font = "bold 10px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(v + "%", x, y + 8);
    });
  }
}




//-----------------------------------------
// Сравнение с профессией
//-----------------------------------------
function compareProfession(){
  const checked = document.querySelector("input[name=prof]:checked");
  const profIndex = checked ? Number(checked.value) : NaN;
  if (isNaN(profIndex)) return;

  const div = document.getElementById("prof-results");
  div.innerHTML = "<h3>Диаграммы профессии</h3>";

  // Создаем контейнер для горизонтального расположения диаграмм
  const chartsContainer = document.createElement('div');
  chartsContainer.className = 'charts-grid';
  div.appendChild(chartsContainer);

  const p = profData.professions[profIndex];

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

  // Маппинг полей профессий к testIndex и названиям тестов
  // Порядок соответствует порядку в data.json
  const testMapping = [
    { field: 'levels', testIndex: null, name: 'Уровни' },
    { field: 'warming', testIndex: null, name: 'Разогрев' },
    { field: 'coding_small', testIndex: null, name: 'Кодировки мелкие' },
    { field: 'coding_medium', testIndex: null, name: 'Кодировки средние' },
    { field: 'coding_large', testIndex: null, name: 'Кодировки крупные' }
  ];

  // Находим testIndex для каждого теста по имени
  testMapping.forEach(m => {
    const idx = testData.tests ? testData.tests.findIndex(t => t.name === m.name) : -1;
    m.testIndex = idx >= 0 ? idx : null;
  });

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
    }

    // Получаем labels из testData, если testIndex найден
    let labels = [];
    if (mapping.testIndex !== null && testData.tests && testData.tests[mapping.testIndex]) {
      const test = testData.tests[mapping.testIndex];
      const meanings = test.answersMeaning;
      const keys = Object.keys(meanings).sort((a, b) => Number(a) - Number(b));
      labels = keys.map(k => meanings[k]);
    }

    // Создаем карточку для каждой диаграммы
    const chartCard = document.createElement('div');
    chartCard.className = 'chart-card';
    
    // Создаем заголовок
    const h4 = document.createElement('h4');
    h4.className = 'chart-title';
    h4.textContent = mapping.name;
    chartCard.appendChild(h4);
    
    // Создаем легенду, если есть данные пользователя
    if (userValuesObj) {
      const legend = document.createElement('div');
      legend.style.marginBottom = '10px';
      legend.style.fontSize = '12px';
      legend.style.textAlign = 'center';
      legend.innerHTML = `
        <span style="color: #0066ff;">●</span> Профессия 
        <span style="color: #ff6600; margin-left: 15px;">●</span> Вы
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
