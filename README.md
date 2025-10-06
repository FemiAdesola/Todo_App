# TODO App with (Vanilla JavaScript)

> This is a fully functional, browser-based TODO application built **entirely with native JavaScript**, and **no libraries**. The app is styled with external CSS and includes robust task management features.

View the website link [here](https://todo-app-femi.netlify.app)
---

## 🌟 Features

- ✅ Add tasks with **start** and **due** dates
  
- 📝 **Edit** tasks inline (double-click to edit)  
- 🗑️ **Delete** tasks with **Undo** option  
- ☑️ **Mark as completed** (strikes and fades the task)  
- 🔃 **Drag-and-drop** reordering of tasks  
- 📂 Filter tasks (**All / Active / Completed**)  
- 💾 Data persistence using **LocalStorage**  
- 🔍 Validation for blank or too-short inputs  
- 🎨 External CSS and JS files  
- 🕓 Task labels for Task / Date / Delete columns  
- 🧩 Addition feature of **Hide/Show** list button  

---

## 🗂️ Project Structure

```
📁 TODO_APP/
├── img/
│   ├── drag_drop.png
│   ├── FrontPage.png
│   ├── Functionality.png
│   └── Hide_show.png
├── README.md
├── todo.css
├── index.html
└── todo.js
```
---

## 🧭 Usage Guide

![FrontPage](/img/FrontPage.png)

### ➕ Add
> Type a task name (minimum 3 characters) and select a due date, then click **Add Task.** \
> The app automatically records today’s date as the start date, and the task instantly appears in your list.

### ✏️ Edit
> Double-click any task text to switch it into edit mode. Type the new text and press Enter (or click away) to save the update instantly.

### 🗑️ Delete
> Click the trash 🗑 icon next to any task to remove it from the list. Deleted tasks trigger an Undo option for several seconds.

### ↩️ Undo
> If you accidentally delete a task, click “Undo” in the blue banner to restore it to the top of the list.

### 📅 Start & Due Dates
> Every task displays both a start date (when it was created) and a due date (set by the users). \
> Overdue tasks are highlighted in red color automatically for easy attention.

### 🧹 Clear Completed
> This feature allows users to quickly remove all tasks that have been marked as done from the list. It removes all finished tasks instantly, keeping the list tidy.

### 🔍 Filter Buttons
> All / Active / Completed buttons can be used to control what tasks are visible.\
Active shows only pending tasks; Completed shows only finished ones.
* All: Displays every task.
* Active: Shows only incomplete tasks.
* Completed: Shows only tasks marked as done.

### 💾 LocalStorage Persistence
> All tasks and their states (adding, editing, completing, deleting, or reordering) are stored locally in the browser using LocalStorage.\
Even if user close or reload the tab, the entire list remains intact.

### ✅ Fade + Strike-through when Checked
> When user mark a task as completed, it automatically fades out and displays a strike-through effect, making it easy to distinguish done items from active ones.

![Functionality](/img/Functionality.png)

### 🔃 Drag-and-Drop
> Reorder the tasks simply by dragging and dropping them. \
> The custom order is instantly saved to LocalStorage, so it stays the same even after refreshing.

![drag_drop](/img/drag_drop.png)

### 👁️ Hide/Show List
> The “Hide List / Show List” button can be used to toggle visibility of the entire task list. \
It allows to keep workspace clean and quickly hide the list when it’s not needed. \
Also, Aall data remains saved in LocalStorage, even when hidden.

![hide_show](/img/Hide_show.png)

---
[Femi Adesola Oyinloye](https://github.com/FemiAdesola) © 2025 