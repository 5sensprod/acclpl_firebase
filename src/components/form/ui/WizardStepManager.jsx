import React, { useState } from 'react'
import { Button, Spinner } from 'react-bootstrap'
import { Map } from 'react-bootstrap-icons'
import { useFormWizardState } from '../context/FormWizardContext'
import { checkDuplicateEstablishment } from '../../../services/establishmentCheckerService'
import EstablishmentModal from '../modals/EstablishmentModal'
import formatCompanyName from '../../../utils/formatCompanyName'
import normalizedCompanyName from '../../../utils/normalizedCompanyName'
import { isFormReadyToSubmit } from '../wizard/wizardValidation'
import PreviewModal from '../modals/PreviewModal'
import useHandleSubmitClick from '../hooks/useHandleSubmitClick'
import useShowEstablishmentModal from '../hooks/useShowEstablishmentModal'
import SuccessModal from '../modals/SuccessModal'
import { useUserContext } from '../../../context/userContext' // Import the user context

const WizardStepManager = () => {
  const { state, dispatch } = useFormWizardState()
  const [isLoading, setIsLoading] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const { handleSubmitClick, showModal, handleCloseModal } =
    useHandleSubmitClick(setIsLoading, setShowAddModal)

  const { setActiveView } = useUserContext() // Get the setActiveView function from the context

  const currentStep = state.currentStep
  const totalSteps = state.steps.length

  const [showPreview, setShowPreview] = useState(false)

  const canFinish = isFormReadyToSubmit(state.formData)

  const handleClosePreview = () => {
    setShowPreview(false)
  }

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

      const duplicateCheckResult = await checkDuplicateEstablishment(
        normalized,
        dispatch,
      )

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

  const handleSubmitAndRedirect = async () => {
    await handleSubmitClick()
    setActiveView('reportings') // Update the activeView to 'reportings'
  }

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
        <div className="btn-group" role="group">
          <Button
            variant="primary"
            onClick={handleVisualizeClick}
            disabled={!canFinish || isLoading}
            onChange={showAddModal ? showAddModal : undefined}
          >
            <Map />
          </Button>
          <Button
            variant="success"
            onClick={handleSubmitAndRedirect} // Use the new function to submit and redirect
            disabled={!canFinish || isLoading}
          >
            {isLoading ? <Spinner animation="border" size="sm" /> : 'Terminer'}
          </Button>
        </div>
      )}
      <EstablishmentModal />
      {showPreview && (
        <PreviewModal
          show={showPreview}
          onHide={handleClosePreview}
          formData={state.formData}
          previewPhotoURL={state.previewPhotoURL}
          isDefaultPhoto={state.isDefaultPhoto}
          photoURLs={state.formData.photoURLs}
        />
      )}
      <SuccessModal show={showModal} handleClose={handleCloseModal} />
    </div>
  )
}

export default WizardStepManager
