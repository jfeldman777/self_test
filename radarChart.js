/* jshint esversion: 6 */
/* Universal Radar Chart for any test */

function drawRadarChart(containerId, labels, values) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Очищаем контейнер перед созданием нового canvas
    container.innerHTML = '';
    
    const count = labels.length;

    // Создаём canvas
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 400;
    container.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const R = 150; // радиус

    // Углы
    const angleStep = (2 * Math.PI) / count;

    // Нарисовать оси + подписи
    labels.forEach((label, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const x = cx + Math.cos(angle) * R;
        const y = cy + Math.sin(angle) * R;

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.strokeStyle = "#aaa";
        ctx.stroke();

        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.fillText(label, x, y - 5);
    });

    // Линия результата
    ctx.beginPath();
    values.forEach((v, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const r = (v / 100) * R;

        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });

    ctx.closePath();
    ctx.strokeStyle = "#0077ff";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Заливка
    ctx.fillStyle = "rgba(0, 119, 255, 0.25)";
    ctx.fill();

    // Рисуем значения (цифры) на точках
    values.forEach((v, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const r = (v / 100) * R;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;

        ctx.fillStyle = "#000";
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(v + "%", x, y);
    });
}
