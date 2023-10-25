import React from 'react'
import useWizard from './useWizard'
import { ProgressBar, Container, Row, Col } from 'react-bootstrap'

const ProgressStepper = () => {
  const { currentStep, totalSteps } = useWizard()

  // Calculer le pourcentage de progression basé sur l'étape actuelle
  const progressPercentage = (currentStep / totalSteps) * 100

  return (
    <Container className="my-4">
      <Row>
        <Col>
          <ProgressBar
            now={progressPercentage}
            striped
            variant="primary"
            animated
          />
        </Col>
      </Row>
    </Container>
  )
}

export default ProgressStepper
