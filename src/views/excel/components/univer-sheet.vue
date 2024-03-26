<template>
  <div ref="container" class="univer-container"></div>
</template>

<script>
import '@univerjs/design/lib/index.css'
import '@univerjs/ui/lib/index.css'
import '@univerjs/sheets-ui/lib/index.css'
import '@univerjs/sheets-formula/lib/index.css'

import { Univer } from '@univerjs/core'
import { defaultTheme } from '@univerjs/design'
import { UniverDocsPlugin } from '@univerjs/docs'
import { UniverDocsUIPlugin } from '@univerjs/docs-ui'
import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula'
import { UniverRenderEnginePlugin } from '@univerjs/engine-render'
import { UniverSheetsPlugin } from '@univerjs/sheets'
import { UniverSheetsFormulaPlugin } from '@univerjs/sheets-formula'
import { UniverSheetsUIPlugin } from '@univerjs/sheets-ui'
import { UniverUIPlugin } from '@univerjs/ui'

import { FUniver } from '@univerjs/facade'

import xbb from '@xbb/xbb-utils'
export default {
  name: 'UniverSheet',
  props: {
    // workbook data
    data: {
      value: Object,
      default: () => ({})
    },
    handInput: {
      type: Object,
      default: () => ({})
    }
  },
  watch: {
    // watch data change, and re-create univer instance
    data: {
      handler(val) {
        this.destroyUniver()
        this.init(val)
      },
      immediate: true
    }
  },
  data() {
    return {
      // univer instance
      univer: null,
      // workbook instance
      workbook: null,
      univerAPI: null
    }
  },
  mounted() {
    this.init(this.data)
  },
  methods: {
    /**
     * Initialize univer instance and workbook instance
     * @param data {IWorkbookData} document see https://univer.work/api/core/interfaces/IWorkbookData.html
     */
    init(data = {}) {
      const univer = new Univer({
        theme: defaultTheme
      })
      this.univer = univer

      // core plugins
      univer.registerPlugin(UniverRenderEnginePlugin)
      univer.registerPlugin(UniverFormulaEnginePlugin)
      univer.registerPlugin(UniverUIPlugin, {
        container: this.$refs.container,
        header: true,
        footer: true
      })

      // doc plugins
      univer.registerPlugin(UniverDocsPlugin, {
        hasScroll: false
      })
      univer.registerPlugin(UniverDocsUIPlugin)

      // sheet plugins
      univer.registerPlugin(UniverSheetsPlugin)
      univer.registerPlugin(UniverSheetsUIPlugin)
      univer.registerPlugin(UniverSheetsFormulaPlugin)

      // create workbook instance
      this.workbook = univer.createUniverSheet(data)

      this.univerAPI = FUniver.newAPI(univer)
      // define a custom error
      this.univerAPI.onBeforeCommandExecute((command) => {
        const { id, type, params } = command
        const arr = [
          'sheet.operation.set-cell-edit-visible', // 双击单元格编辑
          'doc.command.insert-text', // 上方插入文本
          'sheet.operation.set-activate-cell-edit' // 上方插入文本点击 单元格编辑框激活
        ]
        if (arr.includes(id)) {
          const startRow = xbb._get(params, 'primary.startRow', -1)
          const startColumn = xbb._get(params, 'primary.startColumn', -1)
          // const startRow = xbb._get(params, 'selections[0].range.startRow', -1)
          // const startColumn = xbb._get(params, 'selections[0].range.startColumn', -1)
          const isHandInput = this.handInput[`${startRow}_${startColumn}`]
          if (isHandInput) {
            throw new Error(`不允许编辑: ${id}`)
          }
        } else {
          console.log('id', id)
          // console.log('params', params)
        }
      })
    },
    /**
     * Destroy univer instance and workbook instance
     */
    destroyUniver() {
      this.univer?.dispose()
      this.univer = null
      this.workbook = null

      this.univerAPI = null
    },
    /**
     * Get workbook data
     */
    getData() {
      if (!this.workbook) {
        throw new Error('Workbook is not initialized')
      }
      return this.workbook.save()
    },
    getCellInfo() {
      const rangObj = this.univerAPI.getActiveWorkbook().getActiveSheet().getSelection()
      return rangObj.getActiveRange()
    },
    setData({ pos, value }) {
      const [col, row, colNum, rowNum] = pos

      const activeSheet = this.univerAPI.getActiveWorkbook().getActiveSheet()

      const range = activeSheet.getRange(col, row, colNum, rowNum)
      range?.setValue(value)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.univer-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* Also hide the menubar */
:global(.univer-menubar) {
  display: none;
}

/* 组件内 类名为 univer-slide-tab-active 的color 改为绿色 */
:deep(.univer-slide-tab-active) {
  color: #ff6a00;
}
</style>
