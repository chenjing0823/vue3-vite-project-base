<template>
  <!-- 富文本 -->
  <div class="editor">
    <button @click="exportToWord">导出</button>
    <button @click="exportToWord1">导出1</button>
    <input type="file" @change="uploadFile" />
    <button
      draggable="true"
      @click="clickadd"
      @dragstart="(event) => onDragStartMceNonEditable(event)"
    >
      客户名称
    </button>
    <button @click="clickaddPic">图片(点击)</button>
    <Editor
      class="editor-content"
      ref="editor"
      v-model="content"
      :init="init"
      :disabled="disabled"
      @init="onEditorInit"
    ></Editor>
  </div>
</template>


<script>
//在js中引入所需的主题和组件
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/icons/default/icons'

import 'tinymce/icons/default' //引入编辑器图标icon，不引入则不显示对应图标
import 'tinymce/themes/silver'
import 'tinymce/models/dom'

import 'tinymce/plugins/image' //插入编辑图片
import 'tinymce/plugins/table' //表格
import 'tinymce/plugins/lists' //列表插件
import 'tinymce/plugins/link' //超链接
import 'tinymce/plugins/wordcount' //字数统计
import 'tinymce/plugins/fullscreen' //全屏
import 'tinymce/plugins/help' //帮助
// import 'tinymce/plugins/charmap' //特殊字符
// import 'tinymce/plugins/save' //保存

// 自定义插件
import '@/views/word/components/plugins/xbb-paste.js'

// 按需求
// import 'tinymce/plugins/media'
// import 'tinymce/plugins/preview'
// import 'tinymce/plugins/code'
// import 'tinymce/plugins/advlist'
// import 'tinymce/plugins/codesample'
// import 'tinymce/plugins/searchreplace'
// import 'tinymce/plugins/autolink'
// import 'tinymce/plugins/directionality'
// import 'tinymce/plugins/visualblocks'
// import 'tinymce/plugins/visualchars'
// import 'tinymce/plugins/template'
// import 'tinymce/plugins/nonbreaking'
// import 'tinymce/plugins/insertdatetime'
// import 'tinymce/plugins/autosave'
// import 'tinymce/plugins/autoresize'

// 错误
// import 'tinymce/plugins/contextmenu'
// import 'tinymce/plugins/colorpicker'
// import 'tinymce/plugins/textcolor'
// import 'tinymce/plugins/hr'
// import 'tinymce/plugins/textpattern'
// import 'tinymce/plugins/imagetools'

import contentStyle from './styles/content-styles.js'

import { saveAs } from 'file-saver'
import axios from 'axios'
// import { exportToWordNode } from '@/api/index.js'

