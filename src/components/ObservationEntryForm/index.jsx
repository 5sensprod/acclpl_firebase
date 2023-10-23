import React, { useContext, useState } from 'react'
import CompanyNameInput from './CompanyNameInput'
import AddressInput from './AddressInput'
import DateTimeInput from './DateTimeInput'
import PhotoCaptureInput from './PhotoCaptureInput'
import useCompanyAndAddress from '../../hooks/useCompanyAndAddress'
import { handleObservationSubmit } from '../../services/handleObservationSubmit'
import { UserContext } from '../../context/userContext'
import { Form, Button } from 'react-bootstrap'
import { ArrowLeft, ArrowRight } from 'react-bootstrap-icons'

function ObservationEntryForm({
  onSelectAddress,
  currentCoords,
  onSelectImage,
}) {
  const [dateOfObservation, setDateOfObservation] = useState('')
  const [timeOfObservation, setTimeOfObservation] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [croppedImageUrl, setCroppedImageUrl] = useState(null)

  const { currentUser } = useContext(UserContext)
  const [currentStep, setCurrentStep] = useState(1)

  const moveToNextStep = () => {
    setCurrentStep(currentStep + 1)
  }

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
  } = useCompanyAndAddress(onSelectAddress, currentCoords, moveToNextStep)

  const handleImageValidation = (imageData) => {
    setCroppedImageUrl(imageData)
    onSelectImage(imageData)
  }
  const handleDateChange = (e) => {
    setDateOfObservation(e.target.value)
  }

  const handleTimeChange = (e) => {
    setTimeOfObservation(e.target.value)
  }

  const handleFileSelected = (file) => {
    setSelectedFile(file)
  }
  // console.log('Address value:', address)

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
            onDateChange={handleDateChange}
            onTimeChange={handleTimeChange}
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
        return !companyName
      case 2:
        return !address
      case 3:
        return !dateOfObservation || !timeOfObservation
      case 4:
        // Si vous avez un état qui conserve la valeur/image de la saisie PhotoCaptureInput, vous pouvez le vérifier ici.
        // Pour l'instant, je vais supposer que c'est `selectedFile` :
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
        <div className="d-flex justify-content-between mb-3">
          {currentStep > 1 && (
            <Button
              variant="outline-primary"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              <ArrowLeft className="mr-2" /> Précédent
            </Button>
          )}
          {currentStep < 4 && (
            <Button
              variant="primary"
              onClick={moveToNextStep}
              disabled={isCurrentStepInputEmpty()}
            >
              Suivant <ArrowRight className="ml-2" />
            </Button>
          )}
          {currentStep === 4 && (
            <Button variant="primary" type="submit">
              Envoyer
            </Button>
          )}
        </div>

        {renderStep()}
      </Form>
    </div>
  )
}

export default ObservationEntryForm
