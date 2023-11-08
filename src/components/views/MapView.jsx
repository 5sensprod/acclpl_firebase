import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../../context/userContext'
import { getObservationsForUser } from '../../services/observationService'
import { Accordion, Card, Button, useAccordionButton } from 'react-bootstrap'
import { Calendar, Clock } from 'react-bootstrap-icons'
import styles from '../styles/MapView.module.css'
import { ChevronDown } from 'react-bootstrap-icons'

const MapView = () => {
  const { currentUser } = useContext(UserContext)
  const [observations, setObservations] = useState([])
  const [activeKey, setActiveKey] = useState(null)

  const formatDate = (dateString) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return new Date(dateString).toLocaleDateString('fr-FR', options)
  }

  useEffect(() => {
    if (currentUser?.uid) {
      const fetchObservations = async () => {
        try {
          const obs = await getObservationsForUser(currentUser.uid)
          setObservations(obs)
        } catch (error) {
          console.error('Failed to fetch observations:', error)
        }
      }

      fetchObservations()
    }
  }, [currentUser])

  // Group observations by establishment id
  const observationsByEstablishment = observations.reduce((acc, obs) => {
    const key = obs.establishment.id
    if (!acc[key]) {
      acc[key] = {
        name: obs.establishment.establishmentName,
        address: `${obs.street.streetName}, ${obs.street.city}, ${obs.street.postalCode}`,
        observations: [],
      }
    }
    acc[key].observations.push({
      date: obs.date,
      time: obs.time,
      photoURLs: obs.photoURLs,
    })
    return acc
  }, {})

  // Function to create a custom accordion toggle
  function CustomToggle({ children, eventKey }) {
    const decoratedOnClick = useAccordionButton(eventKey, () => {
      setActiveKey((prevKey) => (prevKey === eventKey ? null : eventKey))
    })

    const isCurrentEventKeyActive = activeKey === eventKey

    const chevronStyle = {
      transform: isCurrentEventKeyActive ? 'rotate(180deg)' : 'none',
      transition: 'transform 0.3s ease',
    }

    return (
      <Button
        variant="link"
        onClick={decoratedOnClick}
        className={`text-start ${styles.customToggle}`}
        aria-expanded={isCurrentEventKeyActive}
      >
        <span>{children}</span>
        <ChevronDown style={chevronStyle} />
      </Button>
    )
  }

  return (
    <div className="reporting-view text-light">
      {/* <h2>Observations des Lumières Allumées</h2> */}
      <Accordion activeKey={activeKey}>
        {Object.entries(observationsByEstablishment).map(
          ([key, { name, address, observations }], index) => (
            <Card key={key} className="mb-3">
              <Card.Header className="bg-dark text-light rounded mb-1">
                <CustomToggle
                  eventKey={`${index}`}
                  // style={{ textDecoration: 'none', color: 'white' }}
                  className={`${styles.customToggle}`}
                >
                  <div>{name}</div>
                  <div>{address.split(',')[0]} </div>

                  {/* Ici, on affiche juste la rue */}
                </CustomToggle>
              </Card.Header>
              <Accordion.Collapse eventKey={`${index}`}>
                <Card.Body className="bg-dark text-light rounded">
                  {observations.map((obs, obsIndex) => (
                    <div
                      key={obsIndex}
                      className="d-flex align-items-center justify-content-between"
                    >
                      <div className="flex-grow-1 d-flex flex-column">
                        <div className="mb-1">
                          <Calendar size="20" className="me-2" />
                          <span>{formatDate(obs.date)}</span>
                        </div>
                        <div>
                          <Clock size="20" className="me-2" />
                          <span>{obs.time}</span>
                        </div>
                      </div>
                      {obs.photoURLs &&
                        obs.photoURLs.map((url, urlIndex) => (
                          <img
                            key={urlIndex}
                            src={url}
                            alt={`Observation ${obsIndex + 1}`}
                            className="img-fluid rounded"
                            style={{ maxWidth: '50px' }}
                          />
                        ))}
                    </div>
                  ))}
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          ),
        )}
      </Accordion>
    </div>
  )
}

export default MapView
