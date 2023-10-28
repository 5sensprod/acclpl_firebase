import getCroppedImg from '../../crop/utils/CropImage'

export const cropImage = async (photoURL, croppedAreaPixels, rotation) => {
  try {
    const { url } = await getCroppedImg(photoURL, croppedAreaPixels, rotation)
    return url
  } catch (error) {
    console.error('Error cropping the image:', error)
  }
}

export const zoomPercent = (value) => {
  return `${Math.round(value * 100)}%`
}
