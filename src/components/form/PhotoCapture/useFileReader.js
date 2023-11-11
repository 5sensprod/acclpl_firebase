import { useState } from 'react'

export function useFileReader() {
  const [fileContent, setFileContent] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const readAsDataURL = (file) => {
    const reader = new FileReader()
    setIsLoading(true)

    reader.onload = (e) => {
      setFileContent(e.target.result)
      setIsLoading(false)
    }

    reader.onerror = (e) => {
      setError(e)
      setIsLoading(false)
    }

    reader.readAsDataURL(file)
  }

  return { fileContent, error, isLoading, readAsDataURL }
}
