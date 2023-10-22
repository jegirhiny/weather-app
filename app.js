const apiKey = '9b60528ef675419baa2214630222305';
const baseURL = 'http://api.weatherapi.com/v1';
const weatherExtension = 'current.json';
const searchExtension = 'search.json';

const $form = $('#form');
const $input = $('#search');
const $suggestions = $('#suggestions');
const $error = $('#error');

const $weatherInfo = $('#weather-info');
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

const $root = $(document.documentElement);

let lastResponse = null;

$form.on('submit', async (e) => {
    e.preventDefault();

    const searchTerm = $input.val();

    if(searchTerm == '') {
        return;
    }

    $error.removeClass('active');
    updateSuggestions([]);

    try {
        lastResponse = await axios.get(`${baseURL}/${weatherExtension}?key=${apiKey}&q=${searchTerm}&aqi=yes`);

        updateWeather(lastResponse.data);
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

    let response = await axios.get(`${baseURL}/${searchExtension}?key=${apiKey}&q=${searchTerm}&aqi=yes`);

    let locations = response.data.map((location) => {
        return `${location.name}, ${location.region}` 
    })

    updateSuggestions(locations.length === 0 ? [] : locations);
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

function updateSuggestions(locations) {
    $suggestions.empty();

    locations.forEach((location) => {
        let $ul = $("<ul>").addClass("suggestion").text(location);
        $suggestions.append($ul);
    })
}

$colorMode.on('click', () => {
    $root.attr('data-theme', localStorage.getItem('data-theme') == 'dark' ? 'light' : 'dark');

    localStorage.setItem('data-theme', $root.attr('data-theme'));
})

$imperialMetric.on('click', () => {
    localStorage.setItem('unit-type', localStorage.getItem('unit-type') == 'imperial' ? 'metric' : 'imperial');

    if ($weatherInfo.hasClass('active') && lastResponse !== null) {
        let actual = lastResponse.data.current;

        $temperature.text(localStorage.getItem('unit-type') == 'metric' ? `${actual.temp_f}°` : `${actual.wind_kph}°`);
        $wind.text(localStorage.getItem('unit-type') == 'metric' ? `${actual.wind_mph}mph` : `${actual.wind_kph}kph`);
        $precipitation.text(localStorage.getItem('unit-type') == 'metric' ? `${actual.precip_in}in` : `${actual.precip_mm}mm`);
        $visibility.text(localStorage.getItem('unit-type') == 'metric' ? `${actual.vis_miles}mi` : `${actual.vis_km}km`);
    }
})

$(document).ready(() => {
    if (localStorage.getItem('data-theme') === null) {
        localStorage.setItem('data-theme', 'dark');
    }

    if (localStorage.getItem('unit-type') === null) {
        localStorage.setItem('unit-type', 'metric');
    }

    $root.attr('data-theme', localStorage.getItem('data-theme'));
})

function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;

    return `${hours12 < 10 ? '0' : ''}${hours12}:${minutes < 10 ? '0' : ''}${minutes} ${amOrPm}`;
  }

function updateWeather(weather) {
    let current = weather.current;
    let condition = current.condition;

    $conditionImg.attr('src', condition.icon);
    $condition.text(`${condition.text}`);

    $temperature.text(localStorage.getItem('unit-type') == 'metric' ? `${current.temp_f}°` : `${current.wind_kph}°`);
    $wind.text(localStorage.getItem('unit-type') == 'metric' ? `${current.wind_mph}mph` : `${current.wind_kph}kph`);
    $precipitation.text(localStorage.getItem('unit-type') == 'metric' ? `${current.precip_in}in` : `${current.precip_mm}mm`);
    $visibility.text(localStorage.getItem('unit-type') == 'metric' ? `${current.vis_miles}mi` : `${current.vis_km}km`);

    $uv.text(`${current.uv}`);
    $humidity.text(`${current.humidity}%`);
    $airQuality.text(`${current.air_quality['us-epa-index']}`);
    $date.text(`${new Date().toDateString()}`);
    $time.text(`${getCurrentTime()}`);

    $weatherInfo.addClass('active');
}