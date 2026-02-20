/**
 * Локализация для игр baby
 * Языки: ru, en, et
 */
(function () {
  const STORAGE_KEY = 'baby-lang';

  const T = {
    ru: {
      lang: 'Язык',
      langRu: 'Русский',
      langEn: 'English',
      fallingTitle: 'Падающие карточки',
      fallingInstr: 'Инструкция',
      fallingInstr1: 'Карточка падает сверху вниз.',
      fallingInstr2: 'Успей нажать на неё или на её эквивалент внизу до того, как она упадёт.',
      fallingInstr3: 'Правильно нажатая карточка исчезает и не появляется до рестарта.',
      fallingInstr4: 'Неправильное нажатие — минус 1, фон краснеет на секунду.',
      fallingInstr5: 'Игра идёт по уровням: сначала цифра 1, потом 2, и так до максимума (1–9).',
      fallingInstr6: 'Когда все карточки исчезли на последнем уровне — экран мигает жёлтым, игра останавливается.',
      fallingInstr7: '<strong>А1:</strong> точки падают и лежат → цифры падают и лежат → новый максимум.',
      fallingInstr8: '<strong>А2:</strong> точки падают и лежат → цифры падают и лежат → цифры падают, точки лежат → точки падают, цифры лежат → новый максимум.',
      mode: 'Режим',
      modeNormal: 'Обычный',
      modeA1: 'А1',
      modeA2: 'А2',
      whatFalls: 'Что падает',
      digit: 'Цифра',
      point: 'Точка',
      whatLies: 'Что лежит внизу',
      digits: 'Цифры',
      points: 'Точки',
      speed: 'Скорость падения',
      maxDigit: 'Максимум цифра',
      play: 'ИГРАТЬ',
      start: 'СТАРТ',
      stop: 'СТОП',
      reset: 'СБРОС',
      back: 'НАЗАД',
      score: 'Сумма',
      level: 'Уровень',
      addTitle: 'Сложение',
      subTitle: 'Вычитание',
      addInstr1: 'Показано равенство: карточка + карточка = ?',
      addInstr2: 'Нужно кликнуть одну из карточек внизу, чтобы получилось верное равенство.',
      addInstr3: 'Правильный ответ появляется после знака «=».',
      addInstr4: '<strong>Режим ТОЧКИ:</strong> карточки-точки (визуальное представление).',
      addInstr5: '<strong>Режим ЦИФРЫ:</strong> карточки-цифры.',
      addInstr6: '<strong>Режим ТРУДНЫЙ:</strong> 1) пример цифрами, ответ точками; 2) наоборот; 3) в примере одно число точками, другое цифрой, внизу точки; 4) как 3, но внизу цифры; 5) внизу цифры и точки в правильном порядке, каждая позиция случайно — цифра или точки.',
      subInstr1: 'Показано равенство: карточка − карточка = ?',
      hard: 'Трудный',
      navFalling: 'Падающие карточки',
      navAdd: 'Сложение',
      navSub: 'Вычитание',
      modeLabel: 'Режим',
      modePoints: 'Точки',
      modeDigits: 'Цифры',
      hardPhase1: 'Цифры→Точки',
      hardPhase2: 'Точки→Цифры',
      hardPhase3: 'Смешанный, ответ точки',
      hardPhase4: 'Смешанный, ответ цифры',
      hardPhase5: 'Смешанный, внизу цифры и точки'
    },
    en: {
      lang: 'Language',
      langRu: 'Русский',
      langEn: 'English',
      fallingTitle: 'Falling Cards',
      fallingInstr: 'Instructions',
      fallingInstr1: 'A card falls from top to bottom.',
      fallingInstr2: 'Tap on it or its equivalent below before it falls.',
      fallingInstr3: 'A correctly tapped card disappears and does not reappear until restart.',
      fallingInstr4: 'Wrong tap — minus 1, background turns red for a second.',
      fallingInstr5: 'The game goes by levels: first digit 1, then 2, and so on up to the maximum (1–9).',
      fallingInstr6: 'When all cards have disappeared on the last level — the screen flashes yellow, the game stops.',
      fallingInstr7: '<strong>A1:</strong> points fall and lie → digits fall and lie → new maximum.',
      fallingInstr8: '<strong>A2:</strong> points fall and lie → digits fall and lie → digits fall, points lie → points fall, digits lie → new maximum.',
      mode: 'Mode',
      modeNormal: 'Normal',
      modeA1: 'A1',
      modeA2: 'A2',
      whatFalls: 'What falls',
      digit: 'Digit',
      point: 'Point',
      whatLies: 'What lies below',
      digits: 'Digits',
      points: 'Points',
      speed: 'Fall speed',
      maxDigit: 'Max digit',
      play: 'PLAY',
      start: 'START',
      stop: 'STOP',
      reset: 'RESET',
      back: 'BACK',
      score: 'Score',
      level: 'Level',
      addTitle: 'Addition',
      subTitle: 'Subtraction',
      addInstr1: 'Equation shown: card + card = ?',
      addInstr2: 'Click one of the cards below to get the correct equality.',
      addInstr3: 'The correct answer appears after the «=» sign.',
      addInstr4: '<strong>POINTS mode:</strong> point cards (visual representation).',
      addInstr5: '<strong>DIGITS mode:</strong> digit cards.',
      addInstr6: '<strong>HARD mode:</strong> 1) example in digits, answer in points; 2) vice versa; 3) one number in points, one in digits, points below; 4) like 3, but digits below; 5) digits and points below in correct order, each position randomly digit or points.',
      subInstr1: 'Equation shown: card − card = ?',
      hard: 'Hard',
      navFalling: 'Falling Cards',
      navAdd: 'Addition',
      navSub: 'Subtraction',
      modeLabel: 'Mode',
      modePoints: 'Points',
      modeDigits: 'Digits',
      hardPhase1: 'Digits→Points',
      hardPhase2: 'Points→Digits',
      hardPhase3: 'Mixed, answer points',
      hardPhase4: 'Mixed, answer digits',
      hardPhase5: 'Mixed, digits and points below'
    },
    et: {
      lang: 'Keel',
      langRu: 'Русский',
      langEn: 'English',
      langEt: 'Eesti',
      fallingTitle: 'Kukkuvad kaardid',
      fallingInstr: 'Juhised',
      fallingInstr1: 'Kaart kukub ülevalt alla.',
      fallingInstr2: 'Vajuta sellele või selle ekvivalendile all enne, kui see kukub.',
      fallingInstr3: 'Õigesti vajutatud kaart kaob ega ilmu uuesti enne taaskäivitust.',
      fallingInstr4: 'Vale vajutus — miinus 1, taust muutub sekundiks punaseks.',
      fallingInstr5: 'Mäng läheb tasemete kaupa: esmalt number 1, siis 2 jne kuni maksimumini (1–9).',
      fallingInstr6: 'Kui kõik kaardid on viimasel tasemel kadunud — ekraan vilgub kollaselt, mäng peatub.',
      fallingInstr7: '<strong>A1:</strong> punktid kukuvad ja lamavad → numbrid kukuvad ja lamavad → uus maksimum.',
      fallingInstr8: '<strong>A2:</strong> punktid kukuvad ja lamavad → numbrid kukuvad ja lamavad → numbrid kukuvad, punktid lamavad → punktid kukuvad, numbrid lamavad → uus maksimum.',
      mode: 'Režiim',
      modeNormal: 'Tavaline',
      modeA1: 'A1',
      modeA2: 'A2',
      whatFalls: 'Mis kukub',
      digit: 'Number',
      point: 'Punkt',
      whatLies: 'Mis lamab all',
      digits: 'Numbrid',
      points: 'Punktid',
      speed: 'Kukkumise kiirus',
      maxDigit: 'Maksimum number',
      play: 'MÄNGI',
      start: 'ALUSTA',
      stop: 'STOP',
      reset: 'LÄHTESTA',
      back: 'TAGASI',
      score: 'Skoor',
      level: 'Tase',
      addTitle: 'Liitmine',
      subTitle: 'Lahutamine',
      addInstr1: 'Näidatakse võrrand: kaart + kaart = ?',
      addInstr2: 'Vajuta ühele kaardist all, et saada õige võrdsus.',
      addInstr3: 'Õige vastus ilmub märgi «=» järele.',
      addInstr4: '<strong>PUNKTID režiim:</strong> punktikaardid (visuaalne esitus).',
      addInstr5: '<strong>NUMBRID režiim:</strong> numbrikaardid.',
      addInstr6: '<strong>RASKE režiim:</strong> 1) näide numbrites, vastus punktides; 2) vastupidi; 3) üks number punktides, teine numbrites, punktid all; 4) nagu 3, aga numbrid all; 5) numbrid ja punktid all õiges järjekorras, iga positsioon juhuslikult number või punktid.',
      subInstr1: 'Näidatakse võrrand: kaart − kaart = ?',
      hard: 'Raske',
      navFalling: 'Kukkuvad kaardid',
      navAdd: 'Liitmine',
      navSub: 'Lahutamine',
      modeLabel: 'Režiim',
      modePoints: 'Punktid',
      modeDigits: 'Numbrid',
      hardPhase1: 'Numbrid→Punktid',
      hardPhase2: 'Punktid→Numbrid',
      hardPhase3: 'Segatud, vastus punktid',
      hardPhase4: 'Segatud, vastus numbrid',
      hardPhase5: 'Segatud, numbrid ja punktid all'
    }
  };

  let currentLang = localStorage.getItem(STORAGE_KEY) || 'ru';
  if (T[currentLang] === undefined) currentLang = 'ru';

  window.Lang = {
    get: function () { return currentLang; },
    set: function (lang) {
      if (T[lang]) {
        currentLang = lang;
        localStorage.setItem(STORAGE_KEY, lang);
        return true;
      }
      return false;
    },
    t: function (key) {
      return (T[currentLang] && T[currentLang][key]) || T.ru[key] || key;
    },
    apply: function (scope) {
      scope = scope || document;
      scope.querySelectorAll('[data-i18n]').forEach(function (el) {
        const key = el.getAttribute('data-i18n');
        const text = window.Lang.t(key);
        if (el.tagName === 'INPUT' || el.tagName === 'BUTTON') {
          if (el.type === 'submit' || el.type === 'button' || el.type === '') {
            el.textContent = text;
          }
        } else {
          el.innerHTML = text;
        }
      });
    }
  };
})();
