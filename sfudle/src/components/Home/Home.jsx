import { useState } from 'react'
import sfuLogo from '../../assets/sfuLogo.png'

function Home() {

    return(
        <div className='flex flex-col items-center justify-start min-h-screen'>

            <div className='flex flex-row items-center'>
                <img src={sfuLogo}>
                
            </img>
                <h1 className='ml-2 font-bold text-3xl'>
                DLE
                </h1>
            </div>
            
            <div>
                <h1>
                   Welcome
                </h1>
            </div>
            
        </div>


    )




}

export default Home