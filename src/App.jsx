import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState("We'll be back soon!")

  const messages = [
    "We'll be back soon!",
    "Thank you for your patience.",
    "Improving the website experience...",
    "Maintenance in progress."
  ]

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      index = (index + 1) % messages.length
      setMessage(messages[index])
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="container">
      <div className="maintenance-box">
        <h1>🚧 Under Maintenance</h1>
        <p>We are currently performing scheduled maintenance to improve your experience. Please check back later.</p>
        <div className="countdown">
          <span id="time">{message}</span>
        </div>
      </div>
    </div>
  )
}

export default App
