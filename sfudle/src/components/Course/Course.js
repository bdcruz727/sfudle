import fs from "fs";

/**
 * Returns a random course from a JSON file, filtered by allowed departments and degree level,
 * excluding courses with "Practicum" in the title.
 * Only includes dept, number, units, title, and description.
 * 
 * @param {string} filePath - Path to the JSON file.
 * @param {string[]} allowedDepts - Array of departments to include (e.g., ["CMPT","MATH","BUS"]).
 * @param {string} degreeLevel - Degree level to filter (default: "UGRD").
 * @returns {object|null} - An object with dept, number, units, title, description, or null if no match.
 */
function getRandomCourse(filePath, allowedDepts = ["CMPT","MATH","BUS"], degreeLevel = "UGRD") {
  let text;
  try {
    text = fs.readFileSync(filePath, "utf8").trim();
  } catch (err) {
    console.error("❌ Failed to read file:", err.message);
    return null;
  }

  // Wrap comma-separated JSON objects in [ ... ] if needed
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

  // Filter by allowed departments, degree level, and exclude "Practicum"
  const filtered = data.filter(c =>
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
    description: course.description
  };
}

// --- Example usage ---
const course = getRandomCourse("response.json", ["CMPT", "MATH"]);

if (course) {
  console.log("🎓 Randomly selected course:");
  console.log(`Department: ${course.dept}`);
  console.log(`Number: ${course.number}`);
  console.log(`Units: ${course.units}`);
  console.log(`Title: ${course.title}`);
  console.log(`Description: ${course.description}`);
} else {
  console.log("⚠️ No matching courses found.");
}
