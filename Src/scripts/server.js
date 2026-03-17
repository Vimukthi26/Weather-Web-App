const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
const path = require('path');
app.use(express.static(path.join(__dirname, '..'))); // Serve frontend files from Src folder (one level up from scripts)

const weatherRoutes = require('../routes/weather');

app.use('/api', weatherRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
