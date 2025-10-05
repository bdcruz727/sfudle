import { useState, useEffect } from "react";
import sfuLogo from "../../assets/sfuLogo.png";
import mascot from "../../assets/mascot.png";

function Standard() {
  const departments = ["EDUC", "CMPT", "BUS", "STAT", "MATH", "PHIL", "PHYS", "ECON", "MACM", "COGS"];
  const [selectedDepts, setSelectedDepts] = useState([]); // Start unselected
  const [started, setStarted] = useState(false);
  const [error, setError] = useState(""); // For on-page error

  // Force body background white and text black
  useEffect(() => {
    document.body.style.backgroundColor = "white";
    document.body.style.color = "black";
  }, []);

  const handleToggle = (dept) => {
    setSelectedDepts((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    );
    setError(""); // Clear error when toggling
  };

  const handleStart = () => {
    if (selectedDepts.length === 0) {
      setError("Please select at least one department!");
      return;
    }
    setStarted(true);
  };

  const handleBack = () => {
    setStarted(false);
    setError("");
  };

  if (started) {
    // ===== NEW BLANK STATE =====
    return (
      <div className="min-h-screen bg-white text-black relative flex flex-col items-start">
        <button
          onClick={handleBack}
          className="m-4 px-4 py-2 text-white font-bold text-lg rounded-full border border-black hover:bg-gray-100 transition"
        >
          ← Back
        </button>
        <div className="flex-1 flex items-center justify-center w-full">
          {/* Blank state content goes here */}
        </div>
      </div>
    );
  }

  // ===== ORIGINAL START PAGE =====
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-white text-black">
      {/* ===== HEADER ===== */}
      <div className='flex flex-row items-end w-100 mt-16'>
        <img src={sfuLogo}></img>
        <div className='flex flex-col'>
          <img src={mascot}></img>
          <h1 className='ml-2 font-bold text-4xl'>
            DLE
          </h1>
        </div>
      </div>

      {/* ===== FILTERS ===== */}
      <div className="flex flex-col items-center py-24 w-full">
        <h3 className="text-2xl font-semibold mb-10 text-black">Select Department(s)</h3>

        <div className="flex flex-wrap justify-center gap-4 w-[600px]">
          {departments.map((dept) => (
            <div
              key={dept}
              onClick={() => handleToggle(dept)}
              className={`cursor-pointer px-4 py-2 rounded-xl border-2 border-red-600 text-black font-semibold flex items-center justify-center transition transform
                ${selectedDepts.includes(dept) ? "bg-red-200" : "bg-white"}
                hover:scale-105 hover:bg-red-300`}
            >
              {dept}
            </div>
          ))}
        </div>

        {/* ===== START BUTTON ===== */}
          <button
            onClick={handleStart}
            className="mt-16 px-12 py-10 text-white font-bold text-3xl rounded-3xl transition w-[300px] h-[75px] hover:scale-105"
            style={{ backgroundColor: "#CC0633" }}
          >
            Start
        </button>

        {/* ===== ON-PAGE ERROR MESSAGE ===== */}
        {error && (
          <div className="mt-4 text-red-600 font-semibold text-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default Standard;
