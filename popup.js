const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const resetButton = document.getElementById("reset");
const durationInput = document.getElementById("duration");
const timerDisplay = document.getElementById("timer");
let countdownInterval;

function updateDisplay(time) {
  let minutes = Math.floor(time / 1000 / 60);
  let seconds = Math.floor(time / 1000) % 60;
  timerDisplay.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function startCountdown(duration) {
  let endTime = Date.now() + duration * 1000;
  countdownInterval = setInterval(() => {
    let remainingTime = endTime - Date.now();
    if (remainingTime < 1000) {
      clearInterval(countdownInterval);
      timerDisplay.textContent = "00:00";
      durationInput.disabled = false;
      startButton.disabled = false;
      startButton.style.backgroundColor = ""; // Reset button color
      stopButton.disabled = true;
    } else {
      updateDisplay(remainingTime);
    }
  }, 1000);
}

startButton.onclick = () => {
  let duration = parseInt(durationInput.value) * 60;
  if (!isNaN(duration) && duration > 0) {
    chrome.runtime.sendMessage({ command: "start", duration: duration });
    startCountdown(duration);
    durationInput.disabled = true; // Disable input to prevent changes while running
    startButton.disabled = true; // Disable start button
    startButton.style.backgroundColor = "gray"; // Change start button color
    stopButton.disabled = false; // Enable stop button
  } else {
    alert("Please enter a valid number of minutes.");
  }
};

stopButton.onclick = () => {
  chrome.runtime.sendMessage({ command: "stop" });
  clearInterval(countdownInterval);
  durationInput.disabled = false;
  startButton.disabled = false; // Enable start button
  startButton.style.backgroundColor = ""; // Reset button color
  stopButton.disabled = true; // Disable stop button
};

resetButton.onclick = () => {
  chrome.runtime.sendMessage({ command: "reset" });
  clearInterval(countdownInterval);
  timerDisplay.textContent = "25:00";
  durationInput.value = 25;
  durationInput.disabled = false;
  startButton.disabled = false; // Enable start button
  startButton.style.backgroundColor = ""; // Reset button color
  stopButton.disabled = true; // Disable stop button
};

// When popup opens, request the current time from the background
chrome.runtime.sendMessage({ command: "requestTime" }, (response) => {
  if (response && response.endTime) {
    let remainingTime = response.endTime - Date.now();
    if (remainingTime > 0) {
      startCountdown(remainingTime / 1000);
      durationInput.disabled = true;
      startButton.disabled = true; // Disable start button
      startButton.style.backgroundColor = "gray"; // Change start button color
      stopButton.disabled = false; // Enable stop button
    }
  } else {
    stopButton.disabled = true; // Disable stop button if no timer is running
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === "playSound") {
    let audio = new Audio(chrome.runtime.getURL("alarm.wav"));
    audio.play();
  }
});

durationInput.oninput = () => {
  if (durationInput.value < 1) {
    durationInput.value = 1;
  }
};