import { useState, useEffect } from "react";
import { getDetailsGuess, getRandomCourseDetails, getColours } from '../common/getCourseDetails.js';
import sfuLogo from "../../assets/sfuLogo.png";
import mascot from "../../assets/mascot.png";
import { Link }  from 'react-router-dom'
import allCourses from '../../data/courses.json'
import standardVictory from '../../assets/standardVictoryImage.png'

function Standard() {
  const departments = ["EDUC", "CMPT", "BUS", "STAT", "MATH", "PHIL", "PHYS", "ECON", "MACM", "COGS"];
  const [selectedDepts, setSelectedDepts] = useState([]); // Start unselected
  const [started, setStarted] = useState(false);
  const [error, setError] = useState(""); // For on-page error
  const [dept, setDept] = useState(''); // state to store input value
  const [number, setNumber] = useState('');
  const [answer, setAnswer] = useState('');
  const [submitError, setSubmitError] = useState(false);


  const[win, setWin] = useState(false);
  const checkWin = (colours) => {
    const correctColor = "#B1DFA3";
    
    return (
      colours.facultyColour === correctColor &&
      colours.deptColour === correctColor &&
      colours.number1Colour === correctColor &&
      colours.number2Colour === correctColor &&
      colours.number3Colour === correctColor &&
      colours.designationColour === correctColor &&
      colours.unitsColour === correctColor
    );
  };  

  const availableCourses = allCourses.filter(course => course.dept === dept);

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

    incrementNumGuesses();
    const newColours = getColours(ans, guess);
    setColourList(prev => [newColours, ...prev])
    setDetailsList(prev => [details, ...prev])
    console.log(newColours);

    if (checkWin(newColours)) {
    console.log("Win!");
    setWin(true);
    }
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

  const handleSelectAll = () => {
    if (selectedDepts.length === departments.length){
      setSelectedDepts([]);
    }
    else{
      setSelectedDepts([...departments]);
    }

  }

  const handleStart = async () => {
    if (selectedDepts.length === 0) {
      setError("Please select at least one department!");
      return;
    }
    setWin(false);
    setNumGuesses(0);
    setNumber('');
    setDetailsList([]);
    setColourList([]);
    setStarted(true);
    if (selectedDepts.length == 1){
      setDept(selectedDepts[0]);
    }
    else{
      setDept(selectedDepts[0]);
    }
    
    const answer = await getRandomCourseDetails(selectedDepts);
    console.log("Answer " + answer.dept + " " + answer.number);
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
      setSubmitError(false);
      console.log(det)
      addGuess(det.dept, det.number, answer, det)
      printDetails(det);

    } catch (error) {
      setSubmitError(true);
      console.error('Error fetching details:', error);
    }
  };

  function printDetails(det){
    var fac = det.faculty;
    var dept = det.dept;
    var num = det.number;
    var quant = det.designations.Quantitative;
    var writ = det.designations.Writing;
    var hum = det.designations.Humanities;
    var soc = det.designations.Social;
    var sci = det.designations.Science;

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

/*  function checkWin(colours){
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
*/
 

  if (started) {
    // ===== NEW BLANK STATE =====
    return (
      <div className="min-h-screen bg-white text-black relative flex flex-col items-center">
        <div className='flex flex-row items-end w-100 mt-16 cursor-pointer' onClick={handleBack}>
          <img src={sfuLogo}></img>
          <div className='flex flex-col'>
            <img src={mascot}></img>
            <h1 className='ml-2 font-bold text-4xl'>
              DLE
            </h1>
          </div>
        </div>
        {win && (<>
          <div className="mt-4 p-4 bg-green-200 text-green-800 font-bold rounded">
            🎉 You Win! 🎉 <br>
            </br>
            It Took {numGuesses} Guesses!
          </div>

          <div className="mt-4">
            <div className="relative w-[500px]">
              <img src={standardVictory}>
              </img>

              <div className={`absolute top-24 ${numGuesses >= 10 ? "right-10" : "right-12" } text-black px-3 py-1 font-bold text-4xl`}>
                
                  {numGuesses}
               
              </div>

            </div>
            <div className="flex flex-col items-center">
                <button className='select-button mt-4' onClick={handleBack}>
                    <h2 className='text-[#fff9fc]'>
                        Play Again
                    </h2>
                </button>
                <Link to='/'>
                  <button className='select-button mt-4'>
                      <h2 className='text-[#fff9fc]'>
                          Return Home
                      </h2>
                  </button>
                </Link>
              </div>
          </div>
          

       </> )}
        <div className="flex items-center justify-center w-full p-8">

            <form onSubmit={handleSubmit} className="flex flex-row gap-4">
                <select
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  className="border-2 rounded px-2 py-2 w-32 max-h-40 overflow-y-scroll"
                >
                  {selectedDepts.sort().map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <input 
                    type="text" 
                    list="courseNumbers"
                    value={number} 
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="Course # (e.g. 101)"
                    className="border-2 rounded-4xl px-2 py-2 text-center"
                />

                <datalist id="courseNumbers">
                  {availableCourses.map((course) => (
                    <option key={course.dept + course.number} value={course.number}>
                      {course.title}
                    </option>
                  ))}
                </datalist>
              <button 
                type="submit" 
                className={`submit-button ${win ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                disabled={win}
              >
                Submit
              </button>
            </form>

        </div>
        <div>
            <li className="grid grid-cols-[200px_1fr_1fr_1fr_1fr_1fr] gap-2 font-bold">
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
                <div className="w-32 h-8 border rounded flex items-center justify-center text-center">
                Units
                </div>
            </li>
        
        
        {numGuesses && numGuesses > 0 ? (
            <div className="mt-4">
                <ul>
                    {detailsList.map((details, index) => (
                    <li key={index} className="grid grid-cols-[200px_1fr_1fr_1fr_1fr_1fr] gap-2 mt-4 fade-slide-in">
                        <div className="w-32 h-32 border rounded flex items-center justify-center text-center">
                            {details.dept + " " + details.number}
                        </div>
                        <div className="w-32 h-32 border rounded flex items-center justify-center text-center"
                        style={{ backgroundColor: colourList[index].facultyColour}}>
                            {details.faculty}
                        </div>
                        <div className="w-32 h-32 border rounded flex items-center justify-center text-center"
                        style={{ backgroundColor: colourList[index].deptColour}}>
                            {details.dept}
                        </div>
                        <div className="h-32 rounded grid grid-cols-3 text-center">
                            {String(details.number)
                            .padStart(3, "0") // ensures 3 digits (e.g. "007")
                            .split("")
                            .map((digit, i) => (
                                <div
                                key={i}
                                className="flex items-center justify-center border border-black"
                                style={{ backgroundColor: colourList[index][`number${i+1}Colour`] }}
                                >
                                {digit}
                          </div>
                            ))}
                        </div>
                        
                        <div className="w-32 h-32 border rounded flex flex-col items-center justify-center text-center"
                        style={{ backgroundColor: colourList[index].designationColour}}>
                           {(() => {
                            const trueDesignations = Object.entries(details.designations)
                              .filter(([key, value]) => value) // keep only true ones
                              .map(([key]) => key);

                            if (trueDesignations.length === 0) return <span>None</span>;

                            return trueDesignations.map((key) => (
                              <span key={key} className="px-2 py-1 mx-1 rounded">
                                {key}
                              </span>
                            ));
                          })()}

                        </div>
                        <div className="w-32 h-32 border rounded flex items-center justify-center text-center"
                        style={{ backgroundColor: colourList[index].unitsColour}}>
                            {details.units}
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
      <Link to="/">
      <div className='flex flex-row items-end w-100 mt-16'>
        <img src={sfuLogo}></img>
        <div className='flex flex-col'>
          <img src={mascot}></img>
          <h1 className='ml-2 font-bold text-4xl text-black'>
            DLE
          </h1>
        </div>
      </div>
      </Link>

      {/* ===== FILTERS ===== */}
      <div className="flex flex-col items-center py-4 w-full">
        <h3 className="text-2xl font-semibold mb-10 text-black">Select Department(s)<br></br>To Guess From</h3>

        <div className="flex flex-wrap justify-center gap-4 w-[600px]">
          {departments.map((dept) => (
            <div
              key={dept}
              onClick={() => handleToggle(dept)}
              className={`cursor-pointer px-4 py-2 rounded-xl border-2 border-red-600 text-black font-semibold flex items-center justify-center transition transform
                ${selectedDepts.includes(dept) ? "bg-red-300 hover:bg-red-400" : "bg-white hover:bg-red-200"}
                hover:scale-105`}
            >
              {dept}
            </div>
          ))}
        </div>

        {/* ===== START BUTTON ===== */}
          <button className="select-button mt-4" onClick={() => handleSelectAll()}>
            Select/Deselect All
          </button>
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
