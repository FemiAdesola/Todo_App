"use strict";

const form = document.getElementById("todo-form");
const taskInput = document.getElementById("task-input");
const dueInput = document.getElementById("due-date");
const errorBox = document.getElementById("form-error");
const todoList = document.getElementById("todo-list");
const openCount = document.getElementById("open-count");
const filters = document.querySelectorAll(".filter-btn");
const clearBtn = document.getElementById("clear-done");
const toggleBtn = document.getElementById("toggle-list");
const listSection = document.getElementById("list-section");

const STORAGE_KEY = "todo-full-v2";
let todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
let filterState = "all";
let lastDeleted = null;

// --- Event Listeners ---
form.addEventListener("submit", addTask);
filters.forEach((btn) => btn.addEventListener("click", changeFilter));

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
    dueDate: due,
  };

  todos.unshift(newTask);
  saveTodos();
  taskInput.value = "";
  dueInput.value = "";
  taskInput.classList.remove("invalid");
  render();
}

function showError(msg) {
  errorBox.textContent = msg;
  errorBox.classList.remove("hidden");
  setTimeout(() => errorBox.classList.add("hidden"), 2500);
}

// --- Filters ---
function changeFilter(e) {
  filterState = e.target.dataset.filter;
  render();
}

// --- Render ---
function render() {
  todoList.innerHTML = "";
  const visible = todos.filter((t) =>
    filterState === "active" ? !t.done : filterState === "done" ? t.done : true
  );

  if (visible.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No tasks.";
    li.className = "todo-item";
    todoList.appendChild(li);
  } else {
    visible.forEach((task) => todoList.appendChild(createItem(task)));
  }

  // Update counts and button states
  openCount.textContent = todos.filter((t) => !t.done).length;
  filters.forEach((btn) =>
    btn.classList.toggle("active", btn.dataset.filter === filterState)
  );
}

// --- Task Item Creation ---
function createItem(task) {
  const li = document.createElement("li");
  li.className = "todo-item";
  li.dataset.id = task.id;
  li.draggable = true;

  const today = new Date().toISOString().split("T")[0];
  if (!task.done && task.dueDate < today) li.classList.add("overdue");
  if (task.done) li.classList.add("done");

  const taskDiv = document.createElement("div");
  taskDiv.className = "task-column";

  const span = document.createElement("span");
  span.textContent = `${task.text} (${task.startDate})`;
  span.className = "todo-text";
  if (task.done) span.classList.add("done");
  span.addEventListener("dblclick", () => editTask(task.id, span));

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.done;
  checkbox.addEventListener("change", () => toggleDone(task.id));

  taskDiv.append(checkbox, span);

  const date = document.createElement("span");
  date.className = "due-date";
  date.textContent = task.dueDate;

  const delBtn = document.createElement("button");
  delBtn.className = "icon-btn";
  delBtn.textContent = "🗑";
  delBtn.title = "Delete task";
  delBtn.addEventListener("click", () => deleteTask(task.id));

  li.append(taskDiv, date, delBtn);
  return li;
}

// --- CRUD Actions ---
function toggleDone(id) {
  const task = todos.find((t) => t.id === id);
  task.done = !task.done;
  saveTodos();
  render();
}

function deleteTask(id) {
  const idx = todos.findIndex((t) => t.id === id);
  if (idx === -1) return;
  lastDeleted = todos[idx];
  todos.splice(idx, 1);
  saveTodos();
  render();
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}
