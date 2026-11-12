import { useEffect, useState } from 'react'

interface HealthResponse {
  status: string
  service: string
}

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/health')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`)
        }
        return response.json()
      })
      .then((data: HealthResponse) => {
        setHealth(data)
      })
      .catch((err: Error) => {
        setError(err.message)
      })
  }, [])

  return (
    <main>
      <h1>Universal Hackathon Starter Kit</h1>

      <h2>Backend Health Check</h2>

      {health && (
        <pre>{JSON.stringify(health, null, 2)}</pre>
      )}

      {error && <p>Error: {error}</p>}

      {!health && !error && <p>Connecting to backend...</p>}
    </main>
  )
}

export default App
