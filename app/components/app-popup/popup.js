
let timerInterval;
let timeLeft = 25 * 60; // 25 minutes in seconds


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

// Start the timer
function startTimer() {
    if (timerInterval) return; // Prevent multiple intervals

    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
        } else {
            clearInterval(timerInterval);
            timerInterval = null;

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
    startTimer();
});

// Initialize the display
updateDisplay();
