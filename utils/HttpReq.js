import { showModal } from "./modal.js";

const BASE_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = "17e6283a0811f0c5f90b06d47cc5dc4b";

const getWeatherData = async (type, data) => {
  let url = null;

  switch (type) {
    case "current":
      if (typeof data === "string") {
        url = `${BASE_URL}/weather?q=${data}&appid=${API_KEY}&units=metric`;
      } else {
        url = `${BASE_URL}/weather?lat=${data.lat}&lon=${data.lon}&appid=${API_KEY}&units=metric`;
      }
      break;

    case "forecast":
      if (typeof data === "string") {
        url = `${BASE_URL}/forecast?q=${data}&appid=${API_KEY}&units=metric`;
      } else {
        url = `${BASE_URL}/forecast?lat=${data.lat}&lon=${data.lon}&appid=${API_KEY}&units=metric`;
      }
      break;

    default:
      url = `${BASE_URL}/weather?q=esfahan&appid=${API_KEY}&units=metric`;
      break;
  }

  // try {
  const response = await fetch(url);
  const result = await response.json();
  // if (+json.cod === 200) {
  return result;
  //   } else {
  //     showModal(json.message);
  //   }
  // } catch (error) {
  //   showModal("an error occured when fetching data");
  // }
};

export default getWeatherData;
