const api = {
    key: "Your_Key",
    baseurl: "https://api.openweathermap.org/data/2.5/"
}

//More complete version
if (navigator.geolocation) {
    // Request the current position
    // If successful, call getPosSuccess; On error, call getPosErr
    navigator.geolocation.getCurrentPosition(getPosSuccess, getPosErr);
} else {
    alert('geolocation not available?! What year is this?');
    // IP address or prompt for city?
}

// getCurrentPosition: Successful return
function getPosSuccess(pos) {
    console.log(pos)
  // Get the coordinates and accuracy properties from the returned object
  var geoLat = pos.coords.latitude.toFixed(5);
  var geoLng = pos.coords.longitude.toFixed(5);
  

  fetch(`${api.baseurl}weather?lat=${geoLat}&lon=${geoLng}&units=metric&APPID=${api.key}`)
    .then(weather => {
        return weather.json();
    }).then(specifyResults)
}

// getCurrentPosition: Error returned
function getPosErr(err) {
  switch (err.code) {
    case err.PERMISSION_DENIED:
      alert("User denied the request for Geolocation.");
      break;
    case err.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case err.TIMEOUT:
      alert("The request to get user location timed out.");
      break;
    default:
      alert("An unknown error occurred.");
  }
}

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);

function setQuery(evt) {
    if (evt.keyCode == 13) {
      getResults(searchbox.value);
    }
}

function getResults (query){
    fetch(`${api.baseurl}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then(weather => {
            return weather.json();
        }).then(specifyResults);
        
}
function specifyResults (weather){
    let city = document.querySelector('.location .city');
    city.innerText = `${weather.name}, ${weather.sys.country}`;

    let latGeo = `${weather.coord.lat}`;
    let lngGeo = `${weather.coord.lon}`;

    fetch(`${api.baseurl}onecall?lat=${latGeo}&lon=${lngGeo}&units=metric&APPID=${api.key}`)
    .then(onecall => {
        return onecall.json();
    }).then(fcData);
}
function fcData(onecall){
    console.log(onecall);
    
    let now = new Date();
    let date = document.querySelector('.location .date');
    date.innerText = dateBuilder(now);

    let temp = document.querySelector('.current .temp');
    temp.innerHTML = `${Math.round(onecall.current.temp)}<span>°c</span>`;

    let weather_el = document.querySelector('.current .weather');
    weather_el.innerText = onecall.current.weather[0].main;

    let hilow = document.querySelector('.hi-low');
    hilow.innerText = `${Math.round(onecall.daily[0].temp.min)}°c / ${Math.round(onecall.daily[0].temp.max)}°c`;

    //forecast
    let time_utc = `${onecall.current.dt}`;
    console.log(time_utc);
    var fc_date = new Date(time_utc * 1000);
        // Hours part from the timestamp
    let fc_hour = fc_date.getHours();
    //let fc_time = document.querySelector('.forecast-data .fc-time');
    fc_time.innerHTML = fc_hour;

    

    //let fc_time = document.querySelector('.forecast-data .fc-time');
    //fc_time.innerHTML = `${Math.round(onecall.hourly[0].dt)}`;

    let fc_temp = document.querySelector('.fc-temp');
    fc_temp.innerHTML = `${Math.round(onecall.current.temp)}<span>°c</span>`;


    
    //detail-data
   // let rain = document.querySelector('.Niederschlag-data');
   // rain.innerHTML = `${onecall.}`

    let humiditi = document.querySelector('.humidity-data');
    humiditi.innerHTML = `${onecall.current.humidity}%`;

    let sun = document.querySelector('.Uv-data');
    sun.innerHTML = `${onecall.current.uvi}`;

    let wind = document.querySelector('.Wind-data');
    wind.innerHTML = `${onecall.current.wind_speed} m/s`;

    let vision = document.querySelector('.Visibility-data');
    vision.innerHTML = `${onecall.current.visibility} m`;

    let Pressure = document.querySelector('.Pressure-data');
    Pressure.innerHTML = `${onecall.current.pressure} hPa`;
}

/*
function displayResults(weather){
    

    let now = new Date();
    let date = document.querySelector('.location .date');
    date.innerText = dateBuilder(now);

    let temp = document.querySelector('.current .temp');
    temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;

    let bottomTemp = document.querySelector('.fc-temp');
    bottomTemp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;

    let weather_el = document.querySelector('.current .weather');
    weather_el.innerText = weather.weather[0].main;

    let hilow = document.querySelector('.hi-low');
    hilow.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;

    
    
}
*/

function dateBuilder (d) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
  
    return `${day} ${date} ${month} ${year}`;
}

