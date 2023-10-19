const apiKey = '9b60528ef675419baa2214630222305';
const baseURL = 'http://api.weatherapi.com/v1';
const weatherExtension = 'current.json';
const searchExtension = 'search.json';

const $form = $('#form');
const $input = $('#search');
const $suggestions = $('#suggestions');
const $notification = $('#notification');

const $wetherInfo = $('#wether-info');
const $defaultImg = $('#default-img');

$form.on('submit', async (e) => {
    e.preventDefault();

    const searchTerm = $input.val();

    if(searchTerm == '') {
        return;
    }

    updateSuggestions([]);
    $notification.text(``);

    try {
        let response = await axios.get(`${baseURL}/${weatherExtension}?key=${apiKey}&q=${searchTerm}&aqi=yes`);
        
        updateWeather(response.data);
    } catch (error) {
        $defaultImg.attr('src', './images/forest-fire.png');
        $notification.text(`Uh oh... that's a 404.`);
    }

    $form.trigger('reset');
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

    updateSuggestions(locations.length === 0 ? ['No Locations'] : locations);
})

$suggestions.on('click', (e) => {
    let location = e.target.innerText;
    $input.val(location);

    $form.trigger('submit');
})

function updateSuggestions(locations) {
    $suggestions.empty();

    locations.forEach((location) => {
        let $ul = $("<ul>").addClass("suggestion").text(location);
        $suggestions.append($ul);
    })
}

function updateWeather(weather) {
    let current = weather.current;
    let condition = current.condition;

    $defaultImg.attr('src', condition.icon)
}