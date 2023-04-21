function formatDate(timestamp) {
  let currentTime = new Date(timestamp);
  let hours = currentTime.getHours();
  hours = hours % 12 || 12;
  let minutes = ("0" + currentTime.getMinutes()).slice(-2);
  let days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  let day = days[currentTime.getDay()];
  let date = currentTime.getDate();
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
  let month = months[currentTime.getMonth()];
  let year = currentTime.getFullYear();

  return `${day} ${month} ${date}, ${year}  ${hours}:${minutes}    ${
    currentTime.getHours() < 12 ? "AM" : "PM"
  }`;
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
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6 && index !== 0) {
      forecastHTML =
        forecastHTML +
        `
              <div class="col-2 future-card">
                <div class="card" style="width: 6rem">
                  <div class="card-body forecast-body">
                    <h5 class="card-title day">${formatForecastDay(
                      forecastDay.time
                    )}</h5>
                    <p class="forecast-date">${formatForecastDate(
                      forecastDay.time
                    )}</p>
                    <p class="card-icon futureforecast-icons">
                      <img src=${forecastDay.condition.icon_url} alt="${
          forecastDay.condition.description
        }" id="forecast-icon" width="50" />
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
  let apiKey = "56a8a52fdb532o964ddd1d934709d5bt";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=imperial`;

  axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
  fahrenheitTemperature = response.data.temperature.current;
  feelsLike = response.data.temperature.feels_like;
  document.querySelector("#city").innerHTML = response.data.city;
  document.querySelector("#current-temperature").innerHTML = Math.round(
    fahrenheitTemperature
  );
  document.querySelector("#description").innerHTML =
    response.data.condition.description;
  document.querySelector("#feels-like").innerHTML = Math.round(feelsLike);
  document.querySelector("#humidity").innerHTML =
    response.data.temperature.humidity;
  document.querySelector("#wind-speed").innerHTML = Math.round(
    response.data.wind.speed
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
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=imperial`;

  axios.get(apiUrl).then(displayTemperature);
}

function runSearchForm(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");

  search(cityInput.value);
}

function showPosition(position) {
  let apiKey = "56a8a52fdb532o964ddd1d934709d5bt";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${position.coords.longitude}&lat=${position.coords.latitude}&key=${apiKey}&units=imperial`;

  axios.get(apiUrl).then(displayTemperature);
}

function runNavigator(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

let currentLocationButton = document.querySelector("#current-location-button");
let form = document.querySelector("#search-form");

currentLocationButton.addEventListener("click", runNavigator);
form.addEventListener("submit", runSearchForm);

search("New York");
