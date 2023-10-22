const apiKey = '9b60528ef675419baa2214630222305';
const baseURL = 'http://api.weatherapi.com/v1';
const weatherExtension = 'current.json';
const searchExtension = 'search.json';
const forecastExtension = 'forecast.json';

const $form = $('#form');
const $input = $('#search');
const $suggestions = $('#suggestions');
const $error = $('#error');

const $weatherInfo = $('#weather-info');
const $mainInfo = $('#main-info');
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

const $root = $(document.documentElement);

let currentRes = null;

$form.on('submit', async (e) => {
    e.preventDefault();

    const searchTerm = $input.val();

    if(searchTerm == '') {
        return;
    }

    $error.removeClass('active');
    updateSuggestions([]);

    try {
        currentRes = await axios.get(`${baseURL}/${forecastExtension}?key=${apiKey}&q=${searchTerm}&aqi=yes`);

        const $chart = $('#myChart');
        let wasActive = false;

        if ($chart.length) {
            if($chart.get(0).classList.contains('active')) {
                wasActive = true;
            }

            $chart.remove();
        }

        const timestamps = currentRes.data.forecast.forecastday[0].hour;
        const xValues = timestamps.map(data => militaryToStandard(data.time.substring(data.time.indexOf(' ') + 1)));
        const yValues = timestamps.map(data => data.temp_f);
        
        const chartCanvas = $('<canvas id="myChart"></canvas>').get(0);

        if(wasActive) {
            $(chartCanvas).addClass('active');
        }

        $mainInfo.append(chartCanvas);
        
        new Chart(chartCanvas, {
            type: "line",
            data: {
                labels: xValues,
                datasets: [{
                    backgroundColor: "#1e1e1e",
                    borderColor: "#1e1e1e",
                    pointBackgroundColor: "white",
                    pointBorderColor: "white",
                    data: yValues
                }]
            },
            options: {
                legend: {
                    display: false
                }
            }
        });

        updateWeather(currentRes.data);
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

$mainInfo.on('click', () => {
    $content.toggleClass('inactive');
    $('#myChart').toggleClass('active');
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

    if ($weatherInfo.hasClass('active') && currentRes !== null) {
        let actual = currentRes.data.current;

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