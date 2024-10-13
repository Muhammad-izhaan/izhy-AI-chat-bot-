document.addEventListener("DOMContentLoaded", function() {
    const sendButton = document.getElementById("send-button");
    const userInput = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");

    // Automatically send a welcome message on page load
    appendMessage("Chatbot", "Hey there! How can I help you today?");

    // Add a click event listener to the send button
    sendButton.addEventListener("click", function() {
        const message = userInput.value.trim();
        if (message) {
            appendMessage("User", message);  // Display the user message in the chat
            sendMessageToServer(message);    // Send the message to the backend
            userInput.value = "";            // Clear the input field
        }
    });

    // Add "Enter" key listener to the input box for sending messages
    userInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            sendButton.click();  // Simulate click on pressing Enter
        }
    });

    function appendMessage(sender, message) {
        const messageElement = document.createElement("p");
        messageElement.classList.add("message");
        messageElement.textContent = `${sender}: ${message}`;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;  // Scroll to bottom on new message
    }

    function sendMessageToServer(message) {
        fetch("/get_response", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: message })
        })
        .then(response => response.json())
        .then(data => {
            appendMessage("Chatbot", data.response);  // Display the chatbot's response
        })
        .catch(error => {
            console.error("Error:", error);
        });
    }
});
