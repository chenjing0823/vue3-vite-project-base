export default function timestampPlugin() {
  return {
    name: 'timestamp-plugin',
    transformIndexHtml(html) {
      const timestamp = Date.now() // 获取当前时间戳
      return html
        .replace(/\.js("|')/g, `.js?timestamp=${timestamp}$1`)
        .replace(/\.css("|')/g, `.css?timestamp=${timestamp}$1`) // 在文件后缀中添加时间戳
    }
    // transformAssetUrls: {
    //   // 同样，你可以根据需要处理其他类型的资源文件
    //   img: ["src"],
    // },
  }
}
