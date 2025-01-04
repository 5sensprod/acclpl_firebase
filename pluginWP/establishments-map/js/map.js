document.addEventListener('DOMContentLoaded', function () {
  const map = L.map('establishments-map').setView([46.603354, 1.888334], 6)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map)

  const establishments = establishmentsData.establishments

  establishments.forEach((establishment) => {
    const marker = L.marker([
      parseFloat(establishment.lat),
      parseFloat(establishment.lng),
    ]).addTo(map)

    let photosHTML = ''
    if (establishment.photo_urls) {
      try {
        const urls = JSON.parse(establishment.photo_urls)
        photosHTML = urls
          .map(
            (url) =>
              `<img src="${url}" style="max-width: 200px; margin: 5px;">`,
          )
          .join('')
      } catch (e) {
        console.error('Erreur parsing JSON:', e)
      }
    }

    marker.bindPopup(`
            <div class="establishment-popup">
                <strong>${establishment.establishment_name}</strong><br>
                ${establishment.address}<br>
                Observations: ${establishment.observation_count}<br>
                <div class="observation-photos">
                    ${photosHTML}
                </div>
            </div>
        `)
  })
})
