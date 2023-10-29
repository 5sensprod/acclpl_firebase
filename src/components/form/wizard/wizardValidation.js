const isFormComplete = (formData) => {
  const {
    companyName,
    normalizedCompanyName,
    companyAddress,
    companyCoordinates,
    dateOfObservation,
    timeOfObservation,
  } = formData

  const isValid =
    companyName &&
    normalizedCompanyName &&
    companyAddress &&
    companyCoordinates &&
    dateOfObservation &&
    timeOfObservation

  return isValid
}

export { isFormComplete }
