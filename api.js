var map = L.map('map').setView([39.8283, -98.5795], 4); // Centered on the United States
          
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors'
            }).addTo(map);
          
            var marker;
          
            // Event listener for map click
            map.on('click', function(e) {
              var clickedLatLng = e.latlng;
              console.log("Clicked on: " + clickedLatLng.lat + ", " + clickedLatLng.lng);
              findNearestTown(clickedLatLng);
            });
          
            //input box enter
            function handleKeyPress(event) {
                // Check if the pressed key is Enter (keyCode 13)
                if (event.keyCode === 13) {
                  // Call your function here
                  searchCity();
                }
              }
          
            function searchCity() {
              var city = document.getElementById('city').value;
          
              if (!city) return;
          
              // Use OpenStreetMap Nominatim API to get coordinates
              var nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${city},USA&bounded=1`;
          
              fetch(nominatimUrl)
                .then(response => response.json())
                .then(data => {
                  if (data.length > 0) {
                    // Display search results in a dropdown
                    var resultsContainer = document.getElementById('results');
                    resultsContainer.innerHTML = '';
          
                    var dropdown = document.createElement('select');
                    dropdown.setAttribute('id', 'cityDropdown');
                    dropdown.addEventListener('change', function() {
                      var selectedCity = dropdown.options[dropdown.selectedIndex].text;
                      displayCityOnMap(selectedCity);
                    });
          
                    data.forEach(cityResult => {
                      var option = document.createElement('option');
                      option.value = cityResult.display_name;
                      option.text = cityResult.display_name;
                      dropdown.appendChild(option);
                    });
          
                    resultsContainer.appendChild(dropdown);
          
                    // Display the first location on the map by default
                    displayCityOnMap(data[0].display_name);
                  } else {
                    console.log("No results found for " + city);
                  }
                })
                .catch(error => console.error('Error:', error));
            }
          
            function displayCityOnMap(selectedCity) {
              // Use OpenStreetMap Nominatim API to get coordinates for the selected city
              var nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${selectedCity}&bounded=1`;
          
              fetch(nominatimUrl)
                .then(response => response.json())
                .then(data => {
                  if (data.length > 0) {
                    var coordinates = data[0];
                    var latlng = L.latLng(coordinates.lat, coordinates.lon);
                    map.flyTo(latlng, 10);
          
                    if (marker) {
                      map.removeLayer(marker);
                    }
          
                    marker = L.marker(latlng).addTo(map);
                    console.log("Coordinates for " + selectedCity + ": " + coordinates.lat + ", " + coordinates.lon);
                    showWeather(coordinates.lat, coordinates.lon);
                  } else {
                    console.log("Coordinates not found for " + selectedCity);
                  }
                })
                .catch(error => console.error('Error:', error));
            }
          
            function findNearestTown(clickedLatLng) {
              // Use OpenStreetMap Nominatim API to find the nearest town
              var nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${clickedLatLng.lat}&lon=${clickedLatLng.lng}&zoom=10&addressdetails=1,USA&bounded=1`;
          
              fetch(nominatimUrl)
                .then(response => response.json())
                .then(data => {
                  var town = data.address.town || data.address.city || data.address.village || data.address.hamlet;
                  var state = data.address.state;
                  if (town && state) {
                    console.log("Nearest town: " + town + ", " + state);
                    displayCityOnMap(`${town}, ${state}`);
                  } else {
                    console.log("No town found near the clicked location");
                  }
                })
                .catch(error => console.error('Error:', error));
            }

// Function to get user's location
function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      // Call the showWeather function with coordinates
      showWeather(position.coords.latitude, position.coords.longitude);
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

// Function to show weather information based on coordinates
function showWeather(latitude, longitude) {
  // Call National Weather Service API to get weather information
  const weatherApiUrl = `https://api.weather.gov/points/${latitude},${longitude}`;

  // Use Fetch API for Ajax request
  fetch(weatherApiUrl)
    .then(response => response.json())
    .then(data => {
      const forecastUrl = data.properties.forecast;
      
      // Another Fetch request for forecast data
      return fetch(forecastUrl);
    })
    .then(response => response.json())
    .then(forecastData => {
      // Display weather information for each forecast period
      const forecastPeriods = forecastData.properties.periods;

      let weatherInfo = '<h2>Weather Information</h2>';

      forecastPeriods.forEach(period => {
        weatherInfo += `<p><strong>${period.name}:</strong> ${period.detailedForecast}</p>`;
      });

      document.getElementById('weather-info').innerHTML = weatherInfo;
      document.getElementById('weather-info').classList.add("container");
      document.getElementById("weather-info").scrollIntoView({ behavior: "smooth" });
    })
    .catch(error => {
      console.error('Error:', error);
    });
}