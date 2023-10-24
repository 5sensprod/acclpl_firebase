import { useState } from 'react'

export function useImageHandlers(onSelectImage) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [croppedImageUrl, setCroppedImageUrl] = useState(null)

  const handleImageValidation = (imageData) => {
    setCroppedImageUrl(imageData)
    onSelectImage(imageData)
  }

  const handleFileSelected = (file) => {
    setSelectedFile(file)
  }

  return {
    selectedFile,
    croppedImageUrl,
    handleImageValidation,
    handleFileSelected,
    setCroppedImageUrl, // Ajoutez cette ligne
  }
}
