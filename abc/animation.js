/**
 * Управляемая анимация "Кривая разогрева"
 * Картинка 1111.png - приход энергии. По СТАРТ вода заливает область под кривой.
 * По Дальше - вертикальная линия едет, вода сливается (белая), резервуар наполняется.
 */

(function() {
    const img = document.getElementById('base-image');
    const canvas = document.getElementById('animation-canvas');
    const ctx = canvas.getContext('2d');
    const reservoirFill = document.getElementById('reservoir-fill');
    const bathtubSection = document.getElementById('bathtub-section');
    const areaTrapezoid = document.getElementById('area-trapezoid');
    const areaBathtub = document.getElementById('area-bathtub');
    const areaSum = document.getElementById('area-sum');
    const btnStart = document.getElementById('btn-start');
    const btnNext = document.getElementById('btn-next');
    const btnReset = document.getElementById('btn-reset');

    // Координаты трапеции под кривой (нормализованные 0-1)
    // x: время слева направо, y: 1=ось (низ), 0=верх графика
    const CURVE_OFFSET_X = 0.02; // сдвиг вправо (уменьшить = влево)
    const CURVE_POINTS = [
        { x: 0.0 + CURVE_OFFSET_X, y: 1.0 },   // левый нижний
        { x: 0.14 + CURVE_OFFSET_X, y: 0.282 },  // вершина левая4
        { x: 0.365 + CURVE_OFFSET_X, y: 0.282},  // плато
        { x: 0.52 + CURVE_OFFSET_X, y: 1.0 },  // правый нижний
        { x: 0.0 + CURVE_OFFSET_X, y: 1.0 }
    ];

    const CURVE_MIN_X = 0.0 + CURVE_OFFSET_X;
    const CURVE_MAX_X = 0.52 + CURVE_OFFSET_X; // правый край трапеции — ванна и линия заканчивают вместе

    // Границы графика на изображении (доля от ширины/высоты)
    const GRAPH_MARGIN = { left: 0.02, right: 0.12, top: 0.17, bottom: 0.14 };

    const STEP_DELTA = 1; // одно нажатие — выливается вся вода
    const ANIM_DURATION_MS = 3200;

    let state = {
        started: false,
        lineX: 0,
        targetLineX: 0,
        totalArea: 0,
        drainedArea: 0,
        imgWidth: 0,
        imgHeight: 0,
        animating: false
    };

    function px(normX) {
        const w = state.imgWidth || canvas.width;
        const marginLeft = w * GRAPH_MARGIN.left;
        const graphWidth = w * (1 - GRAPH_MARGIN.left - GRAPH_MARGIN.right);
        return marginLeft + normX * graphWidth;
    }

    function py(normY) {
        const h = state.imgHeight || canvas.height;
        const marginTop = h * GRAPH_MARGIN.top;
        const graphHeight = h * (1 - GRAPH_MARGIN.top - GRAPH_MARGIN.bottom);
        return marginTop + normY * graphHeight;
    }

    function resizeCanvas() {
        const rect = img.getBoundingClientRect();
        const scale = img.naturalWidth / rect.width;
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        state.imgWidth = img.naturalWidth;
        state.imgHeight = img.naturalHeight;
    }

    function updateTotalArea() {
        // Вычисляем площадь под кривой методом трапеций
        let area = 0;
        let prevX = CURVE_POINTS[0].x, prevY = CURVE_POINTS[0].y;
        for (let i = 1; i < CURVE_POINTS.length; i++) {
            const p = CURVE_POINTS[i];
            area += (p.x - prevX) * (p.y + prevY) / 2;
            prevX = p.x;
            prevY = p.y;
        }
        state.totalArea = Math.abs(area);
    }

    function getDrainedAreaAt(x) {
        if (x <= 0) return 0;
        let area = 0;
        let prevX = CURVE_POINTS[0].x, prevY = CURVE_POINTS[0].y;
        for (let i = 1; i < CURVE_POINTS.length; i++) {
            const p = CURVE_POINTS[i];
            const segRight = Math.max(prevX, p.x);
            const segLeft = Math.min(prevX, p.x);
            if (x >= segRight) {
                area += (segRight - segLeft) * (prevY + p.y) / 2;
            } else if (x > segLeft) {
                const t = (x - segLeft) / (segRight - segLeft);
                const yAtX = prevY + t * (p.y - prevY);
                area += (x - segLeft) * (prevY + yAtX) / 2;
            }
            prevX = p.x;
            prevY = p.y;
        }
        return Math.abs(area);
    }

    // Точка пересечения вертикали x с отрезком (a,b)
    function intersectSegment(a, b, x) {
        if (x < Math.min(a.x, b.x) || x > Math.max(a.x, b.x)) return null;
        const t = (b.x - a.x) !== 0 ? (x - a.x) / (b.x - a.x) : 0;
        return { x, y: a.y + t * (b.y - a.y) };
    }

    // Путь воды (синий) — область под кривой СПРАВА от линии (не слитая)
    function buildWaterPath(lineX) {
        if (lineX >= CURVE_MAX_X) return [];
        const path = [];
        const x = Math.max(lineX, CURVE_MIN_X);
        path.push({ x: px(x), y: py(1) });
        let addedIntersection = false;
        for (let i = 1; i < CURVE_POINTS.length; i++) {
            const prev = CURVE_POINTS[i - 1];
            const p = CURVE_POINTS[i];
            const pt = intersectSegment(prev, p, lineX);
            if (pt && !addedIntersection) {
                path.push({ x: px(pt.x), y: py(pt.y) });
                addedIntersection = true;
            }
            if (p.x > Math.max(lineX, CURVE_MIN_X)) {
                path.push({ x: px(p.x), y: py(p.y) });
            }
        }
        return path;
    }

    // Путь слитой области (белый) — область под кривой СЛЕВА от линии
    function buildDrainedPath(lineX) {
        if (lineX <= CURVE_MIN_X + 0.005) return [];
        const path = [];
        path.push({ x: px(CURVE_MIN_X), y: py(1) });
        for (let i = 1; i < CURVE_POINTS.length; i++) {
            const prev = CURVE_POINTS[i - 1];
            const p = CURVE_POINTS[i];
            if (p.x <= lineX) {
                path.push({ x: px(p.x), y: py(p.y) });
            } else {
                const pt = intersectSegment(prev, p, lineX);
                if (pt) {
                    path.push({ x: px(pt.x), y: py(pt.y) });
                }
                break;
            }
        }
        path.push({ x: px(lineX), y: py(1) });
        return path;
    }

    // Общий путь трапеции (для клипа — оба слоя строго внутри)
    function buildFullTrapezoidPath() {
        const path = [];
        for (let i = 0; i < CURVE_POINTS.length - 1; i++) {
            const p = CURVE_POINTS[i];
            path.push({ x: px(p.x), y: py(p.y) });
        }
        return path;
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!state.started) return;

        const lineX = state.lineX;

        // После прохода линии — очистить canvas, показать исходный график
        if (lineX >= CURVE_MAX_X) return;

        // Клип по трапеции — заливки только внутри графика
        const fullPath = buildFullTrapezoidPath();
        if (fullPath.length >= 3) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(fullPath[0].x, fullPath[0].y);
            for (let i = 1; i < fullPath.length; i++) {
                ctx.lineTo(fullPath[i].x, fullPath[i].y);
            }
            ctx.closePath();
            ctx.clip();
        }

        // 1. Слитая область (белая) — под кривой СЛЕВА от линии (сначала, чтобы синяя была поверх)
        const drainedPath = buildDrainedPath(lineX);
        if (drainedPath.length >= 3) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.beginPath();
            ctx.moveTo(drainedPath[0].x, drainedPath[0].y);
            for (let i = 1; i < drainedPath.length; i++) {
                ctx.lineTo(drainedPath[i].x, drainedPath[i].y);
            }
            ctx.closePath();
            ctx.fill();
        }

        // 2. Заливка водой (синяя) — область под кривой СПРАВА от линии
        ctx.fillStyle = 'rgba(59, 130, 246, 0.55)';
        ctx.beginPath();
        const waterPath = buildWaterPath(lineX);
        if (waterPath.length >= 3) {
            ctx.moveTo(waterPath[0].x, waterPath[0].y);
            for (let i = 1; i < waterPath.length; i++) {
                ctx.lineTo(waterPath[i].x, waterPath[i].y);
            }
            ctx.closePath();
            ctx.fill();
        }

        ctx.restore();

        // 3. Вертикальная линия (если линия сдвинулась)
        if (lineX > CURVE_MIN_X + 0.005) {
            ctx.strokeStyle = '#1e40af';
            ctx.lineWidth = 2;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(px(lineX), py(0));
            ctx.lineTo(px(lineX), py(1));
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }

    function updateReservoir() {
        // Заполнение по позиции линии — ванна и трапеция заканчивают визуально вместе
        const progress = (state.lineX - CURVE_MIN_X) / (CURVE_MAX_X - CURVE_MIN_X);
        const pct = Math.min(100, Math.max(0, progress * 100));
        reservoirFill.style.height = pct + '%';
    }

    function updateAreaDisplay() {
        if (state.totalArea <= 0) {
            areaTrapezoid.textContent = '—';
            areaBathtub.textContent = '—';
            areaSum.textContent = '—';
            return;
        }
        // Оба слагаемых >= 0; сумма = const. Без отрицательных (погрешность округления)
        const inTrapezoid = Math.max(0, state.totalArea - state.drainedArea);
        const inBathtub = Math.min(state.totalArea, state.drainedArea);
        const sum = inTrapezoid + inBathtub;
        const fmt = (v) => v.toFixed(4);
        areaTrapezoid.textContent = fmt(inTrapezoid);
        areaBathtub.textContent = fmt(inBathtub);
        areaSum.textContent = fmt(sum) + ' (const)';
    }

    function step() {
        if (state.animating || state.lineX >= CURVE_MAX_X) return;
        state.animating = true;
        btnNext.disabled = true;
        const startX = state.lineX;
        const targetX = Math.min(CURVE_MAX_X, startX + STEP_DELTA);
        const startTime = performance.now();

        function animate(now) {
            const elapsed = now - startTime;
            const t = Math.min(1, elapsed / ANIM_DURATION_MS);
            const eased = t * t * (3 - 2 * t); // smoothstep
            state.lineX = startX + (targetX - startX) * eased;
            state.drainedArea = getDrainedAreaAt(state.lineX);
            draw();
            updateReservoir();
            updateAreaDisplay();
            if (t < 1) {
                requestAnimationFrame(animate);
            } else {
                state.animating = false;
                state.lineX = targetX;
                state.drainedArea = getDrainedAreaAt(targetX);
                updateReservoir();
                updateAreaDisplay();
                draw();
                if (state.lineX >= CURVE_MAX_X) {
                    btnNext.disabled = true;
                } else {
                    btnNext.disabled = false;
                }
            }
        }
        requestAnimationFrame(animate);
    }

    function reset() {
        state.started = false;
        state.lineX = CURVE_MIN_X;
        state.animating = false;
        state.drainedArea = 0;
        bathtubSection.style.display = 'none'; // убрать ванну только после С НАЧАЛА
        btnStart.disabled = false;
        btnNext.disabled = true;
        draw();
        updateReservoir();
        updateAreaDisplay();
    }

    function start() {
        state.started = true;
        state.lineX = CURVE_MIN_X;
        state.drainedArea = 0;
        bathtubSection.style.display = 'block';
        btnStart.disabled = true;
        btnNext.disabled = false;
        updateTotalArea();
        draw();
        updateReservoir();
        updateAreaDisplay();
    }

    img.addEventListener('load', function() {
        resizeCanvas();
        updateTotalArea();
        draw();
        updateAreaDisplay();
    });

    if (img.complete) {
        resizeCanvas();
        updateTotalArea();
        draw();
        updateAreaDisplay();
    }

    window.addEventListener('resize', function() {
        resizeCanvas();
        draw();
    });

    btnStart.addEventListener('click', start);
    btnNext.addEventListener('click', step);
    btnReset.addEventListener('click', reset);
})();
