"use strict";

const form = document.getElementById("todo-form"); // Form element
const taskInput = document.getElementById("task-input"); // Task input field 
const dueInput = document.getElementById("due-date"); // Due date input field
const errorBox = document.getElementById("form-error"); // Error message box
const todoList = document.getElementById("todo-list"); // UL for tasks
const openCount = document.getElementById("open-count"); // Span for open tasks count
const filters = document.querySelectorAll(".filter-btn"); // Filter buttons
const clearBtn = document.getElementById("clear-done"); // Clear completed button
const toggleBtn = document.getElementById("toggle-list"); // Toggle list button
const listSection = document.getElementById("list-section"); // Section containing the list
const undoBanner = document.getElementById("undo-banner"); // Undo banner
const undoBtn = document.getElementById("undo-btn"); // Undo button in banner

// --- State ---
const STORAGE_KEY = "todo-v1";
let todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); // Load from localStorage
let filterState = "all";
let lastDeleted = null;
let undoTimer;

// --- Event Listeners ---
form.addEventListener("submit", addTask);
filters.forEach((btn) => btn.addEventListener("click", changeFilter)); // Filter buttons
clearBtn.addEventListener("click", clearCompleted); // Clear completed tasks
toggleBtn.addEventListener("click", toggleList); // Toggle list visibility
undoBtn.addEventListener("click", restoreDeleted); // Restore last deleted task

// --- Functions ---
function addTask(e) {
  e.preventDefault();
  const text = taskInput.value.trim(); // Trim whitespace
  const due = dueInput.value;

  if (text.length < 3 || !due) {
    showError("Please enter a valid task and due date.");
    taskInput.classList.add("invalid");
    return;
  }

  // Create new task object
  const newTask = {
    id: Date.now().toString(),
    text,
    done: false,
    startDate: new Date().toISOString().split("T")[0],
    dueDate: due,
  };

  // Add to the beginning of the list
  todos.unshift(newTask);
  saveTodos();
  taskInput.value = "";
  dueInput.value = "";
  taskInput.classList.remove("invalid");
  render();
}

// Show error message
function showError(msg) {
  errorBox.textContent = msg;
  errorBox.classList.remove("hidden");
  setTimeout(() => errorBox.classList.add("hidden"), 5000); // Hide after 5 seconds
}

// --- Filters ---
function changeFilter(e) {
  filterState = e.target.dataset.filter;
  render();
}

// --- Render ---
function render() {
  todoList.innerHTML = ""; // Clear existing items

  // Filter tasks based on filterState
  const visible = todos.filter((t) =>
    filterState === "active" ? !t.done : filterState === "done" ? t.done : true
  );

  if (visible.length === 0) {
    const li = document.createElement("li"); // Create list item
    li.textContent = "No tasks.";
    li.className = "todo-item";
    todoList.appendChild(li);
  } else {
    visible.forEach((task) => todoList.appendChild(createItem(task))); // Create and append each task item
  }

  // Update counts and button states
  openCount.textContent = todos.filter((t) => !t.done).length;
  filters.forEach((btn) =>
    btn.classList.toggle("active", btn.dataset.filter === filterState)
  );
}

// --- Task Item Creation ---

