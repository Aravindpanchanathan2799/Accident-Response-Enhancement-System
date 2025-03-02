from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

Gemini_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=Gemini_API_KEY)

app = Flask(__name__)

def generate_first_responder_message(accident_data):
    try:
        model = genai.GenerativeModel('gemini-2.0-flash')
        location = accident_data.get('location', 'Unknown location')
        timestamp = accident_data.get('timestamp', 'Unknown timestamp')
        severity = accident_data.get('severity', 'Unknown severity')
        num_injured = accident_data.get('numInjured', 'Unknown number of injured')
        injury_part = accident_data.get('injuryPart', 'Unspecified injury part')
        text_description = accident_data.get('textDescription', 'No additional description provided')

        prompt = (f"Timestamp: {timestamp}, Severity: {severity}, "
                  f"Location: {location}, Injured: {num_injured}, Injury: {injury_part}, "
                  f"Description: {text_description}. Provide a concise message for first responders, "
                  "including potential injuries, immediate actions, and nearest hospital location.")

        response = model.generate_content(prompt)
        text_response = response.candidates[0].content.parts[0].text

        return jsonify({"message": text_response})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/ai_agent', methods=['POST'])
def ai_agent_endpoint():
    accident_data = request.get_json()
    if not accident_data:
        return jsonify({'error': 'No data provided'}), 400

    response = generate_first_responder_message(accident_data)
    return response

if __name__ == '__main__':
    app.run(debug=True, port=5001)
