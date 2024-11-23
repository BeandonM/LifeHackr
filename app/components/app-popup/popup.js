let interval; // Interval for polling the background
const timerDisplay = document.getElementById("timer");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");

// Format time in MM:SS format
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

// Update the timer display
function updateDisplay(timeLeft) {
    timerDisplay.textContent = formatTime(timeLeft);
}

// Fetch time left immediately from the background script
function fetchTimeImmediately() {
    chrome.runtime.sendMessage({ action: "getTimeLeft" }, (response) => {
        if (response) {
            updateDisplay(response.timeLeft);
            if (response.isRunning) {
                startPolling(); // Start polling if the timer is running
            }
        }
    });
}

// Start polling for updates from the background script
function startPolling() {
    if (interval) return; // Prevent multiple intervals

    interval = setInterval(() => {
        chrome.runtime.sendMessage({ action: "getTimeLeft" }, (response) => {
            if (response) {
                updateDisplay(response.timeLeft);
                if (!response.isRunning) {
                    clearInterval(interval);
                    interval = null; // Stop polling if the timer stops
                }
            }
        });
    }, 1000); // Poll every second
}

// Start the timer
function startTimer() {
    chrome.runtime.sendMessage(
        { action: "startTimer", duration: 0.25 * 60 }, // Start a 25-minute timer
        (response) => {
            if (response.status === "Timer started") {
                fetchTimeImmediately(); // Update the display immediately
            }
        }
    );
}

// Stop the timer
function stopTimer() {
    chrome.runtime.sendMessage({ action: "stopTimer" }, (response) => {
        if (response.status === "Timer stopped") {
            clearInterval(interval);
            interval = null;
            updateDisplay(0.25 * 60); // Reset to 25:00
        }
    });
}

// Initialize the popup
function initializePopup() {
    fetchTimeImmediately(); // Fetch the time immediately when the popup opens
}

// Event listeners
startButton.addEventListener("click", startTimer);
stopButton.addEventListener("click", stopTimer);

// Initialize when the popup is loaded
initializePopup();
