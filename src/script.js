function formatDate(timestamp) {
  let now = new Date(timestamp);
  let hours = ("0" + now.getHours()).slice(-2);
  let minutes = ("0" + now.getMinutes()).slice(-2);
  let days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  let day = days[now.getDay()];
  let date = now.getDate();
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = months[now.getMonth()];
  let year = now.getFullYear();

  return `${day} ${month} ${date}, ${year}  ${hours}:${minutes}`;
}

function formatForecastDay(timestamp) {
  let currentTime = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  let day = days[currentTime.getDay()];
  return `${day}`;
}

function formatForecastDate(timestamp) {
  let currentTime = new Date(timestamp * 1000);
  let date = currentTime.getDate();
  return `${date}`;
}

function displayForecast(response) {
  console.log(response);
  console.log(response.data.daily);
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row g-1">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6 && index !== 0) {
      forecastHTML =
        forecastHTML +
        `
              <div class="col-2 future-card">
                <div class="card" style="width: 7rem">
                  <div class="card-body forecast-body">
                    <h5 class="card-title day">${formatForecastDay(
                      forecastDay.time
                    )}</h5>
                    <p class="forecast-date">${formatForecastDate(
                      forecastDay.time
                    )}</p>
                    <p class="card-icon futureforecast-icons">
                      <img src=${
                        forecastDay.condition.icon_url
                      } alt="#s" id="forecast-icon" width="42" />
                    </p>
                  </div>
                  <div class="card-body forecast-temperatures">
                    <div class="row forecast-temperature-row">
                      <div class="col forecast-temp-max">${Math.round(
                        forecastDay.temperature.maximum
                      )}°</div>
                      <div class="col forecast-temp-min">${Math.round(
                        forecastDay.temperature.minimum
                      )}°</div>
                    </div>
                  </div>
                </div>
              </div>
            `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function fetchForecast(coordinates) {
  console.log(coordinates);

  let apiKey = "56a8a52fdb532o964ddd1d934709d5bt";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
  console.log(response);
  celsiusTemperature = response.data.temperature.current;
  feelsLikeCelsius = response.data.temperature.feels_like;
  document.querySelector("#city").innerHTML = response.data.city;
  document.querySelector("#current-temperature").innerHTML =
    Math.round(celsiusTemperature);
  document.querySelector("#description").innerHTML =
    response.data.condition.description;
  document.querySelector("#feels-like").innerHTML =
    Math.round(feelsLikeCelsius);
  document.querySelector("#humidity").innerHTML =
    response.data.temperature.humidity;
  document.querySelector("#wind-speed").innerHTML = Math.round(
    response.data.wind.speed * 3.6
  );
  document.querySelector("#date").innerHTML = formatDate(
    response.data.time * 1000
  );
  document
    .querySelector("#current-temp-icon")
    .setAttribute("src", response.data.condition.icon_url);
  document
    .querySelector("#current-temp-icon")
    .setAttribute("alt", response.data.condition.description);

  fetchForecast(response.data.coordinates);
}

function search(city) {
  let apiKey = "56a8a52fdb532o964ddd1d934709d5bt";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayTemperature);
}

function runSearchForm(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");

  search(cityInput.value);
}

function showPosition(position) {
  let apiKey = "56a8a52fdb532o964ddd1d934709d5bt";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${position.coords.longitude}&lat=${position.coords.latitude}&key=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayTemperature);
}

function runNavigator(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

function displayFahrenheit(event) {
  event.preventDefault();
  let currentTempElement = document.querySelector("#current-temperature");
  let feelsLikeElement = document.querySelector("#feels-like");
  let feelsLikeFahrenheit = (feelsLikeCelsius * 9) / 5 + 32;
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  currentTempElement.innerHTML = Math.round(fahrenheitTemperature);
  feelsLikeElement.innerHTML = Math.round(feelsLikeFahrenheit);
}

function displayCelsius(event) {
  event.preventDefault();
  let currentTempElement = document.querySelector("#current-temperature");
  let feelsLikeElement = document.querySelector("#feels-like");
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  currentTempElement.innerHTML = Math.round(celsiusTemperature);
  feelsLikeElement.innerHTML = Math.round(feelsLikeCelsius);
}

let celsiusTemperature = null;
let feelsLikeCelsius = null;

let celsiusLink = document.querySelector("#celsius-link");
let currentLocationButton = document.querySelector("#current-location-button");
let fahrenheitLink = document.querySelector("#fahrenheit-link");
let form = document.querySelector("#search-form");

celsiusLink.addEventListener("click", displayCelsius);
currentLocationButton.addEventListener("click", runNavigator);
fahrenheitLink.addEventListener("click", displayFahrenheit);
form.addEventListener("submit", runSearchForm);

search("New York");
