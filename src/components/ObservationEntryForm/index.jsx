import React, { useState } from 'react'
import CompanyNameInput from './CompanyNameInput'
import AddressInput from './AddressInput'
import DateTimeInput from './DateTimeInput'
import PhotoCaptureInput from './PhotoCaptureInput'
import useCompanyAndAddress from '../../hooks/useCompanyAndAddress'
import { addObservation } from '../../services/firestore'

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

  const handleSubmit = async (e) => {
    e.preventDefault() // Empêche le rechargement de la page lors de la soumission du formulaire
    const formData = {
      companyName,
      address,
      dateOfObservation,
      timeOfObservation,
    }
    // Appellez addObservation avec les données du formulaire
    await addObservation(formData)
    console.log('Form data submitted:', formData)
  }

  return (
    <div className="my-4">
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default ObservationEntryForm
