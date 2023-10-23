import imageCompression from 'browser-image-compression'

async function compressImage(file) {
  try {
    const options = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 512,
      useWebWorker: true,
    }
    const compressedFile = await imageCompression(file, options)
    return compressedFile
  } catch (error) {
    console.error('Error compressing image:', error)
    throw error
  }
}

export { compressImage }
