import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import CompanyNameInput from '../ObservationEntryForm/CompanyNameInput'
import useCompanyName from '../../hooks/useCompanyName'
import Wizard from './Wizard'
import { WizardProvider } from './WizardProvider'

const Step1 = () => {
  const {
    companyName,
    isNameValidated,
    handleCompanyNameChange,
    handleCompanyNameValidation,
    handleCompanyNameModification,
    handleIDontKnowClick,
  } = useCompanyName()

  return (
    <Container>
      <Row className="justify-content-center">
        <Col l="auto">
          <h3 className="text-light">Étape 1</h3>
          <CompanyNameInput
            companyName={companyName}
            isNameValidated={isNameValidated}
            onNameChange={handleCompanyNameChange}
            onValidation={handleCompanyNameValidation}
            onModification={handleCompanyNameModification}
            onIDontKnowClick={handleIDontKnowClick}
          />
        </Col>
      </Row>
    </Container>
  )
}

const Step2 = () => (
  <Container>
    <Row className="justify-content-center">
      <Col xs="auto">
        <h3 className="text-light">Étape 2</h3>
      </Col>
    </Row>
  </Container>
)

const Step3 = () => (
  <Container>
    <Row className="justify-content-center">
      <Col xs="auto">
        <h3 className="text-light">Étape 3</h3>
      </Col>
    </Row>
  </Container>
)

const Steps = () => {
  const steps = [
    { component: Step1 },
    { component: Step2 },
    { component: Step3 },
  ]

  return (
    <WizardProvider>
      <Wizard steps={steps} />
    </WizardProvider>
  )
}

export default Steps
