import { weatherApiKey } from "./Api_Keys.js"; // After writing the ApiKey below, remove this line
// const weatherApiKey = "Enter your api key";
const weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const countryApi = "https://countriesnow.space/api/v0.1/countries/capital";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");


async function getCapitalFromCountry(countryName) {
    try {
        const response2 = await fetch(countryApi);
        const data = await response2.json();

        const found = data.data.find(
            (item) => {
                return item.name.toLowerCase() === countryName.toLowerCase() || item.iso2.toLowerCase() === countryName.toLowerCase() || item.iso3.toLowerCase() === countryName.toLowerCase();  
            }
        );

        if (found) {
            return {
                capital: found.capital,
                iso2: found.iso2, // Return ISO 2 country code
                iso3: found.iso3 
            };
        } else {
            return null;
        }
    } catch (error) {
        console.log("Error fetching country data:", error);
        return null;
    }
}



async function getWeatherInfo(city) {
    try {
        const response = await fetch(weatherApiUrl + city + `&appid=${weatherApiKey}`);
        if (response.status == 404) {
            document.querySelector(".error").style.display = "block";
            document.querySelector(".weather").style.display = "none";
            return;
        }

        const data = await response.json();
        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = Math.round(data.wind.speed) + "km/h";

        const weatherMain = data.weather[0].main;
        if (weatherMain === "Clouds") {
            weatherIcon.src = "images/clouds.png";
        } else if (weatherMain === "Clear") {
            weatherIcon.src = "images/clear.png";
        } else if (weatherMain === "Rain") {
            weatherIcon.src = "images/rain.png";
        } else if (weatherMain === "Drizzle") {
            weatherIcon.src = "images/drizzle.png";
        } else if (weatherMain === "Mist") {
            weatherIcon.src = "images/mist.png";
        }

        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";

    } catch (error) {
        console.log("Weather fetch error:", error);
    }
}



async function handleSearch() {
    const input = searchBox.value.trim();

    if (!input) return;

    // Try to get capital of the country
    const capitalData = await getCapitalFromCountry(input);

    if (capitalData) {
        getWeatherInfo(capitalData.capital);
        
    } else {
        getWeatherInfo(input);
    }
}



searchBox.addEventListener("keyup", (event) => {
    if (event.key == "Enter") {
        handleSearch();
    }
});

searchBtn.addEventListener("click", () => {
    handleSearch();
});
