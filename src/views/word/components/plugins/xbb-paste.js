import tinymce from 'tinymce'

tinymce.PluginManager.add('xbbpaste', (editor, url) => {
  editor.ui.registry.addButton('xbbpaste', {
    icon: 'accessibility-check',
    tooltip: 'xbbpaste',
    onAction: () => {
      console.log('xbbpaste')
    }
  })
  // 为插件注册一个菜蛋项
  editor.ui.registry.addMenuItem('xbbpaste', {
    icon: 'paste',
    text: '粘贴',
    onAction: function () {
      navigator.clipboard
        .readText()
        .then((text) => {
          console.log('Clipboard content:', text)
          editor.insertContent(text)
          // 在这里处理剪贴板内容
        })
        .catch((err) => {
          console.error('Failed to read clipboard contents: ', err)
        })
    }
  })
})
