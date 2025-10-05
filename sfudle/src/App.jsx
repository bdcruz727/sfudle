import { useState } from 'react'

import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home/Home.jsx'
import Standard from './components/Standard/Standard.jsx'
import Course from './components/Course/Course.jsx'
import Location from './components/Location/Location.jsx'


function App() {
 

  return (
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/standard' element={<Standard/>} />
          <Route path='/course' element={<Course/>} />
          <Route path='/location' element={<Location/>} />
        </Routes>
  )
}

export default App
