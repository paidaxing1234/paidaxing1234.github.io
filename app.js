const form = document.querySelector("#costForm");
const resultCard = document.querySelector("#resultCard");

function money(value) {
  return `$${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function readNumber(name) {
  const value = Number(new FormData(form).get(name));
  return Number.isFinite(value) ? value : 0;
}

function renderCost() {
  if (!form || !resultCard) return;
  const users = readNumber("users");
  const calls = readNumber("calls");
  const inputTokens = readNumber("inputTokens");
  const outputTokens = readNumber("outputTokens");
  const inputPrice = readNumber("inputPrice");
  const outputPrice = readNumber("outputPrice");
  const monthlyCalls = users * calls * 30;
  const inputCost = (monthlyCalls * inputTokens * inputPrice) / 1_000_000;
  const outputCost = (monthlyCalls * outputTokens * outputPrice) / 1_000_000;
  const total = inputCost + outputCost;
  const warning =
    total > 1000
      ? "成本已经很高，优先做缓存、限额、分层模型和批处理。"
      : total > 200
        ? "成本进入需要管理的区间，建议给重度用户限额。"
        : "成本还算轻，先验证用户留存，再做复杂优化。";

  resultCard.querySelector("strong").textContent = money(total);
  resultCard.querySelector("p").textContent = warning;
  resultCard.querySelector(".result-breakdown").innerHTML = `
    <div><span>每月调用</span><b>${monthlyCalls.toLocaleString("en-US")} 次</b></div>
    <div><span>输入成本</span><b>${money(inputCost)}</b></div>
    <div><span>输出成本</span><b>${money(outputCost)}</b></div>
    <div><span>单用户月均</span><b>${money(users ? total / users : 0)}</b></div>
  `;
}

form?.addEventListener("input", renderCost);
renderCost();
