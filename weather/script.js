
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const message = document.getElementById("message");
const weatherResult = document.getElementById("weatherResult");

searchBtn.addEventListener("click", getWeather);

async function getWeather() {
    const city = cityInput.value.trim();

    if (city === "") {
        alert("Please enter a city name.");
        return;
    }

    message.textContent = "Loading weather...";
    weatherResult.style.display = "none";
    searchBtn.disabled = true;

    try {
        // Get city coordinates
        const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoURL);

        if (!geoResponse.ok) {
            throw new Error("Failed to find city.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found. Please enter a valid city.");
        }

        const latitude = geoData.results[0].latitude;
        const longitude = geoData.results[0].longitude;
        const cityName = geoData.results[0].name;
        const country = geoData.results[0].country;

        // Get weather information
        const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather data.");
        }

        const weatherData = await weatherResponse.json();
        const current = weatherData.current;

        // Convert weather code into condition
        const weatherCodes = {
            0: "Clear Sky",
            1: "Mainly Clear",
            2: "Partly Cloudy",
            3: "Cloudy",
            45: "Foggy",
            48: "Foggy",
            51: "Light Drizzle",
            53: "Moderate Drizzle",
            55: "Heavy Drizzle",
            61: "Light Rain",
            63: "Moderate Rain",
            65: "Heavy Rain",
            71: "Light Snow",
            73: "Moderate Snow",
            75: "Heavy Snow",
            80: "Rain Showers",
            81: "Moderate Showers",
            82: "Heavy Showers",
            95: "Thunderstorm"
        };

        // Display results
        document.getElementById("cityName").textContent =
            `${cityName}, ${country}`;

        document.getElementById("temperature").textContent =
            `${current.temperature_2m}°C`;

        document.getElementById("condition").textContent =
            weatherCodes[current.weather_code] || "Unknown condition";

        document.getElementById("humidity").textContent =
            `Humidity: ${current.relative_humidity_2m}%`;

        document.getElementById("wind").textContent =
            `Wind Speed: ${current.wind_speed_10m} km/h`;

        weatherResult.style.display = "block";
        message.textContent = "";

    } catch (error) {
        message.textContent = error.message;
        weatherResult.style.display = "none";
    } finally {
        searchBtn.disabled = false;
    }
}
