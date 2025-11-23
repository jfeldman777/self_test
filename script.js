/* jshint esversion: 6 */

let testData = {};

//---------------------------------------------------
// Загружаем JSON
//---------------------------------------------------
fetch("data.json")
  .then(r => r.json())
  .then(d => {
    testData = d;
    loadIndex();
    loadTest();
    loadResult();
    loadHistory();
  });


//---------------------------------------------------
// INDEX: список тестов
//---------------------------------------------------
function loadIndex() {
  const list = document.getElementById("test-list");
  if (!list) return;

  list.innerHTML = "";

  testData.tests.forEach((t, i) => {
    list.innerHTML += `
      <div class="testItem">
        <a class="test-link" href="test.html?test=${i}">
          <b>${t.name}</b>
        </a>
      </div>
    `;
  });
}


//---------------------------------------------------
// Загружаем ТЕСТ
//---------------------------------------------------
function loadTest() {
  const container = document.getElementById("test-container");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const idx = Number(params.get("test"));
  const test = testData.tests[idx];

  document.getElementById("test-title").innerText = test.name;

  container.innerHTML = "";

  test.questions.forEach((q, qi) => {
    const div = document.createElement("div");
    div.className = "question";

    let html = `<b>${q.text}</b><br><br>`;

    q.answers.forEach((a, ai) => {
      html += `
        <div class="slider-block">
          <label>${a.text}</label><br>
          <input type="range" min="0" max="10" value="0"
                 class="slider"
                 data-question="${qi}"
                 data-answer="${ai}">
        </div>
        <br>
      `;
    });

    div.innerHTML = html;
    container.appendChild(div);
  });
}


//---------------------------------------------------
// Завершение теста
//---------------------------------------------------
function finishTest() {
  const params = new URLSearchParams(window.location.search);
  const idx = Number(params.get("test"));
  const test = testData.tests[idx];

  let score = {};
  Object.keys(test.answersMeaning).forEach(k => score[k] = 0);

  const sliders = document.querySelectorAll(".slider");

  sliders.forEach(sl => {
    let qi = sl.dataset.question;
    let ai = sl.dataset.answer;
    let val = Number(sl.value);
    score[ai] += val;
  });

  // сохраняем
  localStorage.setItem("lastResult", JSON.stringify({
    testIndex: idx,
    score
  }));

  // история
  let history = JSON.parse(localStorage.getItem("history") || "[]");
  history.push({
    test: test.name,
    time: new Date().toLocaleString(),
    score
  });
  localStorage.setItem("history", JSON.stringify(history));

  window.location = "result.html";
}


//---------------------------------------------------
// Вывод результата
//---------------------------------------------------
function loadResult() {
  const div = document.getElementById("result-container");
  if (!div) return;

  const saved = JSON.parse(localStorage.getItem("lastResult"));
  if (!saved) {
    div.innerHTML = "<p>No data.</p>";
    return;
  }

  const test = testData.tests[saved.testIndex];
  const meanings = test.answersMeaning;
  const score = saved.score;

  div.innerHTML = `<h3>${test.name}</h3>`;

  for (let k in score) {
    div.innerHTML += `<p>${meanings[k]}: <b>${score[k]}</b></p>`;
  }
}


//---------------------------------------------------
// История
//---------------------------------------------------
function loadHistory() {
  const div = document.getElementById("history-container");
  if (!div) return;

  const h = JSON.parse(localStorage.getItem("history") || "[]");

  if (h.length === 0) {
    div.innerHTML = "<p>No history.</p>";
    return;
  }

  h.forEach(e => {
    div.innerHTML += `<p><b>${e.time}</b> • <i>${e.test}</i>: ${JSON.stringify(e.score)}</p>`;
  });
}

function clearHistory() {
  localStorage.removeItem("history");
  location.reload();
}
