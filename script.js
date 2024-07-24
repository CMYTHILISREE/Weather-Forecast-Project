const serachButton = document.getElementById("search");
const cityInput = document.getElementById("cityInput");
const locationButton = document.getElementById("location");
const currentWeatherDiv = document.getElementById("currentWeather");
const weatherCardDiv = document.getElementById("weather-cards");

const API_KEY = "6960f7a3e834dc2df94fe4aadbe0217d";

const createWeatherCard = (cityName,weatherItem,index) => {
    if(index === 0){
        return ` <div id="information">
                        <h2>${cityName} ${weatherItem.dt_txt.split(" ")[0]}</h2>
                        <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                        <h4>Wind:${weatherItem.wind.speed}M/S</h4>
                        <h4">${weatherItem.main.humidity}%</h4>
                    </div>
                    <div id="icon">
                        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="">
                        <h4>${weatherItem.weather[0].description}</h4>
                    </div>`;

    }else{
   
    return `<li id="card">
                            <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                            <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="">
                            <h4>Temo:${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                            <h4>Wind:${weatherItem.wind.speed}M/S</h4>
                            <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                        </li>`;
    }
}

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(res => res.json())
                          .then(data => {
                           
                            const forecastDays = [];
                            const fiveDaysForecast = data.list.filter(forecast => {
                                const forecastDate = new Date(forecast.dt_txt).getDate();
                                if(!forecastDays.includes(forecastDate)){
                                    return forecastDays.push(forecastDate);
                                }

                            });

                            console.log(fiveDaysForecast);

                            cityInput.value = "";
                            currentWeatherDiv.innerHTML = "";
                            weatherCardDiv.innerHTML = "";

                            console.log(fiveDaysForecast);
                            fiveDaysForecast.forEach((weatherItem, index) => {
                                if(index === 0){
                                    currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName,weatherItem,index));

                                }else{
                                    weatherCardDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName,weatherItem,index));

                                }  

                            });
                          }).catch(() => {
                            alert("Error occured while fetching the Weather Forecast!");
                        });
                    
}
function getCityInputs(){
    const cityName = cityInput.value.trim(); 
    if(!cityName){
        return;
    }
const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

fetch(GEOCODING_API_URL).then(res => res.json())            
                        .then(data => { 
                            if(!data.length){
                               return alert(`No data found for ${cityName}`);
                            }
                            const {name, lat, lon} = data[0];
                            getWeatherDetails(name, lat, lon);
                        }).catch(() => {
                            alert("Error occured while fetching the data!");
                        });
                        
}

const getUserInputs = () => {
    navigator.geolocation.getCurrentPosition( (position) => {
        const {latitude, longitude} = position.coords;
        const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
        fetch(REVERSE_GEOCODING_URL).then(res => res.json())            
                        .then(data => { 
                            const {name} = data[0];
                            getWeatherDetails(name,latitude,longitude);
                        }).catch(() => {
                            alert("Error occured while fetching the city!");
                        });
    },
    error => {
        if(error.code === error.PERMISSION_DENIED){
            alert("geolocation request Denied.Please reset location permission to grand access again.");
        }
    }
);

}


locationButton.addEventListener("click",getUserInputs);
serachButton.addEventListener("click", getCityInputs);
cityInput.addEventListener("keyup", e=> e.key === "Enter" && getCityInputs() );




// Function to update the list of recently searched cities
function updateRecentlySearchedCities(cityInput) {
    let cities = JSON.parse(localStorage.getItem('recentCities')) || []; // Get recent cities from local storage
    if (!cities.includes(cityInput)) {
        cities.push(cityInput); // Add new city to the list
        localStorage.setItem('recentCities', JSON.stringify(cities)); // Save updated list to local storage
        updateCityDropdown(cities); // Update the city dropdown with the new list
    }
}

// Function to update the city dropdown with recent searches
function updateCityDropdown(cities) {
    const dropdown = document.getElementById('city-dropdown');
    if (!dropdown) {
        // Create a new dropdown if it doesn't exist
        const newheading = document.createElement('p');
        newheading.innerHTML = `<h2 class="text-xl font-extrabold text-start mt-4 ">Recent Search</h2>`;
        const newDropdown = document.createElement('select');
        newDropdown.id = 'city-dropdown';
        newDropdown.classList.add('p-3', 'border', 'rounded-lg', 'w-full', 'bg-indigo-500', 'hover:bg-indigo-300', 'transition', 'duration-300');
        newDropdown.addEventListener('change', (event) => {
            const cityInput = event.target.value;
            if (cityInput) {
                getWeatherDetails(cityName,latitude,longitude);// Fetch weather for selected city
                 // Fetch forecast for selected city
            }
        });
        document.getElementById('app').appendChild(newheading); // Add the heading to the app
        document.getElementById('app').appendChild(newDropdown); // Add the new dropdown to the app
    }
    const dropdownElement = document.getElementById('city-dropdown');
    dropdownElement.innerHTML = cities.map(city => `<option value="${city}">${city}</option>`).join(''); // Populate the dropdown with cities
}

// Load recently searched cities on page load
document.addEventListener('DOMContentLoaded', () => {
    const cities = JSON.parse(localStorage.getItem('recentCities')) || [];
    if (cities.length > 0) {
        updateCityDropdown(cities); // Update the city dropdown if there are recent searches
    }
});
