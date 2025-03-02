const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Accident = require('../models/accident');

router.post('/report', async (req, res) => {
    try {
        const { timestamp, location } = req.body;

        // Validate required fields
        if (!location || !location.latitude || !location.longitude || !location.city || !location.state) {
            return res.status(400).json({ error: "Missing required location fields (latitude, longitude, city, state)" });
        }

        const newAccident = new Accident({
            timestamp: timestamp || new Date(), // Use provided timestamp or default to now
            location
        });

        const savedAccident = await newAccident.save();
        res.status(201).json({ accidentId: savedAccident._id, message: 'SOS Report Submitted!' });
    } catch (error) {
        console.error('Error saving accident report:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/report/:id', async (req, res) => {
    try {
        const accidentId = req.params.id;
        const updateData = req.body; 
        if (!mongoose.Types.ObjectId.isValid(accidentId)) {
            return res.status(400).json({ error: "Invalid accident ID" });
        }

        
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: "No update data provided" });
        }

        
        const updatedAccident = await Accident.findByIdAndUpdate(
            accidentId,
            { $set: updateData }, 
            { new: true }
        );

        if (!updatedAccident) {
            return res.status(404).json({ error: "Accident record not found" });
        }

        res.json({
            message: "Accident report updated successfully",
            updatedAccident
        });
    } catch (error) {
        console.error('Error updating accident report:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/reports', async (req, res) => {
    try {
        const reports = await Accident.find();
        res.json(reports);
    } catch (error) {
        console.error('Error fetching accident reports:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/report/:id', async (req, res) => {
    try {
        const accidentId = req.params.id;

        // ✅ Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(accidentId)) {
            return res.status(400).json({ error: "Invalid accident ID" });
        }

        // ✅ Fetch the record
        const accident = await Accident.findById(accidentId);

        if (!accident) {
            return res.status(404).json({ error: "Accident record not found" });
        }

        res.json(accident);
    } catch (error) {
        console.error('Error fetching accident report:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;

