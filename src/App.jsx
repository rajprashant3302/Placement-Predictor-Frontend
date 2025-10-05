import React, { useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [features, setFeatures] = useState({
    CGPA: "",
    Internships: "",
    Projects: "",
    CompetitiveRank: "",
    Branch: "CSE",
    CodeforcesRating: "",
    CommunicationSkill: 50,
    ExperienceMonths: "",
    Age: "",
    CollegeTag: "IIT",
    Grade10: "",
    Grade12: "",
    Backlogs: "",
    Gender: "M"
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

  const collegeOptions = ["IIT", "NIT", "State_University","IIIT","Private_College"];

  const handleChange = (key, value) => {
    setFeatures({ ...features, [key]: value });
  };

  // Inside App component

const handleClosePrediction = () => {
  // Hide popup
  setPrediction(null);
  setGreeting("");

  // Reset all fields
  setName("");
  setFeatures({
    CGPA: "",
    Internships: "",
    Projects: "",
    CompetitiveRank: "",
    Branch: "",
    CodeforcesRating: "",
    CommunicationSkill: 50,
    ExperienceMonths: "",
    Age: "",
    CollegeTag: "IIT",
    Grade10: "",
    Grade12: "",
    Backlogs: "",
    Gender: "M"
  });
};


  const handlePredict = async () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }

    // Validations
    if (
      parseFloat(features.CGPA) <= 0 ||
      parseFloat(features.Backlogs) < 0 ||
      parseFloat(features.CodeforcesRating) < 0 ||
      parseFloat(features.ExperienceMonths) < 0 ||
      parseInt(features.Age) < 15 ||
      parseFloat(features.Grade10) < 0 ||
      parseFloat(features.Grade12) < 0 ||
      parseInt(features.Internships) < 0 ||
      parseInt(features.Projects) < 0
    ) {
      alert("Please enter valid positive values (Age ≥ 15)");
      return;
    }

    for (let key in features) {
      if (features[key] === "") {
        alert(`Please fill ${key}`);
        return;
      }
    }

    setLoading(true);
    setGreeting(`Hello ${name}, calculating your predicted package...`);
    setPrediction(null);

    const numericFields = [
      "CGPA",
      "Internships",
      "Projects",
      "CompetitiveRank",
      "CodeforcesRating",
      "CommunicationSkill",
      "ExperienceMonths",
      "Age",
      "Grade10",
      "Grade12",
      "Backlogs",
    ];

    const featureArray = Object.keys(features).map((key) =>
      numericFields.includes(key) ? parseFloat(features[key]) : features[key]
    );

    try {
      const response = await fetch("https://placement-predictor-backend.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: featureArray }),
      });

      const data = await response.json();
      setPrediction(parseFloat(data.prediction).toFixed(2));
    } catch (err) {
      console.error(err);
      alert("Error connecting to backend");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 flex flex-col items-center p-6 w-full">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-3xl mt-8 space-y-6">
        <h1 className="text-4xl font-extrabold text-center text-purple-700">
          Placement Predictor
        </h1>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800">
          {/* Name */}
          <div className="col-span-2">
            <label className="block font-semibold mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* CGPA */}
          <div>
            <label className="block font-semibold mb-1">CGPA</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="10"
              value={features.CGPA}
              onChange={(e) => handleChange("CGPA", e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Internships */}
          <div>
            <label className="block font-semibold mb-1">Internships</label>
            <input
              type="number"
              min="0"
              value={features.Internships}
              onChange={(e) => handleChange("Internships", e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Projects */}
          <div>
            <label className="block font-semibold mb-1">Projects</label>
            <input
              type="number"
              min="0"
              value={features.Projects}
              onChange={(e) => handleChange("Projects", e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Competitive Rank */}
          <div>
            <label className="block font-semibold mb-1">Competitive Exam Rank</label>
            <input
              type="number"
              min="0"
              value={features.CompetitiveRank}
              onChange={(e) => handleChange("CompetitiveRank", e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Branch */}
          <div>
            <label className="block font-semibold mb-1">Branch</label>
            <select
              value={features.Branch}
              onChange={(e) => handleChange("Branch", e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              {branchOptions.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>

          {/* Codeforces Rating */}
          <div>
            <label className="block font-semibold mb-1">Codeforces Rating</label>
            <input
              type="number"
              min="0"
              value={features.CodeforcesRating}
              onChange={(e) => handleChange("CodeforcesRating", e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Communication Skill */}
          <div className="col-span-2">
            <label className="block font-semibold mb-1">
              Communication Skill: {features.CommunicationSkill}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={features.CommunicationSkill}
              onChange={(e) => handleChange("CommunicationSkill", e.target.value)}
              className="w-full"
            />
          </div>

          {/* Experience */}
          <div>
            <label className="block font-semibold mb-1">Experience Months</label>
            <input
              type="number"
              min="0"
              value={features.ExperienceMonths}
              onChange={(e) => handleChange("ExperienceMonths", e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block font-semibold mb-1">Age</label>
            <input
              type="number"
              min="15"
              value={features.Age}
              onChange={(e) => handleChange("Age", e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* College */}
          <div>
            <label className="block font-semibold mb-1">College</label>
            <select
              value={features.CollegeTag}
              onChange={(e) => handleChange("CollegeTag", e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              {collegeOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Grade 10 */}
          <div>
            <label className="block font-semibold mb-1">Grade 10</label>
            <input
              type="number"
              min="0"
              value={features.Grade10}
              onChange={(e) => handleChange("Grade10", e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Grade 12 */}
          <div>
            <label className="block font-semibold mb-1">Grade 12</label>
            <input
              type="number"
              min="0"
              value={features.Grade12}
              onChange={(e) => handleChange("Grade12", e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Backlogs */}
          <div>
            <label className="block font-semibold mb-1">Backlogs</label>
            <input
              type="number"
              min="0"
              value={features.Backlogs}
              onChange={(e) => handleChange("Backlogs", e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block font-semibold mb-1">Gender</label>
            <select
              value={features.Gender}
              onChange={(e) => handleChange("Gender", e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
        </div>

        {/* Predict Button */}
        <button
          onClick={handlePredict}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-bold hover:scale-105 transform transition duration-300"
        >
          {loading ? "Predicting..." : "Predict"}
        </button>

        {/* Greeting */}
        {greeting && !loading && (
          <p className="mt-4 text-center text-gray-800 font-semibold">{greeting}</p>
        )}
      </div>


        {/* Prediction Popup */}
{prediction && !loading && (
  <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-sm z-50">
    <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-3xl shadow-2xl p-8 w-96 text-center animate-fadeIn">
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
