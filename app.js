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
const $pressure = $('#pressure');
const $visibility = $('#visibility');
const $airQuality = $('#air-quality');
const $date = $('#date');
const $time = $('#time');
const $condition = $('#condition');

const $settings = $('#settings');
const $dropdown = $('#dropdown');
const $colorMode = $('#color-mode');

$form.on('submit', async (e) => {
    e.preventDefault();

    const searchTerm = $input.val();

    if(searchTerm == '') {
        return;
    }

    $error.removeClass('active');
    updateSuggestions([]);

    try {
        let response = await axios.get(`${baseURL}/${weatherExtension}?key=${apiKey}&q=${searchTerm}&aqi=yes`);
        
        console.log(response)

        updateWeather(response.data);
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
    const $root = $(document.documentElement);
    const theme = $root.attr('data-theme');

    $root.attr('data-theme', theme == 'dark' ? 'light' : 'dark');
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
    $condition.text(`${condition.text}`)
    $temperature.text(`${current.temp_f}°`);
    $precipitation.text(`${current.precip_in}in`);
    $wind.text(`${current.wind_mph}mph`);
    $uv.text(`${current.uv}`);
    $pressure.text(`${current.pressure_in}in`);
    $visibility.text(`${current.vis_miles}mi`);
    $airQuality.text(`${current.air_quality.co}co`);
    $date.text(`${new Date().toDateString()}`);
    $time.text(`${getCurrentTime()}`);
    $weatherInfo.addClass('active');
}