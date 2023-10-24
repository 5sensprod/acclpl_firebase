import React, { useContext, useState } from 'react'
import CompanyNameInput from './CompanyNameInput'
import AddressInput from './AddressInput'
import DateTimeInput from './DateTimeInput'
import PhotoCaptureInput from './PhotoCaptureInput'
import useCompanyAddress from '../../hooks/useGeocodedAddress'
import useCompanyName from '../../hooks/useCompanyName'
import useDateTimeObservation from '../../hooks/useDateTimeObservation'
import { useImageHandlers } from '../../hooks/useImageHandlers'
import { handleObservationSubmit } from '../../services/handleObservationSubmit'
import { UserContext } from '../../context/userContext'
import { Form } from 'react-bootstrap'
import { NavigationButtons } from '../NavigationButtons'

function ObservationEntryForm({
  onSelectAddress,
  onSelectCompanyName,
  currentCoords,
  onSelectImage,
}) {
  const { currentUser } = useContext(UserContext)
  const [currentStep, setCurrentStep] = useState(1)

  const moveToNextStep = () => {
    setCurrentStep(currentStep + 1)
  }

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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CompanyNameInput
            companyName={companyName}
            isNameValidated={isNameValidated}
            onNameChange={handleCompanyNameChange}
            onValidation={handleCompanyNameValidation}
            onModification={handleCompanyNameModification}
            onIDontKnowClick={handleIDontKnowClick}
          />
        )
      case 2:
        return (
          <AddressInput
            address={address}
            isAddressValidated={isAddressValidated}
            isNameValidated={isNameValidated}
            onAddressChange={handleAddressChange}
            onValidation={handleAddressValidation}
            onModification={handleAddressModification}
            onSuggestionClick={handleSuggestionClick}
            onGeolocationClick={handleGeolocationClick}
            autocompleteResults={autocompleteResults}
          />
        )
      case 3:
        return (
          <DateTimeInput
            dateOfObservation={dateOfObservation}
            timeOfObservation={timeOfObservation}
            isDateTimeValidated={isDateTimeValidated}
            onDateChange={handleDateChange}
            onTimeChange={handleTimeChange}
            onValidation={handleDateTimeValidation}
            onModification={handleDateTimeModification}
          />
        )
      case 4:
        return (
          <PhotoCaptureInput
            onImageValidate={handleImageValidation}
            onFileSelected={handleFileSelected}
            onCroppedImage={setCroppedImageUrl}
          />
        )
      default:
        return null
    }
  }

  const isCurrentStepInputEmpty = () => {
    switch (currentStep) {
      case 1:
        return !companyName || !isNameValidated
      case 2:
        return !address || !isAddressValidated
      case 3:
        return !dateOfObservation || !timeOfObservation || !isDateTimeValidated
      case 4:
        return !selectedFile
      default:
        return false
    }
  }

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

        {renderStep()}
      </Form>
    </div>
  )
}

export default ObservationEntryForm
