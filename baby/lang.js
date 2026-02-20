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
      fallingInstr7: '<strong>А1:</strong> точки → цифры → звери → новый максимум.',
      fallingInstr8: '<strong>А2:</strong> точки → цифры → точки/цифры → звери → новый максимум.',
      fallingInstr9: '<strong>Трудный:</strong> цифры, точки и звери смешаны в случайном порядке.',
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
      animals: 'Звери',
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
      addInstr5b: '<strong>Режим ЗВЕРИ:</strong> карточки-звери.',
      addInstr6: '<strong>Режим ТРУДНЫЙ:</strong> цифры, точки и звери смешаны в случайном порядке в примере и в ответах.',
      subInstr1: 'Показано равенство: карточка − карточка = ?',
      hard: 'Трудный',
      navFalling: 'Падающие карточки',
      navAdd: 'Сложение',
      navSub: 'Вычитание',
      modeLabel: 'Режим',
      modePoints: 'Точки',
      modeDigits: 'Цифры',
      modeAnimals: 'Звери',
      hardMode: 'Трудный'
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
      fallingInstr7: '<strong>A1:</strong> points → digits → animals → new maximum.',
      fallingInstr8: '<strong>A2:</strong> points → digits → points/digits → animals → new maximum.',
      fallingInstr9: '<strong>Hard:</strong> digits, points and animals mixed in random order.',
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
      animals: 'Animals',
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
      addInstr5b: '<strong>ANIMALS mode:</strong> animal cards.',
      addInstr6: '<strong>HARD mode:</strong> digits, points and animals mixed in random order in the example and in the answers.',
      subInstr1: 'Equation shown: card − card = ?',
      hard: 'Hard',
      navFalling: 'Falling Cards',
      navAdd: 'Addition',
      navSub: 'Subtraction',
      modeLabel: 'Mode',
      modePoints: 'Points',
      modeDigits: 'Digits',
      modeAnimals: 'Animals',
      hardMode: 'Hard'
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
      fallingInstr7: '<strong>A1:</strong> punktid → numbrid → loomad → uus maksimum.',
      fallingInstr8: '<strong>A2:</strong> punktid → numbrid → punktid/numbrid → loomad → uus maksimum.',
      fallingInstr9: '<strong>Raske:</strong> numbrid, punktid ja loomad segatud juhuslikus järjekorras.',
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
      animals: 'Loomad',
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
      addInstr5b: '<strong>LOOMAD režiim:</strong> loomakaardid.',
      addInstr6: '<strong>RASKE režiim:</strong> numbrid, punktid ja loomad segatud juhuslikus järjekorras näites ja vastustes.',
      subInstr1: 'Näidatakse võrrand: kaart − kaart = ?',
      hard: 'Raske',
      navFalling: 'Kukkuvad kaardid',
      navAdd: 'Liitmine',
      navSub: 'Lahutamine',
      modeLabel: 'Režiim',
      modePoints: 'Punktid',
      modeDigits: 'Numbrid',
      modeAnimals: 'Loomad',
      hardMode: 'Raske'
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
