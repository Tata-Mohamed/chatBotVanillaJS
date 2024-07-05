import axios from "axios";
import { appendMessage } from "../main";
import Message from "../bots/message";
import { addMessageToLocalStorage } from "../localStorage";

const apiKey = 'f020b1ef5c5c53d023daf73dc4add93e';
const baseUrl = 'https://api.themoviedb.org/3';

export async function getMovieRating(message) {
    console.log('getMovieRating', message.content);
    try {
        const response = await axios.get(`${baseUrl}/search/movie`, {
            params: {
                api_key: apiKey,
                query: message.content,
                language: 'fr-FR'
            }
        });

        if (!response.data.results || response.data.results.length === 0) {
            throw new Error('Film non trouvé.');
        }

        const movie = response.data.results[0];
        const movieTitleResult = movie.title;
        const movieVoteAverage = movie.vote_average;
        const movieVoteCount = movie.vote_count;
        
        appendMessage(new Message(message.senderName, message.senderAvatar, `Informations sur le film ${message.content} :\n\nNote moyenne: ${movieVoteAverage}/10\nNombre de votes: ${movieVoteCount}`, new Date()));
        addMessageToLocalStorage(new Message(message.senderName, message.senderAvatar, `Informations sur le film ${message.content} :\n\nNote moyenne: ${movieVoteAverage}/10\nNombre de votes: ${movieVoteCount}`, new Date()));
    } catch (error) {
        console.error('Erreur lors de la requête pour les films :', error);

        appendMessage(new Message(message.senderName, message.senderAvatar, `Désolé, je n'ai pas pu récupérer d'informations sur ce film.`, new Date()));
        addMessageToLocalStorage(new Message(message.senderName, message.senderAvatar, `Désolé, je n'ai pas pu récupérer d'informations sur ce film.`, new Date()));
    }
}

export async function getUpcomingMovies(message) {
    try {
        const response = await axios.get(`${baseUrl}/movie/upcoming`, {
            params: {
                api_key: apiKey,
                language: 'fr-FR'
            }
        });

        const upcomingMovies = response.data.results.slice(0, 5).map(movie => ({
            title: movie.title,
            overview: movie.overview,
            release_date: movie.release_date
        }));

        const upcomingMoviesFormatted = upcomingMovies.map(movie => `Titre: ${movie.title}\nRésumé: ${movie.overview}\nDate de sortie: ${movie.release_date}`).join('\n\n');

        appendMessage(new Message(message.senderName, message.senderAvatar, `Les prochaines sorties sont :\n\n${upcomingMoviesFormatted}`, new Date()));
        addMessageToLocalStorage(new Message(message.senderName, message.senderAvatar, `Les prochaines sorties sont :\n\n${upcomingMoviesFormatted}`, new Date()));
    } catch (error) {
        console.error('Erreur lors de la requête des prochaines sorties :', error);
        appendMessage(new Message(message.senderName, message.senderAvatar, `Désolé, je n'ai pas pu récupérer les prochaines sorties.`, new Date()));
        addMessageToLocalStorage(new Message(message.senderName, message.senderAvatar, `Désolé, je n'ai pas pu récupérer les prochaines sorties.`, new Date()));
    }
}

export async function getMovieInfo(message) {
    try {
        const response = await axios.get(`${baseUrl}/search/movie`, {
            params: {
                api_key: apiKey,
                query: message.content,
                language: 'fr-FR'
            }
        });

        if (!response.data.results || response.data.results.length === 0) {
            throw new Error('Film non trouvé.');
        }

        const movie = response.data.results[0];
        const movieTitleResult = movie.title;
        const movieOverview = movie.overview;
        const movieReleaseDate = movie.release_date;

        appendMessage(new Message(message.senderName, message.senderAvatar, `Résumé: ${movieOverview}\nDate de sortie: ${movieReleaseDate}`, new Date()));
        addMessageToLocalStorage(new Message(message.senderName, message.senderAvatar, `Résumé: ${movieOverview}\nDate de sortie: ${movieReleaseDate}`, new Date()));
        
    } catch (error) {
        appendMessage(new Message(message.senderName, message.senderAvatar, `Désolé, je n'ai pas pu récupérer d'informations sur ce film.`, new Date()));
        addMessageToLocalStorage(new Message(message.senderName, message.senderAvatar, `Désolé, je n'ai pas pu récupérer d'informations sur ce film.`, new Date()));
    }
}