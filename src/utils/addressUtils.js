export function formatAddress(address) {
  // Expression régulière pour capturer le numéro de la rue, le nom de la rue, le code postal et la ville
  const addressRegex = /((?:\d+[bt]?\s)?[^\d]+)\s+(\d{5})\s+(.+)/
  const match = address.match(addressRegex)

  if (match) {
    // Si l'expression régulière correspond, extraire les composants
    const fullStreetName = match[1].trim() // Retire les espaces blancs éventuels au début et à la fin
    const postalCode = match[2]
    const city = match[3]

    // Séparez le numéro de rue du nom de la rue
    const numberRegex = /(\d+[bt]?)\s(.+)/
    const numberMatch = fullStreetName.match(numberRegex)
    let streetNumber, streetName
    if (numberMatch) {
      streetNumber = numberMatch[1]
      streetName = numberMatch[2]
    } else {
      streetNumber = ''
      streetName = fullStreetName
    }

    return {
      streetNumber,
      streetName,
      postalCode,
      city,
    }
  } else {
    // Si l'expression régulière ne correspond pas, lancer une erreur
    throw new Error('Invalid address format')
  }
}
