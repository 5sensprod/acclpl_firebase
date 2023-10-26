import React, { useState } from 'react' // Ajoutez useState
import { Button } from 'react-bootstrap'
import { useFormWizardState } from './FormWizardContext'
import { checkDuplicateEstablishment } from '../../../services/establishmentCheckerService'
import DuplicateModal from './DuplicateModal' // Importez le modal

const WizardNavigationButtons = () => {
  const { state, dispatch } = useFormWizardState()
  const [showModal, setShowModal] = useState(false) // Gérez l'état du modal ici

  const currentStep = state.currentStep
  const totalSteps = state.steps.length

  const moveToPrevStep = () => {
    dispatch({ type: 'PREV_STEP' })
  }

  const moveToNextStep = async () => {
    if (currentStep === 1 && state.formData.companyName.trim() !== '') {
      dispatch({
        type: 'FORMAT_COMPANY',
        payload: state.formData.companyName,
      })

      if (state.formData.normalizedCompanyName) {
        const isDuplicate = await checkDuplicateEstablishment(
          state.formData.normalizedCompanyName,
        )
        if (isDuplicate) {
          setShowModal(true) // Affichez le modal si un doublon est détecté
          return
        }
      }
    }

    dispatch({ type: 'NEXT_STEP' })
  }

  return (
    <div className="d-flex justify-content-between my-3">
      {currentStep > 1 && (
        <Button variant="outline-primary" onClick={moveToPrevStep}>
          Revenir
        </Button>
      )}

      {currentStep < totalSteps && (
        <Button variant="primary" onClick={moveToNextStep}>
          Suivant
        </Button>
      )}

      {/* Affichez le modal ici */}
      <DuplicateModal
        show={showModal}
        handleClose={() => setShowModal(false)}
      />
    </div>
  )
}

export default WizardNavigationButtons
