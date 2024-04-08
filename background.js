// let countdown;
// let duration;

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.command === "start") {
//     startTimer(message.duration);
//   } else if (message.command === "stop") {
//     stopTimer();
//   } else if (message.command === "reset") {
//     resetTimer();
//   }
// });

// function startTimer(duration) {
//   clearInterval(countdown);
//   let endTime = Date.now() + duration * 1000;
//   countdown = setInterval(() => {
//     let remainingTime = endTime - Date.now();
//     if (remainingTime < 1000) {
//       clearInterval(countdown);
//       chrome.action.setBadgeText({ text: "" });
//       showNotification();
//       resetTimer();
//     } else {
//       let minutes = Math.floor(remainingTime / 1000 / 60);
//       let seconds = Math.floor(remainingTime / 1000) % 60;
//       let displayTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
//       chrome.action.setBadgeText({ text: displayTime });
//     }
//   }, 1000);
// }

// function stopTimer() {
//   clearInterval(countdown);
//   chrome.action.setBadgeText({ text: "" });
// }

// function resetTimer() {
//   clearInterval(countdown);
//   chrome.action.setBadgeText({ text: "25:00" }); // Reset to default or last set time
// }

// function showNotification() {
//   chrome.notifications.create("", {
//     title: "Pomodoro Timer",
//     message: "Time is up!",
//     iconUrl: "timer.png",
//     type: "basic",
//   });
// }

let countdown;
let endTime;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.command) {
    case "start":
      startTimer(message.duration);
      break;
    case "stop":
      stopTimer();
      break;
    case "reset":
      resetTimer();
      break;
    case "requestTime":
      sendResponse({ endTime });
      break;
  }
});

function startTimer(duration) {
  clearInterval(countdown);
  endTime = Date.now() + duration * 1000;
  updateTimer();
}

function stopTimer() {
  clearInterval(countdown);
  chrome.action.setBadgeText({ text: "" });
}

function resetTimer() {
  clearInterval(countdown);
  chrome.action.setBadgeText({ text: "25:00" });
  endTime = null;
}

function updateTimer() {
  countdown = setInterval(() => {
    if (!endTime) {
      clearInterval(countdown);
      return;
    }

    let remainingTime = endTime - Date.now();
    if (remainingTime < 1000) {
      clearInterval(countdown);
      chrome.action.setBadgeText({ text: "" });
      showNotification();
      endTime = null;
    } else {
      let minutes = Math.floor(remainingTime / 1000 / 60);
      let seconds = Math.floor(remainingTime / 1000) % 60;
      let displayTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
      chrome.action.setBadgeText({ text: displayTime });
    }
  }, 1000);
}

function showNotification() {
  chrome.notifications.create("", {
    title: "Pomodoro Timer",
    message: "Time is up!",
    iconUrl: "timer.png",
    type: "basic",
  });
}
