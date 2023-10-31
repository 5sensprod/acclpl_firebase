import React, { useState } from 'react'
import { Button, Spinner } from 'react-bootstrap'
import { useFormWizardState } from './FormWizardContext'
import { checkDuplicateEstablishment } from '../../../services/establishmentCheckerService'
import EstablishmentModal from '../modals/EstablishmentModal'
import formatCompanyName from '../../../utils/formatCompanyName'
import normalizedCompanyName from '../../../utils/normalizedCompanyName'
import { isFormReadyToSubmit } from './wizardValidation'
import PreviewModal from './PreviewModal'
import useHandleSubmitClick from './useHandleSubmitClick'
import useShowEstablishmentModal from './useShowEstablishmentModal'

const WizardStepManager = () => {
  const { state, dispatch } = useFormWizardState()
  const [isLoading, setIsLoading] = useState(false)

  const currentStep = state.currentStep
  const totalSteps = state.steps.length

  const [showPreview, setShowPreview] = useState(false)

  const canFinish = isFormReadyToSubmit(state.formData)

  const moveToPrevStep = () => {
    dispatch({ type: 'PREV_STEP' })
  }

  const showEstablishmentModal = useShowEstablishmentModal(
    setIsLoading,
    dispatch,
  )

  const moveToNextStep = async () => {
    setIsLoading(true)

    if (
      currentStep === 1 &&
      state.formData.companyName.trim() !== '' &&
      !state.hasClosedModal
    ) {
      const formattedName = formatCompanyName(state.formData.companyName)
      const normalized = normalizedCompanyName(formattedName)

      dispatch({
        type: 'FORMAT_COMPANY',
        payload: {
          companyName: formattedName,
          normalizedCompanyName: normalized,
        },
      })

      const duplicateCheckResult = await checkDuplicateEstablishment(normalized)

      if (duplicateCheckResult.found) {
        showEstablishmentModal(duplicateCheckResult)
        return
      }
    }

    dispatch({ type: 'NEXT_STEP' })
    setIsLoading(false)
  }
  const handleVisualizeClick = () => {
    setShowPreview(true)
  }

  const handleCloseModal = () => {
    setShowPreview(false)
  }

  const handleSubmitClick = useHandleSubmitClick(setIsLoading)

  return (
    <div className="d-flex justify-content-between mb-2">
      {currentStep > 1 && (
        <Button variant="outline-primary" onClick={moveToPrevStep}>
          Revenir
        </Button>
      )}

      {currentStep < totalSteps && (
        <Button variant="primary" onClick={moveToNextStep} disabled={isLoading}>
          {isLoading ? <Spinner animation="border" size="sm" /> : 'Suivant'}
        </Button>
      )}

      {currentStep === totalSteps && (
        <>
          <Button
            variant="secondary"
            onClick={handleVisualizeClick}
            disabled={!canFinish || isLoading}
          >
            Voir sur la carte
          </Button>
          <Button
            variant="success"
            onClick={handleSubmitClick}
            disabled={!canFinish || isLoading}
          >
            {isLoading ? <Spinner animation="border" size="sm" /> : 'Terminer'}
          </Button>
        </>
      )}
      <EstablishmentModal />
      {showPreview && (
        <PreviewModal
          show={showPreview}
          onHide={handleCloseModal}
          formData={state.formData}
        />
      )}
    </div>
  )
}

export default WizardStepManager
