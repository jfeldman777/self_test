/* jshint esversion: 6 */
/* Universal Radar Chart for any test */

function drawRadarChart(containerId, labels, values) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    const count = labels.length;
    const canvasWidth = 400;
    const canvasHeight = 400;

    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    container.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const R = 150;

    const angleStep = (2 * Math.PI) / count;

    labels.forEach((label, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const x = cx + Math.cos(angle) * R;
        const y = cy + Math.sin(angle) * R;

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.strokeStyle = "#aaa";
        ctx.stroke();

        ctx.font = "18px Arial";
        ctx.textAlign = "center";
        ctx.fillText(label, x, y - 5);
    });

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

    ctx.fillStyle = "rgba(0, 119, 255, 0.25)";
    ctx.fill();

    values.forEach((v, i) => {
        if (v === null || v === undefined || isNaN(v)) return;
        
        const angle = i * angleStep - Math.PI / 2;
        const r = (v / 100) * R;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;

        const offset = 20;
        const textX = x + Math.cos(angle) * offset;
        const textY = y + Math.sin(angle) * offset;

        ctx.fillStyle = "#000";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(v + "%", textX, textY);
    });

    const overlay = document.createElement("div");
    overlay.className = "chart-click-overlay";
    overlay.style.cssText = "position:absolute;top:0;left:0;width:" + canvasWidth + "px;height:" + canvasHeight + "px;pointer-events:auto;";
    container.style.position = "relative";
    container.appendChild(overlay);

    labels.forEach(function(label, i) {
        const angle = i * angleStep - Math.PI / 2;
        const x = cx + Math.cos(angle) * R;
        const y = cy + Math.sin(angle) * R;

        const btn = document.createElement("button");
        btn.className = "chart-number-btn";
        btn.textContent = label;
        btn.dataset.hintIndex = (i + 1);
        btn.style.cssText = "position:absolute;left:" + (x - 16) + "px;top:" + (y - 16) + "px;width:32px;height:32px;border-radius:50%;border:2px solid #0077ff;background:rgba(255,255,255,0.9);cursor:pointer;font-weight:bold;font-size:14px;";
        btn.title = "Подсказка " + (i + 1);
        overlay.appendChild(btn);

        btn.addEventListener("click", function() {
            window.dispatchEvent(new CustomEvent("chartHintClick", { detail: { index: i + 1 } }));
        });
    });
}
