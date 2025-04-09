import React, { useState } from "react";
import "./ChurnForm.css";

const sections = {
  BasicInfo: ["SeniorCitizen", "tenure", "MonthlyCharges", "TotalCharges", "gender_Male", "Partner_Yes", "Dependents_Yes"],
  Services: ["PhoneService_Yes", "MultipleLines_No_phone_service", "MultipleLines_Yes", "InternetService_Fiber_optic", "InternetService_No",
    "OnlineSecurity_No_internet_service", "OnlineSecurity_Yes", "OnlineBackup_No_internet_service", "OnlineBackup_Yes",
    "DeviceProtection_No_internet_service", "DeviceProtection_Yes", "TechSupport_No_internet_service", "TechSupport_Yes",
    "StreamingTV_No_internet_service", "StreamingTV_Yes", "StreamingMovies_No_internet_service", "StreamingMovies_Yes"],
  Billing: ["Contract_One_year", "Contract_Two_year", "PaperlessBilling_Yes", "PaymentMethod_Credit_card_automatic",
    "PaymentMethod_Electronic_check", "PaymentMethod_Mailed_check"]
};

const defaultFormData = Object.fromEntries(
  Object.values(sections).flat().map((key) => [key, 0])
);

const ChurnForm = () => {
  const [formData, setFormData] = useState(defaultFormData);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState("BasicInfo");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="glass-card">
      <h2>🧠 Customer Churn Predictor</h2>

      <div className="tabs">
        {Object.keys(sections).map((key) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={active === key ? "tab active" : "tab"}
          >
            {key}
          </button>
        ))}
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        {sections[active].map((key) => (
          <div className="form-group" key={key}>
            <label>{key.replace(/_/g, " ")}</label>
            <input
              type="number"
              name={key}
              value={formData[key]}
              onChange={handleChange}
            />
          </div>
        ))}
        {active === "Billing" && (
          <button type="submit" className="predict-btn">
            {loading ? "Predicting..." : "🚀 Predict"}
          </button>
        )}
      </form>

      {result && (
        <div className="result-box">
          <h3>
            {result.churn ? (
              <span className="danger">❌ Customer Will Churn</span>
            ) : (
              <span className="safe">✅ Customer Will Stay</span>
            )}
          </h3>
          <p>Probability: {(result.probability * 100).toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
};

export default ChurnForm;