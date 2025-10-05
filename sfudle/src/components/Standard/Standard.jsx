import { useState, useEffect } from "react";
import { getDetailsGuess, getRandomCourseDetails, getColours } from '../common/getCourseDetails.js';
import sfuLogo from "../../assets/sfuLogo.png";
import mascot from "../../assets/mascot.png";

function Standard() {
  const departments = ["EDUC", "CMPT", "BUS", "STAT", "MATH", "PHIL", "PHYS", "ECON", "MACM", "COGS"];
  const [selectedDepts, setSelectedDepts] = useState([]); // Start unselected
  const [started, setStarted] = useState(false);
  const [error, setError] = useState(""); // For on-page error
  const [dept, setDept] = useState(''); // state to store input value
  const [number, setNumber] = useState('');
  const [answer, setAnswer] = useState('');

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

  const handleStart = async () => {
    if (selectedDepts.length === 0) {
      setError("Please select at least one department!");
      return;
    }
    setStarted(true);
    const answer = await getRandomCourseDetails(selectedDepts);
    setAnswer(answer);
  };

  const handleBack = () => {
    setStarted(false);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // prevent page reload
    try {
      const guess = await getDetailsGuess(dept, number); // async call inside handler
      printDetails(answer);
      printDetails(guess);
      const colours = getColours(answer, guess);
      checkWin(colours);

    } catch (error) {
      console.error('Error fetching details:', error);
    }
  };

  function printDetails(det){
    var fac = det.faculty;
    var dept = det.dept;
    var num = det.number;
    var quant = det.designations.quantitative;
    var writ = det.designations.writing;
    var hum = det.designations.humanities;
    var soc = det.designations.social;
    var sci = det.designations.science;

    alert(`faculty: ${fac}\ndept: ${dept}\nnumber: ${num}\nquantitative: ${quant}\nwriting: ${writ}\nhumanities: ${hum}\nsocial: ${soc}\nscience: ${sci}`);
  }

  function printColours(colours){
    var fac = colours.facultyColour;
    var dept = colours.deptColour;
    var num1 = colours.numberColour.num1;
    var num2 = colours.numberColour.num2;
    var num3 = colours.numberColour.num3;
    var des = colours.designationColour;
    
    alert(`faculty: ${fac}\ndept: ${dept}\nnum1: ${num1}\nnum2: ${num2}\nnum3: ${num3}\ndesignations: ${des}`);
  }

  function checkWin(colours){
    printColours(colours);
    var array = [colours.facultyColour, colours.deptColour, colours.numberColour.num1, colours.numberColour.num2, colours.numberColour.num3, colours.designationColour];
    
    if(colours.facultyColour != "2"){
        return false;
    }
    if(colours.deptColour != "2"){
        return false;
    }
    if(colours.numberColour.num1 != "2"){
        return false;
    }
    if(colours.numberColour.num2 != "2"){
        return false;
    }
    if(colours.numberColour.num3 != "2"){
        return false;
    }
    if(colours.designationColour != "2"){
        return false;
    }
    
    alert("You win!!");
    return true
  }

 

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

            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={dept} 
                    onChange={(e) => setDept(e.target.value)}
                    placeholder="Department" 
                />
                <input 
                    type="text" 
                    value={number} 
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="Course Number" 
                />
                <button type="submit">Submit</button>
            </form>

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
