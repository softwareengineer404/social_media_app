const MAX_VIDEO_SIZE = 900 * 1024
const MAX_IMAGE_DIMENSION = 1440
const MAX_IMAGE_SIZE = 7 * 1024 * 1024

const readAsDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(reader.result)
  reader.onerror = () => reject(new Error('The selected file could not be read.'))
  reader.readAsDataURL(file)
})

const compressImage = async (file) => {
  const image = new Image()
  image.src = await readAsDataUrl(file)
  await image.decode()

  const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(image.width, image.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(image.width * scale))
  canvas.height = Math.max(1, Math.round(image.height * scale))
  canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', 0.82)
}

export const fileToLocalUrl = async (file) => {
  if (!file) throw new Error('Choose a file first.')
  if (file.type.startsWith('image/')) {
    if (file.size > MAX_IMAGE_SIZE) {
      throw new Error('Images must be smaller than 7 MB.')
    }
    if (file.type === 'image/gif') return readAsDataUrl(file)
    return compressImage(file)
  }
  if (file.type.startsWith('video/')) {
    if (file.size > MAX_VIDEO_SIZE) {
      throw new Error('Videos must be smaller than 900 KB for local browser storage.')
    }
    return readAsDataUrl(file)
  }
  throw new Error('Choose an image or video file.')
}
