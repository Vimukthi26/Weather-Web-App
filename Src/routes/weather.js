const express = require('express');
const router = express.Router();
const axios = require('axios');

// Route for weather data
router.get('/weather', async (req, res) => {
    try {
        const { lat, lon } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({ error: 'Latitude and Longitude are required' });
        }

        // Using Open-Meteo API
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m`;

        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        res.status(500).json({ error: 'Error fetching weather data' });
    }
});

// Route for geocoding (searching by city name)
router.get('/geocode', async (req, res) => {
    try {
        const { city } = req.query;

        if (!city) {
            return res.status(400).json({ error: 'City name is required' });
        }

        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;

        const response = await axios.get(url);
        if (response.data.results && response.data.results.length > 0) {
            res.json(response.data.results[0]);
        } else {
            res.status(404).json({ error: 'City not found' });
        }
    } catch (error) {
        console.error('Error geocoding city:', error.message);
        res.status(500).json({ error: 'Error finding city coordinates' });
    }
});

module.exports = router;
