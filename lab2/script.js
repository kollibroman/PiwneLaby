const predefinedLists = [
  { id: "list-1", name: "Mało pilne", collapsed: false, tasks: [] },
  { id: "list-2", name: "Pilne", collapsed: false, tasks: [] },
  { id: "list-3", name: "Na wczoraj", collapsed: false, tasks: [] }
];

const appState = {
  lists: predefinedLists,
  trash: null,
  searchQuery: "",
  caseSensitive: false,
  selectedListId: predefinedLists[0].id
};

let pendingDeleteTaskId = null;

const filterTasks = (tasks, query, caseSensitive) => {
  if (query === "") {
    return tasks;
  }
  if (caseSensitive) {
    return tasks.filter((task) => task.text.includes(query));
  }
  const lowerQuery = query.toLowerCase();
  return tasks.filter((task) => task.text.toLowerCase().includes(lowerQuery));
};


function handleAddTask() {
  const input = document.getElementById("task-input");
  const trimmedText = input.value.trim();

  if (trimmedText === "") {
    return;
  }

  const selectedList = appState.lists.find(
    (list) => list.id === appState.selectedListId
  );

  if (!selectedList) {
    return;
  }

  const newTask = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    text: trimmedText,
    done: false,
    doneDate: null,
    listId: appState.selectedListId
  };

  selectedList.tasks.push(newTask);
  input.value = "";
  renderLists();
}

function handleToggleDone(taskId) {
  for (const list of appState.lists) {
    const task = list.tasks.find((t) => t.id === taskId);
    if (task) {
      task.done = !task.done;
      task.doneDate = task.done ? new Date().toISOString() : null;
      renderLists();
      return;
    }
  }
}


function renderModal(taskText) {
  const overlay = document.getElementById("modal-overlay");
  const modalText = document.getElementById("modal-text");
  modalText.textContent = "Czy na pewno chcesz usunąć zadanie o treści: " + taskText;
  overlay.style.display = "flex";
}


function handleDeleteClick(taskId) {
  for (const list of appState.lists) {
    const task = list.tasks.find((t) => t.id === taskId);
    if (task) {
      pendingDeleteTaskId = taskId;
      renderModal(task.text);
      return;
    }
  }
}


function handleConfirmDelete() {
  if (pendingDeleteTaskId === null) {
    return;
  }

  for (const list of appState.lists) {
    const taskIndex = list.tasks.findIndex((t) => t.id === pendingDeleteTaskId);
    if (taskIndex !== -1) {
      const removedTask = list.tasks.splice(taskIndex, 1)[0];
      appState.trash = removedTask;
      break;
    }
  }

  pendingDeleteTaskId = null;

  const overlay = document.getElementById("modal-overlay");
  overlay.style.display = "none";

  renderLists();
  updateTrashButton();
}


function handleCancelDelete() {
  pendingDeleteTaskId = null;
  const overlay = document.getElementById("modal-overlay");
  overlay.style.display = "none";
}

function handleUndo() {
  if (appState.trash === null) {
    return;
  }

  const task = appState.trash;
  const originalList = appState.lists.find((list) => list.id === task.listId);

  if (originalList) {
    originalList.tasks.push(task);
  } else {
    const fallbackList = appState.lists[0];
    task.listId = fallbackList.id;
    fallbackList.tasks.push(task);
  }

  appState.trash = null;
  renderLists();
  updateTrashButton();
}

function handleAddList() {
  const input = document.getElementById("new-list-input");
  const trimmedName = input.value.trim();

  if (trimmedName === "") {
    return;
  }

  const newList = {
    id: "list-" + Date.now().toString(),
    name: trimmedName,
    collapsed: false,
    tasks: []
  };

  appState.lists.push(newList);
  input.value = "";
  renderLists();
}

function handleToggleList(listId) {
  const list = appState.lists.find((l) => l.id === listId);
  if (list) {
    list.collapsed = !list.collapsed;
    renderLists();
  }
}

