// script.js

const monthsContainer = document.getElementById('monthsContainer');
const taskStats = document.getElementById('taskStats');
const toggleDarkMode = document.getElementById('toggleDarkMode');
const searchInput = document.getElementById('searchTask'); // Input pencarian
const searchButton = document.getElementById('searchButton'); // Tombol pencarian

// Array of month names
const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

// Object to hold tasks for each month
let tasks = {};

// Load tasks from Local Storage
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        for (const month of monthNames) {
            if (tasks[month]) {
                renderTasks(month);
            }
        }
        updateStats();
    }
}

// Save tasks to Local Storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Create month cards
monthNames.forEach((month) => {
    const monthCard = document.createElement('div');
    monthCard.classList.add('month-card');
    
    const monthTitle = document.createElement('div');
    monthTitle.classList.add('month-title');
    monthTitle.innerText = month;

    const taskInput = document.createElement('div');
    taskInput.classList.add('task-input');

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.placeholder = 'Tugas...';

    const addButton = document.createElement('button');
    addButton.innerText = 'Tambah';
    
    // Task list
    const taskList = document.createElement('ul');
    taskList.classList.add('task-list');

    // Function to add task on button click
    addButton.onclick = () => {
        const taskText = inputField.value.trim();
        if (taskText) {
            addTask(month, taskText);
            inputField.value = '';
            updateStats();
        }
    };

    taskInput.appendChild(inputField);
    taskInput.appendChild(addButton);
    monthCard.appendChild(monthTitle);
    monthCard.appendChild(taskInput);
    monthCard.appendChild(taskList);
    monthsContainer.appendChild(monthCard);
});

// Function to add task to a month
function addTask(month, taskText) {
    if (!tasks[month]) {
        tasks[month] = [];
    }
    tasks[month].push({ text: taskText, done: false });
    saveTasks(); // Save to Local Storage
    renderTasks(month);
}

// Function to render tasks for a month
function renderTasks(month, searchText = '') {
    const monthCard = Array.from(monthsContainer.children).find(card => card.querySelector('.month-title').innerText === month);
    const taskList = monthCard.querySelector('.task-list');
    taskList.innerHTML = '';

    tasks[month].forEach((task, index) => {
        // Jika ada teks pencarian, hanya tampilkan tugas yang cocok
        if (task.text.toLowerCase().includes(searchText.toLowerCase())) {
            const taskItem = document.createElement('li');
            taskItem.classList.add('task-item');
            if (task.done) taskItem.classList.add('done');

            taskItem.innerHTML = `
                <span>${task.text}</span>
                <div>
                    <button onclick="toggleTask('${month}', ${index})">✓</button>
                    <button onclick="deleteTask('${month}', ${index})">✕</button>
                </div>
            `;
            taskList.appendChild(taskItem);
        }
    });
}

// Function to toggle task done status
function toggleTask(month, index) {
    tasks[month][index].done = !tasks[month][index].done;
    saveTasks(); // Save to Local Storage
    renderTasks(month);
    updateStats();
}

// Function to delete a task
function deleteTask(month, index) {
    tasks[month].splice(index, 1);
    if (tasks[month].length === 0) {
        delete tasks[month]; // Remove month if no tasks are left
    }
    saveTasks(); // Save to Local Storage
    renderTasks(month);
    updateStats();
}

// Function to update statistics
function updateStats() {
    const totalTasks = Object.values(tasks).flat().length;
    const completedTasks = Object.values(tasks).flat().filter(task => task.done).length;
    taskStats.innerText = `Total Tugas: ${totalTasks} | Tugas Selesai: ${completedTasks}`;
}

// Dark Mode Toggle
toggleDarkMode.onclick = () => {
    document.body.classList.toggle('dark-mode');
};

// Function for searching tasks
searchButton.onclick = () => {
    const searchText = searchInput.value.trim();
    for (const month of monthNames) {
        renderTasks(month, searchText);
    }
};

loadTasks();
