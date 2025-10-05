import fs from 'fs/promises'; 
import path from 'path';

const facultyDict = {
    "cmpt": "applied science",
    "bus": "beedie",
    "math": "science"
}

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
    var courses = await getJSONAll();
    const result = courses.filter(course => allowedDepts.includes(course.dept) && course.degreeLevel == "UGRD");
    
    var max = result.length;
    var i = Math.floor(Math.random() * (max + 1));
    const j = [result[i]];
    var details = getCourseDetails(j);
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
        designations: getCourseDesignation(json)
    }
    return details;
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
        quantitative: isQuantitative(desig),
        writing: isWriting(desig),
        humanities: isHumanities(desig),
        social: isSocialScience(desig),
        science: isScience(desig)
    }

    return designations;
}

export function getColours(ansDetails, guessDetails){
    //2 is green, 1 is yellow, 0 is red
    var colours = {
        facultyColour: String(getFacultyColour(ansDetails, guessDetails)),
        deptColour: String(getDeptColour(ansDetails, guessDetails)),
        numberColour: getNumberColour(ansDetails, guessDetails),
        designationColour: String(getDesignationColour(ansDetails, guessDetails))
    }

    return colours;
}

async function getJSONAll(){
    const response = await fetch('https://api.sfucourses.com/v1/rest/outlines?');
    const json = await response.json();     
    return json;
}

function isQuantitative(string){
    string = string.toLowerCase();
    if(string.includes("q")){ return true; }
    return false;
}

function isWriting(string){
    string = string.toLowerCase();
    if(string.includes("w")){ return true; }
    return false;
}

function isHumanities(string){
    string = string.toLowerCase();
    if(string.includes("hum")){ return true; }
    return false;
}

function isSocialScience(string){
    string = string.toLowerCase();
    if(string.includes("soc")){ return true; }
    return false;
}

function isScience(string){
    string = string.toLowerCase();
    if( string.includes("-sci") || string.includes("/sci") ){ return true; }
    return false;
}


function getFacultyColour(ansDetails, guessDetails){
    if( ansDetails.faculty == guessDetails.faculty ){ return 2; }
    return 0;
}

function getDeptColour(ansDetails, guessDetails){
    if( ansDetails.dept == guessDetails.dept ){ return 2; }
    return 0;
}

function getNumberColour(ansDetails, guessDetails){
    var array = [0, 0, 0];

    for (let i = 0; i < array.length; i++) {
        if( ansDetails.number[i] == guessDetails.number[i] ){
            array[i] = 2; 
        }
        else if( Math.abs(ansDetails.number[i] - guessDetails.number[i] ) <= 1 ){
            array[i] = 1;
        }
        else{
            array[i] = 0;
        }
    }

    const numColours = {
        num1: String(array[0]),
        num2: String(array[1]),
        num3: String(array[2])
    }

    return numColours;
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
        return 2;
    }

    for (const des in ansDetails.designations) {
        if(ansDetails.designations[des] == true && guessDetails.designations[des] == true){
            return 1;
        }
    }

    return 0;
}









