# weather-app
A simple web application that allows users to check the current weather and forecast for a specific location. The app provides various weather-related information, including temperature, precipitation, wind, UV index, humidity, air quality, visibility, and more. Users can search for a city or zip code to get the weather details for their desired location.

### Project Structure
- `/images` Various images used for icons and visual elements.
- `index.html` The main HTML file that structures the web page.
- `index.css`  The CSS file for styling the web page.
- `app.js` The JavaScript file containing the application logic.

### Usage
1. Clone this repository to your local machine.
2. Obtain an API key and replace the API_KEY variable within the ``app.js`` file.
3. Open the `index.html` file in a web browser to access the weather app.
4. Enter a city name or zip code in the search input field.
5. Press the "Enter" key to retrieve weather information for the specified location.
6. The app will display the current weather conditions, temperature, precipitation, and other details.

### API Key
To make the app work, replace the API_KEY variable in the ``app.js`` file with a new key obtained from [WeatherAPI](https://www.weatherapi.com/).

```javascript
const API_KEY = 'YOUR_API_KEY_HERE';
```

### Screenshots
<img src="https://github.com/jegirhiny/weather-app/assets/93138298/b49ce223-53f1-4cdc-b2ea-03ecc5ffcb93" width="45%" alt="app-white-search">
<img src="https://github.com/jegirhiny/weather-app/assets/93138298/3ef24c5c-1946-4e3b-9302-4306693e8ba3" width="45%" alt="app-white-search">
<img src="https://github.com/jegirhiny/weather-app/assets/93138298/e38227e7-0ed0-45e6-96ce-c7c0556086bb" width="45%" alt="app-white-search">
<img src="https://github.com/jegirhiny/weather-app/assets/93138298/88c3a568-2e92-4935-80ab-c36a6d6ffc76" width="45%" alt="app-white-search">
<img src="https://github.com/jegirhiny/weather-app/assets/93138298/147050d7-c17c-4b66-ac63-de84c5b0b010" width="45%" alt="app-white-search">
<img src="https://github.com/jegirhiny/weather-app/assets/93138298/b094f007-d432-4b62-be47-05249681a120" width="45%" alt="app-white-search">
<img src="https://github.com/jegirhiny/weather-app/assets/93138298/1cf94263-59c7-4aec-b736-58c4d02845ed" width="45%" alt="app-white-search">
<img src="https://github.com/jegirhiny/weather-app/assets/93138298/6aab545f-344b-41e4-93ab-e4e43a2ce824" width="45%" alt="app-white-search">

### Features
- **Real-time Weather Data**: Get up-to-date weather information using the WeatherAPI.
- **Weather Display**: View a wide range of weather parameters at a glance.
- **Unit Conversion**: Easily switch between metric and imperial units to suit your preference.
- **Customizable Themes**: Choose between light and dark themes for a personalized user interface.

### Technologies
- **Axios**: Utilized for making API requests.
- **jQuery**: Empowering DOM manipulation.
- **Front-end**: Built with JavaScript, HTML, and CSS.

### Acknowledgments
- Weather data provided by [WeatherAPI](https://www.weatherapi.com/).
- Icons provided by [Boxicons](https://boxicons.com/?query=).
