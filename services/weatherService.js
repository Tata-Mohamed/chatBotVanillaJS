import axios from "axios";
import Message from "../bots/message";
import { appendMessage } from "../main.js";
import { addMessageToLocalStorage } from "../localStorage.js";

const apiKeyWeather = "c8d88badfd1f25c65167dd21dda4bdb6";

export async function getWeather(message) {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${message.content}&appid=${apiKeyWeather}&units=metric`);
        const data = response.data;
        const weather = data.weather[0].description;
        const temp = data.main.temp;

        appendMessage(new Message(message.senderName, message.senderAvatar, `La météo à ${message.content} est actuellement ${weather} avec une température de ${temp}°C.`, new Date()));
        addMessageToLocalStorage(new Message(message.senderName, message.senderAvatar, `La météo à ${message.content} est actuellement ${weather} avec une température de ${temp}°C.`, new Date()));
    } catch (error) {
        console.error('Error fetching weather data:', error);
        appendMessage(new Message(message.senderName, message.senderAvatar, `Désolé, je ne peux pas récupérer la météo pour le moment.`, new Date()));
        addMessageToLocalStorage(new Message(message.senderName, message.senderAvatar, `Désolé, je ne peux pas récupérer la météo pour le moment.`, new Date()));
    }
}

export async function getWeatherForecast(message) {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${message.content}&appid=${apiKeyWeather}&units=metric`);
        const data = response.data;
        const forecasts = data.list.slice(0, 5).map(forecast => {
            const date = new Date(forecast.dt * 1000);
            const weather = forecast.weather[0].description;
            const temp = forecast.main.temp;
            return `Le ${date.toLocaleString()} : ${weather}, ${temp}°C.`;
        }).join('\n');

        appendMessage(new Message(message.senderName, message.senderAvatar, `Les prévisions pour ${message.content} sont : \n${forecasts}`, new Date()));
        addMessageToLocalStorage(new Message(message.senderName, message.senderAvatar, `Les prévisions pour ${message.content} sont : \n${forecasts}`, new Date()));
    } catch (error) {
        console.error('Error fetching weather forecast data:', error);
        appendMessage(new Message(message.senderName, message.senderAvatar, `Désolé, je ne peux pas récupérer les prévisions météo pour le moment.`, new Date()));
        addMessageToLocalStorage(new Message(message.senderName, message.senderAvatar, `Désolé, je ne peux pas récupérer les prévisions météo pour le moment.`, new Date()));
    }
}

export async function getWeatherInfo(message) {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${message.content}&appid=${apiKeyWeather}&units=metric`);
        const data = response.data;
        const weatherInfo = {
            temp: data.main.temp,
            feels_like: data.main.feels_like,
            temp_min: data.main.temp_min,
            temp_max: data.main.temp_max,
            pressure: data.main.pressure,
            humidity: data.main.humidity,
            sea_level: data.main.sea_level,
            grnd_level: data.main.grnd_level
        };

        appendMessage(new Message(message.senderName, message.senderAvatar, `Informations météo détaillées pour ${message.content} :
        Température : ${weatherInfo.temp}°C
        Ressenti : ${weatherInfo.feels_like}°C
        Température min : ${weatherInfo.temp_min}°C
        Température max : ${weatherInfo.temp_max}°C
        Pression : ${weatherInfo.pressure} hPa
        Humidité : ${weatherInfo.humidity}%
        Niveau de la mer : ${weatherInfo.sea_level} hPa
        Niveau du sol : ${weatherInfo.grnd_level} hPa`, new Date()));

        addMessageToLocalStorage(new Message(message.senderName, message.senderAvatar, `Informations météo détaillées pour ${message.content} :
        Température : ${weatherInfo.temp}°C
        Ressenti : ${weatherInfo.feels_like}°C
        Température min : ${weatherInfo.temp_min}°C
        Température max : ${weatherInfo.temp_max}°C
        Pression : ${weatherInfo.pressure} hPa
        Humidité : ${weatherInfo.humidity}%
        Niveau de la mer : ${weatherInfo.sea_level} hPa
        Niveau du sol : ${weatherInfo.grnd_level} hPa`, new Date()));
    } catch (error) {
        console.error('Error fetching detailed weather data:', error);
        appendMessage(new Message(message.senderName, message.senderAvatar, `Désolé, je ne peux pas récupérer les informations météo détaillées pour le moment.`, new Date()));
        addMessageToLocalStorage(new Message(message.senderName, message.senderAvatar, `Désolé, je ne peux pas récupérer les informations météo détaillées pour le moment.`, new Date()));
    }
}
