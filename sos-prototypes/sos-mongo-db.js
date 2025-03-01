const mongoose = require('mongoose');

const victimSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    location: {
        latitude: Number,
        longitude: Number,
        city: String,
        state: String
    },
    victimDetails: {
        firstName: String,
        lastName: String,
        age: Number,
        gender: String
    },
    injuryDetails: {
        type: String,
        severity: String,
        description: String
    },
    reporterDetails: {
        name: String,
        contactInfo: String
    },
    images: [String], // URLs or IDs of uploaded images
    emergencyResponse: {
        responded: { type: Boolean, default: false },
        ambulance: String,
        hospitalAssigned: String
    }
});

const Victim = mongoose.model('Victim', victimSchema);

module.exports = Victim;
