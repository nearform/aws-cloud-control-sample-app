import { useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import Welcome from './components/Welcome'
import ArtistDisplay from './components/ArtistDisplay'
import Footer from './components/Footer'
import getArtist from './services/getArtist'

function App() {
  const [artist, setArtist] = useState(null)
  const [artistMeta, setArtistMeta] = useState(null)

  async function getInfo(event) {
    event.preventDefault()
    const response = await getArtist(artist)
    setArtistMeta(response)
  }

  return (
    <div className="App">
      <header className="App-header">
        {artistMeta ? <ArtistDisplay artistMeta={artistMeta} /> : <Welcome />}
        <Form onSubmit={getInfo}>
          <Form.Group className="mb-3" controlId="formArtistName">
            <Form.Control
              type="text"
              autoFocus
              size="lg"
              placeholder="Any singer or band..."
              onChange={(event) => {
                setArtist(event.target.value)
              }}
            />
          </Form.Group>
          <Button variant="primary" size="lg" onClick={getInfo}>
            Find Artist
          </Button>
        </Form>
      </header>
      <Footer />
    </div>
  )
}

export default App
