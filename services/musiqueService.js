import axios from "axios";
import { appendMessage } from "../main.js";
import Message from "../bots/message";
import { addMessageToLocalStorage } from "../localStorage.js";

export async function handleArtistRequest(message) {
    try {
        const response = await axios.get(`http://musicbrainz.org/ws/2/artist/?query=${encodeURIComponent(message.content)}&fmt=json`);

        if (!response.data.artists || response.data.artists.length === 0) {
            throw new Error('Aucun artiste trouvé.');
        }

        const artistInfo = response.data.artists[0];
        const artistNameResult = artistInfo.name;
        const artistCountry = artistInfo.country;
        const artistBeginDate = artistInfo['life-span'].begin;
        const artistAge = calculateAge(artistBeginDate);
        const artistCity = artistInfo['begin-area'] ? artistInfo['begin-area'].name : 'Non spécifiée';
        const artistStyle = artistInfo.tags ? artistInfo.tags.map(tag => tag.name).join(', ') : 'Non spécifié';


        appendMessage(new Message(message.senderName, message.senderAvatar, `Informations sur l'artiste ${message.content}:\n\nPays: ${artistCountry}\nVille: ${artistCity}\nÂge: ${artistAge}\nStyles: ${artistStyle}`, new Date()));
        addMessageToLocalStorage(new Message(message.senderName, message.senderAvatar, `Informations sur l'artiste ${message.content}:\n\nPays: ${artistCountry}\nVille: ${artistCity}\nÂge: ${artistAge}\nStyles: ${artistStyle}`, new Date()));
    } catch (error) {
        console.error('Erreur lors de la requête vers MusicBrainz API :', error);
        appendMessage(new Message(message.senderName, message.senderAvatar, `ucun artiste trouvé.`, new Date()));
        addMessageToLocalStorage(new Message(message.senderName, message.senderAvatar, `ucun artiste trouvé.`, new Date()));
    }
}

export async function handleAlbumsRequest(message) {
    try {
        const response = await axios.get(`http://musicbrainz.org/ws/2/release/?query=artist:${encodeURIComponent(message.content)}&fmt=json`);

        if (!response.data.releases || response.data.releases.length === 0) {
            throw new Error('Aucun album trouvé pour cet artiste.');
        }

        const albumsSet = new Set();
        response.data.releases.forEach(release => {
            if (release.title && release.title !== '') {
                albumsSet.add(release.title);
            }
        });

        const albumsList = Array.from(albumsSet);

        appendMessage(new Message(message.senderName, message.senderAvatar, `Albums de ${message.content} :\n\n${albumsList.join('\n')}`, new Date()));
        addMessageToLocalStorage(new Message(message.senderName, message.senderAvatar, `Albums de ${message.content} :\n\n${albumsList.join('\n')}`, new Date()));
    } catch (error) {
        console.error('Erreur lors de la requête vers MusicBrainz API :', error);

        appendMessage(new Message(message.senderName, message.senderAvatar, `Désolé, je n'ai pas pu récupérer la liste des albums pour cet artiste.`, new Date()));
        addMessageToLocalStorage(new Message(message.senderName, message.senderAvatar, `Désolé, je n'ai pas pu récupérer la liste des albums pour cet artiste.`, new Date()));
    }
}

export async function handleGroupMembersRequest(message) {
    try {
        const artistResponse = await axios.get(`https://musicbrainz.org/ws/2/artist/?query=${encodeURIComponent(message.content)}&fmt=json`);
        
        if (!artistResponse.data.artists || artistResponse.data.artists.length === 0) {
            throw new Error('Groupe non trouvé.');
        }

        const groupId = artistResponse.data.artists[0].id;

        const groupMembersResponse = await axios.get(`https://musicbrainz.org/ws/2/artist/${groupId}?inc=artist-rels&fmt=json`);

        if (!groupMembersResponse.data.relations || groupMembersResponse.data.relations.length === 0) {
            throw new Error('Aucun membre trouvé pour ce groupe.');
        }

        const members = groupMembersResponse.data.relations
            .filter(relation => relation.type === 'member of band')
            .map(relation => {
                const member = relation.artist;
                const beginDate = relation['begin'];
                const endDate = relation['end'] ? ` à ${relation['end']}` : '';
                return `${member.name} (${beginDate}${endDate})`;
            });

        appendMessage(new Message(message.senderName, message.senderAvatar, `Membres du groupe ${message.content} :\n\n${members.join('\n')}`, new Date()));
        addMessageToLocalStorage(new Message(message.senderName, message.senderAvatar, `Membres du groupe ${message.content} :\n\n${members.join('\n')}`, new Date()));

    } catch (error) {
        console.error('Erreur lors de la requête vers MusicBrainz API :', error.message);

        appendMessage(new Message(message.senderName, message.senderAvatar, `Désolé, je n'ai pas pu récupérer les membres de ce groupe.`, new Date()));
        addMessageToLocalStorage(new Message(message.senderName, message.senderAvatar, `Désolé, je n'ai pas pu récupérer les membres de ce groupe.`, new Date()));     
    }
}


function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}