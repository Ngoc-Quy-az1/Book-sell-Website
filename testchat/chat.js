let stompClient = null;
let currentGroupId = null;
const userId = 14; // Hardcoded user ID for testing
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;

// Auto connect when page loads
window.onload = function() {
    connect();
};

function connect() {
    if (reconnectAttempts >= maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        alert('Unable to connect to chat server. Please refresh the page to try again.');
        return;
    }

    const socket = new SockJS('http://localhost:8090/ws');
    stompClient = Stomp.over(socket);
    
    // Disable debug logging
    stompClient.debug = null;

    const connectHeaders = {
        'heart-beat': '10000,10000'
    };

    stompClient.connect(connectHeaders, onConnected, onError);
}

function onConnected(frame) {
    console.log('Connected: ' + frame);
    reconnectAttempts = 0; // Reset reconnect attempts on successful connection
    
    // Subscribe to private messages
    stompClient.subscribe('/user/queue/messages', function(message) {
        try {
            const chatMessage = JSON.parse(message.body);
            displayPrivateMessage(chatMessage);
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    // Load chat history with admin
    loadAdminChatHistory();
}

function onError(error) {
    console.error('STOMP error:', error);
    reconnectAttempts++;
    
    // Exponential backoff for reconnection
    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 10000);
    console.log(`Attempting to reconnect in ${delay/1000} seconds...`);
    
    setTimeout(connect, delay);
}

async function loadAdminChatHistory() {
    try {
        const response = await fetch('http://localhost:8090/api/chat/admin/history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                userId: userId
            })
        });
        
        if (response.ok) {
            const messages = await response.json();
            const container = document.getElementById('private-messages');
            container.innerHTML = ''; // Clear existing messages
            messages.forEach(msg => {
                displayPrivateMessage({
                    sender: msg.sender.name || msg.sender.email || 'User',
                    content: msg.message,
                    timestamp: msg.createdAt
                });
            });
        } else {
            throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error loading chat history:', error);
        const container = document.getElementById('private-messages');
        container.innerHTML = '<div class="message error">Failed to load chat history. Please try again later.</div>';
    }
}

async function sendPrivateMessage() {
    const messageContent = document.getElementById('private-message').value;
    if (!messageContent) {
        alert('Please enter a message');
        return;
    }

    try {
        const response = await fetch('http://localhost:8090/api/chat/admin/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                senderId: userId,
                message: messageContent
            })
        });

        if (response.ok) {
            const result = await response.json();
            displayPrivateMessage({
                sender: 'You',
                content: messageContent,
                timestamp: result.createdAt
            });
            document.getElementById('private-message').value = '';
        }
    } catch (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message');
    }
}

async function joinGroup() {
    const groupId = document.getElementById('group-id').value;
    if (!groupId) {
        alert('Please enter a group ID');
        return;
    }

    currentGroupId = parseInt(groupId);
    
    // Subscribe to group messages
    stompClient.subscribe('/topic/group.' + groupId, function(message) {
        const chatMessage = JSON.parse(message.body);
        displayGroupMessage(chatMessage);
    });

    // Load group chat history
    try {
        const response = await fetch('http://localhost:8090/api/chat/community/history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                groupId: currentGroupId
            })
        });
        
        if (response.ok) {
            const messages = await response.json();
            const container = document.getElementById('group-messages');
            container.innerHTML = ''; // Clear existing messages
            messages.forEach(msg => {
                displayGroupMessage({
                    sender: msg.sender.email || 'User',
                    content: msg.message,
                    timestamp: msg.createdAt
                });
            });
        }
    } catch (error) {
        console.error('Error loading group history:', error);
    }
}

async function sendGroupMessage() {
    if (!currentGroupId) {
        alert('Please join a group first');
        return;
    }

    const messageContent = document.getElementById('group-message').value;
    if (!messageContent) {
        alert('Please enter a message');
        return;
    }

    try {
        const response = await fetch('http://localhost:8090/api/chat/community/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                senderId: userId,
                groupId: currentGroupId,
                message: messageContent
            })
        });

        if (response.ok) {
            const result = await response.json();
            displayGroupMessage({
                sender: 'You',
                content: messageContent,
                timestamp: result.createdAt
            });
            document.getElementById('group-message').value = '';
        }
    } catch (error) {
        console.error('Error sending group message:', error);
        alert('Failed to send message');
    }
}

function displayPrivateMessage(message) {
    const messageContainer = document.getElementById('private-messages');
    const messageElement = createMessageElement(message);
    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

function displayGroupMessage(message) {
    const messageContainer = document.getElementById('group-messages');
    const messageElement = createMessageElement(message);
    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

function createMessageElement(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    
    const time = new Date(message.timestamp).toLocaleTimeString();
    
    messageDiv.innerHTML = `
        <span class="sender">${message.sender}</span>
        <span class="time">${time}</span><br>
        <span class="content">${message.content}</span>
    `;
    
    return messageDiv;
}

// Clean up on window close
window.onbeforeunload = function() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
}; 