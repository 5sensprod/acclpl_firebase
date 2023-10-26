import { useFormWizardState } from './FormWizardContext'
import NameCompany from '../inputs/NameCompany'
import EmailInput from '../inputs/EmailInput'

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

// Composant pour l'étape 2 (e-mail)
export const Step2Component = (props) => {
  const { state, dispatch } = useFormWizardState()

  const handleEmailChange = (event) => {
    dispatch({
      type: 'UPDATE_FORM_DATA',
      payload: { email: event.target.value },
    })
  }

  return (
    <EmailInput
      value={state.formData.email || ''}
      onChange={handleEmailChange}
      {...props}
    />
  )
}
