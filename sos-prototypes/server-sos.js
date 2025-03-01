const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const Victim = require('./models/victim'); // path to the schema/model file

const app = express();
app.use(bodyParser.json()); // support json encoded bodies

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Endpoint to receive data and store it in MongoDB
app.post('/report-accident', async (req, res) => {
    try {
        const victim = new Victim(req.body);
        await victim.save();
        res.status(201).send('Accident report saved successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

