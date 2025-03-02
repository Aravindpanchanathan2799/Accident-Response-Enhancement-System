const mongoose = require('mongoose');

const accidentSchema = new mongoose.Schema(
    {
        timestamp: { type: Date, default: Date.now },
        location: {
            latitude: { type: Number, required: true },
            longitude: { type: Number, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true }
        },
        description: { type: String, default: "" } 
    },
    { strict: false } 
);

const Accident = mongoose.model('Accident', accidentSchema);
module.exports = Accident;