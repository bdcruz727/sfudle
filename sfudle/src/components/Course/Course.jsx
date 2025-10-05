import { useState, useEffect } from "react";
import { getDetailsGuess, getRandomCourseDetails, getColours } from '../common/getCourseDetails.js';
import sfuLogo from "../../assets/sfuLogo.png";
import mascot from "../../assets/mascot.png";
import { Link }  from 'react-router-dom'
import allCourses from '../../data/courses.json'
import standardVictory from '../../assets/standardVictoryImage.png'

function Course() {
    return(
        <div>
            <h1>
                Course
            </h1>
        </div>

    )
}
export default Course