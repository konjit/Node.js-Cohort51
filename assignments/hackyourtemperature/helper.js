import { API_KEY, WRONG_API_KEY } from "./sources/keys.js";


const units = "metric";

export const getWeatherUrl = (cityName) => {
  const base = "https://api.openweathermap.org/data/2.5/weather";
  return `${base}?q=${cityName}&units=${units}&appid=${API_KEY}`;
};

export const getWeatherUrlWithWrongApiKey = (cityName) => {
  const base = "https://api.openweathermap.org/data/2.5/weather";
  return `${base}?q=${cityName}&units=${units}&appid=${WRONG_API_KEY}`;
}

export const getWeatherUrlWithEmptyApiKey = (cityName) => {
  const base = "https://api.openweathermap.org/data/2.5/weather";
  return `${base}?q=${cityName}&units=${units}&appid=${EMPTY_API_KEY}`;
}

export const getWeatherUrlWithWrongDomain = (cityName) => {
  const base = "https://api.openweahermap.org/data/2.5/weather";
  return `${base}?q=${cityName}&units=${units}&appid=${API_KEY}`;
}

export const getWeatherUrlWithWrongEndPoint = (cityName) => {
   const base = "https://api.openweathermap.org/data/2.5/weat";
  return `${base}?q=${cityName}&units=${units}&appid=${API_KEY}`;
}


