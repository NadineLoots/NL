document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    const locationBtn = document.querySelector('.location-btn');
    const weatherIcon = document.querySelector('.weather-icon i');
    const temperature = document.querySelector('.temperature');
    const weatherDescription = document.querySelector('.weather-description');
    const locationElement = document.querySelector('.location');
    const dateTimeElement = document.querySelector('.date-time');
    const windElement = document.querySelector('.detail-item:nth-child(1) .detail-value');
    const humidityElement = document.querySelector('.detail-item:nth-child(2) .detail-value');
    const pressureElement = document.querySelector('.detail-item:nth-child(3) .detail-value');
    const forecastContainer = document.querySelector('.forecast-items');
    
    // API Key - In a real app, this should be secured and not exposed in frontend code
    const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your actual API key
    const BASE_URL = 'https://api.openweathermap.org/data/2.5';
    
    // Initialize with default city
    fetchWeatherData('New York');
    
    // Event Listeners
    searchBtn.addEventListener('click', () => {
        const city = searchInput.value.trim();
        if (city) {
            fetchWeatherData(city);
        }
    });
    
    locationBtn.addEventListener('click', getUserLocation);
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const city = searchInput.value.trim();
            if (city) {
                fetchWeatherData(city);
            }
        }
    });
    
    // Functions
    async function fetchWeatherData(city) {
        try {
            // Fetch current weather
            const currentWeatherResponse = await fetch(`${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`);
            const currentWeatherData = await currentWeatherResponse.json();
            
            if (currentWeatherData.cod !== 200) {
                throw new Error(currentWeatherData.message || 'City not found');
            }
            
            // Fetch forecast
            const forecastResponse = await fetch(`${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`);
            const forecastData = await forecastResponse.json();
            
            updateWeatherUI(currentWeatherData, forecastData);
            updateBackground(currentWeatherData.weather[0].main);
        } catch (error) {
            alert(error.message);
            console.error('Error fetching weather data:', error);
        }
    }
    
    function updateWeatherUI(currentData, forecastData) {
        // Update current weather
        const weatherCondition = currentData.weather[0].main.toLowerCase();
        const iconClass = getWeatherIcon(weatherCondition);
        
        weatherIcon.className = `fas ${iconClass}`;
        temperature.textContent = `${Math.round(currentData.main.temp)}°`;
        weatherDescription.textContent = currentData.weather[0].description;
        locationElement.textContent = `${currentData.name}, ${currentData.sys.country}`;
        
        // Update weather details
        windElement.textContent = `${Math.round(currentData.wind.speed * 3.6)} km/h`;
        humidityElement.textContent = `${currentData.main.humidity}%`;
        pressureElement.textContent = `${currentData.main.pressure} hPa`;
        
        // Update date and time
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        dateTimeElement.textContent = now.toLocaleDateString('en-US', options);
        
        // Update forecast
        updateForecastUI(forecastData);
    }
    
    function updateForecastUI(forecastData) {
        // Clear previous forecast
        forecastContainer.innerHTML = '';
        
        // Group forecast by day and get daily data
        const dailyForecast = {};
        forecastData.list.forEach(item => {
            const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
            if (!dailyForecast[date]) {
                dailyForecast[date] = {
                    temp_min: item.main.temp_min,
                    temp_max: item.main.temp_max,
                    weather: item.weather[0],
                    date: date
                };
            } else {
                // Update min and max temps
                if (item.main.temp_min < dailyForecast[date].temp_min) {
                    dailyForecast[date].temp_min = item.main.temp_min;
                }
                if (item.main.temp_max > dailyForecast[date].temp_max) {
                    dailyForecast[date].temp_max = item.main.temp_max;
                }
            }
        });
        
        // Display forecast for next 5 days
        const forecastDays = Object.values(dailyForecast).slice(0, 5);
        
        forecastDays.forEach(day => {
            const forecastItem = document.createElement('div');
            forecastItem.className = 'forecast-item';
            
            const iconClass = getWeatherIcon(day.weather.main.toLowerCase());
            
            forecastItem.innerHTML = `
                <div class="forecast-day">${day.date}</div>
                <div class="forecast-icon"><i class="fas ${iconClass}"></i></div>
                <div class="forecast-temp">
                    <span class="forecast-temp-max">${Math.round(day.temp_max)}°</span>
                    <span class="forecast-temp-min">${Math.round(day.temp_min)}°</span>
                </div>
            `;
            
            forecastContainer.appendChild(forecastItem);
        });
    }
    
    function getWeatherIcon(condition) {
        const iconMap = {
            'clear': 'fa-sun',
            'clouds': 'fa-cloud',
            'rain': 'fa-cloud-rain',
            'thunderstorm': 'fa-bolt',
            'snow': 'fa-snowflake',
            'mist': 'fa-smog',
            'smoke': 'fa-smog',
            'haze': 'fa-smog',
            'dust': 'fa-smog',
            'fog': 'fa-smog',
            'sand': 'fa-smog',
            'ash': 'fa-smog',
            'squall': 'fa-wind',
            'tornado': 'fa-tornado',
            'drizzle': 'fa-cloud-rain'
        };
        
        return iconMap[condition] || 'fa-cloud';
    }
    
    function updateBackground(weatherCondition) {
        const body = document.body;
        const particles = document.querySelector('.particles');
        
        // Remove all weather classes
        body.className = '';
        particles.className = 'particles';
        
        // Add class based on weather condition
        switch(weatherCondition.toLowerCase()) {
            case 'clear':
                body.classList.add('clear-sky');
                particles.classList.add('sunny');
                break;
            case 'clouds':
                body.classList.add('cloudy');
                particles.classList.add('cloudy');
                break;
            case 'rain':
                body.classList.add('rainy');
                particles.classList.add('rainy');
                break;
            case 'snow':
                body.classList.add('snowy');
                particles.classList.add('snowy');
                break;
            case 'thunderstorm':
                body.classList.add('stormy');
                particles.classList.add('stormy');
                break;
            default:
                body.classList.add('default-weather');
                particles.classList.add('default');
        }
    }
    
    function getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    fetchWeatherByCoords(latitude, longitude);
                },
                error => {
                    alert('Unable to retrieve your location. Please enable location services or search for a city.');
                    console.error('Geolocation error:', error);
                }
            );
        } else {
            alert('Geolocation is not supported by your browser. Please search for a city.');
        }
    }
    
    async function fetchWeatherByCoords(lat, lon) {
        try {
            // Fetch current weather by coordinates
            const currentWeatherResponse = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
            const currentWeatherData = await currentWeatherResponse.json();
            
            // Fetch forecast by coordinates
            const forecastResponse = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
            const forecastData = await forecastResponse.json();
            
            updateWeatherUI(currentWeatherData, forecastData);
            updateBackground(currentWeatherData.weather[0].main);
        } catch (error) {
            alert('Error fetching weather data for your location.');
            console.error('Error fetching weather by coordinates:', error);
        }
    }
});