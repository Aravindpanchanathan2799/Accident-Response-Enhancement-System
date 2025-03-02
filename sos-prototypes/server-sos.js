const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');


const Victim = require('./models/victim'); // path to the schema/model file

const app = express();
app.use(cors());
app.use(bodyParser.json()); // support json encoded bodies

// Directly specify the MongoDB URI and port
const MONGODB_URI = 'mongodb+srv://aravindpanchanathan:selvi%40123@cluster1.u5xx2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1';
const PORT = 3000;

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Endpoint to receive data and store it in MongoDB
app.post('/report-accident', async (req, res) => {
    try {
        console.log(req.body);
        const victim = new Victim(req.body);
        await victim.save();
        res.setHeader('Content-Type', 'application/json');
        res.status(201).json({ message: 'Accident report saved successfully' });
    } catch (error) {
        console.log(error);  // Log the error for debugging
        res.status(400).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

