import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

function LeafletMapView({ center, zoom, markersData }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  const defaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    shadowSize: [41, 41],
  })

  const lastIcon = L.divIcon({
    className: 'custom-marker-icon',
    html: '<div style="background-color: red; width: 25px; height: 25px; border-radius: 50%; border: 2px solid white;"></div>',
  })

  useEffect(() => {
    const map = L.map(mapRef.current).setView(center, zoom)
    mapInstanceRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    return () => {
      map.remove()
    }
  }, [center, zoom])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !markersData) return

    let lastMarkerCoords = null

    markersData.forEach((data) => {
      const icon = data.isLastObservation ? lastIcon : defaultIcon
      const marker = L.marker(data.markerCoords, { icon }).addTo(map)

      if (data.isLastObservation) {
        lastMarkerCoords = data.markerCoords
      }

      let currentIndex = 0

      // Fonction de mise à jour du contenu du popup
      const updatePopupContent = (popupElement, index) => {
        const signalement = data.observationDateTimes[index]

        // Mise à jour du texte de la date et de l'heure
        popupElement.querySelector(
          '.popup-date',
        ).textContent = ` ${signalement.date} à ${signalement.time}`

        // Mise à jour correcte de l'image en fonction de la date sélectionnée
        const imageElement = popupElement.querySelector('.popup-image')
        const imageURLs = signalement.photoURLs // Utiliser les images associées à la date
        imageElement.src = imageURLs[0] // Affiche la première image du tableau de photos
        imageElement.alt = `Image associée au signalement du ${signalement.date}`
      }

      marker.on('click', () => {
        const popupContent = `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-width: 80px; text-align:center;">
            <p style="margin-top: 5px;margin-bottom: 5px;">${
              data.companyName
            }</p>
            <p class="popup-date" style="margin: 0;">${
              data.observationDateTimes[currentIndex].date
            } à ${data.observationDateTimes[currentIndex].time}</p>
            <img class="popup-image" src="${
              data.observationDateTimes[currentIndex].photoURLs[0]
            }" alt="Image associée" style="max-width: 80px; max-height: 100px;">
            ${
              data.observationDateTimes.length > 1
                ? `<div style="display: flex; justify-content: space-between; margin-top: 10px;">
                    <button id="prev-btn" style="cursor: pointer;">&#8249;</button>
                    <button id="next-btn" style="cursor: pointer;">&#8250;</button>
                   </div>`
                : ''
            }
          </div>
        `

        L.popup()
          .setLatLng(data.markerCoords)
          .setContent(popupContent)
          .openOn(map)

        const popupElement = document.querySelector('.leaflet-popup-content')

        // Vérifiez l'existence des boutons avant de leur ajouter des écouteurs
        const prevBtn = popupElement.querySelector('#prev-btn')
        const nextBtn = popupElement.querySelector('#next-btn')

        if (prevBtn && nextBtn) {
          prevBtn.addEventListener('click', () => {
            currentIndex =
              (currentIndex - 1 + data.observationDateTimes.length) %
              data.observationDateTimes.length
            updatePopupContent(popupElement, currentIndex)
          })

          nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % data.observationDateTimes.length
            updatePopupContent(popupElement, currentIndex)
          })
        }
      })
    })

    if (lastMarkerCoords) {
      map.setView(lastMarkerCoords, zoom)
    } else {
      map.setView(center, zoom)
    }
  }, [markersData, center, zoom, defaultIcon, lastIcon])

  return (
    <div
      className="rounded"
      ref={mapRef}
      style={{ width: '100%', height: '400px' }}
    ></div>
  )
}

export default LeafletMapView
