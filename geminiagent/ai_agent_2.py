from flask import Flask, request, jsonify

app = Flask(__name__)

def generate_hospital_preparation_message(update_data):
    """
    Simulate generating a hospital preparation message based on the update data received.
    """
    update_description = update_data.get('updateDescription', 'No additional details provided.')
    additional_info = update_data.get('additionalInfo', {})
    blood_type = additional_info.get('bloodType', 'Unknown')
    known_allergies = additional_info.get('knownAllergies', [])

    # Construct a response message that hospitals might use to prepare for the patient's arrival.
    preparation_message = (
        f"Attention: Immediate preparations required. "
        f"Patient blood type: {blood_type}. "
        f"Known allergies: {', '.join(known_allergies) if known_allergies else 'None'}. "
        f"Details: {update_description}. "
        f"Please ensure that the necessary medical personnel and equipment are ready for potential critical care procedures."
    )
    return preparation_message

@app.route('/ai_agent_2', methods=['POST'])
def update_incident():
    """
    Endpoint to receive incident updates and generate messages for hospital preparation.
    """
    update_data = request.get_json()
    if not update_data:
        return jsonify({'error': 'Missing necessary data'}), 400

    # Generate the message for hospital preparation
    preparation_message = generate_hospital_preparation_message(update_data)
    return jsonify({"hospital_preparation_message": preparation_message}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5002)
    