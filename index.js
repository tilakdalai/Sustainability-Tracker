document.getElementById('trackerForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Get user input values
    const transportation = document.getElementById('transportation').value.trim();
    const energyConsumption = document.getElementById('energyConsumption').value.trim();
    const destination = document.getElementById('destination').value.trim();
    const weatherLocation = document.getElementById('weatherLocation').value.trim();

    // Display a loading message
    document.getElementById('results').innerHTML = '<p>Loading data...</p>';

    try {
        // Fetch transportation data from Google Maps API using CORS proxy
        const transportationResponse = await fetch(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/directions/json?origin=${transportation}&destination=${destination}&mode=driving&key=AIzaSyC3IhXD80-TLPcb9gca29D88gCjGVXC3-c`);
        const transportationData = await transportationResponse.json();
        console.log('Transportation Data:', transportationData); // Log transportation data

        // Fetch energy data from Carbon Interface API
        const energyResponse = await fetch(`https://api.carboninterface.com/v1/estimate`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${carbonInterfaceApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "type": "electricity",
                "consumption": energyConsumption
            })
        });
        const energyData = await energyResponse.json();
        console.log('Energy Data:', energyData); // Log energy data

        // Fetch weather data from WeatherAPI
        const weatherResponse = await fetch(`https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${weatherLocation}`);
        const weatherData = await weatherResponse.json();
        console.log('Weather Data:', weatherData); // Log weather data

        // Create result HTML to display data
        const resultHTML = `
            <div class="result-card">
                <h3>Transportation Impact</h3>
                <p>Mode: ${transportation}</p>
                <p>Emissions: ${transportationData.routes[0].legs[0].distance.text} km</p>
            </div>
            <div class="result-card">
                <h3>Energy Consumption</h3>
                <p>Consumption: ${energyConsumption} kWh</p>
                <p>Impact: ${energyData.data.attributes.carbon_footprint} kg of CO2</p>
            </div>
            <div class="result-card">
                <h3>Weather Information</h3>
                <p>Location: ${weatherLocation}</p>
                <p>Condition: ${weatherData.current.condition.text}</p>
                <p>Temperature: ${weatherData.current.temp_c}°C</p>
            </div>
        `;

        // Display results on the page
        document.getElementById('results').innerHTML = resultHTML;
    } catch (error) {
        document.getElementById('results').innerHTML = '<p>Error fetching data. Please try again.</p>';
        console.error('Error fetching data:', error);
    }
});