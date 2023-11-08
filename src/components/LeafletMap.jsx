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
  imageURL,
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

    const marker = L.marker(markerCoords).addTo(map)

    if (companyName) {
      const popupContent = document.createElement('div')

      popupContent.style.display = 'flex'
      popupContent.style.flexDirection = 'column'
      popupContent.style.alignItems = 'center'
      popupContent.style.justifyContent = 'center'

      const companyNameElement = document.createElement('p')
      companyNameElement.textContent = companyName
      popupContent.appendChild(companyNameElement)

      if (imageURL) {
        const imageElement = document.createElement('img')
        imageElement.src = imageURL
        imageElement.alt = 'Image associée'
        imageElement.style.maxWidth = '100px'
        imageElement.style.maxHeight = '100px'
        popupContent.appendChild(imageElement)
      }

      marker.bindPopup(popupContent).openPopup()
    }

    markerRef.current = marker
    map.setView(markerCoords, 16)
  }, [markerCoords, zoom, companyName, imageURL])

  return <div ref={mapRef} style={{ width: '100%', height: '400px' }}></div>
}

export default LeafletMap
