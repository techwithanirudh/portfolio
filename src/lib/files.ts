export interface Base64FileParts {
  mediaType: string
  data: string
}

export const parseB64File = (value: string): Base64FileParts | null => {
  if (!value.startsWith('data:')) {
    return null
  }

  const separator = ';base64,'
  const separatorIndex = value.indexOf(separator)

  if (separatorIndex === -1) {
    return null
  }

  const mediaType = value.slice(5, separatorIndex).trim()
  const data = value.slice(separatorIndex + separator.length).trim()

  if (!(mediaType && data)) {
    return null
  }

  return {
    mediaType,
    data,
  }
}
