import React from 'react'
import { Calendar, Clock } from 'react-bootstrap-icons'
import Spinner from 'react-bootstrap/Spinner'
import { formatDate } from '../../../utils/dateUtils'

const ObservationDetail = ({
  observation,
  isImageLoaded,
  handleImageLoaded,
}) => {
  return (
    <div className="d-flex align-items-center justify-content-between mb-3">
      <div className="flex-grow-1 d-flex flex-column">
        <div className="mb-1">
          <Calendar size="18" className="me-2" />
          <span>{formatDate(observation.date)}</span>
        </div>
        <div>
          <Clock size="18" className="me-2" />
          <span>{observation.time}</span>
        </div>
      </div>
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
  )
}

export default ObservationDetail
