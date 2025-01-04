/* eslint-disable no-console */ // Disables console warnings globally in this file
/* eslint-disable no-undef */ // Disables warnings for undefined variables like 'L' or 'establishmentsData'

document.addEventListener('DOMContentLoaded', function () {
  window.moveCarousel = function (direction, button) {
    const container = button
      .closest('.carousel')
      .querySelector('.carousel-container')
    const items = container.querySelectorAll('.carousel-item')
    const activeItem = container.querySelector('.carousel-item.active')
    let currentIndex = Array.from(items).indexOf(activeItem)

    currentIndex = (currentIndex + direction + items.length) % items.length
    items.forEach((item) => item.classList.remove('active'))
    items[currentIndex].classList.add('active')
  }

  const map = L.map('establishments-map').setView([46.603354, 1.888334], 6)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map)

  const groupedEstablishments = {}
  establishmentsData.establishments.forEach((establishment) => {
    const id = establishment.id
    if (!groupedEstablishments[id]) {
      groupedEstablishments[id] = {
        ...establishment,
        observations: [],
      }
    }
    if (establishment.photo_urls) {
      groupedEstablishments[id].observations.push({
        photos: JSON.parse(establishment.photo_urls),
        date: establishment.observation_date,
        time: establishment.observation_time,
        notes: establishment.notes,
      })
    }
  })

  Object.values(groupedEstablishments).forEach((establishment) => {
    const marker = L.marker([
      parseFloat(establishment.lat),
      parseFloat(establishment.lng),
    ]).addTo(map)

    let observationsHTML = ''
    if (establishment.observations.length > 0) {
      observationsHTML = `
        <div class="carousel">
          <div class="carousel-container">
            ${establishment.observations
              .map(
                (obs, index) => `
              <div class="carousel-item ${index === 0 ? 'active' : ''}">
                ${obs.photos
                  .map(
                    (url) =>
                      `<img src="${url}" style="max-width: 200px; margin: 5px;">`,
                  )
                  .join('')}
                <div class="observation-date">
                  ${new Date(obs.date).toLocaleDateString(
                    'fr-FR',
                  )} à ${obs.time.slice(0, 5)}
                </div>
                ${
                  obs.notes
                    ? `<div class="observation-notes">${obs.notes}</div>`
                    : ''
                }
              </div>
            `,
              )
              .join('')}
          </div>
          ${
            establishment.observations.length > 1
              ? `
            <button class="carousel-prev" onclick="moveCarousel(-1, this)">❮</button>
            <button class="carousel-next" onclick="moveCarousel(1, this)">❯</button>
          `
              : ''
          }
        </div>
      `
    }

    marker.bindPopup(`
      <div class="establishment-popup">
        <strong>${establishment.establishment_name}</strong><br>
        ${establishment.address}<br>
        Observations: ${establishment.observation_count}<br>
        ${observationsHTML}
      </div>
    `)
  })
})
