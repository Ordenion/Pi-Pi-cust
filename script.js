
// Функция для переключения видимости элементов
window.onload = function() {
    toggleDisplay('chatbot-container', 'none');  // Скрываем контейнер чатбота при загрузке страницы
}

function toggleDisplay(elementId, displayState) {
    document.getElementById(elementId).style.display = displayState;
}

function showPage(pageId) {
    toggleDisplay('main-content', 'none');
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    toggleDisplay('back-btn', 'flex');
    toggleDisplay('chatbot-btn', 'none');
    toggleDisplay('chatbot-header', 'none');
    toggleDisplay('default-header', 'block');
    toggleDisplay('chatbot-container', 'none');
}

function showMainPage() {
    toggleDisplay('main-content', 'block');
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    toggleDisplay('back-btn', 'none');
    toggleDisplay('chatbot-btn', 'block');
    toggleDisplay('chatbot-header', 'none');
    toggleDisplay('default-header', 'block');
    toggleDisplay('chatbot-container', 'none');
}

function showChatbot() {
    console.log("Opening chatbot...");
    toggleDisplay('main-content', 'none');
    toggleDisplay('service-buttons', 'none');
    toggleDisplay('view-orders-btn', 'none');
    toggleDisplay('default-header', 'none');
    toggleDisplay('chatbot-header', 'flex');
    toggleDisplay('chatbot-container', 'flex');
    toggleDisplay('chatbot-btn', 'none');
    toggleDisplay('back-btn', 'flex');
}

function hideChatbot() {
    console.log("Closing chatbot...");
    toggleDisplay('chatbot-container', 'none');
    toggleDisplay('default-header', 'block');
    toggleDisplay('chatbot-header', 'none');
    toggleDisplay('main-content', 'block');
    toggleDisplay('service-buttons', 'block');
    toggleDisplay('view-orders-btn', 'block');
    toggleDisplay('chatbot-btn', 'flex');
    toggleDisplay('back-btn', 'none');
}

/*----------------CHATBOT PAGE BEHAVIOUR---------------------------------------------*/

// Функция отправки сообщения
function scrollToBottom() {
    const chatBoxContent = document.getElementById('chat-box-content');
    chatBoxContent.scrollTop = chatBoxContent.scrollHeight;
}

function sendMessage() {
    const userInput = document.getElementById('user-input').value.trim();
    if (!userInput) return;

    // Отображение сообщения пользователя
    displayMessage('user', userInput);
    document.getElementById('user-input').value = ''; // Очищаем поле ввода

    const chatBoxContent = document.getElementById('chat-box-content');
    const botMessageContainer = document.createElement('div'); // Создаем контейнер для сообщения бота
    botMessageContainer.className = 'message-container bot';

    // Показываем индикатор набора текста
    const botTypingIndicator = document.createElement('div');
    botTypingIndicator.className = 'typing-indicator';
    botTypingIndicator.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    botMessageContainer.appendChild(botTypingIndicator);
    chatBoxContent.appendChild(botMessageContainer);

    scrollToBottom();

    // Отправляем сообщение боту и получаем ответ
    fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: userInput,
            user_id: 'default_user_id'
        })
    })
    .then(response => response.json())
    .then(data => {
        // Удаляем индикатор перед отображением ответа бота
        botMessageContainer.removeChild(botTypingIndicator);
        const botMessageElement = document.createElement('div'); // Создаем элемент сообщения бота
        botMessageElement.className = 'message bot';
        botMessageElement.textContent = data.response || 'No response from bot';

        const timestampElement = document.createElement('div'); // Создаем элемент временной метки
        timestampElement.className = 'timestamp';
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        timestampElement.textContent = currentTime;

        // Добавляем сообщение и временную метку в контейнер бота
        botMessageContainer.appendChild(botMessageElement);
        botMessageContainer.appendChild(timestampElement);

        scrollToBottom();
    })
    .catch(error => {
        console.error('Error:', error);
        botMessageContainer.removeChild(botTypingIndicator); // Удаляем индикатор в случае ошибки

        const errorElement = document.createElement('div'); // Создаем элемент сообщения об ошибке
        errorElement.className = 'message bot';
        errorElement.textContent = 'Error: ' + error.message;
        botMessageContainer.appendChild(errorElement);

        scrollToBottom();
    });

    scrollToBottom();
}

