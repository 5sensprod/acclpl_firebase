// wordpressService.js
const WP_API = process.env.REACT_APP_WP_API
const API_USER = process.env.REACT_APP_WP_USER
const API_PASSWORD = process.env.REACT_APP_WP_PASSWORD

export async function uploadMediaToWordPress(fileUrl) {
  const response = await fetch(`${WP_API}/media`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(API_USER + ':' + API_PASSWORD)}`,
    },
    body: JSON.stringify({ file_url: fileUrl }),
  })

  if (!response.ok)
    throw new Error(`WordPress media upload failed: ${await response.text()}`)
  return response.text()
}

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
  // Convertir les URLs Firebase en URLs WordPress
  const wordpressPhotoURLs = await Promise.all(
    observationData.photoURLs.map((url) => uploadMediaToWordPress(url)),
  )

  const wordpressData = {
    ...observationData,
    photoURLs: wordpressPhotoURLs,
  }

  const response = await fetch(`${WP_API}/observation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(API_USER + ':' + API_PASSWORD)}`,
    },
    body: JSON.stringify(wordpressData),
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
