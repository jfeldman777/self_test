/* jshint esversion: 6 */

let testData = {};
let shuffledAnswers = {};   // <-- тут будет храниться порядок перемешивания

// ------------------------------------------------------
// Загрузка JSON
// ------------------------------------------------------
fetch("data.json")
  .then(r => r.json())
  .then(d => {
    testData = d;
    loadIndex();
    loadTest();
    loadResult();
    loadHistory();
  });


// ------------------------------------------------------
// INDEX — список тестов
// ------------------------------------------------------
function loadIndex() {
  const list = document.getElementById("test-list");
  if (!list) return;

  if (!testData.tests) {
    list.innerHTML = "<p>No tests found.</p>";
    return;
  }

  list.innerHTML = "";

  testData.tests.forEach((t, i) => {
    list.innerHTML += `
      <div class="testItem">
        <a class="test-link" href="test.html?test=${i}">
          <b>${t.name}</b>
        </a>
      </div>`;
  });
}


// ------------------------------------------------------
// TEST — загрузка теста
// ------------------------------------------------------
function loadTest() {
  const container = document.getElementById("test-container");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const idx = Number(params.get("test"));
  const test = testData.tests[idx];

  container.innerHTML = "";

  test.questions.forEach((q, qi) => {

    // ------- перемешиваем варианты -------
    const order = [...q.answers.keys()].sort(() => Math.random() - 0.5);
    shuffledAnswers[qi] = order;

    const div = document.createElement("div");
    div.className = "question";

    div.innerHTML = `<div><b>${q.text}</b></div>`;

    order.forEach( (originalAnswerIndex) => {

      const answerText = q.answers[originalAnswerIndex].text;

      div.innerHTML += `
        <div class="sliderBlock">
          <label>${answerText}</label>
          <input type="range" min="0" max="10" value="0"
                 data-question="${qi}"
                 data-original="${originalAnswerIndex}">
        </div>
      `;
    });

    container.appendChild(div);
  });
}


// ------------------------------------------------------
// FINISH — подсчёт результата
// ------------------------------------------------------
function finishTest() {
  const params = new URLSearchParams(window.location.search);
  const idx = Number(params.get("test"));
  const test = testData.tests[idx];

  let score = {};
  Object.keys(test.answersMeaning).forEach(k => score[k] = 0);

  // собираем данные из всех слайдеров
  document.querySelectorAll("input[type=range]").forEach(sl => {
    const originalIndex = sl.dataset.original;
    const value = Number(sl.value);
    score[originalIndex] += value;
  });

  // считаем проценты
  let result = {};
  let sumAll = Object.values(score).reduce((a,b)=>a+b,0);
  if (sumAll === 0) sumAll = 1;

  for (let k in score) {
    result[k] = Math.round(100 * score[k] / sumAll);
  }

  // сохраняем last result
  localStorage.setItem("lastResult", JSON.stringify({
    testIndex: idx,
    result
  }));

  // сохраняем в историю
  let history = JSON.parse(localStorage.getItem("history") || "[]");
  history.push({
    test: test.name,
    time: new Date().toLocaleString(),
    result
  });
  localStorage.setItem("history", JSON.stringify(history));

  window.location = "result.html";
}


// ------------------------------------------------------
// RESULT — вывод результата
// ------------------------------------------------------
function loadResult() {
  const div = document.getElementById("result-container");
  if (!div) return;

  const saved = JSON.parse(localStorage.getItem("lastResult"));
  if (!saved) {
    div.innerHTML = "<p>No result.</p>";
    return;
  }

  const test = testData.tests[saved.testIndex];
  const meanings = test.answersMeaning;
  const r = saved.result;

  div.innerHTML = `<h3>${test.name}</h3>`;

  for (let k in r) {
    div.innerHTML += `
      <p>${meanings[k]}: <b>${r[k]}%</b></p>`;
  }
}


// ------------------------------------------------------
// HISTORY
// ------------------------------------------------------
function loadHistory() {
  const div = document.getElementById("history-container");
  if (!div) return;

  const h = JSON.parse(localStorage.getItem("history") || "[]");

  if (h.length === 0) {
    div.innerHTML = "<p>No history yet.</p>";
    return;
  }

  h.forEach(e => {
    div.innerHTML += `
      <p><b>${e.time}</b> • <i>${e.test}</i> → ${JSON.stringify(e.result)}</p>`;
  });
}

function clearHistory() {
  localStorage.removeItem("history");
  location.reload();
}
