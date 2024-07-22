const serachButton = document.getElementById("search");
const cityInput = document.getElementById("cityInput");
const currentWeatherDiv = document.getElementById("CurrentWeather");
const weatherCardDiv = document.getElementById("weather-cards");

const API_KEY = "6960f7a3e834dc2df94fe4aadbe0217d";

const createWeatherCard = (cityName,weatherItem,index) => {
    if(index === 0){
        return ` <div id="information">
                        <h2>${cityName}(${weatherItem.dt_txt.split("")[0]})</h2>
                        <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                        <h4>Wind:${weatherItem.wind.speed}M/S</h4>
                        <h4 class="underline font-extrabold">${weatherItem.main.humidity}%</h4>
                    </div>
                    <div id="icon">
                        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="" class="w-20 h-20">
                        <h4>${weatherItem.weather[0].description}</h4>
                    </div>`;

    }else{
   
    return `<li id="card">
                            <h3>(${weatherItem.dt_txt.split("")[0]})</h3>
                            <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="">
                            <h4>${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
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

                            cityInput.value = "";
                            currentWeatherDiv.innerHTML = "";
                            weatherCardDiv.innerHTML = "";

                            console.log(fiveDaysForecast);
                            fiveDaysForecast.forEach((weatherItem, index) => {
                                if(index === 0){
                                    weatherCardDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName,weatherItem,index));

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
const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${API_KEY}`;

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


serachButton.addEventListener("click", getCityInputs);