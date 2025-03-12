const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const router = express.Router();
const Accident = require("../models/accident");

router.post("/Voice", async (req, res) => {
  console.log("In the backend");
  try {
    const { accidentId, voiceInput } = req.body;
    console.log;
    if (!mongoose.Types.ObjectId.isValid(accidentId)) {
      return res.status(400).json({ error: "Invalid accident ID" });
    }

    if (!voiceInput) {
      return res.status(400).json({ error: "No voice input provided" });
    }

    const updatedAccident = await Accident.findByIdAndUpdate(
      accidentId,
      { $set: { description: voiceInput } },
      { new: true }
    );

    if (!updatedAccident) {
      return res.status(404).json({ error: "Accident record not found" });
    }

    res.json({
      message: "Accident report updated successfully",
      updatedAccident,
    });
  } catch (error) {
    console.error("Error updating accident report:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/report", async (req, res) => {
  try {
    const { timestamp, location } = req.body;

    // Validate required fields
    if (
      !location ||
      !location.latitude ||
      !location.longitude ||
      !location.city ||
      !location.state
    ) {
      return res.status(400).json({
        error:
          "Missing required location fields (latitude, longitude, city, state)",
      });
    }

    const newAccident = new Accident({
      timestamp: timestamp || new Date(), // Use provided timestamp or default to now
      location,
    });

    const savedAccident = await newAccident.save();
    res.status(201).json({
      accidentId: savedAccident._id,
      message: "SOS Report Submitted!",
    });
  } catch (error) {
    console.error("Error saving accident report:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/reports", async (req, res) => {
  try {
    const reports = await Accident.find();
    res.json(reports);
  } catch (error) {
    console.error("Error fetching accident reports:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/report/:id", async (req, res) => {
  try {
    const accidentId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(accidentId)) {
      return res.status(400).json({ error: "Invalid accident ID" });
    }

    const accident = await Accident.findById(accidentId);

    if (!accident) {
      return res.status(404).json({ error: "Accident record not found" });
    }

    res.json(accident);
  } catch (error) {
    console.error("Error fetching accident report:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/Image", (req, res) => {
  const { image, accidentId } = req.body;

  // Decode image from Base64
  const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");

  // Save the image to file system for example
  const filePath = path.join(__dirname, "uploads", `${accidentId}.jpg`);
  fs.writeFile(filePath, buffer, (err) => {
    if (err) {
      console.error("Error saving image:", err);
      return res.status(500).json({ message: "Failed to save image" });
    }
    res.json({ message: "Image saved successfully" });
  });
});

// router.post("/image", upload.array("images", 5), async (req, res) => {
//   try {
//     console.log("INside image", req.body);
//     const accidentId = req.body.accidentId;
//     const imageFiles = req.body.formData;
//     console.log(accidentId, imageFiles);

//     if (!mongoose.Types.ObjectId.isValid(accidentId)) {
//       return res.status(400).json({ error: "Invalid accident ID" });
//     }

//     if (!imageFiles || imageFiles.length === 0) {
//       return res.status(400).json({ error: "No images uploaded" });
//     }
//     const imageUrls = imageFiles.map((file) => `/uploads/${file.filename}`);
//     const updatedAccident = await Accident.findByIdAndUpdate(
//       accidentId,
//       { $push: { images: { $each: imageUrls } } },
//       { new: true }
//     );

//     if (!updatedAccident) {
//       return res.status(404).json({ error: "Accident record not found" });
//     }

//     res.json({
//       message: "Images added successfully",
//       updatedAccident,
//     });
//   } catch (error) {
//     console.error("Error adding images:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

module.exports = router;
