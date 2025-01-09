// wizardValidation.js
const isFormReadyToSubmit = (formData) => {
  const {
    companyName,
    normalizedCompanyName,
    companyAddress,
    companyCoordinates,
    dateOfObservation,
    timeOfObservation,
    observationTypes,
  } = formData

  const isValid =
    companyName &&
    normalizedCompanyName &&
    companyAddress &&
    companyCoordinates &&
    dateOfObservation &&
    timeOfObservation &&
    observationTypes &&
    Array.isArray(observationTypes) &&
    observationTypes.length > 0

  return isValid
}
export { isFormReadyToSubmit }
