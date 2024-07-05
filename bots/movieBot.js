import { getMovieRating, getUpcomingMovies, getMovieInfo } from '../services/movieService.js';
import { appendMessage } from '../main.js';
import Message from './message.js';
import { addMessageToLocalStorage } from '../localStorage.js';

class MovieBot {
    constructor(name, avatar) {
        this.name = name;
        this.avatar = avatar;
        this.awaitingRatingMovie = false;
        this.awaitingFutureOutings = false;
        this.awaitingMovie = false;
    }

    async respondTo(inputData) {
        if (inputData.content.toLowerCase().includes('note')) {
            this.awaitingRatingMovie = true;
            this.awaitingFutureOutings = false;
            this.awaitingMovie = false;
    
            const message = new Message(this.name, this.avatar, "Pour quel film voulez-vous connaître la note ?", new Date());
            appendMessage(message);
            addMessageToLocalStorage(message);
    
        } else if (inputData.content.toLowerCase().includes('prochaines sorties')) {
            this.awaitingFutureOutings = true;
            this.awaitingRatingMovie = false;
            this.awaitingMovie = false;
    
            const message = new Message(this.name, this.avatar, inputData.content, new Date());
            getUpcomingMovies(message);
    
        } else if (inputData.content.toLowerCase().includes('film')) {
            this.awaitingMovie = true;
            this.awaitingFutureOutings = false;
            this.awaitingRatingMovie = false;
    
            const message = new Message(this.name, this.avatar, "Pour quel film voulez-vous connaître les informations ?", new Date());
            appendMessage(message);
            addMessageToLocalStorage(message);
        } else {
            if (this.awaitingRatingMovie) {
                console.log("awaitingRatingMovie");
                this.awaitingRatingMovie = false;
                const message = new Message(this.name, this.avatar, inputData.content, new Date());
                getMovieRating(message);
            } else if (this.awaitingFutureOutings) {
                this.awaitingFutureOutings = false;
            } else if (this.awaitingMovie) {
                this.awaitingMovie = false;
                const message = new Message(this.name, this.avatar, inputData.content, new Date());
                getMovieInfo(message);
            } else {
                this.respondTo(inputData);
            }
        }
    }    
}

export default MovieBot;