import { handleAlbumsRequest, handleArtistRequest, handleGroupMembersRequest } from '../services/musiqueService.js';
import { appendMessage } from '../main.js';
import Message from './message.js';
import { addMessageToLocalStorage } from '../localStorage.js';

class botMusique {
    constructor(name, avatar) {
        this.name = name;
        this.avatar = avatar;
        this.awaitingArtist = false;
        this.awaitingAlbums = false;
        this.awaitingMembers = false;
    }

    async respondTo(inputData) {
        if (inputData.content.toLowerCase().includes('artiste')) {
            const artistName = inputData.content.replace('artiste', '').trim();
            if (artistName) {
                try {
                    this.awaitingArtist = true;
                    this.awaitingAlbums = false;
                    this.awaitingMembers = false;
                    const message = new Message(this.name, this.avatar, inputData.content, new Date());
                    handleArtistRequest(message)
                } catch (error) {
                    console.error('Erreur lors de la recherche de cet artiste :', error);
                    const message = new Message(this.name, this.avatar, "Désolé, je n'ai pas pu récupérer les informations de cet artiste", new Date());

                    appendMessage(message);

                    addMessageToLocalStorage(message);
                }
            } else {
                const message = new Message(this.name, this.avatar, "Désolé, je n'ai pas compris. Veuillez spécifier un nom d'artiste.", new Date());
                appendMessage(message);

                addMessageToLocalStorage(message);
            }
        } else if (inputData.content.toLowerCase().includes('albums')) {
            const artistName = inputData.content.replace('albums', '').trim();
            if (artistName) {
                console.log(inputData.content);
                try {
                    this.awaitingArtist = false;
                    this.awaitingAlbums = true;
                    this.awaitingMembers = false;
                    const message = new Message(this.name, this.avatar, inputData.content, new Date());
                    handleAlbumsRequest(message);
                } catch (error) {
                    console.error('Erreur lors de la recherche des albums :', error);
                    const message = new Message(this.name, this.avatar, "Désolé, je n'ai pas pu récupérer les albums de cet artiste", new Date());

                    appendMessage(message);

                    addMessageToLocalStorage(message);
                }
            } else {
                const message = new Message(this.name, this.avatar, "Désolé, je n'ai pas compris. Veuillez spécifier un nom d'artiste.", new Date());
                appendMessage(message);

                addMessageToLocalStorage(message);
            }
        } else if (inputData.content.toLowerCase().includes('membres')) {
            const groupName = inputData.content.replace('membres', '').trim();
            if (groupName) {
                try {
                    this.awaitingArtist = false;
                    this.awaitingAlbums = false;
                    this.awaitingMembers = true;
                    const message = new Message(this.name, this.avatar, inputData.content, new Date());
                    handleGroupMembersRequest(message);
                } catch (error) {
                    console.error('Erreur lors de la recherche des membres :', error);
                    const message = new Message(this.name, this.avatar, "Désolé, je n'ai pas pu récupérer les membres de ce groupe.", new Date());
                    handleGroupMembersRequest(message);
                }
            } else {
                const message = new Message(this.name, this.avatar, "Désolé, je n'ai pas pu récupérer les membres de ce groupe.", new Date());
                handleGroupMembersRequest(message);
            }
        } else {
            // const artistName = inputData.trim();
            // if (awaitingArtist) {
            //     try {
            //         const message = new Message(this.name, this.avatar, inputData, new Date());
            //         handleArtistRequest(message);
            //     } catch (error) {
            //         console.error('Erreur lors de la recherche de l\'artiste :', error);
            //         const message = new Message(this.name, this.avatar, 'Erreur lors de la recherche de l\'artiste :', error, new Date());
            //         handleArtistRequest(message);
            //     }
            // } else {
            //     return respondTo(inputData);
            // }
        }
    }
}

export default botMusique;