function connect() {
    const messagesElement = document.getElementById('messages');

    const socket = new WebSocket('ws://localhost:8765');

    socket.onopen = () => {
        console.log('Connected to server!');
    };

    socket.onmessage = (event) => {
        const message = event.data;
        // Check if it's a Blob object
        if (message instanceof Blob) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const messageText = e.target.result
                if (messageText.length === 0) {
                    return
                }
                const messageEl = document.createElement('li');
                messageEl.classList.add('message');
                messageEl.textContent = messageText;
                messagesUl.appendChild(messageEl);

                messageInput.value = '';
            };
            reader.readAsText(message, 'UTF-8');
        }


    };

    socket.onerror = (error) => {
        console.error(error);
    };

    socket.onclose = () => {
        console.log('Disconnected from server.');
        setTimeout(function () {
            connect();
        }, 1000);
    };

    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const messagesUl = document.querySelector('.messages');

    const sendMessage = () => {
        const messageText = messageInput.value.trim();

        if (messageText.length > 0) {
            socket.send(messageText);

        }
    }

    sendBtn.addEventListener('click', function () {
        sendMessage()
    });

    messageInput.addEventListener('keypress', function (event) {
        if (event.code === 'Enter') {
            sendMessage()
        }
    });

}


connect()
