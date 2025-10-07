import React, { useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [features, setFeatures] = useState({
    Grade10: "",
    Grade12: "",
    CPI: "",
    Backlogs: "",
    CodeforcesRating: "",
    CompetitiveExamRank: "",
    Projects: "",
    Internships: "",
    ExperienceMonths: "",
    CollegeTier: "Tier 1",
    CommunicationSkill: 50,
    Leadership: 5,
    Branch: "CSE",
    HackathonWins: 0,
    ResearchPapers: 0,
    OpenSourceContrib: 0
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [greeting, setGreeting] = useState("");

  const branchOptions = [
    { label: "Computer Science Engineering", value: "CSE" },
    { label: "Mechanical Engineering", value: "ME" },
    { label: "Civil Engineering", value: "CE" },
    { label: "Electronics & Communication Engineering", value: "ECE" },
    { label: "Electrical Engineering", value: "EE" },
    { label: "Information Technology", value: "IT" },
  ];

  const collegeOptions = ["Tier 1", "Tier 2", "Tier 3"];

  const handleChange = (key, value) => {
    setFeatures({ ...features, [key]: value });
  };

  const handleClosePrediction = () => {
    setPrediction(null);
    setGreeting("");
    setName("");
    setFeatures({
      Grade10: "",
      Grade12: "",
      CPI: "",
      Backlogs: "",
      CodeforcesRating: "",
      CompetitiveExamRank: "",
      Projects: "",
      Internships: "",
      ExperienceMonths: "",
      CollegeTier: "Tier 1",
      CommunicationSkill: 50,
      Leadership: 5,
      Branch: "CSE",
      HackathonWins: 0,
      ResearchPapers: 0,
      OpenSourceContrib: 0
    });
  };

  const handlePredict = async () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }

    // Validation
    for (let key in features) {
      if (features[key] === "") {
        alert(`Please fill ${key}`);
        return;
      }
      if (
        ["Grade10","Grade12","CPI","Backlogs","CodeforcesRating","CompetitiveExamRank","Projects","Internships","ExperienceMonths","CommunicationSkill","Leadership","HackathonWins","ResearchPapers","OpenSourceContrib"].includes(key) &&
        parseFloat(features[key]) < 0
      ) {
        alert(`${key} must be ≥ 0`);
        return;
      }
    }

    setLoading(true);
    setGreeting(`Hello ${name}, calculating your predicted package...`);
    setPrediction(null);

    try {
      // const response = await fetch("https://placement-predictor-backend.onrender.com/predict", {
      const response = await fetch("https://placement-predictor-backend.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify( features )
      });

      const data = await response.json();
      // Ensure minimum 0 package to avoid negative predictions
      setPrediction(Math.max(0, parseFloat(data.prediction)).toFixed(2));
    } catch (err) {
      console.error(err);
      alert("Error connecting to backend");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 flex flex-col items-center p-4 md:p-6 w-full">
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-3xl space-y-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-purple-700">
          Placement Predictor
        </h1>

        {/* Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800">
          {/* Name */}
          <div className="col-span-1 sm:col-span-2">
            <label className="block font-semibold mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Map numeric and select inputs */}
          {Object.keys(features).map((key) => {
            if (["Branch","CollegeTier"].includes(key)) {
              const options = key === "Branch" ? branchOptions : collegeOptions.map(c=>({label:c,value:c}));
              return (
                <div key={key}>
                  <label className="block font-semibold mb-1">{key}</label>
                  <select
                    value={features[key]}
                    onChange={(e)=>handleChange(key,e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    {options.map(opt => <option key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</option>)}
                  </select>
                </div>
              )
            } else if (key === "CommunicationSkill" || key === "Leadership") {
              return (
                <div className="col-span-1 sm:col-span-2" key={key}>
                  <label className="block font-semibold mb-1">{key}: {features[key]}</label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={features[key]}
                    onChange={(e)=>handleChange(key,e.target.value)}
                    className="w-full"
                  />
                </div>
              )
            } else {
              return (
                <div key={key}>
                  <label className="block font-semibold mb-1">{key}</label>
                  <input
                    type="number"
                    min="0"
                    value={features[key]}
                    onChange={(e)=>handleChange(key,e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              )
            }
          })}
        </div>

        {/* Predict Button */}
        <button
          onClick={handlePredict}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-bold hover:scale-105 transform transition duration-300"
        >
          {loading ? "Predicting..." : "Predict"}
        </button>

        {/* Loading Spinner */}
        {loading && (
  <div className="flex justify-center mt-4">
    <div className="w-12 h-12 border-4 border-purple-300 border-t-4 border-t-purple-600 rounded-full animate-spin"></div>
  </div>
)}


        {/* Greeting */}
        {greeting && !loading && (
          <p className="mt-4 text-center text-gray-800 font-semibold">{greeting}</p>
        )}
      </div>

      {/* Prediction Popup */}
      {prediction && !loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-sm z-50 p-4">
          <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-3xl shadow-2xl p-6 w-full max-w-sm text-center animate-fadeIn">
            <h2 className="text-2xl font-bold mb-4">Congratulations {name}!</h2>
            <p className="text-xl">Predicted Package:</p>
            <p className="text-4xl font-extrabold mt-2">{prediction} LPA</p>
            <button
              className="mt-6 bg-white text-purple-700 font-bold px-6 py-2 rounded-xl hover:bg-gray-200 transition"
              onClick={handleClosePrediction}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;