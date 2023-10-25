// src/components/Wizard/WizardStepsContainer.jsx

import React from 'react'
import Wizard from './index'
import { useWizardState } from './wizardState'

import { Container, Row, Col } from 'react-bootstrap'
import CompanyNameInput from '../ObservationEntryForm/CompanyNameInput'
import useCompanyNameWizard from './hooks/useCompanyNameWizard'
import AddressInput from '../ObservationEntryForm/AddressInput'
import useCompanyAddress from '../../hooks/useGeocodedAddress'

const Step1 = ({ formData, setField }) => {
  const onSelectCompanyName = (name) => {
    console.log('Selected name:', name)
    setField('companyName', name)
  }

  const {
    companyName,
    isNameValidated,
    handleCompanyNameChange,
    handleCompanyNameValidation,
    handleCompanyNameModification,
    handleIDontKnowClick,
  } = useCompanyNameWizard(onSelectCompanyName, null, formData, setField)
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

const Step2 = ({ currentCoords }) => {
  const onSelectAddress = (coordinates) => {
    console.log('Selected coordinates:', coordinates)
  }

  const {
    address,
    isAddressValidated,
    handleAddressChange,
    handleAddressValidation,
    handleAddressModification,
    handleSuggestionClick,
    handleGeolocationClick,
    autocompleteResults,
  } = useCompanyAddress(onSelectAddress, currentCoords)

  return (
    <Container>
      <Row className="justify-content-center">
        <Col l="auto">
          <h3 className="text-light">Étape 2</h3>
          <AddressInput
            address={address}
            isAddressValidated={isAddressValidated}
            onAddressChange={handleAddressChange}
            onValidation={handleAddressValidation}
            onModification={handleAddressModification}
            onSuggestionClick={handleSuggestionClick}
            onGeolocationClick={handleGeolocationClick}
            autocompleteResults={autocompleteResults}
          />
        </Col>
      </Row>
    </Container>
  )
}

const WizardStepsContainer = () => {
  const { formData, setField } = useWizardState()

  const steps = [
    {
      component: Step1,
      props: { formData, setField },
      // autres propriétés pour l'étape...
    },
    { component: Step2 },
    // ... ajoutez autant d'étapes que nécessaire
  ]

  return <Wizard steps={steps} />
}

export default WizardStepsContainer
