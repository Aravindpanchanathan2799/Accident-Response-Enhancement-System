function startDictation() {
    if (window.hasOwnProperty('webkitSpeechRecognition')) {
        var recognition = new webkitSpeechRecognition();

        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";
        recognition.start();

        recognition.onresult = function (e) {
            document.getElementById('accidentDescription').value = e.results[0][0].transcript;
            recognition.stop();
            document.getElementById('startVoiceInput').innerHTML = 'Start Voice Input'; // Reset button text after speaking
        };

        recognition.onerror = function (e) {
            recognition.stop();
        }

        recognition.onstart = function() {
            document.getElementById('startVoiceInput').innerHTML = 'Listening...'; // Indicate listening state
        }
    }
}

function reportEmergency() {
    const time = new Date().toISOString();
    console.log("Emergency reported at:", time);
    alert("Emergency reported successfully. Please provide more details in the form.");
}

function submitAccidentReport() {
    const description = document.getElementById('accidentDescription').value;
    const images = document.getElementById('accidentImages').files;
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const timestamp = document.getElementById('timestamp').value;

    const imageNames = Array.from(images).map(file => file.name).join(', ');
    console.log("Accident Description:", description);
    console.log("Latitude:", latitude, "Longitude:", longitude);
    console.log("City:", city, "State:", state);
    console.log("Timestamp:", timestamp);
    console.log("Images Uploaded:", imageNames);

    alert("Accident report submitted. All details including location and images will be processed.");
}

document.getElementById('accidentReportForm').addEventListener('submit', function(event) {
    event.preventDefault();
    submitAccidentReport();
});

function reportEmergency() {
    const time = new Date().toISOString();
    document.getElementById('timestamp').value = time; // Store the timestamp
    console.log("Emergency reported at:", time);
    
    navigator.geolocation.getCurrentPosition(function(position) {
        document.getElementById('latitude').value = position.coords.latitude;
        document.getElementById('longitude').value = position.coords.longitude;

        // Optionally add reverse geocoding here to fill city and state
        fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`)
            .then(response => response.json())
            .then(data => {
                document.getElementById('city').value = data.city || 'Not found';
                document.getElementById('state').value = data.principalSubdivision || 'Not found';
            }).catch(error => console.error('Error in reverse geocoding:', error));

        alert("Location fetched. Please verify or edit these details along with the accident description.");
    }, handleLocationError);
}

function handleLocationError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        default:
            alert("An unknown error occurred.");
            break;
    }
}