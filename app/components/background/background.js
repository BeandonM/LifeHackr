chrome.runtime.onInstalled.addListener(() => {
    console.log("Pomodoro Timer extension installed!");
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "pomodoroComplete") {
        chrome.notifications.create({
            type: "basic",
            iconUrl: "icon.png",
            title: "Pomodoro Timer",
            message: "Time's up! Take a break.",
            priority: 2,
        });
    }
});

// Create an alarm for when the timer completes
function createPomodoroAlarm(durationInMinutes) {
    chrome.alarms.create("pomodoroComplete", {
        delayInMinutes: durationInMinutes,
    });
}

chrome.runtime.sendMessage({
    action: "startAlarm",
    duration: timeLeft / 60, // Convert seconds to minutes
});