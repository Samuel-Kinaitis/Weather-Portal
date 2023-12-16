//Browser Geolocation API

console.log("test");

    // Function to calculate the distance between two points using Haversine formula
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * (Math.PI / 180)) *
          Math.cos(lat2 * (Math.PI / 180)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in kilometers
  
        return distance;
      }
  
      // Function to set a cookie with a name, value, and expiration in days
      function setCookie(name, value, days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
      }
  
      // Function to retrieve the stored location from the cookie
      function getUserStoredLocation() {
        var name = "userLocation=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var cookies = decodedCookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
          var cookie = cookies[i].trim();
          if (cookie.indexOf(name) == 0) {
            return JSON.parse(cookie.substring(name.length, cookie.length));
          }
        }
        return null;
      }
  
      // Function to get the user's current location
      function getUserLocations() {
        // Retrieve the stored location
        var storedLocation = getUserStoredLocation();
  
        if (storedLocation) {
          var storedLatitude = storedLocation.latitude;
          var storedLongitude = storedLocation.longitude;
  
          // Log the stored location
          console.log("Stored Location:", storedLocation);
  
          // Get the current location
          if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (currentPosition) {
              var currentLatitude = currentPosition.coords.latitude;
              var currentLongitude = currentPosition.coords.longitude;
  
              // Calculate the distance between the current and stored locations
              var distance = calculateDistance(
                currentLatitude,
                currentLongitude,
                storedLatitude,
                storedLongitude
              );
  
              console.log("Current Location:", { latitude: currentLatitude, longitude: currentLongitude });
              console.log("Distance between current and stored locations:", distance.toFixed(2), "km");
  
              // You can set a threshold distance and compare it to determine if the locations are similar
              var thresholdDistance = 1; // Adjust as needed
              if (distance <= thresholdDistance) {
                console.log("The locations are similar.");
              } else {
                console.log("The locations are different.");
              }
            });
          } else {
            console.log("Geolocation is not available");
          }
        } else {
          console.log("No stored location found.");
        }
      }
  
    //   // Event listener for the "Get Locations" button
    //   document.getElementById("get-locations").addEventListener("click", function () {
    //     getUserLocations();
    //   });

    function test(){

      //Check if location is storaged (Check for how old last stored location is)


          // Check if the Geolocation API is supported by the browser
    if ('geolocation' in navigator) {
      // Show loading message
      showLoadingMessage();

      // Use the Geolocation API to get the user's current position
      navigator.geolocation.getCurrentPosition(
          function (position) {
              // Hide loading message
              hideLoadingMessage();

              // Success callback
              const latitude = position.coords.latitude;
              const longitude = position.coords.longitude;

              console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
              
              // Now you can use the obtained latitude and longitude for your purposes
          },
          function (error) {
              // Hide loading message
              hideLoadingMessage();

              // Error callback
              switch (error.code) {
                  case error.PERMISSION_DENIED:
                      console.error('User denied the request for Geolocation.');
                      break;
                  case error.POSITION_UNAVAILABLE:
                      console.error('Location information is unavailable.');
                      break;
                  case error.TIMEOUT:
                      console.error('The request to get user location timed out.');
                      break;
                  case error.UNKNOWN_ERROR:
                      console.error('An unknown error occurred.');
                      break;
              }
          }
      );
    } else {
      // Geolocation is not supported by the browser
      console.error('Geolocation is not supported by your browser.');
    }

    function showLoadingMessage() {
      // You can implement your loading UI here, e.g., display a loading spinner or message
      console.log('Getting current location, please stand by...');
    }

    function hideLoadingMessage() {
      // You can implement logic to hide your loading UI here
      console.log('Location request complete.');
    }

    }

//NWS API

//Get location weather information based off of 
  function NWSLocationCall(latitude,longitude){
      const apiUrl = `https://api.weather.gov/points/${latitude},${longitude}`;
  //'ProgramName (email@adress)'
  const userAgent = 'NWS-WeatherPortal (samuel.kinaitis@gmail.com)';
  
  fetch(apiUrl, {
      headers: {
          'User-Agent': userAgent
      }
  })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          // Extract the forecast URL
          const forecastUrl = data.properties.forecast;
  
          // Make a request to the forecast URL to get the actual weather forecast data
          fetch(forecastUrl, {
              headers: {
                  'User-Agent': userAgent
              }
          })
              .then(forecastResponse => {
                  if (!forecastResponse.ok) {
                      throw new Error('Network response for forecast was not ok');
                  }
                  return forecastResponse.json();
              })
              .then(forecastData => {
                  // Handle the forecast data
                  console.log(forecastData);
              })
              .catch(forecastError => {
                  console.error('Error fetching forecast data:', forecastError);
              });
      })
      .catch(error => {
          console.error('Error fetching weather data:', error);
      });
  }
  