const BASE_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = "17e6283a0811f0c5f90b06d47cc5dc4b";

const searchInput = document.querySelector("input");
const searchButton = document.querySelector("button");
const weatherContainer = document.getElementById("weather");
const locationIcon = document.getElementById("location");

const getCurrentWeatherByName = async (city) => {
  const url = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);
  const result = await response.json();
  return result;
};

const getCurrentWeatherByCoordinates = async (lat, lon) => {
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);
  const result = await response.json();
  return result;
};

const renderCurrentWeather = (data) => {
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

const searchHandler = async () => {
  const cityName = searchInput.value;

  if (!cityName) {
    alert("please enter city name");
  }

  const currentData = await getCurrentWeatherByName(cityName);
  renderCurrentWeather(currentData);
};

const positionCallback = async (position) => {
  const { latitude, longitude } = position.coords;
  const currentData = await getCurrentWeatherByCoordinates(latitude, longitude);
  renderCurrentWeather(currentData);
};

const errorCallback = (error) => {
  console.log(error.message);
};

const locationHandler = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(positionCallback, errorCallback);
  } else {
    alert("your browser does not support geolocation");
  }
};

searchButton.addEventListener("click", searchHandler);
locationIcon.addEventListener("click", locationHandler);
