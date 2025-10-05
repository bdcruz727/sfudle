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

  const [numGuesses, setNumGuesses] = useState(0);
  const incrementNumGuesses = () => {
  setNumGuesses(numGuesses => numGuesses + 1)
  }

  const [detailsList, setDetailsList] = useState([]);
  const [colourList, setColourList] = useState([]);


  const addGuess = async (dept, num, ans, guess) => {

    const alreadyGuessed = detailsList.some(
    (d) => d.dept === dept && d.number === num
    );

    if (alreadyGuessed) {
    console.log("Already guessed:", dept, num);
    return; // don’t add again
    }
    
    const newGuess = [dept, num]
    const details = await getDetailsGuess(dept, num)

    const newColours = getColours(ans, guess);
    setColourList(prev => [newColours, ...prev])
    setDetailsList(prev => [details, ...prev])
  }

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
    setNumGuesses(0);
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

      const det = await getDetailsGuess(dept, number); // async call inside handler
      incrementNumGuesses();
      console.log(det)
      addGuess(det.dept, det.number, answer, det)
      printDetails(det);

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

    //alert(`faculty: ${fac}\ndept: ${dept}\nnumber: ${num}\nquantitative: ${quant}\nwriting: ${writ}\nhumanities: ${hum}\nsocial: ${soc}\nscience: ${sci}`);
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
      <div className="min-h-screen bg-white text-black relative flex flex-col items-center">


        <div className="flex items-center justify-center w-full p-8">

            <form onSubmit={handleSubmit} className="flex flex-row gap-4">
                <input 
                    type="text" 
                    value={dept} 
                    onChange={(e) => setDept(e.target.value)}
                    placeholder="Department" 
                    className="border-2 rounded-4xl px-2 py-2"
                />
                <input 
                    type="text" 
                    value={number} 
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="Course Number"
                    className="border-2 rounded-4xl px-2 py-2"
                />
                <button type="submit">Submit</button>
            </form>

        </div>
        <div>
            <li className="grid grid-cols-[200px_1fr_1fr_1fr_1fr] gap-2 font-bold">
                <div className="w-32 h-8 border rounded flex items-center justify-center text-center">
                Guess
                </div>
                <div className="w-32 h-8 border rounded flex items-center justify-center text-center">
                Faculty
                </div>
                <div className="w-32 h-8 border rounded flex items-center justify-center text-center">
                Department
                </div>
                <div className="w-32 h-8 border rounded flex items-center justify-center text-center">
                Number
                </div>
                <div className="w-32 h-8 border rounded flex items-center justify-center text-center">
                Designation
                </div>
            </li>
        
        
        {numGuesses && numGuesses > 0 ? (
            <div className="mt-4">
                <ul>
                    {detailsList.map((details, index) => (
                    <li key={index} className="grid grid-cols-[200px_1fr_1fr_1fr_1fr] gap-2 mt-4">
                        <div className="w-32 h-32 border rounded flex items-center justify-center text-center">
                            {details.dept + " " + details.number}
                        </div>
                        <div className="w-32 h-32 border rounded flex items-center justify-center text-center">
                            {details.faculty}
                        </div>
                        <div className="w-32 h-32 border rounded flex items-center justify-center text-center">
                            {details.dept}
                        </div>
                        <div className="h-32 border rounded grid grid-cols-3 text-center">
                            {String(details.number)
                            .padStart(3, "0") // ensures 3 digits (e.g. "007")
                            .split("")
                            .map((digit, i) => (
                                <div
                                key={i}
                                className={`flex items-center justify-center border-xl ${
                                    i === 0 ? "bg-red-100" : i === 1 ? "bg-green-100" : "bg-blue-100"
                                }`}
                                >
                                {digit}
                                </div>
                            ))}
                        </div>
                        <div className="w-32 h-32 border rounded flex items-center justify-center text-center">
                            {Object.entries(details.designations)
                            .filter(([key, value]) => value) // keep only true ones
                            .map(([key]) => (
                            <span key={key} className="px-2 py-1 mx-1 rounded bg-green-200">
                                {key}
                            </span>
                            ))}
                        </div>
                        </li>
            ))}
                
                    
                </ul>
            </div>
        ) : (
            <div>
                
            </div>
        )
        }
        <div className="flex flex-row">

        </div>
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
