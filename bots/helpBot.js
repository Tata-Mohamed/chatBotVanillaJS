import Message from "./message";
import { appendMessage } from '../main.js';
import { addMessageToLocalStorage } from "../localStorage.js";

class HelpBot {
    constructor(name, avatar) {
        this.name = name;
        this.avatar = avatar;
    }

    async respondTo(message) {
        if (message.content.toLowerCase().includes('help')) {

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
                             `
            const message = new Message(this.name, this.avatar, botMessage, new Date());

            appendMessage(message);
            addMessageToLocalStorage(message);
        } else {
            const message = new Message(this.name, this.avatar, "Veuillez entrer la commande 'help' pour plus d'informations.", new Date());

            appendMessage(message);
            addMessageToLocalStorage(message);
        }
    }
}

export default HelpBot;
