const balance = document.getElementById("balance");
const inflow = document.getElementById("income");
const outflow = document.getElementById("expense");
const tbody = document.getElementById("tbody");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const table = document.getElementById("table");


const localStorageTransactions = JSON.parse(localStorage.getItem("transactions"));
let transactions = localStorage.getItem("transactions") !== null ? localStorageTransactions : [];


function addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === "" || amount.value.trim() === "") {
        document.getElementById("error_msg").innerHTML =
            "<span class='error-style fade-in-text'>Please enter Transaction Name and Amount!</span>";
        setTimeout(
            () => (document.getElementById("error_msg").innerHTML = ""),
            7000
        );
    } else {
        const transaction = {
            id: generateID(),
            text: text.value,
            amount: +amount.value,
        };

        transactions.push(transaction);
        addTransactionDOM(transaction);
        updateValues();
        updateLocalStorage();

        text.value = "";
        amount.value = "";
    }
}

function generateID() {
    return Math.floor(Math.random() * 100000000);
}

function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? "-" : "+";
    const item = document.createElement("tr");

    item.innerHTML = `
    <td>
        <span class="delete-btn" onclick="removeTransaction(${transaction.id})">X</span>
    </td>
    <td>${transaction.text}</td> 
    <td>${sign}</td>
    <td>${Math.abs(transaction.amount)}</td>`;

    tbody.appendChild(item);
    table.classList.remove("hide");
    table.classList.add("show");
}
function updateValues() {
    const amounts = transactions.map((transaction) => transaction.amount);
    const total = amounts.reduce((bal, value) => (bal += value), 0);
    const income = amounts
        .filter((value) => value > 0)
        .reduce((bal, value) => (bal += value), 0);
    const expense =
        amounts
            .filter((value) => value < 0)
            .reduce((bal, value) => (bal += value), 0) * -(1);

    balance.innerText = `$${total}`;
    inflow.innerText = `$${income}`;
    outflow.innerText = `$${expense}`;
}

function removeTransaction(id) {
    transactions = transactions.filter((transaction) => transaction.id !== id);
    table.classList.remove("show");
    table.classList.add("hide");

    updateLocalStorage();
    start();
}

function updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function start() {
    tbody.innerHTML = "";
    transactions.forEach(addTransactionDOM);
    updateValues();
}

start();
form.addEventListener("submit", addTransaction);
