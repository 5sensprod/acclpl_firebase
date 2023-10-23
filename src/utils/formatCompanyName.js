function formatCompanyName(str) {
  //   console.log('Original string:', str) // Log original string

  // Supprimez les espaces en début et en fin de chaîne
  const trimmedStr = str.trim()

  // Séparez la chaîne en mots
  const words = trimmedStr.split(' ')

  // Capitalisez la première lettre de chaque mot
  const capitalizedWords = words.map((word) => {
    const firstCharUpper = word.charAt(0).toUpperCase()
    const restLower = word.slice(1).toLowerCase()
    return firstCharUpper + restLower
  })

  // Joignez les mots capitalisés avec des espaces
  const formattedStr = capitalizedWords.join(' ')

  return formattedStr
}

export default formatCompanyName
