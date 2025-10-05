import fs from 'fs/promises'; 
import path from 'path';

const facultyDict = {
    "cmpt": "Applied Sciences",
    "bus": "Beedie School of Business",
    "math": "Science",
    "educ": "Education",
    "stat": "Science",
    "phil": "Arts and Social Sciences",
    "phys": "Science",
    "econ": "Arts and Social Sciences",
    "macm": "Science",
    "cogs": "Arts and Social Sciences"
}

export const departments = [
  "BUS", "CMPT", "COGS", "ECON", "EDUC", "MACM",
  "MATH", "PHIL", "PHYS", "STAT", 
];

/* details format
var details = {
    faculty: String(getCourseFaculty(json)),
    dept: String(getCourseDept(json)),
    number: String(getCourseNumber(json)),
    designations: getCourseDesignation(json)
}
*/



export async function getDetailsGuess(dept, number){
    var j = await getJSON(dept, number);
    var details = getCourseDetails(j);

    return details;
}

export async function getRandomCourseDetails(allowedDepts){
    const courses = await getJSONAll();
    const result = courses.filter(
        course => allowedDepts.includes(course.dept) && course.degreeLevel === "UGRD"
    );

    if (result.length === 0) {
        throw new Error("No courses found for the selected departments");
    }

    let details;
    while (!details) {
        const i = Math.floor(Math.random() * result.length); // use result.length, not +1
        const candidate = result[i];
        if (!candidate) continue; // if undefined, pick again

        details = getCourseDetails([candidate]);
        if (!details) {
            console.warn("Picked undefined course, retrying...");
            details = null; // loop continues
        }
    }

    return details;
}

export async function getJSON(dept, number){
    const url = `https://api.sfucourses.com/v1/rest/outlines?dept=${dept}&number=${number}`;
    const response = await fetch(url);
    const json = await response.json();     
    return json;
}

export function getCourseDetails(json){
    var details = {
        faculty: String(getCourseFaculty(json)),
        dept: String(getCourseDept(json)),
        number: String(getCourseNumber(json)),
        designations: getCourseDesignation(json),
        units: getCourseUnits(json),
        title: getCourseTitle(json),
        description: getCourseDescription(json)
    }
    return details;
}

export function getCourseDescription(json){
    return json[0].description
}

export function getCourseTitle(json){
    return json[0].title;
}

export function getCourseFaculty(json){
    const dept = getCourseDept(json).toLowerCase();
    return facultyDict[dept];
}

export function getCourseDept(json){
    return json[0].dept;
}

export function getCourseNumber(json){
    return json[0].number;
}

export function getCourseUnits(json){
    return json[0].units;
}

export function getCourseDesignation(json){
    // Returns a {} object containing status of all designations for course
    
    /* Possible return strings from .designation:
        'Quantitative/Breadth-Science',
        'Quantitative',
        'N/A',
        'Writing/Quantitative',
        '',
        'Breadth-Social Sciences',
        'Breadth-Social Sci/Science',----
        'Breadth-Humanities/Social Sciences',
        'Writing/Breadth-Social Sci',
        'Breadth-Humanities',
        'Writing',
        'Breadth-Science',----
        'Writing/Breadth-Humanities',
        'Breadth-Hum/Social Sci/Science',----
        'Writing/Breadth-Hum/Soc Sci',
        'Quantitative/Breadth-Soc',
        'Writing/Breadth-Hum/Science',----
        'Breadth-Humanities/Sciences',----
        'Q/Breadth-Social Sci/Sciences'----
    */

    const desig = json[0].designation;

    var designations = {
        Quantitative: isQuantitative(desig),
        Writing: isWriting(desig),
        Humanities: isHumanities(desig),
        Social: isSocialScience(desig),
        Science: isScience(desig)
    }

    return designations;
}

export function getColours(ansDetails, guessDetails){
    //2 is green, 1 is yellow, 0 is red
    var colours = {
        facultyColour: String(getFacultyColour(ansDetails, guessDetails)),
        deptColour: String(getDeptColour(ansDetails, guessDetails)),
        number1Colour: getNumber1Colour(ansDetails, guessDetails),
        number2Colour: getNumber2Colour(ansDetails, guessDetails),
        number3Colour: getNumber3Colour(ansDetails, guessDetails),
        designationColour: String(getDesignationColour(ansDetails, guessDetails)),
        unitsColour: String(getUnitsColour(ansDetails, guessDetails))
    }

    return colours;
}

async function getJSONAll(){
    const response = await fetch('https://api.sfucourses.com/v1/rest/outlines?');
    const json = await response.json();     
    return json;
}

function isQuantitative(string){
    const newString = string.toLowerCase();
    if(newString.includes("q")){ return true; }
    return false;
}

function isWriting(string){
    const newString = string.toLowerCase();
    if(newString.includes("w")){ return true; }
    return false;
}

function isHumanities(string){

    const newString = string.toLowerCase();
    if(newString.includes("hum")){ return true; }
    return false;
}

function isSocialScience(string){
    const newString = string.toLowerCase();
    if(newString.includes("soc")){ return true; }
    return false;
}

function isScience(string){
    const newString = string.toLowerCase();
    if( newString.includes("-sci") || newString.includes("/sci") ){ return true; }
    return false;
}


function getFacultyColour(ansDetails, guessDetails){
    if( ansDetails.faculty == guessDetails.faculty ){ return "#B1DFA3"; }
    return "#FD9999";
}

function getDeptColour(ansDetails, guessDetails){
    if( ansDetails.dept == guessDetails.dept ){return "#B1DFA3"; }
    return "#FD9999";
}

function getUnitsColour(ansDetails, guessDetails){
    if (ansDetails.units == guessDetails.units){return "#B1DFA3"}
    else if (Math.abs(ansDetails.units - guessDetails.units) == 1) {return "#FFE781"}
    else{
        return "#FD9999";
    }
    
}

function getNumber1Colour(ansDetails, guessDetails){
    if( ansDetails.number[0] == guessDetails.number[0] ){
        return '#B1DFA3'; 
    }
    else if( Math.abs(ansDetails.number[0] - guessDetails.number[0] ) <= 1 ){
        return '#FFE681';
    }
    else{
        return '#FD9999';
    }
}

function getNumber2Colour(ansDetails, guessDetails){
    if( ansDetails.number[1] == guessDetails.number[1] ){
        return '#B1DFA3'; 
    }
    else if( Math.abs(ansDetails.number[1] - guessDetails.number[1] ) <= 1 ){
        return '#FFE681';
    }
    else{
        return '#FD9999';
    }
}

function getNumber3Colour(ansDetails, guessDetails){
    if( ansDetails.number[2] == guessDetails.number[2] ){
        return '#B1DFA3'; 
    }
    else if( Math.abs(ansDetails.number[2] - guessDetails.number[2] ) <= 1 ){
        return '#FFE681';
    }
    else{
        return '#FD9999';
    }
}

function getDesignationColour(ansDetails, guessDetails){
    var i = 0;
    for (const des in ansDetails.designations) {
        if(ansDetails.designations[des] != guessDetails.designations[des]){
            break;
        }
        i++;
    }
    if(i == 5){
        return "#B1DFA3";
    }

    for (const des in ansDetails.designations) {
        if(ansDetails.designations[des] == true && guessDetails.designations[des] == true){
            return "#FFE681";
        }
    }

    return "#FD9999";
}









