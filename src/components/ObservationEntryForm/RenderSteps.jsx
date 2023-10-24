import CompanyNameInput from './CompanyNameInput'
import AddressInput from './AddressInput'
import DateTimeInput from './DateTimeInput'
import PhotoCaptureInput from './PhotoCaptureInput'

export const RenderSteps = ({
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
}) => {
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
