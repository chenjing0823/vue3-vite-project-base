
const copyToClipboard = (text) => {
  // 检查浏览器是否支持 Clipboard API
  if (!navigator.clipboard) {
    // 如果不支持，则使用传统的 document.execCommand("copy") 方式
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    return
  }

  // 使用 Clipboard API 复制内容到剪切板
  navigator.clipboard.writeText(text).then(
    function () {
      console.log('复制成功')
    },
    function () {
      console.log('复制失败')
    }
  )
}


export default {
  copyToClipboard
}
