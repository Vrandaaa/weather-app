const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const searchTabForm = document.querySelector(".form-container");
const grantTab = document.querySelector(".grant-location-container");
const userWeather = document.querySelector(".your-weather");
const loading = document.querySelector(".loading");
const err = document.querySelector("[data-not-found-error]");
let currentTab = userTab;
currentTab.classList.add("current-tab");
// userWeather.classList.add("active");
function switchTabs(clickedTab) {
    if (clickedTab != currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if (!searchTabForm.classList.contains("active")) {
            searchTabForm.classList.add("active");
            grantTab.classList.remove("active");
            userWeather.classList.remove("active");
        }
        else {
            searchTabForm.classList.remove("active");
            getFromSessionStorage();
        }
    }
}

userTab.addEventListener('click', () => {
    console.log("your tab is clicked");
    switchTabs(userTab)
});
searchTab.addEventListener('click', () => {
    console.log("search tab is clicked")
    switchTabs(searchTab)
});

const API = "e1e1aed73656340f986d4406eabca96e";

document.querySelector("[searchBtn]").addEventListener('click', searchFetchRequest);

async function searchFetchRequest() {
    loading.classList.add("active");
    const cityElement = document.querySelector("[data-search]");
    const city = cityElement.value.trim();
    try{
    const data = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API}`);
    const searchData = await data.json();
    if(searchData.cod == 404)
    {
        throw new Error("city not found");
    }
    loading.classList.remove("active");
    setData(searchData);}
    catch(er)
    {
        userWeather.classList.remove("active");
        cityElement.value=" ";
        loading.classList.remove("active");
        err.classList.add("active");
        console.log("error occured",er);
        setTimeout(()=>{
            err.classList.remove("active");
            
        },10000);
    }
}
document.querySelector("[grant-btn]").addEventListener('click', getLocation);


async function userFetchRequest(long, lat) {
    userWeather.classList.remove("active");
    loading.classList.add("active");
    const userLocationData = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API}`);
    const userData = await userLocationData.json();

    loading.classList.remove("active");
    console.log(userData);
    setData(userData);
}
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success);
    }
}

function success(position) {
    const userCoordinates = {
        long: position.coords.longitude,
        lat: position.coords.latitude
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    grantTab.classList.remove("active");
    userFetchRequest(userCoordinates.long, userCoordinates.lat);
}

function setData(data) {
    userWeather.classList.add("active");
    //fetching the elements 
    const cityName = document.getElementById("city");
    const countryIcon = document.getElementById("country-icon");
    const airCondition = document.querySelector("[air-condition]");
    const weatherIcon = document.querySelector("[weather-icon]")
    const temp = document.querySelector("[temprature]");
    const speed = document.querySelector("[windSpeed]");
    const humidity = document.querySelector("[humidity]");
    const cloudy = document.querySelector("[cloudy]");

    //setting the value to elements
    cityName.textContent = data.name;
    if (data.sys && data.sys.country) {
        countryIcon.src =`https://flagcdn.com/40x30/${data.sys.country.toLowerCase()}.png`;
    }
    airCondition.textContent = data.weather[0].main;
    weatherIcon.src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    temprature = parseInt(data.main.temp - 273.15);
    temp.textContent = temprature + "°C";
    speed.textContent = data.wind.speed + "m/s";
    humidity.textContent = data.main.humidity + "%";
    cloudy.textContent = data.clouds.all + "%";
}
function getFromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        grantTab.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        var long = coordinates.long;
        var lat = coordinates.lat;
        userFetchRequest(long, lat);
    }
}
getFromSessionStorage();





