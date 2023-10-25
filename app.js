const baseURL = 'http://api.weatherapi.com/v1';
const searchExtension = 'search.json';
const forecastExtension = 'forecast.json';

const $root = $(document.documentElement);
const $form = $('#form');
const $input = $('#search');
const $suggestions = $('#suggestions');
const $error = $('#error');
const $noApiKey = $('#no-api-key');
const $weatherInfo = $('#weather-info');
const $mainInfo = $('#main-info');
const $hourly = $('#hourly');
const $conditionImg = $('#condition-img');
const $temperature = $('#temperature');
const $precipitation = $('#precipitation');
const $wind = $('#wind');
const $uv = $('#uv');
const $humidity = $('#humidity');
const $visibility = $('#visibility');
const $airQuality = $('#air-quality');
const $date = $('#date');
const $time = $('#time');
const $condition = $('#condition');
const $settings = $('#settings');
const $dropdown = $('#dropdown');
const $colorMode = $('#color-mode');
const $imperialMetric = $('#imperial-metric');
const $content = $('#content');
const $morningTemp = $('#morning-temp');
const $afternoonTemp = $('#afternoon-temp');
const $eveningTemp = $('#evening-temp');
const $chanceRain = $('#chance-rain');
const $chanceSnow = $('#chance-snow');

let response = null;

$form.on('submit', async (e) => {
    e.preventDefault();

    const searchTerm = $input.val();

    if(searchTerm == '') {
        return;
    }

    $error.removeClass('active');
    updateSuggestions([]);

    try {
        response = await axios.get(`${baseURL}/${forecastExtension}?key=${API_KEY}&q=${searchTerm}&aqi=yes`);

        updateWeather();
        updateHourly();
    } catch (error) {
        $weatherInfo.removeClass('active');
        $error.addClass('active');
    }
})

$form.on('keyup', async (e) => {
    const searchTerm = $input.val();

    if(searchTerm == '' || e.key == 'Enter' || e.key == 'Return') {
        updateSuggestions([]);
        return;
    }

    try {
        let response = await axios.get(`${baseURL}/${searchExtension}?key=${API_KEY}&q=${searchTerm}&aqi=yes`);

        let locations = response.data.map((location) => {
            return `${location.name}, ${location.region}`;
        })

        updateSuggestions(locations.length === 0 ? [] : locations);
    } catch (error) {
        $weatherInfo.removeClass('active');
        $error.addClass('active');
    }
})

$mainInfo.on('click', () => {
    if($content.hasClass('inactive')) {
        $hourly.fadeOut(400, () => {
            $hourly.toggleClass('inactive');
            $content.toggleClass('inactive');
            $content.fadeIn(400);
        })
    } else {
        $content.fadeOut(400, () => {
            $hourly.toggleClass('inactive');
            $content.toggleClass('inactive');
            $hourly.fadeIn(400);
        })
    }
})

$suggestions.on('click', (e) => {
    let location = e.target.innerText;
    $input.val(location);

    updateSuggestions([]);
    $form.trigger('submit');
})

$settings.on('click', () => {
    $dropdown.toggleClass('active');
})

$colorMode.on('click', () => {
    $root.attr('data-theme', localStorage.getItem('data-theme') == 'dark' ? 'light' : 'dark');

    localStorage.setItem('data-theme', $root.attr('data-theme'));
})

$imperialMetric.on('click', () => {
    localStorage.setItem('unit-type', localStorage.getItem('unit-type') == 'imperial' ? 'metric' : 'imperial');

    if(localStorage.getItem('unit-type') == 'imperial') {
        $imperialMetric.text('F');
    } else {
        $imperialMetric.text('C');
    }

    if ($weatherInfo.hasClass('active') && response !== null) {
        let actual = response.data.current;

        $temperature.text(localStorage.getItem('unit-type') == 'imperial' ? `${actual.temp_f}°` : `${actual.temp_c}°`);
        $wind.text(localStorage.getItem('unit-type') == 'imperial' ? `${actual.wind_mph}mph` : `${actual.wind_kph}kph`);
        $precipitation.text(localStorage.getItem('unit-type') == 'imperial' ? `${actual.precip_in}in` : `${actual.precip_mm}mm`);
        $visibility.text(localStorage.getItem('unit-type') == 'imperial' ? `${actual.vis_miles}mi` : `${actual.vis_km}km`);

        updateHourly();
    }
})

