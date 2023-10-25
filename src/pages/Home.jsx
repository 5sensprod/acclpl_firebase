import React, { useContext } from 'react'
import { UserContext } from '../context/userContext'
import Wizard from '../components/Wizard'
import { Container, Row, Col } from 'react-bootstrap'
import CompanyNameInput from '../components/ObservationEntryForm/CompanyNameInput'
import useCompanyName from '../hooks/useCompanyName'

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

export default function Home() {
  const { currentUser } = useContext(UserContext)

  // 2. Définissez les étapes du Wizard
  const steps = [
    { component: Step1 },
    { component: Step2 },
    { component: Step3 },
    // ... ajoutez autant d'étapes que nécessaire
  ]

  return (
    <div className="container p-3">
      <h1 className="display-3 text-light">
        {currentUser
          ? 'Bienvenue, Gros !'
          : "Bonjour, S'inscrire ou se connecter"}
      </h1>

      {/* 3. Utilisez le composant Wizard dans le rendu */}
      <Wizard steps={steps}></Wizard>
    </div>
  )
}
