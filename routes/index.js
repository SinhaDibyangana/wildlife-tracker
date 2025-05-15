var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const AlertLog = require('../models/AlertLog');





/* GET home page */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Wildlife Tracker' });
});

/* GET forest list */
router.get('/api/forests', (req, res) => {


  const dataPath = path.join(__dirname, '..', '..', 'dataset', 'forest_list.json');

  console.log('📁 Reading from:', dataPath); // Debug line



  
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error('❌ Error reading forest_list.json:', err.message);
      return res.status(500).json({ error: 'Failed to load forest list' });
    }

    try {
      const forests = JSON.parse(data);
      res.json(forests);
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError.message);
      res.status(500).json({ error: 'Invalid JSON format' });
    }
  });
});

// GET animal movement
router.get('/api/animals', (req, res) => {
  const filePath = path.join(__dirname, '..', '..', 'dataset', 'animal_movement.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to load animal data' });
    res.json(JSON.parse(data));
  });
});

// GET geofence zone
router.get('/api/geofence', (req, res) => {
  const filePath = path.join(__dirname, '..', '..', 'dataset', 'geofence_zones.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to load geofence' });
    res.json(JSON.parse(data));
  });
});

// 🧠 Route to get poaching risk from Flask
router.post('/api/risk', async (req, res) => {
  const { lat, lng, timestamp } = req.body;

  try {
    const response = await axios.post('http://127.0.0.1:5050/predict', {
      lat,
      lng,
      timestamp
    });

    res.json(response.data); // Return risk_score & level to frontend
  } catch (error) {
    console.error("⚠️ Error calling Flask API:", error.message);
    res.status(500).json({ error: 'Failed to get risk prediction' });
  }
});

router.post('/api/log-alert', async (req, res) => {
  console.log("🛑 Alert being logged:", req.body);
  try {
    const { forest, animalId, lat, lng, timestamp, riskScore } = req.body;

    const log = new AlertLog({
      forest,
      animalId,
      lat,
      lng,
      timestamp,
      riskScore
    });

    await log.save(); // MongoDB me save karo

    res.status(200).json({ message: 'Alert logged' });
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({ error: 'Could not save alert log' });
  }
});


module.exports = router;
