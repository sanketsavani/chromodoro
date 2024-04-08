const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const resetButton = document.getElementById("reset");
const durationInput = document.getElementById("duration");
const timerDisplay = document.getElementById("timer");

function updateDisplay(time) {
  let minutes = Math.floor(time / 1000 / 60);
  let seconds = Math.floor(time / 1000) % 60;
  timerDisplay.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

startButton.onclick = () => {
  let duration = parseInt(durationInput.value) * 60;
  if (!isNaN(duration) && duration > 0) {
    chrome.runtime.sendMessage({ command: "start", duration: duration });
    durationInput.disabled = true; // Disable input to prevent changes while running
  } else {
    alert("Please enter a valid number of minutes.");
  }
};

stopButton.onclick = () => {
  chrome.runtime.sendMessage({ command: "stop" });
  durationInput.disabled = false;
};

resetButton.onclick = () => {
  chrome.runtime.sendMessage({ command: "reset" });
  timerDisplay.textContent = "25:00";
  durationInput.value = 25;
  durationInput.disabled = false;
};

// When popup opens, request the current time from the background
chrome.runtime.sendMessage({ command: "requestTime" }, (response) => {
  if (response && response.endTime) {
    let remainingTime = response.endTime - Date.now();
    if (remainingTime > 0) {
      updateDisplay(remainingTime);
      durationInput.disabled = true;
    }
  }
});
