<template>
  <!-- 富文本 -->
  <div class="editor">
    <editor class="editor-content" v-model="content" :init="init" :disabled="disabled"></editor>
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
// import 'tinymce/plugins/save' //保存

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
// import 'tinymce/plugins/charmap'
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

export default {
  components: {
    Editor
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    plugins: {
      type: [String, Array],
      default: 'fullscreen image link table lists wordcount help'
      // 'preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr nonbreaking insertdatetime advlist lists wordcount imagetools textpattern autosave autoresize'
    },
    toolbar: {
      type: [String, Array],
      default:
        'code undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link codesample | alignleft aligncenter alignright alignjustify outdent indent formatpainter | \
        blocks styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | \
          table image media charmap hr pagebreak insertdatetime | fullscreen print help'
    }
  },
  data() {
    return {
      //初始化配置
      init: {
        menubar: true, // 菜单栏显隐
        language_url: 'static/tinymce/langs/zh_CN.js',
        language: 'zh_CN',
        skin_url: 'static/tinymce/skins/ui/oxide',
        height: '100%',
        toolbar_mode: 'wrap',
        plugins: this.plugins,
        toolbar: this.toolbar,
        content_style: 'p {margin: 5px 0;} img {max-width:100%;height:auto}',
        fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
        font_formats:
          '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;',
        branding: false,
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
    tinymce.init({})
    setTimeout(() => {
      console.log('aaa', tinyMCE.activeEditor.ui.registry.getAll().buttons)
    })
  },
  methods: {},
  watch: {
    value(newValue) {
      this.content = newValue
    },
    content(newValue) {
      this.$emit('input', newValue)
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