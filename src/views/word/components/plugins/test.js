import tinymce from 'tinymce'

tinymce.PluginManager.add('test', (editor, url) => {
  editor.ui.registry.addButton('test', {
    icon: 'accessibility-check',
    tooltip: 'test',
    onAction: () => {
      console.log('test')
    }
  })
    // 为插件注册一个菜蛋项
    editor.ui.registry.addMenuItem("test", {
      icon: "accessibility-check",
      text: "常用表情",
      onAction: function () {
      },
    })
})