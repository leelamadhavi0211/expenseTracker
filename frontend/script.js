const API = "http://localhost:5000/api/transactions/";
const userId = localStorage.getItem("userId");

async function fetchTransactions() {
  const res = await fetch(`http://localhost:5000/api/transactions?userId=${userId}`);
  const data = await res.json();
  renderTransactions(data);

}

function renderTransactions(data) {
  const list = document.getElementById("list");
  list.innerHTML = "";
  let income = 0, expense = 0;

  data.forEach(tx => {
    const li = document.createElement("li");
    li.textContent = `${tx.description} (${tx.category}) : ₹${tx.amount}`;
    li.style.color = tx.amount < 0 ? "red" : "green";
    li.innerHTML += ` <button onclick="deleteTx('${tx._id}')">x</button>`;
    list.appendChild(li);
    if (tx.amount > 0) income += tx.amount;
    else expense += Math.abs(tx.amount);
  });
  //checkBudget(expense);
  drawCharts(data);

  document.getElementById("balance").textContent = `Balance: ₹${income - expense}`;
  document.getElementById("income").textContent = `Income: ₹${income}`;
  document.getElementById("expense").textContent = `Expense: ₹${expense}`;
}
let categoryChart, summaryChart;

// ----------------------- DRAW CHARTS -----------------------
function drawCharts(transactions) {
  // 💡 Group transactions by category
  const categoryTotals = {};
  let totalIncome = 0, totalExpense = 0;

  transactions.forEach(t => {
    if (t.amount > 0) totalIncome += t.amount;
    else totalExpense += Math.abs(t.amount);

    const cat = t.category || "Others";
    if (!categoryTotals[cat]) categoryTotals[cat] = 0;
    categoryTotals[cat] += Math.abs(t.amount);
  });

  // ===== Pie Chart: Spending by Category =====
  const ctx1 = document.getElementById("categoryChart").getContext("2d");
  if (categoryChart) categoryChart.destroy();
  categoryChart = new Chart(ctx1, {
    type: "pie",
    data: {
      labels: Object.keys(categoryTotals),
      datasets: [{
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56",
          "#4BC0C0", "#9966FF", "#FF9F40"
        ],
      }],
    },
    options: {
      plugins: { legend: { position: "bottom" } }
    }
  });

  // ===== Bar Chart: Income vs Expense =====
  const ctx2 = document.getElementById("summaryChart").getContext("2d");
  if (summaryChart) summaryChart.destroy();
  summaryChart = new Chart(ctx2, {
    type: "bar",
    data: {
      labels: ["Income", "Expense"],
      datasets: [{
        label: "Amount (₹)",
        data: [totalIncome, totalExpense],
        backgroundColor: ["#36A2EB", "#FF6384"]
      }],
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

async function addTransaction() {
  const description = document.getElementById("description").value.trim();
  const category = document.getElementById("category").value;
  const amount = Number(document.getElementById("amount").value);

  console.log({ userId, description, category, amount }); // 🧠 Debug

  if (!description || isNaN(amount)) {
    alert("Please enter valid description and amount!");
    return;
  }

  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, description, category, amount })
  });

  if (!res.ok) {
    const err = await res.json();
    console.error("Error:", err);
    alert("Failed to add transaction");
    return;
  }

  document.getElementById("description").value = "";
  document.getElementById("amount").value = "";
  fetchTransactions();
}

async function deleteTx(id) {
  await fetch(`http://localhost:5000/api/transactions/${id}`, { method: "DELETE" });
  fetchTransactions();
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

fetchTransactions();/*
// -------------------- 💰 Budget Feature --------------------
let budgetLimit = localStorage.getItem("budgetLimit")
  ? parseFloat(localStorage.getItem("budgetLimit"))
  : 0;

// Show saved budget when loading
if (budgetLimit > 0) {
  document.getElementById("budgetInfo").textContent = `Budget set: ₹${budgetLimit}`;
}

// Save budget
document.getElementById("saveBudgetBtn").addEventListener("click", () => {
  const inputVal = parseFloat(document.getElementById("budgetInput").value);
  if (isNaN(inputVal) || inputVal <= 0) {
    alert("Please enter a valid budget amount.");
    return;
  }
  budgetLimit = inputVal;
  localStorage.setItem("budgetLimit", budgetLimit);
  document.getElementById("budgetInfo").textContent = `Budget set: ₹${budgetLimit}`;
  alert("✅ Budget saved successfully!");
});

// Check if expenses exceed budget
function checkBudget(totalExpense) {
  if (budgetLimit > 0 && totalExpense > budgetLimit) {
    alert("⚠️ You have exceeded your monthly budget!");
  }
}
*/