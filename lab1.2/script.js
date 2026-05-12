const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let animationId;
let i = 0;
let points = [];

let scale,
    offsetX,
    offsetY;

// -------- ФІЗИКА --------
function toRad(deg) {
    return deg * Math.PI / 180;
}

function calculate() {
    const x0 = +document.getElementById("x0").value;
    const y0 = +document.getElementById("y0").value;
    const v0 = +document.getElementById("v0").value;
    const angle = +document.getElementById("angle").value;
    const g = +document.getElementById("g").value;

    const rad = toRad(angle);

    const vx = v0 * Math.cos(rad);
    const vy = v0 * Math.sin(rad);

    const tFlight = (2 * vy) / g;

    points = [];

    for (let t = 0; t <= tFlight; t += 0.02) {
        let x = x0 + vx * t;
        let y = y0 + vy * t - (g * t * t) / 2;

        if (y < 0) break;

        points.push({
            x, y
        });
    }
}

// -------- СІТКА --------
function drawGrid(minX, maxX, minY, maxY) {

    const padding = 40;

    scaleX = (canvas.width - padding * 2) / (maxX - minX);
    scaleY = (canvas.height - padding * 2) / (maxY - minY);

    offsetX = padding - minX * scaleX;
    offsetY = padding - minY * scaleY;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#444";
    ctx.lineWidth = 1;
    ctx.font = "12px Arial";
    ctx.fillStyle = "#aaa";

    const stepX = (maxX - minX) / 10;
    const stepY = (maxY - minY) / 10;


    for (let xVal = minX; xVal <= maxX; xVal += stepX) {
        let x = offsetX + xVal * scaleX;

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();

        ctx.fillText(xVal.toFixed(1), x - 10, canvas.height - 5);
    }


    for (let yVal = minY; yVal <= maxY; yVal += stepY) {
        let y = canvas.height - (offsetY + yVal * scaleY);

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();

        ctx.fillText(yVal.toFixed(1), 5, y - 5);
    }


    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;

    let zeroX = offsetX;
    let zeroY = canvas.height - offsetY;

    ctx.beginPath();
    ctx.moveTo(0, zeroY);
    ctx.lineTo(canvas.width, zeroY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(zeroX, 0);
    ctx.lineTo(zeroX, canvas.height);
    ctx.stroke();
}

// -------- АНІМАЦІЯ --------
function animate() {
    let index = Math.floor(i);

    if (index >= points.length) return;

    let p = points[index];

    let x = offsetX + p.x * scaleX;
    let y = canvas.height - (offsetY + p.y * scaleY);

    ctx.strokeStyle = "#ff0000";
    ctx.lineWidth = 3;

    if (index === 0) {
        ctx.beginPath();
        ctx.moveTo(x, y);
    } else {
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    document.getElementById("coord").innerText =
        `x=${p.x.toFixed(2)}, y=${p.y.toFixed(2)}`;

    document.getElementById("speed").innerText =
        `час=${(index * 0.02).toFixed(2)} c`;

    document.getElementById("move").innerText =
        `дальність=${points.length}`;


    let speedVal = +document.getElementById("speedControl").value;
    i += speedVal;

    animationId = requestAnimationFrame(animate);
}

// -------- СТАРТ --------
function start() {
    clearCanvas();

    calculate();

    let xs = points.map(p => p.x);
    let ys = points.map(p => p.y);

    let minX = Math.min(...xs);
    let maxX = Math.max(...xs);
    let minY = 0;
    let maxY = Math.max(...ys);

    drawGrid(minX, maxX, minY, maxY);

    i = 0;
    animate();
}
// -------- CLEAR --------
function clearCanvas() {
    cancelAnimationFrame(animationId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    i = 0;
    points = [];
}