<template>
  <div class="page">
    <Download
      class="download"
      :fileName="fileName"
      :fileTemplete="fileTemplete"
      :exportData="exportData"
    />
  </div>
</template>

<script>
import Download from './components/word-template.vue'

export default {
  data() {
    return {
      fileName: '未命名',
      fileTemplete: 'test',
      exportData: {
        '订单编号#_widget_1566541681583': '202203012313291823012',
        '制单人#_widget_1504855929239': '杭州逍邦网络科技有限公司',
        'product': {
          'name': '服务云',
          'spec': '高级版',
          'unit': '套',
          'num': 1,
        },
        '地址#_widget_1615776349434': '杭州市滨江区银丰大厦',
        '金额大写#_widget_1615883630962': '壹佰贰拾叁元整',
        '付款时间#_widget_1678671134639': '2024年3月8日',
        '支付方式#_widget_1615780451706': '支付宝',
        '交货日期#_widget_1615776349468': '2024年3月20日',
        '保修期限#_widget_1678671134640': '2024年6月20日',
        '节点名称#flow_comment.flow_name': '新建合同',
        '审批人#flow_comment.approver': '陈靖',
        '文本意见#flow_comment.comment': '同意'
      }
    }
  },
  components: {
    Download
  }
}
</script>

<style>
.page {
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  user-select: none;
}
.page .download {
  border: 1px solid #000;
  padding: 5px 10px;
  height: 50px;
  margin-left: 100px;
  cursor: pointer;
}
</style>