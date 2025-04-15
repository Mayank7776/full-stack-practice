import { useEffect, useState } from 'react'
import './App.css'
// to get data from server
import axios from 'axios'

function App() {
  const [jokes, setJokes] = useState([])
  
  useEffect(() => {
    axios.get('/api/jokes')
    .then((respone) => {
      setJokes(respone.data)
    })
    .catch((error) => {
      console.log(error)
    })
  })


  return (
    <>
      <h1>Full-Stack Practice App</h1>
      <p>Jokes : {jokes.length}</p>

      {
        jokes.map((joke) => (
          <div>
            <h3>{joke.name}</h3>
          </div>
        ))
      }
    </>
  )
}

export default App
