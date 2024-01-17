function sendMessage() {
    var userInput = document.getElementById('userMessage').value;
    var selectedOption = document.getElementById('options').value;
    if (userInput.trim() === '' && selectedOption === '') return;

    var messagesContainer = document.getElementById('messages');

    // Display user message
    var userMessageContainer = document.createElement('div');
    userMessageContainer.className = 'message-container';
    var userMessage = document.createElement('div');
    userMessage.className = 'message userMessage';
    userMessage.textContent = userInput;
    userMessageContainer.appendChild(userMessage);
    messagesContainer.appendChild(userMessageContainer);

    // Display predefined solution if an option is selected
    if (selectedOption !== '') {
        var botMessageContainer = document.createElement('div');
        botMessageContainer.className = 'message-container';
        var botMessage = document.createElement('div');
        botMessage.className = 'message botMessage';
        botMessage.textContent = getPredefinedSolution(selectedOption);
        botMessageContainer.appendChild(botMessage);
        messagesContainer.appendChild(botMessageContainer);
    }

    // Clear user input
    document.getElementById('userMessage').value = '';

    // Scroll to the bottom of the chat window
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function getPredefinedSolution(option) {
    // Replace with actual predefined responses based on the selected option
    switch (option) {
        case 'submitFeedback':
        return "To submit feedback, visit our online portal or use the mobile app.";

case 'viewFeedback':
return "To view feedback, log in to the online portal and navigate to the 'View Feedback' section.";

case 'appUsage':
return "To use the app, download it from the app store, install, and follow the on-screen instructions.";

default:
return "I'm sorry, I didn't understand that. How can I assist you?";
}
}