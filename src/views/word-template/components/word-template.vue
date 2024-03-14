<template>
  <div>
    <div class="word-box" @click="exportWord">word</div>
  </div>
</template>

<script>
import Docxtemplater from 'docxtemplater'
import JSZip from 'jszip'
import JSZipUtils from 'jszip-utils'
import { saveAs } from 'file-saver'

export default {
  name: 'Docx',
  props: {
    fileName: {
      type: String, // 输出文件名
      default: ''
    },
    fileTemplete: {
      type: String, // public下存放的word模板名称
      default: ''
    },
    exportData: {
      type: Object, // 导出的word数据
      default: () => {}
    }
  },
  methods: {
    // 点击导出word
    exportWord() {
      // 读取并获得模板文件的二进制内容
      JSZipUtils.getBinaryContent(this.fileTemplete + '.docx', (error, content) => {
        console.log('content', content)
        // 抛出异常
        if (error) throw error
        // 创建一个JSZip实例，内容为模板的内容
        let zip = new JSZip(content)
        // 创建并加载docxtemplater实例对象
        let doc = new Docxtemplater()

        // doc.setOptions({
        //   delimiters: {
        //     start: '${',
        //     end: '}'
        //   }
        // })

        doc.loadZip(zip)
        // 设置模板变量的值
        doc.setData({
          ...this.exportData
        })
        try {
          // 用模板变量的值替换所有模板变量
          doc.render()
        } catch (error) {
          // 抛出异常
          let e = {
            message: error.message,
            name: error.name,
            stack: error.stack,
            properties: error.properties
          }
          console.log(JSON.stringify({ error: e }))
          throw error
        }
        // 生成一个代表docxtemplater对象的zip文件（不是一个真实的文件，而是在内存中的表示）
        let out = doc.getZip().generate({
          type: 'blob',
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        })
        // 将目标文件对象保存为目标类型的文件，并命名
        saveAs(out, this.fileName + '.docx')
      })
    }
  }
}
</script>