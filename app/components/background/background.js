// Default duration for the Pomodoro timer (25 minutes)
const DEFAULT_DURATION = 0.25 * 60; // in seconds

// Handle messages from other parts of the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "startTimer") {
        const durationInMinutes = message.duration / 60; // Convert seconds to minutes
        chrome.alarms.create("pomodoroTimer", { delayInMinutes: durationInMinutes });

        // Save the timer state in storage
        chrome.storage.local.set({
            isRunning: true,
            endTime: Date.now() + message.duration * 1000, // Calculate end time
        });

        sendResponse({ status: "Timer started" });
    } else if (message.action === "stopTimer") {
        chrome.alarms.clear("pomodoroTimer");
        chrome.storage.local.set({ isRunning: false, endTime: null });
        sendResponse({ status: "Timer stopped" });
    }
});

// Listen for the alarm event
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "pomodoroTimer") {
        // Show a notification when the timer ends
        chrome.notifications.create({
            type: "basic",
            iconUrl: "../app-popup/popup-icon.png",
            title: "Pomodoro Timer",
            message: "Time's up! Take a break.",
            priority: 2,
        });

        // Reset the timer state
        chrome.storage.local.set({ isRunning: false, endTime: null });
    }
});

// Handle messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getTimeLeft") {
        // Calculate remaining time based on stored endTime
        chrome.storage.local.get(["isRunning", "endTime"], (result) => {
            if (result.isRunning && result.endTime) {
                const currentTime = Date.now();
                const timeLeft = Math.max(0, Math.floor((result.endTime - currentTime) / 1000));
                sendResponse({ timeLeft, isRunning: result.isRunning });
            } else {
                sendResponse({ timeLeft: 0, isRunning: false });
            }
        });

        return true; // Keep the message channel open for async response
    }
});
