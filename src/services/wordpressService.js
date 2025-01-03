// wordpressService.js
const WP_API = process.env.REACT_APP_WP_API
const API_USER = process.env.REACT_APP_WP_USER
const API_PASSWORD = process.env.REACT_APP_WP_PASSWORD

export async function syncEstablishment(establishmentData) {
  const response = await fetch(`${WP_API}/establishment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(API_USER + ':' + API_PASSWORD)}`,
    },
    body: JSON.stringify(establishmentData),
  })

  if (!response.ok)
    throw new Error(`WordPress sync failed: ${await response.text()}`)
  return response.json()
}

export async function syncObservation(observationData) {
  const response = await fetch(`${WP_API}/observation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(API_USER + ':' + API_PASSWORD)}`,
    },
    body: JSON.stringify(observationData),
  })

  if (!response.ok)
    throw new Error(`WordPress sync failed: ${await response.text()}`)
  return response.json()
}

// Test la connexion
async function testConnection() {
  try {
    const response = await fetch(`${WP_API}`, {
      headers: {
        Authorization: 'Basic ' + btoa(`${API_USER}:${API_PASSWORD}`),
      },
    })
    console.log('Test connexion:', response.status)
    const data = await response.json()
    console.log('Données:', data)
  } catch (error) {
    console.error('Erreur:', error)
  }
}

testConnection()
