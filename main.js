import WeatherBot from './bots/weatherBot.js';
import MusiqueBot from './bots/botMusique.js';
import HelpBot from './bots/helpBot.js';
import MovieBot from './bots/movieBot.js';
import Message from './bots/message.js';
import { addMessageToLocalStorage, clearLocalStorage, downloadDiscussion } from './localStorage.js';

const weatherBot = new WeatherBot('MétéoBot', './assets/meteo.jpg');
const musiqueBot = new MusiqueBot('MusiqueBot', './assets/bot_musique.PNG');
const helpBot = new HelpBot('HelpBot', './assets/help_bot.jpg');
const movieBot = new MovieBot('MovieBot', './assets/movieBot.jpg');

const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const clearButton = document.getElementById('clear-button');
const botsButton = document.getElementById('bots-button');
const messageContainer = document.getElementById('message-container');

let state = null;

export function appendMessage(message, isUserMessage) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(isUserMessage ? 'sent' : 'received'); 

    const avatarElement = document.createElement('img');
    avatarElement.src = message.senderAvatar;
    avatarElement.alt = message.senderName;
    avatarElement.classList.add('message-avatar');

    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');

    const senderName = document.createElement('div');
    senderName.classList.add('message-sender');
    senderName.innerText = message.senderName;

    const textElement = document.createElement('div');
    textElement.classList.add('text');
    textElement.innerText = message.content;

    const messageTime = document.createElement('div');
    messageTime.classList.add('message-time');
    console.log(message.dateTime);
    messageTime.innerText = message.dateTime.toLocaleString();

    messageContent.appendChild(senderName);
    messageContent.appendChild(textElement);
    messageContent.appendChild(messageTime);

    messageElement.appendChild(avatarElement);
    messageElement.appendChild(messageContent);

    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

function clearMessages() {
    messageContainer.innerHTML = '';
}

function showHelpBotCommands() {
    const botMessage = `Voici quelques commandes que vous pouvez utiliser :\n
                         - "météo [ville]" pour obtenir la météo actuelle d'une ville.\n
                         - "prévision [ville]" pour obtenir les prévisions météo d'une ville.\n
                         - "informations [ville]" pour obtenir les informations météo détaillées d'une ville.\n
                         - "bonjour les bots" pour que tous les bots vous disent bonjour.\n
                         - "artiste [nom de l'artiste]" pour obtenir des informations sur un artiste.\n
                         - "albums [nom de l'artiste]" pour obtenir la liste des albums d'un artiste.\n
                         - "membres [nom du groupe]" pour obtenir la liste des membres d'un groupe.\n
                         - "film [nom du film]" pour obtenir des informations sur un film.\n
                         - "note [nom du film]" pour obtenir la note d'un film.\n
                         - "prochaines sorties" pour obtenir la liste des prochaines sorties de films.\n
                         - "help" pour afficher cette liste de commandes.\n`;

    appendMessage({
        senderName: helpBot.name,
        senderAvatar: helpBot.avatar,
        content: botMessage,
        dateTime: new Date()
    });

    addMessageToLocalStorage({
        senderName: helpBot.name,
        senderAvatar: helpBot.avatar,
        content: botMessage,
        dateTime: new Date()
    });
}

export async function sendMessage() {
    const messageText = messageInput.value.trim();
    if (messageText === '') return;

    const message = new Message('Vous', './assets/bot_bleu.jpg', messageText, new Date());
    appendMessage(message, true);

    addMessageToLocalStorage(message);


    if (messageText.toLowerCase().includes('météo') || messageText.toLowerCase().includes('prévision') || messageText.toLowerCase().includes('informations')) {
        state = 'weatherBot';
        weatherBot.respondTo(message);
    } else if (messageText.toLowerCase().includes('artiste') || messageText.toLowerCase().includes('albums') || messageText.toLowerCase().includes('membres')) {
        state = 'musiqueBot';
        musiqueBot.respondTo(message);
    } else if (messageText.toLowerCase().includes('film') || messageText.toLowerCase().includes('note') || messageText.toLowerCase().includes('prochaines sorties')) {
        state = 'movieBot';
        movieBot.respondTo(message);
    } else if (messageText.toLowerCase() === 'help') {
        state = null;
        showHelpBotCommands();
    } else if (messageText.toLowerCase().includes('bonjour les bots')) {
        greetAllBots();
    } else {
        switch (state) {
            case 'weatherBot':
                weatherBot.respondTo(message);
                break;
            case 'musiqueBot':
                musiqueBot.respondTo(message);
                break;
            case 'movieBot':
                movieBot.respondTo(message);
                break;
            default:
                helpBot.respondTo(message);
        }
    }

    messageInput.value = '';
}

function greetAllBots() {
    const helloMessageWeather = new Message('MétéoBot', './assets/meteo.jpg', 'Bonjour !', new Date());
    appendMessage(helloMessageWeather, true);

    addMessageToLocalStorage(helloMessageWeather);

    const helloMessageMusique = new Message('MusiqueBot', './assets/bot_musique.PNG', 'Bonjour !', new Date());
    appendMessage(helloMessageMusique, true);

    addMessageToLocalStorage(helloMessageMusique);

    const helloMessageMovie = new Message('MovieBot', './assets/movieBot.jpg', 'Bonjour !', new Date());
    appendMessage(helloMessageMovie, true);

    addMessageToLocalStorage(helloMessageMovie);

    const helloMessageHelp = new Message('HelpBot', './assets/help_bot.jpg', 'Bonjour !', new Date());
    appendMessage(helloMessageHelp, true);

    addMessageToLocalStorage(helloMessageHelp);
}

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
clearButton.addEventListener('click', () => {
    clearLocalStorage();
} );

botsButton.addEventListener('click', () => {
        showHelpBotCommands();
    }
);

document.addEventListener('DOMContentLoaded', () => {
    const messages = downloadDiscussion();
    console.log(messages);
    messages.forEach(message => {
        appendMessage(message, message.senderName === 'Vous');
    });
});
