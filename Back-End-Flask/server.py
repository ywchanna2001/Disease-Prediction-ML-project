from flask import Flask, jsonify, request
from flask_cors import CORS
import joblib
import numpy as np
import json
from sklearn.ensemble import RandomForestClassifier
import  googlemaps
import pandas as pd
import csv
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app)  # Allow all origins

model = joblib.load('model/rf.pkl')

@app.route('/symptoms', methods=['GET'])
def symptomDetails():
    file_path = 'db/symptoms.json'
    with open(file_path, 'r') as symptom_json:
        symptoms = json.load(symptom_json)
    return jsonify(symptoms)

@app.route('/symptomsearch', methods=['POST'])
def symptomSearch():
    request_data = request.get_json()

    if 'search_key' in request_data:
        search_key = request_data['search_key'].lower()

        file_path = 'db/symptoms.json'
        with open(file_path, 'r') as symptom_json:
            symptoms = json.load(symptom_json)

        filtered_symptoms = [symptom for symptom in symptoms if search_key in symptom['symptom'].lower() or search_key in symptom['description'].lower()]
        return jsonify(filtered_symptoms), 200
    
    return jsonify({'message': 'Please provide a search_key in the request body.'}), 400

@app.route('/feedback', methods=['POST'])
def saveFeedback():
    request_data = request.get_json()
    
    # Create a dictionary to hold the feedback data
    feedback_data = {
        'name': request_data.get('name'),
        'email': request_data.get('email'),
        'message': request_data.get('message'),
        'rating': request_data.get('rating')
    }

    # Save the feedback data to a CSV file
    with open('db/feedback.csv', 'a', newline='') as file:
        fieldnames = ['name', 'email', 'message', 'rating']
        writer = csv.DictWriter(file, fieldnames=fieldnames)

        # Write the header if the file is empty
        if file.tell() == 0:
            writer.writeheader()

        writer.writerow(feedback_data)

    return jsonify({'message': 'Feedback saved successfully.'}), 200

@app.route('/predict', methods=['POST'])
def getPredictions():
    num_features = model.n_features_in_
    custom_array = np.zeros(num_features)
    symptom_ids = [int(x) for x in request.json['ids']]

    for id in symptom_ids:
        custom_array[id] = 1
    
    prob = model.predict_proba([custom_array])[0]
    prediction_classes = model.classes_
    
    threshold = 0.01
    predictions_with_prob = [{'disease': label, 'probability': float(probability)} for label, probability in zip(prediction_classes, prob) if probability > threshold]
    
    predictions_with_prob = sorted(
        predictions_with_prob,
        key=lambda x: x['probability'],
        reverse=True
    )

    response = predictions_with_prob
    
    return jsonify(response), 200

# Google maps API
# def miles_to_meter(miles):
#     try:
#         return miles * 1_609.344
#     except:
#         return 0

# load_dotenv()

# MAPS_API_KEY = os.getenv('MAPS_API_KEY')

# map_client = googlemaps.Client(key=MAPS_API_KEY)

# @app.route('/medicalcenters', methods=['POST'])
# def getNearbyMedicalCenters():
#     request_data = request.get_json()

#     if 'lat' and 'lng' in request_data:
#         lat = request_data.get('lat')
#         lng = request_data.get('lng')
#         location = {'lat': lat, 'lng': lng}
#         search_string = 'ayurveda'
#         distance = miles_to_meter(10)
#         medical_centers = []

#         response = map_client.places_nearby(
#             location=location,
#             keyword=search_string,
#             radius=distance
#         )

#         for place in response.get('results', []):
#             # Get the first photo reference if available
#             photo_reference = place.get('photos', [{}])[0].get('photo_reference', '')

#             # Build the photo URL using the first photo reference
#             photo_url = ''
#             if photo_reference:
#                 photo_url = f'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo_reference}&key={MAPS_API_KEY}'

            
#             medical_centers.append({
#                 'name': place['name'],
#                 'address': place.get('vicinity', ''),
#                 'icon': photo_url,
#                 'url': f"https://www.google.com/maps/place/?q=place_id:{place['place_id']}"
#             })

#         return jsonify(medical_centers)
#     return jsonify({'message': 'Please provide valid request body.'}), 400


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000)