// Create a list item for a task object 
function createItem(task) {
  const li = document.createElement("li"); // Create list item
  li.className = "todo-item";
  li.dataset.id = task.id;
  li.draggable = true;

  const today = new Date().toISOString().split("T")[0];
  if (!task.done && task.dueDate < today) li.classList.add("overdue"); // Overdue class for styling
  if (task.done) li.classList.add("done");

   // Drag events
  li.addEventListener("dragstart", dragStart);
  li.addEventListener("dragover", dragOver);
  li.addEventListener("drop", dropItem);
  li.addEventListener("dragend", dragEnd);

  const taskDiv = document.createElement("div");
  taskDiv.className = "task-column";

  const span = document.createElement("span"); // Task text span 
  span.textContent = `${task.text} (${task.startDate})`; // Show start date
  span.className = "todo-text";
  if (task.done) span.classList.add("done");
  span.addEventListener("dblclick", () => updateTask(task.id, span)); // Edit on double-click

  const checkbox = document.createElement("input"); // Checkbox for done status
  checkbox.type = "checkbox";
  checkbox.checked = task.done;
  checkbox.addEventListener("change", () => toggleDone(task.id)); // Toggle done status

  taskDiv.append(checkbox, span);

  const date = document.createElement("span");
  date.className = "due-date";
  date.textContent = task.dueDate;

  const delBtn = document.createElement("button"); // Delete button
  delBtn.className = "icon-btn";
  delBtn.textContent = "🗑";
  delBtn.title = "Delete task";
  delBtn.addEventListener("click", () => deleteTask(task.id));

  li.append(taskDiv, date, delBtn);
  return li;
}

// --- Updating the task ---
function updateTask(id, span) {
  const task = todos.find(t => t.id === id);
  const input = document.createElement("input"); // Create input field
  input.type = "text";
  input.value = task.text;
  input.className = "edit-input"; // Add CSS class for styling
  span.replaceWith(input);
  input.focus();

  const finish = () => {
    const character = input.value.trim();
    if (character.length >= 3) task.text = character;
    saveTodos();
    render();
  };

  input.addEventListener("blur", finish);
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") finish();
    if (e.key === "Escape") render();
  });
}

// --- CRUD Actions ---

// Toggle task completion status
function toggleDone(id) {
  const task = todos.find((t) => t.id === id);
  task.done = !task.done;
  saveTodos();
  render();
}

// Delete a task and store it for potential undo
function deleteTask(id) {
  const idx = todos.findIndex((t) => t.id === id);
  if (idx === -1) return;
  lastDeleted = todos[idx];
  todos.splice(idx, 1);
  saveTodos();
  showUndo();
  render();
}

// Restore the last deleted task
function restoreDeleted() {
  if (!lastDeleted) return;
  todos.unshift(lastDeleted); // Add back to the start of the list
  lastDeleted = null;
  hideUndo();
  saveTodos();
  render();
}

// clear the completed tasks
function clearCompleted() {
  todos = todos.filter(t => !t.done); // Keep only tasks that are not done
  saveTodos();
  render();
}

// --- Undo Banner ---
function showUndo() {
  undoBanner.classList.remove("hidden");
  clearTimeout(undoTimer);
  undoTimer = setTimeout(hideUndo, 7000);
}
function hideUndo() {
  undoBanner.classList.add("hidden"); // Hide the banner
  lastDeleted = null;
  clearTimeout(undoTimer);
}

// --- toggle the list ---
function toggleList() {
  const hidden = listSection.style.display === "none"; // Check current state
  listSection.style.display = hidden ? "" : "none";
  toggleBtn.textContent = hidden ? "Hide List" : "Show List"; // Update button text accordingly hide or show the list
}

// --- Drag & Drop ---
let draggingId = null;

// Start dragging the item and add dragging class to it
function dragStart(e) {
  draggingId = e.currentTarget.dataset.id;
  e.currentTarget.classList.add("dragging");
}

// Allow dropping by preventing default
function dragOver(e) {
  e.preventDefault();
  const dragging = document.querySelector(".dragging");
  const target = e.currentTarget;
  if (dragging === target) return;
  const list = todoList;
  const items = Array.from(list.children);
  const src = items.indexOf(dragging);
  const tgt = items.indexOf(target);
  if (src < tgt) list.insertBefore(dragging, target.nextSibling);
  else list.insertBefore(dragging, target);
}

// Update the todos array based on new order
function dropItem(e) {
  e.preventDefault();
  const ids = Array.from(todoList.children).map(li => li.dataset.id); // Get new order of IDs
  todos.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
  saveTodos();
}

function dragEnd(e) {
  e.currentTarget.classList.remove("dragging"); // Remove dragging class
}

// --- Local Storage ---
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos)); // Save to localStorage
}

render(); // Initial render