from flask import Flask, request, jsonify
from pymongo import MongoClient
import urllib.parse
import base64
import io
import numpy as np
from PIL import Image
import tensorflow as tf  # Load trained model
from flask import Flask, request, jsonify
from pymongo import MongoClient
import urllib.parse
import datetime
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import wordnet

app = Flask(__name__)

# Encode MongoDB credentials
username = urllib.parse.quote_plus("aravindpanchanathan")
password = urllib.parse.quote_plus("selvi@123")

# MongoDB connection
MONGO_URI = f"mongodb+srv://{username}:{password}@cluster1.u5xx2.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=Cluster1"
client = MongoClient(MONGO_URI)
db = client["mydatabase"]
collection = db["images"]  # Storing only images

# Load Trained Model
model = tf.keras.models.load_model("CNNAccident1.h5")  # Load your trained model


def extract_body_parts(text):
    tokens = word_tokenize(text.lower())

    # Reference WordNet synset for body parts
    body_part_synsets = [wordnet.synset("head.n.01"), wordnet.synset("leg.n.01"), 
                         wordnet.synset("arm.n.01"), wordnet.synset("shoulder.n.01"), 
                         wordnet.synset("spine.n.01"), wordnet.synset("chest.n.01"),
                         wordnet.synset("knee.n.01"), wordnet.synset("wrist.n.01")]

    # Function to determine if a word is semantically similar to a body part
    def is_body_part(word):
        word_synsets = wordnet.synsets(word, pos=wordnet.NOUN)  # Only check nouns
        for synset in word_synsets:
            for body_part in body_part_synsets:
                if synset.wup_similarity(body_part) and synset.wup_similarity(body_part) > 0.5:
                    return True
        return False

    # Extract relevant unique keywords found in the text
    body_part_keywords = list(set(word for word in tokens if is_body_part(word)))
    return body_part_keywords

@app.route('/')
def home():
    return jsonify({"message": "Welcome to Flask Image API"}), 200

# ✅ POST route to upload an image and return prediction
@app.route('/upload', methods=['POST'])
def upload_image():
    try:
        data = request.json
        
        # ✅ Check if `content` field is present
        if "content" not in data:
            return jsonify({"error": "Image content (Base64) is required"}), 400

        # ✅ Decode Base64 Image
        try:
            image_bytes = base64.b64decode(data["content"])
        except Exception:
            return jsonify({"error": "Invalid Base64 encoding"}), 400

        # ✅ Open the Image (Check if it's a valid image)
        try:
            image = Image.open(io.BytesIO(image_bytes))
        except Exception:
            return jsonify({"error": "Invalid image data"}), 400

        # ✅ Store in MongoDB
        image_data = {
            "filename": data.get("filename", "uploaded_image.jpg"),
            "content": data["content"]  # Store Base64
        }
        result = collection.insert_one(image_data)

        # ✅ Process the Image for Prediction
        image = image.resize((256, 256))  # Resize if needed
        image_array = np.array(image) / 255.0  # Normalize
        image_array = np.expand_dims(image_array, axis=0)  # Add batch dimension

        # ✅ Predict using the model
        prediction = model.predict(image_array)
        predicted_class = np.argmax(prediction)  # Get class with highest probability

        return jsonify({
            "image_id": str(result.inserted_id),  # Convert ObjectId to string
            "predicted_class": int(predicted_class)  # Convert NumPy int to normal int
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/report', methods=['POST'])
def store_report():
    try:
        data = request.json
        
        # ✅ Check if `report` field is present
        if "report" not in data:
            return jsonify({"error": "Accident report text is required"}), 400

        accident_report = data["report"]
        extracted_body_parts = extract_body_parts(accident_report)  # Extract body parts

        # ✅ Store in MongoDB
        report_data = {
            "accident_report": accident_report,
            "extracted_body_parts": extracted_body_parts  # Store extracted body parts
        }
        result = collection.insert_one(report_data)

        return jsonify({
            "report_id": str(result.inserted_id),  # Convert ObjectId to string
            "extracted_body_parts": extracted_body_parts
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5070, debug=True)
