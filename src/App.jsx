import { useState } from 'react'
import './App.css'
import headImage from "./assets/Heading_image.jpg"
import EricHelmsCal from './pages/EricHelmsCal'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main>
      <div className="app-view">
        <img src={headImage} alt="" className='heading-image'/>
        <EricHelmsCal />
      </div>
      
    </main>
  )
}

export default App
