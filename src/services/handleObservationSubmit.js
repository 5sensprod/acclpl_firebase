import { addStreet } from './streetService'
import { addEstablishment } from './establishmentService'
import { addObservation } from './observationService'
import { formatAddress } from '../utils/addressUtils'
import { generateUniqueFileName } from '../utils/filenameUtils'
import { compressImage } from '../utils/imageCompression'
import { uploadImage } from './uploadImage'

async function handleObservationSubmit(
  e,
  {
    userID,
    companyName,
    address,
    dateOfObservation,
    timeOfObservation,
    currentCoords,
    selectedFile,
    croppedImageUrl,
  },
) {
  e.preventDefault() // Pour empêcher le rechargement de la page

  try {
    // console.log(address)
    const formattedAddress = formatAddress(address)

    // Vérification et/ou ajout de la rue
    const streetData = {
      streetName: formattedAddress.streetName, // Utilisez formattedAddress au lieu d'address
      city: formattedAddress.city, // Utilisez formattedAddress au lieu d'address
      postalCode: formattedAddress.postalCode, // Utilisez formattedAddress au lieu d'address
    }
    let streetRef
    try {
      streetRef = await addStreet(streetData)
    } catch (error) {
      if (error.message !== 'Street already exists') {
        throw error // Propage l'erreur si ce n'est pas une duplication
      }
    }

    // Vérification et/ou ajout de l'établissement
    const establishmentData = {
      establishmentName: companyName,
      streetNumber: formattedAddress.streetNumber, // Ajout du numéro de rue ici
      streetRef,
      coordinates: currentCoords,
    }
    let establishmentRef
    try {
      establishmentRef = await addEstablishment(establishmentData)
    } catch (error) {
      if (error.message !== 'Establishment already exists') {
        throw error // Propage l'erreur si ce n'est pas une duplication
      }
    }

    // Upload the image
    let photoURL
    if (croppedImageUrl) {
      // Convert the cropped image URL to a File object or Blob
      const response = await fetch(croppedImageUrl)
      const blob = await response.blob()

      // Créez un objet File à partir du blob
      const file = new File([blob], generateUniqueFileName('croppedImage'), {
        type: 'image/jpeg',
      })

      // Compress the image
      const compressedFile = await compressImage(file)

      // Upload the compressed image to Firebase Storage
      photoURL = await uploadImage(compressedFile)
    }
    // Ajout de l'observation
    const observationData = {
      userID,
      date: dateOfObservation,
      time: timeOfObservation,
      photoURLs: photoURL ? [photoURL] : [],
      // ... autres données d'observation
    }
    const observationRef = await addObservation(
      observationData,
      establishmentRef,
    )

    // Retourne les références pour une utilisation ultérieure si nécessaire
    return { streetRef, establishmentRef, observationRef }
  } catch (error) {
    console.error('Error handling observation submit: ', error)
    throw error // Propage l'erreur pour la gérer dans la composante
  }
}

export { handleObservationSubmit }
