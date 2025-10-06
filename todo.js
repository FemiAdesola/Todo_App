'use strict';

const form = document.getElementById("todo-form");
const taskInput = document.getElementById("task-input");
const dueInput = document.getElementById("due-date");
const errorBox = document.getElementById("form-error");

// --- Event Listeners ---
form.addEventListener("submit", addTask);

// --- Functions ---
function addTask(e) {
  e.preventDefault();
  const text = taskInput.value.trim();
  const due = dueInput.value;

  if (text.length < 3 || !due) {
    showError("Please enter a valid task and due date.");
    taskInput.classList.add("invalid");
    return;
  }

  const newTask = {
    id: Date.now().toString(),
    text,
    done: false,
    startDate: new Date().toISOString().split("T")[0],
    dueDate: due
  };

  todos.unshift(newTask);
  taskInput.value = "";
  dueInput.value = "";
  taskInput.classList.remove("invalid");
}

function showError(msg) {
  errorBox.textContent = msg;
  errorBox.classList.remove("hidden");
  setTimeout(() => errorBox.classList.add("hidden"), 2500);
}
