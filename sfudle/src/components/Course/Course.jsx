import { useState } from "react";
import { Link } from "react-router-dom";
import allCourses from "../../data/courses.json";
import sfuLogo from "../../assets/sfuLogo.png";
import mascot from "../../assets/mascot.png";

const presetDepts = ["EDUC", "CMPT", "BUS", "STAT", "MATH", "PHIL", "PHYS", "ECON", "MACM", "COGS"];

function Course() {
  const [answer, setAnswer] = useState(null);
  const [description, setDescription] = useState("");
  const [guess, setGuess] = useState("");
  const [numGuesses, setNumGuesses] = useState(0);
  const [win, setWin] = useState(false);
  const [started, setStarted] = useState(false);
  const [guessesList, setGuessesList] = useState([]);

  // Filter eligible courses
  const eligibleCourses = allCourses.filter(
    course =>
      presetDepts.includes(course.dept) &&
      course.title &&
      !/seminar|practicum|special topics|journeys/i.test(course.title) &&
      course.description &&
      course.description.length >= 100
  );

  const startGame = () => {
    const random = eligibleCourses[Math.floor(Math.random() * eligibleCourses.length)];
    setAnswer(random);
    setDescription(random.description);
    setNumGuesses(0);
    setGuess("");
    setGuessesList([]);
    setWin(false);
    setStarted(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!answer || !guess.trim()) return;

    setNumGuesses(prev => prev + 1);
    setGuessesList(prev => [guess, ...prev]);

    // Check if guess matches exactly
    const normalizedGuess = guess.trim().toUpperCase();
    const correctFormat = `${answer.dept.toUpperCase()} ${answer.number} - ${answer.title.toUpperCase()}`;
    if (normalizedGuess === correctFormat) {
      setWin(true);
    }
    setGuess("");
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center p-8">
      {/* Header */}
      <div className="flex flex-row items-end mb-8 cursor-pointer">
        <Link to="/">
          <img src={sfuLogo} alt="SFU Logo" className="mr-4" />
        </Link>
        <div className="flex flex-col items-start">
          <img src={mascot} alt="Mascot" className="mb-2" />
          <h1 className="text-4xl font-bold">Course Guess</h1>
        </div>
      </div>

      {!started ? (
        <button className="menu-button" onClick={startGame}>
          Start Game
        </button>
      ) : (
        <div className="w-full max-w-3xl flex flex-col items-center">
          {/* Description */}
          <div className="p-6 mb-6 bg-gray-100 rounded shadow w-full text-lg">
            {description}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">
            <input
              list="courseOptions"
              placeholder="DEPT NUM - TITLE"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              disabled={win}
              className="border px-4 py-2 rounded w-full sm:w-96 text-center"
            />
            <button
              type="submit"
              disabled={win}
              className={`submit-button ${win ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Submit
            </button>
          </form>

          {/* Autocomplete options */}
          <datalist id="courseOptions">
            {eligibleCourses.map(course => (
              <option
                key={course.dept + course.number}
                value={`${course.dept} ${course.number} - ${course.title}`}
              />
            ))}
          </datalist>

          {/* Guesses */}
          <div className="mt-4 text-lg font-semibold w-full max-w-3xl">
            <p>Guesses: {numGuesses}</p>
            <ul className="list-disc pl-5 mt-2">
              {guessesList.map((g, idx) => (
                <li key={idx}>{g}</li>
              ))}
            </ul>
          </div>

          {/* Win message */}
          {win && (
            <div className="mt-6 flex flex-col items-center">
              <div className="p-4 bg-green-200 text-green-800 rounded font-bold text-center mb-4">
                🎉 You guessed it! {answer.dept} {answer.number} - {answer.title} 🎉
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="select-button" onClick={startGame}>
                  Play Again
                </button>
                <Link to="/">
                  <button className="select-button">Return Home</button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Course;
