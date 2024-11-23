
let timerInterval;
let timeLeft = 0.25 * 60; // 25 minutes in seconds
let isRunning = false;
let interval;


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
        isRunning,
        endTime: isRunning ? Date.now() + timeLeft * 1000 : null,
    })
}

async function restoreState() {
    const result = await chrome.storage.local.get(["isRunning", "endTime"]);

    isRunning = result.isRunning || false;

    if (result.endTime) {
        const currentTime = Date.now();
        const remainingTime = Math.floor((result.endTime - currentTime) / 1000);

        timeLeft = remainingTime > 0 ? remainingTime : 0;
        if (timeLeft === 0) {
            isRunning = false;
        }
    }
    updateDisplay();

    if (isRunning) {
        startTimer();
    }
}
// Start the timer
function startTimer() {

    if (interval) return; // Prevent multiple intervals

    isRunning = true;
    saveState();

    interval = setInterval(() => {
        timeLeft--;

        if (timeLeft <= 0) {
            clearInterval(interval);
            interval = null;
            isRunning = false;

            chrome.notifications.create({
                type: "basic",
                iconUrl: "popup-icon.png",
                title: "Pomodoro Timer",
                message: "Time's up! Take a break.",
                priority: 2
            });
        }

        updateDisplay();
        saveState();
    }, 1000); // Update every second
}

// Event listener for the start button
startButton.addEventListener("click", () => {
    if (!isRunning) {
        timeLeft = 0.25 * 60;
        startTimer();
    }

});


restoreState();