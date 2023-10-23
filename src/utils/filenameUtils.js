// Importation de la bibliothèque UUID
import { v4 as uuidv4 } from 'uuid'

// Fonction pour générer un horodatage
function generateTimestamp() {
  return new Date().toISOString()
}
// Fonction pour générer un UUID
function generateUUID() {
  return uuidv4()
}

// Fonction pour générer un nom de fichier unique
function generateUniqueFileName(baseFileName) {
  const timestamp = generateTimestamp()
  const uniqueID = generateUUID()
  const uniqueFileName = `${baseFileName}_${timestamp}_${uniqueID}.jpeg`
  return uniqueFileName
}

// Exportation de la fonction generateUniqueFileName
export { generateUniqueFileName }
