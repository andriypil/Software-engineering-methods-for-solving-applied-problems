let delay = 0;

// ===== БАЗА =====
function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function logStep(text) {
  let log = document.getElementById("log");
  log.innerHTML += text + "<br>";
  log.scrollTop = log.scrollHeight;
}

function clearLog() {
  document.getElementById("log").innerHTML = "";
}

function getInput() {
  let weights = document.getElementById("weights").value.split(",").map(Number);
  let values = document.getElementById("values").value.split(",").map(Number);
  let W = parseInt(document.getElementById("W").value);
  return { weights, values, W };
}

// ===== ТАБЛИЦЯ =====
function createTable(n, W) {
  let html = "<table>";
  html += "<tr><td>i\\w</td>";

  for (let w = 0; w <= W; w++) html += `<td>${w}</td>`;
  html += "</tr>";

  for (let i = 0; i <= n; i++) {
    html += `<tr><td>${i}</td>`;
    for (let w = 0; w <= W; w++) {
      html += `<td id="cell-${i}-${w}">0</td>`;
    }
    html += "</tr>";
  }

  html += "</table>";
  return html;
}

// ===== DP =====
async function dpAnimated(weights, values, W) {
  let n = weights.length;
  let dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= W; w++) {

      let cell = document.getElementById(`cell-${i}-${w}`);
      cell.classList.add("highlight");

      await sleep(delay);

      if (weights[i - 1] <= w) {
        let a = dp[i - 1][w];
        let b = dp[i - 1][w - weights[i - 1]] + values[i - 1];
        dp[i][w] = Math.max(a, b);

        logStep(`dp[${i}][${w}] = max(${a}, ${b}) = ${dp[i][w]}`);
      } else {
        dp[i][w] = dp[i - 1][w];
      }

      cell.innerText = dp[i][w];
      cell.classList.remove("highlight");
    }
  }

  return { dp, max: dp[n][W] };
}

async function restore(dp, weights, W) {
  let i = weights.length, w = W;
  let items = [];

  while (i > 0 && w > 0) {
    let cell = document.getElementById(`cell-${i}-${w}`);
    cell.style.background = "red";

    await sleep(150);

    if (dp[i][w] !== dp[i - 1][w]) {
      items.push(i);
      logStep(`Беремо предмет ${i}`);
      w -= weights[i - 1];
    } else {
      logStep(`Не беремо предмет ${i}`);
    }

    i--;
  }

  return items.reverse();
}

// ===== ПЕРЕБІР =====
async function branchDynamic(weights, values, W) {

  clearLog();

  let n = weights.length;
  let max = 0;
  let checked = 0;

  // Формуємо предмети
  let items = weights.map((w, i) => ({
    id: i + 1,
    w: w,
    v: values[i],
    r: values[i] / w
  }));

  // Сортування по вигідності
  items.sort((a, b) => b.r - a.r);

  // Верхня межа
  function bound(i, currentW, currentV) {

    if (currentW >= W) return currentV;

    let totalW = currentW;
    let result = currentV;

    while (i < n && totalW + items[i].w <= W) {
      totalW += items[i].w;
      result += items[i].v;
      i++;
    }

    // дробова частина
    if (i < n) {
      result += (W - totalW) * items[i].r;
    }

    return result;
  }

  async function dfs(i, currentW, currentV) {

    checked++;

    // Оновлення раз на 5000 вузлів
    if (checked % 5000 === 0) {
      document.getElementById("log").innerHTML =
        `Перевірено вузлів: ${checked}<br>Поточний максимум: ${max}`;


    }

    // Перевищили вагу
    if (currentW > W) return;

    // Новий максимум
    if (currentV > max) {
      max = currentV;
    }

    // Кінець
    if (i >= n) return;

    // Відсікання
    if (bound(i, currentW, currentV) <= max) {
      return;
    }

    // Беремо предмет
    await dfs(
      i + 1,
      currentW + items[i].w,
      currentV + items[i].v
    );

    // Не беремо
    await dfs(
      i + 1,
      currentW,
      currentV
    );
  }

  await dfs(0, 0, 0);

  document.getElementById("output").innerHTML = `
        <h2>Максимальна цінність: ${max}</h2>
        <p>Перевірено вузлів: ${checked}</p>
    `;

  return max;
}

// ===== ЖАДІБНИЙ =====
async function greedyDynamic(weights, values, W) {
  clearLog();

  let items = weights.map((w, i) => ({
    i: i + 1,
    w,
    v: values[i],
    r: values[i] / w
  }));

  items.sort((a, b) => b.r - a.r);

  let totalW = 0;
  let totalV = 0;

  for (let item of items) {
    logStep(`Предмет ${item.i} (r=${item.r.toFixed(2)})`);

    if (totalW + item.w <= W) {
      totalW += item.w;
      totalV += item.v;
      logStep(`✔ Беремо → W=${totalW}, V=${totalV}`);
    } else {
      logStep(`Пропускаємо`);
    }

    await sleep(delay * 3);
  }

  return totalV;
}

// ===== РЕКУРСІЯ =====
async function recursiveDynamic(weights, values, W, n = weights.length) {
  logStep(`Виклик: n=${n}, W=${W}`);
  await sleep(delay);

  if (n === 0 || W === 0) return 0;

  if (weights[n - 1] > W) {
    return recursiveDynamic(weights, values, W, n - 1);
  }

  let a = await recursiveDynamic(weights, values, W, n - 1);
  let b = values[n - 1] + await recursiveDynamic(weights, values, W - weights[n - 1], n - 1);

  let res = Math.max(a, b);

  logStep(`max(${a}, ${b}) = ${res}`);

  return res;
}

// ===== ГІЛКИ =====
async function branchDynamic(weights, values, W) {
  clearLog();

  let max = 0;

  async function dfs(i, w, v) {
    logStep(`i=${i}, w=${w}, v=${v}`);
    await sleep(delay);

    if (w <= W && v > max) {
      max = v;
      logStep(`Новий максимум: ${max}`);
    }

    if (i >= weights.length) return;

    await dfs(i + 1, w + weights[i], v + values[i]);
    await dfs(i + 1, w, v);
  }

  await dfs(0, 0, 0);

  return max;
}

// ===== MAIN =====
async function runAll() {
  let { weights, values, W } = getInput();
  let method = document.getElementById("method").value;

  clearLog();

  if (method === "dp") {
    document.getElementById("output").innerHTML =
      createTable(weights.length, W);

    let result = await dpAnimated(weights, values, W);
    let items = await restore(result.dp, weights, W);

    document.getElementById("output").innerHTML +=
      `<h2>${result.max}</h2><p>${items.join(", ")}</p>`;
  }

  else if (method === "brute") {
    let r = await bruteDynamic(weights, values, W);
    show(r);
  }

  else if (method === "rec") {
    let r = await recursiveDynamic(weights, values, W);
    show(r);
  }

  else if (method === "greedy") {
    let r = await greedyDynamic(weights, values, W);
    show(r);
  }

  else if (method === "branch") {
    let r = await branchDynamic(weights, values, W);
    show(r);
  }

  else if (method === "brute_force") {
    await bruteForceFull(weights, values, W);
  }
}

function show(res) {
  document.getElementById("output").innerHTML = `<h2>${res}</h2>`;
}