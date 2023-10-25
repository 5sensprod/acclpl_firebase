import { useContext } from 'react'
import { WizardContext } from './WizardProvider'

const useWizard = () => {
  const context = useContext(WizardContext)

  if (!context) {
    throw new Error(
      "useWizard doit être utilisé à l'intérieur d'un WizardProvider",
    )
  }

  return context
}

export default useWizard
