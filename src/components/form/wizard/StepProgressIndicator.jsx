import React from 'react'
import { Container, Row, Col, ProgressBar } from 'react-bootstrap'
import { useFormWizardState } from '../context/FormWizardContext'

const StepProgressIndicator = () => {
  const { state } = useFormWizardState()

  const currentStep = state.currentStep
  const totalSteps = state.steps.length

  const progressPercentage = (currentStep / totalSteps) * 100

  return (
    <Container className="my-4 p-0">
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

export default StepProgressIndicator
