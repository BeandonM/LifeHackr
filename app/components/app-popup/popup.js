
let timerInterval;
let timeLeft = 25 * 60; // 25 minutes in seconds
let isRunning = false;


const timerDisplay = document.getElementById("timer");
const startButton = document.getElementById("startButton");

// Format time in MM:SS format
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

// Update the timer display
function updateDisplay() {
    timerDisplay.textContent = formatTime(timeLeft);
}

function saveState() {
    chrome.storage.local.set({
        timeLeft,
        isRunning
    })
}

function restoreState() {
    chrome.storage.local.get(["timeLeft", "isRunning"], (result) => {
        if (result.timeLeft !== undefined) {
            timeLeft = result.timeLeft;
        }
        if (result.isRunning !== undefined) {
            isRunning = result.isRunning;
        }
        updateDisplay();

        if (isRunning) {
            startTimer();
        }
    });
}
// Start the timer
function startTimer() {
    if (timerInterval) return; // Prevent multiple intervals

    isRunning = true;
    saveState();
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
            saveState();
        } else {
            clearInterval(timerInterval);
            timerInterval = null;
            isRunning = false;
            saveState();

            // Show a notification when the timer ends
            chrome.notifications.create({
                type: "basic",
                iconUrl: "icon.png",
                title: "Pomodoro Timer",
                message: "Time's up! Take a break.",
                priority: 2
            });
        }
    }, 1000); // Update every second
}

// Event listener for the start button
startButton.addEventListener("click", () => {
    if (!isRunning) {
        startTimer();
    }

});

// Initialize the display
updateDisplay();
