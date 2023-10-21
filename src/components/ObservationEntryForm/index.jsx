import React, { useState } from 'react'
import CompanyNameInput from './CompanyNameInput'
import AddressInput from './AddressInput'
import DateTimeInput from './DateTimeInput'
import PhotoCaptureInput from './PhotoCaptureInput'
import useCompanyAndAddress from '../../hooks/useCompanyAndAddress'

function ObservationEntryForm({
  onSelectAddress,
  currentCoords,
  onSelectImage,
}) {
  const [dateOfObservation, setDateOfObservation] = useState('')
  const [timeOfObservation, setTimeOfObservation] = useState('')

  const {
    companyName,
    isNameValidated,
    handleCompanyNameChange,
    handleCompanyNameValidation,
    handleCompanyNameModification,
    handleIDontKnowClick,
    address,
    isAddressValidated,
    autocompleteResults,
    handleAddressChange,
    handleSuggestionClick,
    handleAddressValidation,
    handleAddressModification,
    handleGeolocationClick,
  } = useCompanyAndAddress(onSelectAddress, currentCoords)

  const handleImageValidation = (imageData) => {
    onSelectImage(imageData)
  }

  const handleDateChange = (e) => {
    setDateOfObservation(e.target.value)
  }

  const handleTimeChange = (e) => {
    setTimeOfObservation(e.target.value)
  }

  return (
    <div className="my-4">
      <CompanyNameInput
        companyName={companyName}
        isNameValidated={isNameValidated}
        onNameChange={handleCompanyNameChange}
        onValidation={handleCompanyNameValidation}
        onModification={handleCompanyNameModification}
        onIDontKnowClick={handleIDontKnowClick}
      />
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

      <DateTimeInput
        dateOfObservation={dateOfObservation}
        timeOfObservation={timeOfObservation}
        onDateChange={handleDateChange}
        onTimeChange={handleTimeChange}
      />
      <PhotoCaptureInput onImageValidate={handleImageValidation} />
    </div>
  )
}

export default ObservationEntryForm
