import { useState } from 'react'
import sfuLogo from '../../assets/sfuLogo.png'
import mascot from '../../assets/mascot.png'

function Home() {

    return(
        <div className='flex flex-col items-center justify-start min-h-screen'>

            <div className='flex flex-row items-end w-100 mt-16'>
                <img src={sfuLogo}>
                
            </img>
            <div className='flex flex-col'>
                <img src={mascot}>
                </img>
                <h1 className='ml-2 font-bold text-4xl'>
                    DLE
                </h1>
            </div>
                
            </div>
            
            <div className='flex flex-row items-center py-32 gap-16'>
                <button className='menu-button'>
                    <h2 className='text-[#fff9fc]'>
                        Standard
                    </h2>
                </button>

                <button className='menu-button'>
                    <h2>
                        Course
                    </h2>
                </button>

                <button className='menu-button'>
                    <h2>
                        Location
                    </h2>
                </button>
            </div>
            
        </div>


    )




}

export default Home