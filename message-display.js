function setupWaitNotification() {
    window.waitNotification = setTimeout(() => {
        // TODO? Separate from other messages (don't want this to overwrite them)
        displayMessage('info', 'Connecting to the server, please wait...');
    }, 1000);
}

function cancelWaitNotification() {
    if (window.waitNotification) {
        clearTimeout(window.waitNotification);
        delete window.waitNotification;
    }
}

function displayMessage(msgType, msg) {
    clearMessageDisplay();
    let msgElement = getMessageElement(msgType);
    msgElement.textContent = msg;
    msgElement.style.display = 'inline';
}

function clearMessageDisplay() {
    let messageTypes = ['info', 'warn', 'error'];
    let messageElements = messageTypes.map((msgType) => getMessageElement(msgType));
    messageElements.forEach((msgElement) => {
        msgElement.textContent = '';
        msgElement.style.display = 'none';
    });
}
function getMessageElement(msgType) {
    if (!(msgType === 'info' || msgType === 'warn' || msgType === 'error')) {
        throw new Error(`Invalid message element type '${msgType}' (must be one of 'info', 'warn', 'error')`)
    }

    let elementId = msgType + '_message';
    let msgElement = document.getElementById(elementId);
    if (msgElement == null) {
        throw new Error(`Couldn't find message element ${elementId}!`);
    } else {
        return msgElement;
    }
}

export { setupWaitNotification, cancelWaitNotification, displayMessage, clearMessageDisplay, getMessageElement };
