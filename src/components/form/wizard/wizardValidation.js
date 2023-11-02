const isFormReadyToSubmit = (formData) => {
  const {
    companyName,
    normalizedCompanyName,
    companyAddress,
    companyCoordinates,
    dateOfObservation,
    timeOfObservation,
    // photoURLs,
  } = formData

  const isValid =
    companyName &&
    normalizedCompanyName &&
    companyAddress &&
    companyCoordinates &&
    dateOfObservation &&
    timeOfObservation
  // photoURLs &&
  // photoURLs.length > 0

  return isValid
}

export { isFormReadyToSubmit }
