const API_KEY = '2394c2c73dce79add7af4b0c0d2412ac'; // Replace with your OpenWeatherMap API key

//function when get weather Btn is clicked
async function getWeather() {
  const location = document.getElementById("locationInput").value;
  const weatherCard = document.getElementById("weatherCard");

  if (!location) {
    weatherCard.innerHTML = "Please enter a location.";
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("City not found");

    const data = await res.json();

    const weatherHTML = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <p><strong>${data.weather[0].main}</strong> – ${data.weather[0].description}</p>
      <p>🌡️ Temp: ${data.main.temp}°C</p>
      <p>💧 Humidity: ${data.main.humidity}%</p>
      <p>💨 Wind: ${data.wind.speed} m/s</p>
    `;
    weatherCard.innerHTML = weatherHTML;
    loadWeatherEffect(data.weather[0].main);
    console.log("Weather Type from API:", data.weather[0].main);


  } catch (error) {
    weatherCard.innerHTML = "❌ Error: " + error.message;
  }
}

const cities = [
  "Bangalore", "Mumbai", "Delhi", "Kolkata", "Chennai",
  "Hyderabad", "Ahmedabad", "Pune", "Jaipur", "Surat",
  "Visakhapatnam", "Bhopal", "Nagpur", "Coimbatore", "Lucknow"
];

//fetches each city weather n passes it to next function
async function fetchCityWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    return {
      city: data.name,
      temp: data.main.temp,
      desc: data.weather[0].description,
      icon: data.weather[0].icon
    };
  } catch (err) {
    console.error(`Failed to fetch weather for ${city}`);
    return null;
  }
}

//displays major city weather passed by above function
async function displayMajorCitiesWeather() {
  const container = document.getElementById("cityWeatherContainer");
  container.innerHTML = "<p>Loading weather data...</p>";

  const weatherData = await Promise.all(cities.map(fetchCityWeather));
  container.innerHTML = "";

  weatherData.forEach(data => {
    if (!data) return;

    const card = document.createElement("div");
    card.className = "city-card";
    card.innerHTML = `
      <h3>${data.city}</h3>
      <img src="http://openweathermap.org/img/wn/${data.icon}@2x.png" alt="${data.desc}" />
      <p><strong>${data.temp}°C</strong></p>
      <p>${data.desc}</p>
    `;
    container.appendChild(card);
  });
}

//scrollbar of major city weather details
function scrollCities(direction) {
  const container = document.getElementById("cityWeatherContainer");
  const scrollAmount = container.clientWidth; // scroll by width of 4 cards

  if (direction === 'left') {
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  } else {
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
}

//background effect based on Weather of the city
let effect;
function loadWeatherEffect(weatherType) {
  if (effect) effect.destroy(); // remove existing effect

  switch (weatherType.toLowerCase()) {
    case 'rain':
    case 'drizzle':
      // you can use a particle effect here manually (or GIF)
      break;

    case 'clouds':
    case 'mist':
    case 'fog':
      effect = VANTA.CLOUDS({
        el: "#weather-bg",
        skyColor: 0x99ccff,
        cloudColor: 0xffffff,
        speed: 1.5
      });
      break;

    case 'clear':
      effect = VANTA.WAVES({
        el: "#weather-bg",
        color: 0x1e90ff,
        shininess: 50,
        waveHeight: 20,
        waveSpeed: 0.5,
        zoom: 0.9
      });
      break;

    case 'snow':
      // VANTA.NET or particles
      break;

    default:
      // fallback background
      break;
  }
}











// Call it on page load
window.onload = () => {
  displayMajorCitiesWeather();
};

