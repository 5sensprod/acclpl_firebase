import React, { useContext } from 'react'
import useCompanyAddress from '../../hooks/useGeocodedAddress'
import useCompanyName from '../../hooks/useCompanyName'
import useDateTimeObservation from '../../hooks/useDateTimeObservation'
import { useImageHandlers } from '../../hooks/useImageHandlers'
import {
  useNavigationLogic,
  useStepValidation,
} from '../../hooks/useFormNavigation'
import { handleObservationSubmit } from '../../services/handleObservationSubmit'
import { UserContext } from '../../context/userContext'
import { Form } from 'react-bootstrap'
import { NavigationButtons } from '../NavigationButtons'
import { RenderSteps } from './RenderSteps'

function ObservationEntryForm({
  onSelectAddress,
  onSelectCompanyName,
  currentCoords,
  onSelectImage,
}) {
  const { currentUser } = useContext(UserContext)

  const { currentStep, setCurrentStep, moveToNextStep } = useNavigationLogic()

  const {
    address,
    isAddressValidated,
    autocompleteResults,
    handleAddressChange,
    handleSuggestionClick,
    handleAddressValidation,
    handleAddressModification,
    handleGeolocationClick,
  } = useCompanyAddress(onSelectAddress, currentCoords, moveToNextStep)

  const {
    companyName,
    isNameValidated,
    handleCompanyNameChange,
    handleCompanyNameValidation,
    handleCompanyNameModification,
    handleIDontKnowClick,
  } = useCompanyName(onSelectCompanyName, moveToNextStep)

  const {
    dateOfObservation,
    timeOfObservation,
    isDateTimeValidated,
    handleDateChange,
    handleTimeChange,
    handleDateTimeValidation,
    handleDateTimeModification,
  } = useDateTimeObservation(moveToNextStep)

  const {
    selectedFile,
    croppedImageUrl,
    handleImageValidation,
    handleFileSelected,
    setCroppedImageUrl,
  } = useImageHandlers(onSelectImage)

  const { isCurrentStepInputEmpty } = useStepValidation({
    companyName,
    isNameValidated,
    address,
    isAddressValidated,
    dateOfObservation,
    timeOfObservation,
    isDateTimeValidated,
    selectedFile,
  })

  return (
    <div className="my-4" style={{ minHeight: '350px' }}>
      <Form
        onSubmit={(e) =>
          handleObservationSubmit(e, {
            userID: currentUser.uid,
            companyName,
            address,
            dateOfObservation,
            timeOfObservation,
            currentCoords,
            selectedFile,
            croppedImageUrl,
          })
        }
      >
        <NavigationButtons
          currentStep={currentStep}
          isCurrentStepInputEmpty={isCurrentStepInputEmpty}
          moveToNextStep={moveToNextStep}
          setCurrentStep={setCurrentStep}
        />

        {RenderSteps({
          currentStep,
          companyName,
          isNameValidated,
          handleCompanyNameChange,
          handleCompanyNameValidation,
          handleCompanyNameModification,
          handleIDontKnowClick,
          address,
          isAddressValidated,
          handleAddressChange,
          handleAddressValidation,
          handleAddressModification,
          handleSuggestionClick,
          handleGeolocationClick,
          autocompleteResults,
          dateOfObservation,
          timeOfObservation,
          isDateTimeValidated,
          handleDateChange,
          handleTimeChange,
          handleDateTimeValidation,
          handleDateTimeModification,
          handleImageValidation,
          handleFileSelected,
          setCroppedImageUrl,
        })}
      </Form>
    </div>
  )
}

export default ObservationEntryForm
