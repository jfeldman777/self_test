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

        const labelX = cx + Math.cos(angle) * (R + 15);
        const labelY = cy + Math.sin(angle) * (R + 15);
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "#333";
        ctx.fillText(label, labelX, labelY);
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

}
