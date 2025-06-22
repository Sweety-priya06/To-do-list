// Default light theme
document.body.setAttribute('data-theme', 'light');

const taskForm = document.getElementById('task-form');
const toggleButton = document.getElementById('theme-toggle');
const todayTasks = document.getElementById('today-tasks');
const tomorrowTasks = document.getElementById('tomorrow-tasks');
const upcomingTasks = document.getElementById('upcoming-tasks');
const quoteDisplay = document.getElementById('quote-display');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Theme Toggle
toggleButton.addEventListener('click', () => {
  const currentTheme = document.body.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.body.setAttribute('data-theme', newTheme);
  toggleButton.textContent = newTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
});

// Add Task
taskForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const text = document.getElementById('task-input').value.trim();
  const category = document.getElementById('task-category').value;
  const priority = document.getElementById('task-priority').value;
  const reminder = document.getElementById('reminder-time').value;

  if (!text || !category || !priority || !reminder) return;

  const task = {
    id: Date.now(),
    text,
    category,
    priority,
    reminder,
    completed: false
  };

  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  taskForm.reset();
  renderTasks();
});

// Render Tasks
function renderTasks() {
  todayTasks.innerHTML = '';
  tomorrowTasks.innerHTML = '';
  upcomingTasks.innerHTML = '';

  const now = new Date();
  const today = new Date(now.toDateString());
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  tasks.forEach(task => {
    const taskDate = new Date(task.reminder);
    const listItem = document.createElement('li');

    listItem.innerHTML = `
      <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
      <small>[${task.category}] - ${task.priority} - ${taskDate.toLocaleString()}</small>
      <button class="complete-btn">✅</button>
      <button class="edit-btn">✏️</button>
      <button class="delete-btn">🗑️</button>
    `;

    // Complete
    listItem.querySelector('.complete-btn').addEventListener('click', () => {
      task.completed = !task.completed;
       
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks();
      updateProductivityChart();
      if (task.completed) {
        showCompletionNotification(task.text);
      }
      

    });

    // Edit
    listItem.querySelector('.edit-btn').addEventListener('click', () => {
      const newText = prompt("Edit task:", task.text);
      if (newText) {
        task.text = newText.trim();
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
      }
    });

    // Delete
    listItem.querySelector('.delete-btn').addEventListener('click', () => {
      tasks = tasks.filter(t => t.id !== task.id);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks();
      updateProductivityChart();
    });

    const isToday = isSameDay(taskDate, today);
    const isTomorrow = isSameDay(taskDate, tomorrow);

    if (isToday) {
      todayTasks.appendChild(listItem);
    } else if (isTomorrow) {
      tomorrowTasks.appendChild(listItem);
    } else {
      upcomingTasks.appendChild(listItem);
    }
  });
}

// Helper
function isSameDay(date1, date2) {
  return date1.toDateString() === date2.toDateString();
}

// Notifications
function checkReminders() {
  const now = new Date();
  tasks.forEach(task => {
    const taskTime = new Date(task.reminder);
    if (!task.notified && now >= taskTime && !task.completed) {
      showNotification(task.text);
      task.notified = true;
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  });
}

// Request Permission
document.addEventListener('DOMContentLoaded', () => {
  checkReminders(); // Check immediately on load
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
  renderTasks();
  showRandomQuote();
  updateProductivityChart();
  notesArea.value = localStorage.getItem('notes') || '';
});

function showNotification(taskTitle) {
  if (Notification.permission === "granted") {
    new Notification("🔔 Reminder", {
      body: `Task: "${taskTitle}" is due now!`
    });
  }
}

function showCompletionNotification(taskTitle) {
  if (Notification.permission === "granted") {
    new Notification("🎉 Task Completed", {
      body: `You completed: "${taskTitle}"`,
      icon: "https://cdn-icons-png.flaticon.com/512/2589/2589175.png"
    });
  }
}
const stickyColors = ['#FFFACD', '#E0FFFF', '#FFEBE0', '#E6E6FA', '#D5F5E3', '#FADBD8'];
const board = document.getElementById("sticky-board");
const addStickyBtn = document.getElementById("add-sticky-btn");

addStickyBtn.addEventListener("click", () => {
  const note = createStickyNote();
  board.appendChild(note);
});

function createStickyNote(content = "", isPinned = false) {
  const note = document.createElement("div");
  const color = stickyColors[Math.floor(Math.random() * stickyColors.length)];
  note.className = "sticky-note";
  note.style.backgroundColor = color;
  if (isPinned) note.classList.add("pinned");

  note.innerHTML = `
    <button class="delete-sticky-btn">✖</button>
    <button class="pin-sticky-btn">📌</button>
    <textarea placeholder="Write something...">${content}</textarea>
  `;

  // Delete Note
  note.querySelector(".delete-sticky-btn").addEventListener("click", () => {
    board.removeChild(note);
  });

  // Pin/Unpin Note
  note.querySelector(".pin-sticky-btn").addEventListener("click", () => {
    note.classList.toggle("pinned");
    board.prepend(note); // Move to top
  });

  return note;
}



// Quotes
const quotes = [
  "Don't watch the clock; do what it does. Keep going. — Sam Levenson",
  "Success is the sum of small efforts, repeated day-in and day-out. — Robert Collier",
  "The secret of getting ahead is getting started. — Mark Twain",
  "You don’t have to be great to start, but you have to start to be great. — Zig Ziglar",
  "Focus on being productive instead of busy. — Tim Ferriss"
];

function showRandomQuote() {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  quoteDisplay.textContent = quote;
}

// Chart
let productivityChart;
function updateProductivityChart() {
  const today = new Date().toDateString();
  const todayTasks = tasks.filter(task => isSameDay(new Date(task.reminder), new Date()));
  const completedTasks = todayTasks.filter(task => task.completed).length;
  const totalTasks = todayTasks.length;
  const percentage = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const ctx = document.getElementById('productivityChart').getContext('2d');
  if (productivityChart) {
    productivityChart.data.datasets[0].data = [completedTasks, totalTasks - completedTasks];
    productivityChart.update();
  } else {
    productivityChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'Pending'],
        datasets: [{
          data: [completedTasks, totalTasks - completedTasks],
          backgroundColor: ['#4caf50', '#f44336']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Today's Productivity"
          }
        }
      }
    });
  }
}

// Check reminders every minute
setInterval(checkReminders, 60000);
const notesArea = document.getElementById('notes-area');

// Load saved notes

  
;

// Save notes on input
notesArea.addEventListener('input', () => {
  localStorage.setItem('notes', notesArea.value);
});
document.getElementById('enter-app').addEventListener('click', () => {
  document.getElementById('welcome-screen').style.display = 'none';
});

