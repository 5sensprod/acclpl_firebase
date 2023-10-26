import React from 'react'
import { useFormWizardState } from './FormWizardContext'
import NameCompany from '../inputs/NameCompany'
import AddressCompany from '../inputs/AddressCompany'

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
  const { dispatch } = useFormWizardState()

  return <AddressCompany dispatch={dispatch} {...props} />
}
