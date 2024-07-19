import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

function LeafletMapView({ center, zoom, markersData }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  // Définissez defaultIcon et lastIcon à l'extérieur des effets pour qu'ils soient accessibles partout
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
