import { useFormWizardState } from './FormWizardContext'
import NameCompany from '../inputs/NameCompany'
import EmailInput from '../inputs/EmailInput'

// Composant pour l'étape 1
export const Step1Component = (props) => {
  const { state, dispatch } = useFormWizardState()

  const handleCompanyNameChange = (event) => {
    dispatch({
      type: 'FORMAT_COMPANY',
      payload: event.target.value,
    })

    console.log(
      'Normalized Company Name in Step1Component:',
      state.formData.normalizedCompanyName,
    )
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
