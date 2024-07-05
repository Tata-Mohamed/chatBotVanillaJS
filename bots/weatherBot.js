import { getWeather, getWeatherForecast, getWeatherInfo } from '../services/weatherService.js';
import Message from './message.js';
import { appendMessage } from "../main.js";
import { addMessageToLocalStorage } from '../localStorage.js';

class WeatherBot {
    constructor(name, avatar) {
        this.name = name;
        this.avatar = avatar;
        this.awaitingCity = false;
        this.awaitingForecastCity = false;
        this.awaitingInfoCity = false;
    }

    async respondTo(inputData) {
        console.log(inputData.content);
        if (inputData.content.toLowerCase().includes('météo')) {
            console.log("Message reçu:", inputData);
            this.awaitingCity = true;
            this.awaitingForecastCity = false;
            this.awaitingInfoCity = false;

            const message = new Message(this.name, this.avatar, "Vous souhaitez connaître la météo de quelle ville ?", new Date());

            appendMessage(message);

            addMessageToLocalStorage(message);

        } else if (inputData.content.toLowerCase().includes('prévision')) {
            this.awaitingForecastCity = true;
            this.awaitingCity = false;
            this.awaitingInfoCity = false;

            const message = new Message(this.name, this.avatar, "Vous souhaitez connaître les prévisions de quelle ville ?", new Date());
            
            appendMessage(message);

            addMessageToLocalStorage(message);

        } else if (inputData.content.toLowerCase().includes('informations')) {
            this.awaitingCity = false;
            this.awaitingForecastCity = false;
            this.awaitingInfoCity = true;

            const message = new Message(this.name, this.avatar, `Vous souhaitez obtenir des informations détaillées sur la météo de quelle ville ?`, new Date());

            appendMessage(message);
            addMessageToLocalStorage(message);
            getWeatherInfo(new Message(this.name, this.avatar, city, new Date()));
        } else {
            if (this.awaitingCity) {
                console.log("awaitingCity");
                this.awaitingCity = false;
                const message = new Message(this.name, this.avatar, inputData.content, new Date());
                getWeather(message);
            } else if (this.awaitingForecastCity) {
                this.awaitingForecastCity = false;
                const message = new Message(this.name, this.avatar, inputData.content, new Date());
                getWeatherForecast(message);
            }  else if (this.awaitingInfoCity) {
                this.awaitingInfoCity = false;
                const message = new Message(this.name, this.avatar, inputData.content, new Date());
                getWeatherInfo(message);
            } else {
                return respondTo(inputData);
            }
        }
    }

    avatar() {
        return this.avatar;
    }

    name() {
        return this.name;
    }
}

export default WeatherBot;