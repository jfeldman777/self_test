/* jshint esversion: 6 */

let testData = {};
let profData = {};

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
    loadProfEditor();
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

  // Обновляем название теста
  const titleElement = document.getElementById('test-title');
  if (titleElement && test) {
    titleElement.textContent = test.name;
  }

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
    // Проверяем, что значение существует и не null/undefined
    if (meanings[k] && r[k] !== null && r[k] !== undefined) {
      div.innerHTML += `<p>${meanings[k]}: <b>${r[k]}%</b></p>`;
    }
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

  // Создаем контейнер для горизонтального расположения профессий
  const profContainer = document.createElement('div');
  profContainer.className = 'professions-list';
  div.appendChild(profContainer);

  profData.professions.forEach((p,pi)=>{
    const label = document.createElement('label');
    label.className = 'prof-option';
    label.innerHTML = `
      <input type="radio" name="prof" value="${pi}">
      ${p.name}
    `;
    profContainer.appendChild(label);
  });

  // Создаем кнопку сравнения
  const compareBtn = document.createElement('button');
  compareBtn.className = 'btn';
  compareBtn.textContent = 'Сравнить';
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
      // Передан testIndex - получаем labels из testData
      const test = testData.tests[testIndexOrLabels];
      const meanings = test.answersMeaning;
      const keys = Object.keys(meanings).sort((a, b) => Number(a) - Number(b));
      labels = keys.map(k => meanings[k]);
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
    const testIndex = testData.tests ? testData.tests.findIndex(t => t.name === item.testName) : -1;
    return { ...item, testIndex: testIndex >= 0 ? testIndex : null };
  });
}

function getTestMeaningLabels(testName){
  if (!testData.tests) return [];
  const test = testData.tests.find(t => t.name === testName);
  if (!test || !test.answersMeaning) return [];
  const keys = Object.keys(test.answersMeaning).sort((a, b) => Number(a) - Number(b));
  return keys.map(k => test.answersMeaning[k]);
}

function cloneProfession(prof){
  const clone = { ...prof };
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
  div.innerHTML = "<h3>Диаграммы профессии</h3>";

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
    h4.textContent = mapping.testName;
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
  if (saveBtn) saveBtn.onclick = saveProfessions;

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

  profEditorState.list.forEach((prof, idx) => {
    const btn = document.createElement('button');
    btn.className = 'prof-select-btn' + (idx === profEditorState.currentIndex ? ' active' : '');
    btn.textContent = prof.name || `Профессия ${idx + 1}`;
    btn.addEventListener('click', () => {
      profEditorState.currentIndex = idx;
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
      });

      row.appendChild(slider);
      row.appendChild(valueSpan);

      section.appendChild(row);
    });

    testsWrap.appendChild(section);
  });
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
}
