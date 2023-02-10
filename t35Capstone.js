// T35 Compulsory Task Capstone Project

/** 
 * Use (node.js) Fetch
 * Work under the assumption that the city is always South Africa
 * 
 * The following details are to be shown:
 * - Population, using this api (https://rapidapi.com/wirefreethought/api/geodb-cities/)
 * - Elevation, using this api (https://rapidapi.com/wirefreethought/api/geodb-cities/)
 * - Current temperature, using this api (https://rapidapi.com/weatherbit/api/weather/)
 * 
 * All potential errors should be appropriately handled
 */

/**
 * From the GeoDB Cities API documentation there is a "City Details" endpoint where I can get the population, elevation, 
 * longitude and latitude data for the city, but it only accepts cityId as the input, therefore I need to make an additional
 * API call to the "Cities" endpoint with the name of the city to retrieve the cityId value to pass to the "City Details" endpoint
 * 
 * When I have the longitude and latitude data I can use this with the "Weather API Current Weather Data of a Location" API
 * to get the current temperature for the city.
 */

/**
 * pseudocode:
 * 1 Define the city name to be used
 * 2 Get the cityId from an API request
 * 3 Use the cityId to make another API request to get the population, elevation, longitude and latitude data for the city
 * 4 Print to the population and elevation to the console
 * 5 Use the longitude and latitude data to make an API request for the current temperature at the defined city
 * 6 Print the current temperature to the console
 * 7 Catch any errors that may have occurred  
 */

const cityName = "pretoria" // defining the city to get the information on

const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?countryIds=ZA&namePrefix=${cityName}`; // defining the url of the api endpoint

const options = { // defining the http verb and headers with my api key for the GeoDB Cities API 
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': 'ba05e3d9b8msh8e4162e298875d0p1e28d3jsndf6a56e2c74f',
    'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
  }
};

const options2 = { // defining the http verb and headers with my api key for the Weather API
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': 'ba05e3d9b8msh8e4162e298875d0p1e28d3jsndf6a56e2c74f',
    'X-RapidAPI-Host': 'weatherbit-v1-mashape.p.rapidapi.com'
  }
};

fetch(url, options) // The first fetch to get the cityId
	.then(res => res.json()) // converting what was returned from the first fetch to a json object
	.then(json => { // performing a function on the json object
      let cityId = json.data[0].id;
      console.log(`The data for ${cityName} is shown below:\n`)
      return new Promise(resolve => setTimeout(() => resolve(fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities/${cityId}/`, options)), 1500)); // The second fetch to get the population, elevation, longitude and latitude data for the city. The free version of the API is limited to 1 request per second. I kept receiving an error of ('You have exceeded the rate limit per second for your plan, BASIC, by the API provider') when I ran the second fetch. I tried an async / await function which would wait for the first api call to finish before making the second api call, but the time between the calls was less than 1 second so it didn't work. I needed to delay the second request by creating a new promise that resolved the fetch after 1.5 seconds. The new promise is then returned to the next .then
    })
	.then(res2 => res2.json()) // converting what was returned from the second fetch to a json object
	.then(json2 => { // performing a function on the json object
      let population = json2.data.population;
      let elevation = json2.data.elevationMeters;
      let longitude = json2.data.longitude;
      let latitude = json2.data.latitude;
      console.log(`Population: ${population}`);
      console.log(`Elevation: ${elevation}`);
      return fetch(`https://weatherbit-v1-mashape.p.rapidapi.com/current?lon=${longitude}&lat=${latitude}`, options2) // The third fetch to get the current temperature at the defined city. The promise is then returned to the next .then. This api has a daily limit of 25 results so only run the program the minimum amount of times necessary to test it
    })
  .then(res3 => res3.json()) // converting what was returned from the third fetch to a json object
	.then(json3 => {// performing a function on the json object
      let temperature = json3.data[0].temp;
      console.log(`The current temperature is ${temperature} C`)
    })
	.catch(err => console.error('error:' + err)); // catching and printing any errors that may occur in the programme.