export function sendMessageToExtension(message) {
    if (window.chrome && chrome.runtime) {
      chrome.runtime.sendMessage(message);
    } else {
      console.error('Chrome runtime is not available.');
    }
  }
  