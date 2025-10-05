import fs from "fs";
import { useState } from "react";
import sfuLogo from "../../assets/sfuLogo.png";

/**
 * Returns a random course from a JSON file, filtered by allowed departments and degree level,
 * excluding courses with "Practicum" in the title.
 * Only includes dept, number, units, title, and description.
 */
function getRandomCourse(filePath, allowedDepts = ["CMPT", "MATH", "BUS"], degreeLevel = "UGRD") {
  let text;
  try {
    text = fs.readFileSync(filePath, "utf8").trim();
  } catch (err) {
    console.error("❌ Failed to read file:", err.message);
    return null;
  }

  if (!text.startsWith("[")) text = "[" + text;
  if (!text.endsWith("]")) text = text.replace(/,\s*$/, "") + "]";

  let data;
  try {
    data = JSON.parse(text);
  } catch (err) {
    console.error("❌ Error parsing JSON:", err.message);
    return null;
  }

  const allowedSet = new Set(allowedDepts);

  const filtered = data.filter(
    (c) =>
      allowedSet.has(c.dept) &&
      c.degreeLevel === degreeLevel &&
      !c.title.toLowerCase().includes("practicum")
  );

  if (filtered.length === 0) return null;

  const course = filtered[Math.floor(Math.random() * filtered.length)];

  return {
    dept: course.dept,
    number: course.number,
    units: course.units,
    title: course.title,
    description: course.description,
  };
}

function Standard() {
  const [selectedDepts, setSelectedDepts] = useState([]);
  const [course, setCourse] = useState(null);

  const departments = ["EDUC", "CMPT", "BUS", "STAT", "MATH", "PHIL", "PHYS", "ECON", "MACM", "COGS"];

  const handleToggle = (dept) => {
    setSelectedDepts((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    );
  };

  const handleGenerate = () => {
    if (selectedDepts.length === 0) {
      alert("Please select at least one department!");
      return;
    }
    const randomCourse = getRandomCourse("path/to/your/courses.json", selectedDepts);
    setCourse(randomCourse);
  };

  return (
    <div className="flex flex-col items-center justify-start p-6">
      {/* Header */}
      <div className="w-1/4 flex flex-row items-center mb-4">
        <img src={sfuLogo} alt="SFU Logo" className="h-12" />
        <h1 className="font-bold text-2xl px-2">DLE</h1>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {departments.map((dept) => (
          <label key={dept} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedDepts.includes(dept)}
              onChange={() => handleToggle(dept)}
              className="w-4 h-4"
            />
            <span className="text-lg">{dept}</span>
          </label>
        ))}
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        className="px-4 py-2 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition"
      >
        🎲 Get Random Course
      </button>

      {/* Display Result */}
      {course && (
        <div className="mt-6 p-4 border rounded-xl shadow-md w-3/4 bg-white">
          <h2 className="font-bold text-xl mb-1">
            {course.dept} {course.number} — {course.title}
          </h2>
          <p className="text-gray-600 mb-1">{course.units} Units</p>
          <p>{course.description}</p>
        </div>
      )}
    </div>
  );
}

export default Standard;
