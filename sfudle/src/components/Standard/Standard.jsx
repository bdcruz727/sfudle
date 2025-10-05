import { useState } from 'react'
import { Link } from 'react-router-dom'
import sfuLogo from '../../assets/sfuLogo.png'
import mascot from '../../assets/mascot.png'
import standardVictoryImage from '../../assets/standardVictoryImage.png'

function Standard() {
    return(
    
            
             <div 
                className="min-h-screen flex flex-col items-center justify-center text-white w-full"
                style={{
                    backgroundImage: `url(${standardVictoryImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <h1>
                    Standardafjsakjfhkjaeglkasjgkaelkgjklaejglkejklgjesklgjkesjglkjeskgjleksgjeslkjjklsjfkldsjfkdsjflnsdnfkldsjfldsj
                </h1>
            </div>


       

    )
}
export default Standard