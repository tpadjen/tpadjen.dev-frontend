const fallbackCopyToClipboard = async (text) => {
  var textArea = document.createElement('textarea')
  textArea.value = text

  // Avoid scrolling to bottom
  textArea.style.top = '0'
  textArea.style.left = '0'
  textArea.style.position = 'fixed'

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    document.execCommand('copy')
    // var msg = successful ? 'successful' : 'unsuccessful'
    // console.log('Fallback: Copying text command was ' + msg)
    document.body.removeChild(textArea)
    return true
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err)
    document.body.removeChild(textArea)
    return false
  }

}

export const copyToClipboard = async (text) => {
  if (!navigator.clipboard) return fallbackCopyToClipboard(text)
  return navigator.clipboard.writeText(text).then(() => true, (_err) => false)
}
