import { useState } from 'react'
import { Link }  from 'react-router-dom'
import sfuLogo from '../../assets/sfuLogo.png'
import mascot from '../../assets/mascot.png'


function Home() {

    return(
        <div className='flex flex-col items-center justify-start min-h-screen'>

            <div className='flex flex-row items-end w-100 mt-8'>
                <img src={sfuLogo}>
                
            </img>
            <div className='flex flex-col'>
                <img src={mascot}>
                </img>
                <h1 className='ml-2 font-bold text-black text-4xl'>
                    DLE
                </h1>
            </div>
                
            </div>
            
            <div className='flex flex-row items-center py-32 gap-16'>
                <Link to="/standard">
                    <button className='menu-button px-8 py-4 rounded-lg text-white font-bold text-xl shadow-lg hover:scale-105 transition-transform duration-200'>
                        <h2 className='text-[#fff9fc]'>
                            STANDARD
                        </h2>
                    </button>
                </Link>
           
                <Link to="/course">
                     <button className='menu-button px-8 py-4 rounded-lg text-white font-bold text-xl shadow-lg hover:scale-105 transition-transform duration-200'
                     style={{ backgroundColor: '#F85353' }}
  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f67a7aff')}
  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#F85353')}>
                        <h2>
                            COURSE
                        </h2>
                    </button>
                </Link>

                <Link to="/location">
                     <button className='menu-button px-8 py-4 rounded-lg text-white font-bold text-xl shadow-lg hover:scale-105 transition-transform duration-200'>
                        <h2>
                            LOCATION
                        </h2>
                    </button>
                </Link>

            </div>
            
        </div>


    )




}

export default Home