function handleSearchInput() {
  const input = document.getElementById("search-input");
  appState.searchQuery = input.value;
  renderLists();
}

function handleCaseToggle() {
  const checkbox = document.getElementById("case-sensitive-checkbox");
  appState.caseSensitive = checkbox.checked;
  renderLists();
}

function renderTasks(list) {
  const fragment = document.createDocumentFragment();
  const filtered = filterTasks(list.tasks, appState.searchQuery, appState.caseSensitive);

  for (const task of filtered) {
    const taskDiv = document.createElement("div");
    taskDiv.className = "task-item";
    if (task.done === true) {
      taskDiv.classList.add("done");
    }

    const textSpan = document.createElement("span");
    textSpan.textContent = task.text;
    textSpan.addEventListener("click", () => handleToggleDone(task.id));
    taskDiv.appendChild(textSpan);

    if (task.done === true && task.doneDate) {
      const dateSpan = document.createElement("span");
      dateSpan.className = "done-date";
      dateSpan.textContent = new Date(task.doneDate).toLocaleString("pl-PL");
      taskDiv.appendChild(dateSpan);
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "X";
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      handleDeleteClick(task.id);
    });
    taskDiv.appendChild(deleteBtn);

    fragment.appendChild(taskDiv);
  }

  return fragment;
}

function renderLists() {
  const container = document.getElementById("lists-container");
  container.innerHTML = "";

  const listSelect = document.getElementById("list-select");
  listSelect.innerHTML = "";

  for (const list of appState.lists) {
    const option = document.createElement("option");
    option.value = list.id;
    option.textContent = list.name;
    listSelect.appendChild(option);
  }
  listSelect.value = appState.selectedListId;

  for (const list of appState.lists) {
    const taskListDiv = document.createElement("div");
    taskListDiv.className = "task-list";

    const headerDiv = document.createElement("div");
    headerDiv.className = "list-header";
    if (list.collapsed === true) {
      headerDiv.classList.add("collapsed");
    }

    const arrow = document.createElement("span");
    arrow.className = "arrow";
    arrow.textContent = list.collapsed === true ? "▶" : "▼";
    headerDiv.appendChild(arrow);

    const nameSpan = document.createElement("span");
    nameSpan.textContent = list.name;
    headerDiv.appendChild(nameSpan);
    headerDiv.addEventListener("click", () => handleToggleList(list.id));
    taskListDiv.appendChild(headerDiv);

    if (list.collapsed !== true) {
      const tasksFragment = renderTasks(list);
      taskListDiv.appendChild(tasksFragment);
    }

    container.appendChild(taskListDiv);
  }
}

function updateTrashButton() {
  const undoBtn = document.getElementById("undo-btn");
  if (appState.trash === null) {
    undoBtn.disabled = true;
  } else {
    undoBtn.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const addTaskBtn = document.getElementById("add-task-btn");
  addTaskBtn.addEventListener("click", handleAddTask);

  const addListBtn = document.getElementById("add-list-btn");
  addListBtn.addEventListener("click", handleAddList);

  const undoBtn = document.getElementById("undo-btn");
  undoBtn.addEventListener("click", handleUndo);

  const modalConfirmBtn = document.getElementById("modal-confirm-btn");
  modalConfirmBtn.addEventListener("click", handleConfirmDelete);

  const modalCancelBtn = document.getElementById("modal-cancel-btn");
  modalCancelBtn.addEventListener("click", handleCancelDelete);

  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", handleSearchInput);

  const caseSensitiveCheckbox = document.getElementById("case-sensitive-checkbox");
  caseSensitiveCheckbox.addEventListener("change", handleCaseToggle);

  const listSelect = document.getElementById("list-select");
  listSelect.addEventListener("change", () => {
    appState.selectedListId = listSelect.value;
  });

  renderLists();
  updateTrashButton();
});
