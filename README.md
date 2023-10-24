# weather-app
This is a simple weather web application that allows users to check the current weather and forecast for a specific location. The app provides various weather-related information, including temperature, precipitation, wind, UV index, humidity, air quality, visibility, and more. Users can search for a city or zip code to get the weather details for their desired location.

### Project Structure
* `/images` Various images used for icons and visual elements.
* `index.html` The main HTML file that structures the web page.
* `index.css`  The CSS file for styling the web page.
* `app.js` The JavaScript file containing the application logic.

### Usage
1. Clone this repository to your local machine.
2. Open the `index.html` file in a web browser to access the weather app.
3. Enter a city name or zip code in the search input field.
4. Press the "Enter" key to retrieve weather information for the specified location.
5. The app will display the current weather conditions, temperature, precipitation, and other details.

### API Key
To make the app work, you'll need to obtain an API key from WeatherAPI and replace the apiKey variable in `app.js`.

```javascript
const apiKey = 'YOUR_API_KEY_HERE';
```

### Features
* Real-time weather data retrieval using the WeatherAPI.
* Display of various weather parameters.
* Switch between metric and imperial units.
* Light and dark theme options for the user interface.

### Technologies Used
* Axios for API requests
* jQuery for DOM manipulation
* JavaScript, HTML, and CSS

### Acknowledgments
* Weather data provided by [WeatherAPI](https://www.weatherapi.com/).
* Icons provided by [Boxicons](https://boxicons.com/?query=).