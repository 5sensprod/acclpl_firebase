import React from 'react'
import { Calendar, Clock, Tags } from 'react-bootstrap-icons'
import Spinner from 'react-bootstrap/Spinner'
import { formatDate } from '../../../utils/dateUtils'

const typeLabels = {
  colors: 'Les couleurs',
  windows: 'Les vitrines',
  sign: "L'enseigne",
  local: 'Le local',
  advertisement: 'Publicité lumineuse',
}

const ObservationDetail = ({
  observation,
  isImageLoaded,
  handleImageLoaded,
}) => {
  return (
    <div className="observation-detail">
      <div className="d-flex justify-content-between mb-3">
        {/* Informations de gauche */}
        <div className="d-flex flex-column">
          <div className="mb-2">
            <Calendar size={18} className="me-2" />
            <span>{formatDate(observation.date)}</span>
          </div>
          <div className="mb-2">
            <Clock size={18} className="me-2" />
            <span>{observation.time}</span>
          </div>
          {/* Ajout d'une condition de vérification plus stricte */}
          {Array.isArray(observation.observationTypes) &&
            observation.observationTypes.length > 0 && (
              <div className="observation-types">
                <Tags size={18} className="me-2" />
                <span>
                  {observation.observationTypes
                    .map((type) => typeLabels[type])
                    .join(', ')}
                </span>
              </div>
            )}
          {observation.additionalNotes && (
            <div className="mt-2 text-muted small">
              {observation.additionalNotes}
            </div>
          )}
        </div>

        {/* Photos à droite */}
        <div className="d-flex">
          {observation.photoURLs &&
            observation.photoURLs.map((url, urlIndex) => (
              <div key={urlIndex} style={{ width: '50px', height: '50px' }}>
                {!isImageLoaded(urlIndex) && <Spinner animation="border" />}
                <img
                  src={url}
                  alt={`Observation ${urlIndex + 1}`}
                  className="img-fluid rounded"
                  style={{
                    maxWidth: '50px',
                    display: isImageLoaded(urlIndex) ? 'block' : 'none',
                  }}
                  onLoad={() => handleImageLoaded(urlIndex)}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default ObservationDetail
