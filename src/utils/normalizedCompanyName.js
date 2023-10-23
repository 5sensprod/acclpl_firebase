import formatCompanyName from './formatCompanyName'

function normalizedCompanyName(str) {
  // Appeler formatCompanyName pour formater la chaîne avant de la normaliser
  const formattedStr = formatCompanyName(str)

  // Suppression des accents
  const normalizedStr = formattedStr
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  // Conversion en minuscules
  const lowerCaseStr = normalizedStr.toLowerCase()

  // Suppression des espaces et des apostrophes
  const finalStr = lowerCaseStr.replace(/\s+/g, '').replace(/'/g, '')

  return finalStr
}

export default normalizedCompanyName