export default {
  components: {
    Editor
  },
  model: {
    prop: 'value',
    event: 'modelChange'
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    plugins: {
      type: [String, Array],
      default: 'image link table lists wordcount help placeholder paste xbbpaste'
      // 'preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr nonbreaking insertdatetime advlist lists wordcount imagetools textpattern autosave autoresize'
    },
    toolbar: {
      type: [String, Array],
      default:
        'undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link codesample | alignleft aligncenter alignright alignjustify outdent indent formatpainter lineheight | \
        blocks fontfamily fontselect fontsize | bullist numlist | blockquote subscript superscript removeformat | \
          table image hr | xbbpaste'
    }
  },
  data() {
    return {
      editorInstance: null,
      //初始化配置
      init: {
        menubar: true, // 菜单栏显隐
        language_url: 'static/tinymce/langs/zh_CN.js',
        language: 'zh_CN',
        skin_url: 'static/tinymce/skins/ui/oxide',
        page_size: 'A4',
        height: '100%',
        toolbar_mode: 'wrap', // floating 浮动 / sliding 下拉 / scrolling 滚动 / wrap 不收缩
        // toolbar_drawer: 'wrap',
        plugins: this.plugins,
        toolbar: this.toolbar,
        contextmenu: 'copy cut paste xbbpaste selectall test',
        // contextmenu: false,
        content_style: contentStyle,
        font_size_input_default_unit: 'pt',
        font_size_formats: '9pt 10pt 11pt 12pt 14pt 16pt 18pt 20pt 22pt 24pt 26pt 28pt 36pt 42pt 48pt 72pt',
        font_family_formats:
          '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;',
        branding: false,
        placeholder: '请输入...',
        table_default_attributes: {
          border: '1'
        },
        // table_sizing_mode: 'fixed',
        resize_img_proportional: false,
        // save_oncancelcallback: () => {
        //   console.log('保存取消')
        // },
        // save_onsavecallback: (data) => {
        //   console.log('Saved')
        // },
        // 图片上传
        images_upload_handler: (blobInfo, success, failure) => {
          // const img = 'data:image/jpeg;base64,' + blobInfo.base64()
          // success(img)

          const formData = new FormData()
          formData.append('file', blobInfo.blob())
          console.log('formData', formData)
          reserveTableFoodDescribe(formData)
            .then((res) => {
              if (res.code === '10000') {
                const file = res.data
                success(file.url)
                return
              }
              failure('上传失败')
            })
            .catch(() => {
              failure('上传出错')
            })
        }
      },
      content: this.value
    }
  },
  mounted() {
    console.log(request)
    tinymce.init(this.init)
    setTimeout(() => {
      console.log('aaa', tinymce.activeEditor.ui.registry.getAll().buttons)
    })
    this.getClipboardContent()
  },
  methods: {
    getClipboardContent() {
      navigator.clipboard
        .readText()
        .then((text) => {
          console.log('Clipboard content:', text)
          // 在这里处理剪贴板内容
        })
        .catch((err) => {
          console.error('Failed to read clipboard contents: ', err)
        })
    },
    onEditorInit(editor) {
      this.editorInstance = editor // 编辑器已初始化，保存编辑器实例
    },

    exportToWord() {
      const fileName = '无标题表格.docx'
      const blob = new Blob([this.content], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      })
      saveAs(blob, fileName)
    },
    exportToWord1() {
      // 假设this.content是包含HTML标记的内容
      const content = this.content

      // 发送POST请求到服务器端接口
      // exportToWordNode({ content })
      axios
        .post('http://localhost:3001/pro/v1/exportToWord', { content }, { responseType: 'blob' })
        .then((response) => {
          console.log('response', response)
          // 创建一个URL对象，指向生成的Word文档
          const url = window.URL.createObjectURL(new Blob([response.data]))

          // 创建一个a标签，用于下载Word文档
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', 'exported_document.docx')
          document.body.appendChild(link)

          // 触发a标签的点击事件，开始下载Word文档
          link.click()

          // 下载完成后，释放URL对象
          window.URL.revokeObjectURL(url)
        })
        .catch((error) => {
          console.error('Error exporting to Word:', error)
        })
    },
    uploadFile(event) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        // 图片成功加载后执行以下代码
        const base64Image = reader.result
        console.log(base64Image)
        // 将 src = base64Image 的图片插入到富文本编辑器中
        tinymce.activeEditor.insertContent(
          `<img src="${base64Image}" width="200px" height="auto" />`
        )
      }
      reader.readAsDataURL(file)
      // Perform file upload logic here
    },
    // 在 Vue 组件中处理拖拽事件，将整体内容插入富文本编辑器
    onDragStartMceNonEditable(event) {
      let html = `&ZeroWidthSpace;<span class="mceNonEditable">{客户名称}</span>&ZeroWidthSpace;`
      event.dataTransfer.setData('text/html', html)
    },
    clickadd() {
      let html = `&ZeroWidthSpace;<span class="mceNonEditable">{客户名称}</span>&ZeroWidthSpace;`
      tinymce.activeEditor.insertContent(html)
    },
    clickaddPic() {
      // 添加图片 src为 assets/image-box.png 标签utf-8
      let html = `&ZeroWidthSpace;<img alt="{图片}" src="src/assets/image-box.png" width="auto" height="200px" />&ZeroWidthSpace;`
      tinymce.activeEditor.insertContent(html)
    }
  },
  watch: {
    value(newValue) {
      this.content = newValue
    },
    content(newValue) {
      this.$emit('modelChange', newValue)
    }
  }
}
</script>
<style scoped lang="scss">
:deep(.tox-tinymce) {
  border-radius: unset;
  border: unset;
}
:deep(.tox-promotion) {
  visibility: hidden;
}
</style>