from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

# Load model and scaler
model = joblib.load("model.pkl")
scaler = joblib.load("scaler.pkl")

# Define feature order manually (must match model training order)
feature_order = [
    "SeniorCitizen", "tenure", "MonthlyCharges", "TotalCharges", "gender_Male",
    "Partner_Yes", "Dependents_Yes", "PhoneService_Yes", "MultipleLines_No phone service",
    "MultipleLines_Yes", "InternetService_Fiber optic", "InternetService_No",
    "OnlineSecurity_No internet service", "OnlineSecurity_Yes",
    "OnlineBackup_No internet service", "OnlineBackup_Yes",
    "DeviceProtection_No internet service", "DeviceProtection_Yes",
    "TechSupport_No internet service", "TechSupport_Yes",
    "StreamingTV_No internet service", "StreamingTV_Yes",
    "StreamingMovies_No internet service", "StreamingMovies_Yes",
    "Contract_One year", "Contract_Two year", "PaperlessBilling_Yes",
    "PaymentMethod_Credit card (automatic)", "PaymentMethod_Electronic check",
    "PaymentMethod_Mailed check"
]

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        # Extract input features in correct order
        input_data = [data.get(feat, 0) for feat in feature_order]

        # Scale input using the loaded scaler
        input_scaled = scaler.transform([input_data])

        # Make prediction
        prediction = model.predict(input_scaled)[0]
        probability = model.predict_proba(input_scaled)[0][1]

        return jsonify({
            "churn": bool(prediction),
            "probability": round(probability, 2)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)