// Функция отображения сообщения
function displayMessage(sender, message) {
    const chatBoxContent = document.getElementById('chat-box-content');
    const messageContainer = document.createElement('div');
    messageContainer.className = 'message-container ' + sender;

    // Создаем элемент сообщения
    const messageElement = document.createElement('div');
    messageElement.className = 'message ' + sender;
    messageElement.textContent = message;

    // Создаем элемент временной метки
    const timestampElement = document.createElement('div');
    timestampElement.className = 'timestamp';
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    timestampElement.textContent = currentTime;

    // Добавляем сообщение и временную метку в контейнер
    messageContainer.appendChild(messageElement);
    messageContainer.appendChild(timestampElement);
    chatBoxContent.appendChild(messageContainer);

    scrollToBottom();
}

// Добавляем слушатель для отправки сообщения по нажатию Enter
document.getElementById('user-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault(); // Отменяем стандартное поведение (переход на новую строку)
        sendMessage();
    }
});

// Слушатель для динамического изменения высоты поля ввода
document.getElementById('user-input').addEventListener('input', function () {
    this.style.height = 'auto';  // Сбрасываем высоту
    this.style.height = (this.scrollHeight) + 'px';  // Устанавливаем высоту в зависимости от содержимого
});

// Слушатель для активации кнопки отправки
function toggleSendButton() {
    const userInput = document.getElementById('user-input').value.trim();
    const sendButton = document.getElementById('send-btn');
    
    if (userInput.length > 0) {
        sendButton.classList.add('enabled');
        sendButton.disabled = false;
    } else {
        sendButton.classList.remove('enabled');
        sendButton.disabled = true;
    }
}

// Добавляем слушатель для отправки сообщения по нажатию Enter
document.getElementById("user-input").addEventListener("keydown", function(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault(); // Предотвращаем перенос строки
        sendMessage();
    }
});

document.getElementById('user-input').addEventListener('input', function () {
    this.style.height = 'auto';  // Сбрасываем высоту
    this.style.height = (this.scrollHeight) + 'px';  // Устанавливаем высоту в зависимости от содержимого
});












function updateQuantity(button, action) {
    const quantityElement = button.parentElement.querySelector('.quantity');
    let currentQuantity = parseInt(quantityElement.textContent);
    if (action === 'increase') {
        currentQuantity++;
    } else if (action === 'decrease' && currentQuantity > 0) {
        currentQuantity--;
    }
    quantityElement.textContent = currentQuantity;
}

document.querySelectorAll('.plus-btn').forEach(button => {
    button.addEventListener('click', function() {
        updateQuantity(button, 'increase');
    });
});

document.querySelectorAll('.minus-btn').forEach(button => {
    button.addEventListener('click', function() {
        updateQuantity(button, 'decrease');
    });
});

function filterMenu(category) {
    document.querySelectorAll('.filter-button').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelector(`.filter-button[onclick="filterMenu('${category}')"]`).classList.add('active');
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function selectDate(button, date) {
    document.querySelectorAll('.date-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    button.classList.add('selected');
}

function selectTaxiType(button, type) {
    document.querySelectorAll('.date-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    button.classList.add('selected');
}

function updateTimeLabel(value) {
    const timeLabel = document.getElementById('time-label');
    let period = 'AM';
    if (value >= 12) {
        period = 'PM';
        if (value > 12) {
            value -= 12;
        }
    }
    if (value == 0) value = 12;
    timeLabel.textContent = value + ":00 " + period;
}

function submitCleaningRequest() {
    const time = document.getElementById('time-label').textContent;
    alert("Cleaning service requested for " + time);
}