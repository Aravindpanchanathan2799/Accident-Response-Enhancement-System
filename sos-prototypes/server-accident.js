const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const methodOverride = require("method-override");
require("dotenv").config();

const accidentRoutes = require("./routes/accidentRoutes");

const app = express();
app.use(cors());
app.use(express.json());

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://aravindpanchanathan:selvi%40123@cluster1.u5xx2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.use("/api", accidentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
