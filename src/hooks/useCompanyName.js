import { useState } from 'react'

function useCompanyName(onSelectAddress, currentCoords, address) {
  const [companyName, setCompanyName] = useState('')
  const [isNameValidated, setIsNameValidated] = useState(false)
  const defaultName = 'Entreprise X'

  const handleCompanyNameChange = (e) => {
    setCompanyName(e.target.value)
  }

  const handleCompanyNameValidation = () => {
    setIsNameValidated(true)
    if (address) {
      if (onSelectAddress) {
        onSelectAddress({
          coordinates: currentCoords,
          companyName: companyName,
        })
      }
    }
  }

  const handleCompanyNameModification = () => {
    setIsNameValidated(false)
  }

  const handleIDontKnowClick = () => {
    setCompanyName(defaultName)
    setIsNameValidated(true)
  }

  return {
    companyName,
    isNameValidated,
    handleCompanyNameChange,
    handleCompanyNameValidation,
    handleCompanyNameModification,
    handleIDontKnowClick,
  }
}

export default useCompanyName
