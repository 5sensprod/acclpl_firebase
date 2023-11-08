import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

function LeafletMapView({ center, zoom, markersData }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  // Définissez defaultIcon à l'extérieur des effets pour qu'il soit accessible partout
  const defaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    shadowSize: [41, 41],
  })

  useEffect(() => {
    const map = L.map(mapRef.current).setView(center, zoom)
    mapInstanceRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    L.Marker.prototype.options.icon = defaultIcon

    return () => {
      map.remove()
    }
  }, [center, zoom, defaultIcon])
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !markersData) return

    markersData.forEach((data) => {
      const marker = L.marker(data.markerCoords, { icon: defaultIcon }).addTo(
        map,
      )
      marker.on('click', () => {
        setTimeout(() => {
          map.setView(data.markerCoords, 15)
        }, 10)
      })
      if (data.companyName) {
        const popupContent = `
          <div style="display: flex; flex-direction: column; align-items: start; justify-content: center; min-width: 80px; text-align:center;">
          <p style="margin-top: 5px;margin-bottom: 5px;">${data.companyName}</p>
            <img src="${data.imageURL}" alt="Image associée" style="max-width: 80px; max-height: 100px;">
          </div>
        `
        marker.bindPopup(popupContent)
      }
    })

    map.setView(center, zoom)
  }, [markersData, center, zoom, defaultIcon]) // Ajoute center et zoom ici

  return (
    <div
      className="rounded"
      ref={mapRef}
      style={{ width: '100%', height: '400px' }}
    ></div>
  )
}

export default LeafletMapView
