// wordpressService.js
const WP_API = 'https://acclpl.fr/wp-json/establishments/v1'
const API_USER = 'api-acclpl'
const API_PASSWORD = '*e!l&PtPw*#vlijSqp#dACwa' // Mot de passe d'application

async function syncEstablishment(establishmentData) {
  const response = await fetch(`${WP_API}/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(API_USER + ':' + API_PASSWORD)}`,
    },
    body: JSON.stringify(establishmentData),
  })

  if (!response.ok) {
    throw new Error(`WordPress sync failed: ${await response.text()}`)
  }
}

export { syncEstablishment }

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
