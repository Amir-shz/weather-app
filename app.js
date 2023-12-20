import getWeatherData from "./utils/HttpReq.js";
import { removeModal, showModal } from "./utils/modal.js";
import getWeekDay from "./utils/customDate.js";

const searchInput = document.querySelector("input");
const searchButton = document.querySelector("button");
const weatherContainer = document.getElementById("weather");
const locationIcon = document.getElementById("location");
const forecastContainer = document.getElementById("forecast");
const modalButton = document.getElementById("modal-button");
const loader = document.getElementById("loader");

const renderCurrentWeather = (data) => {
  if (!data) return;
  const weatherJSX = `
    <h1>${data.name}, ${data.sys.country}</h1>
    <div id="main">
      <img src="https://openweathermap.org/img/w/${
        data.weather[0].icon
      }.png" alt="weather icon"/>
      <span>${data.weather[0].main}</span>
      <p>${Math.round(data.main.temp)} °C</p>
    </div>
    <div id="info">
      <p>Humidity: <span>${data.main.humidity} %</span></p>
      <p>Wind speed</p>: <span>${data.wind.speed} m/s</span></p>
    </div>
  `;

  weatherContainer.innerHTML = weatherJSX;
};

const renderForecastWeather = (data) => {
  if (!data) return;
  forecastContainer.innerHTML = "";
  data = data.list.filter((obj) => obj.dt_txt.endsWith("12:00:00"));
  data.forEach((item) => {
    const forecastJSX = `
      <div>
        <img src="https://openweathermap.org/img/w/${
          item.weather[0].icon
        }.png" alt="weather icon"/>
        <h3>${getWeekDay(item.dt)}</h3>
        <p>${Math.round(item.main.temp)} °C</p>
        <span>${item.weather[0].main}</span>
      </div>
    `;
    forecastContainer.innerHTML += forecastJSX;
  });
};

const searchHandler = async () => {
  weatherContainer.innerHTML = "<span id='loader'></span>";
  loader.style.display = "inline-block";
  const cityName = searchInput.value;
  searchInput.value = "";

  if (!cityName) {
    showModal("please enter city name");
    return;
  }

  const currentData = await getWeatherData("current", cityName);
  loader.style.display = "none";
  renderCurrentWeather(currentData);
  const forecastData = await getWeatherData("forecast", cityName);
  renderForecastWeather(forecastData);
};

const positionCallback = async (position) => {
  const { latitude, longitude } = position.coords;
  const currentData = await getWeatherData("current", {
    lat: latitude,
    lon: longitude,
  });
  renderCurrentWeather(currentData);
  const forecastData = await getWeatherData("forecast", {
    lat: latitude,
    lon: longitude,
  });
  renderForecastWeather(forecastData);
};

const errorCallback = (error) => {
  showModal(error.message);
};

const locationHandler = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(positionCallback, errorCallback);
  } else {
    showModal("your browser does not support geolocation");
  }
};

const initHandler = async () => {
  const currentData = await getWeatherData("current", "tehran");
  renderCurrentWeather(currentData);
  const forecastData = await getWeatherData("forecast", "tehran");
  renderForecastWeather(forecastData);
};

searchButton.addEventListener("click", searchHandler);
locationIcon.addEventListener("click", locationHandler);
modalButton.addEventListener("click", removeModal);
document.addEventListener("DOMContentLoaded", initHandler);

////////////////

window.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    searchHandler();
  }
});
