import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

function LeafletMap({
  center = [48.9562, 4.3653],
  zoom = 13,
  markerCoords,
  companyName,
}) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markerRef = useRef(null)

  useEffect(() => {
    const map = L.map(mapRef.current).setView(center, zoom)
    mapInstanceRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    const defaultIcon = L.icon({
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      shadowSize: [41, 41],
    })
    L.Marker.prototype.options.icon = defaultIcon

    return () => {
      map.remove()
    }
  }, [center, zoom])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !markerCoords) return

    if (markerRef.current) {
      markerRef.current.remove()
    }

    const correctedCoords = [markerCoords[1], markerCoords[0]]
    const marker = L.marker(correctedCoords).addTo(map)

    // Ajouter le popup avec le nom de l'entreprise si présent
    if (companyName) {
      marker.bindPopup(companyName).openPopup()
    }

    markerRef.current = marker
    map.setView(correctedCoords, 16)
  }, [markerCoords, zoom, companyName])

  return <div ref={mapRef} style={{ width: '100%', height: '400px' }}></div>
}

export default LeafletMap
