import React from 'react'
import { useFormWizardState } from './FormWizardContext'
import NameCompany from '../inputs/NameCompany'
import GeolocateAddress from '../inputs/GeolocateAddress'
import DateTimeInput from '../inputs/DateTimeInput'

// Composant pour l'étape 1
export const Step1Component = (props) => {
  const { state, dispatch } = useFormWizardState()

  const handleCompanyNameChange = (event) => {
    const value = event.target.value

    // Mettez uniquement à jour les données du formulaire pour l'affichage
    dispatch({
      type: 'UPDATE_FORM_DATA',
      payload: { companyName: value },
    })
  }

  return (
    <>
      <NameCompany
        value={state.formData.companyName}
        onChange={handleCompanyNameChange}
        {...props}
      />
    </>
  )
}

// Composant pour l'étape 2 (address)
export const Step2Component = (props) => {
  const { state, dispatch } = useFormWizardState()

  // Fonction pour mettre à jour l'adresse dans le contexte
  const handleSelectAddress = (coords) => {
    dispatch({
      type: 'UPDATE_FORM_DATA',
      payload: {
        companyCoordinates: coords,
      },
    })
  }

  return (
    <div>
      <GeolocateAddress
        onSelectAddress={handleSelectAddress}
        currentCoords={state.formData.companyCoordinates}
        moveToNextStep={() => dispatch({ type: 'NEXT_STEP' })}
      />
    </div>
  )
}

export const Step3Component = () => {
  return <DateTimeInput />
}
