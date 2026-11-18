// Get saved expenses from localStorage (or start with an empty list)
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

// ---------- Dark mode ----------
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

document.getElementById("themeBtn").onclick = function () {
  document.body.classList.toggle("dark");
  let theme = document.body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", theme);
};

// ---------- Total and count (Home, My Expenses, Summary pages) ----------
function showStats() {
  let sum = 0;
  for (let e of expenses) {
    sum = sum + e.amount;
  }
  let totalBox = document.getElementById("total");
  let countBox = document.getElementById("count");
  if (totalBox) totalBox.textContent = "₹" + sum.toFixed(2);
  if (countBox) countBox.textContent = expenses.length;
}

// ---------- Add Expense page ----------
function setToday() {
  document.getElementById("date").value = new Date().toLocaleDateString("en-CA");
}

let form = document.getElementById("form");
if (form) {
  setToday();

  form.onsubmit = function (event) {
    event.preventDefault();

    let title = document.getElementById("title").value.trim();
    let amount = Number(document.getElementById("amount").value);
    let category = document.getElementById("category").value;
    let date = document.getElementById("date").value;
    let msg = document.getElementById("msg");

    if (title === "" || category === "" || date === "") {
      msg.textContent = "⚠️ Please fill in all the fields.";
      msg.className = "error";
      return;
    }

    if (!(amount > 0)) {
      msg.textContent = "⚠️ Please enter a valid amount greater than 0.";
      msg.className = "error";
      return;
    }

    expenses.push({
      id: Date.now(),
      title: title,
      amount: amount,
      category: category,
      date: date
    });
    saveExpenses();

    form.reset();
    setToday();
    msg.textContent = "✅ Expense added successfully!";
    msg.className = "success";
  };
}

// ---------- My Expenses page ----------
function showList() {
  let list = document.getElementById("list");
  if (!list) return;

  let selected = document.getElementById("filter").value;
  list.innerHTML = "";

  for (let e of expenses) {
    if (selected !== "All" && e.category !== selected) continue;

    list.innerHTML +=
      "<tr>" +
      "<td>" + e.title + "</td>" +
      "<td>" + e.category + "</td>" +
      "<td>" + e.date + "</td>" +
      "<td>₹" + e.amount.toFixed(2) + "</td>" +
      "<td><button class='delete-btn' onclick='deleteExpense(" + e.id + ")'>🗑️ Delete</button></td>" +
      "</tr>";
  }

  if (list.innerHTML === "") {
    list.innerHTML = "<tr><td colspan='5'>No expenses found.</td></tr>";
  }
}

function deleteExpense(id) {
  expenses = expenses.filter(function (e) {
    return e.id !== id;
  });
  saveExpenses();
  showList();
  showStats();
}

let filter = document.getElementById("filter");
if (filter) {
  filter.onchange = showList;
}

// ---------- Summary page ----------
function showSummary() {
  let box = document.getElementById("summary");
  if (!box) return;

  let categories = ["Food", "Travel", "Books", "Entertainment", "Other"];
  box.innerHTML = "";

  for (let c of categories) {
    let total = 0;
    for (let e of expenses) {
      if (e.category === c) total = total + e.amount;
    }
    box.innerHTML += "<tr><td>" + c + "</td><td>₹" + total.toFixed(2) + "</td></tr>";
  }
}

// ---------- Contact page ----------
let contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.onsubmit = function (event) {
    event.preventDefault();
    let msg = document.getElementById("contactMsg");
    msg.textContent = "✅ Thank you! Your message has been sent.";
    msg.className = "success";
    contactForm.reset();
  };
}

// ---------- Run when the page loads ----------
showStats();
showList();
showSummary();