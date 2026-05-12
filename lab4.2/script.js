const datasets = {
    5: `1 0.5
2 2.1
3 4.4
4 7.1
5 10.2`,

    10: `1 2
2 3
3 5
4 8
5 12
6 17
7 23
8 30`,

    20: `0 2
0.5 2.5
1 3.2
1.5 4.1
2 5.2
2.5 6.5
3 8
3.5 9.7
4 11.6
4.5 13.7
5 16
5.5 18.5
6 21.2
6.5 24.1
7 27.2
7.5 30.5
8 34
8.5 37.7
9 41.6
9.5 45.7`
};

const buildBtn = document.getElementById("buildBtn");
const clearBtn = document.getElementById("clearBtn");
const datasetSelect = document.getElementById("datasetSelect");
const pointsInput = document.getElementById("pointsInput");

pointsInput.value = datasets[10];

datasetSelect.addEventListener("change", () => {
    pointsInput.value = datasets[datasetSelect.value];
});

buildBtn.addEventListener("click", () => {
    const points = parsePoints();
    const degree = parseInt(document.getElementById("degree").value);

    const lagrangeFunc = x => lagrangeInterpolation(points, x);
    const mnkFunc = leastSquares(points, degree);

    drawChart(points, lagrangeFunc, mnkFunc);

    const rmse = calculateRMSE(points, mnkFunc);

    document.getElementById("lagrangeText").textContent =
        "Інтерполяція Лагранжа побудована";

    document.getElementById("mnkText").textContent =
        "МНК побудовано";

    document.getElementById("rmseText").textContent =
        `RMSE: ${rmse.toFixed(4)}`;
});

clearBtn.addEventListener("click", () => {
    d3.select("#chart").selectAll("*").remove();
});

function parsePoints() {
    const input = document.getElementById("pointsInput").value.trim();
    const lines = input.split("\n");

    return lines.map(line => {
        const [x, y] = line.trim().split(/\s+/).map(Number);
        return { x, y };
    });
}

function calculateRMSE(points, func) {
    let sum = 0;

    for (const p of points) {
        sum += Math.pow(p.y - func(p.x), 2);
    }

    return Math.sqrt(sum / points.length);
}