$(document).ready(() => {
    if (localStorage.getItem('data-theme') === null) {
        localStorage.setItem('data-theme', 'light');
    }

    if (localStorage.getItem('unit-type') === null) {
        localStorage.setItem('unit-type', 'imperial');
    }

    if(localStorage.getItem('unit-type') == null || localStorage.getItem('unit-type') == 'imperial') {
        $imperialMetric.text('F');
    } else {
        $imperialMetric.text('C');
    }

    $root.attr('data-theme', localStorage.getItem('data-theme'));
})

function militaryToStandard(militaryTime) {
    const [h, m] = militaryTime.split(':');

    return `${((h % 12) || 12)}:${m} ${h < 12 ? 'AM' : 'PM'}`;
  }

function updateSuggestions(locations) {
    $suggestions.empty();

    locations.forEach((location) => {
        let $ul = $("<ul>").addClass("suggestion").text(location);
        $suggestions.append($ul);
    })
}

function updateWeather() {
    let current = response.data.current;
    let condition = current.condition;

    $conditionImg.attr('src', condition.icon);
    $condition.text(`${condition.text}`);

    $temperature.text(localStorage.getItem('unit-type') == 'imperial' ? `${current.temp_f}°` : `${current.temp_c}°`);
    $wind.text(localStorage.getItem('unit-type') == 'imperial' ? `${current.wind_mph}mph` : `${current.wind_kph}kph`);
    $precipitation.text(localStorage.getItem('unit-type') == 'imperial' ? `${current.precip_in}in` : `${current.precip_mm}mm`);
    $visibility.text(localStorage.getItem('unit-type') == 'imperial' ? `${current.vis_miles}mi` : `${current.vis_km}km`);

    $uv.text(`${current.uv}`);
    $humidity.text(`${current.humidity}%`);
    $airQuality.text(`${current.air_quality['us-epa-index']}`);
    $date.text(`${new Date().toDateString()}`);
    $time.text(`${getCurrentTime()}`);

    $weatherInfo.addClass('active');
}

function updateHourly() {
    let forecastDay = response.data.forecast.forecastday[0];

    let morning = forecastDay.hour[8];
    let afternoon = forecastDay.hour[14];
    let evening = forecastDay.hour[21];

    let chanceOfRain = 0, chanceOfSnow = 0;

    forecastDay.hour.forEach((hour) => {
        chanceOfRain += hour.chance_of_rain;
        chanceOfSnow += hour.chance_of_snow;
    });

    chanceOfRain = Math.min(chanceOfRain, 100);
    chanceOfSnow = Math.min(chanceOfSnow, 100);

    $morningTemp.text(localStorage.getItem('unit-type') == 'imperial' ? `${morning.temp_f}°` : `${morning.temp_c}°`);
    $afternoonTemp.text(localStorage.getItem('unit-type') == 'imperial' ? `${afternoon.temp_f}°` : `${afternoon.temp_c}°`);
    $eveningTemp.text(localStorage.getItem('unit-type') == 'imperial' ? `${evening.temp_f}°` : `${evening.temp_c}°`);
    $chanceRain.text(`${chanceOfRain}%`);
    $chanceSnow.text(`${chanceOfSnow}%`);
}

function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;

    return `${hours12 < 10 ? '0' : ''}${hours12}:${minutes < 10 ? '0' : ''}${minutes} ${amOrPm}`;
  }