import { useState } from 'react'
import React from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Navbar from './components/Navbar'
import ThreeDCardDemo from './components/Hero'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Navbar/>
     <ThreeDCardDemo/>
    </>
  )
}

export default App
