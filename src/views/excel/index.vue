<template>
  <div class="index">
    <div class="btn">
      <button @click="getData" title="print current workbook data to console">Get Data</button>
      <button @click="setData" title="print current workbook data to console">setData</button>
      <button @click="getArrayData" title="print current workbook data to console">
        获取导出数据
      </button>
      <button @click="exportExcel" title="print current workbook data to console">导出</button>
    </div>

    <UniverSheet id="sheet" ref="univerRef" :data="data" v-if="visible" />
  </div>
</template>

<script>
import UniverSheet from './components/univer-sheet.vue'
// import { DEFAULT_WORKBOOK_DATA } from './mock/default-workbook-data'
import DefaultWorkBookData from './mock/default-data'

import utils from '@/utils/index.js'

import FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
export default {
  name: 'index',

  components: {
    UniverSheet
  },

  filters: {},

  mixins: [],
  props: {},

  data() {
    return {
      data: '',
      visible: false
    }
  },

  computed: {},

  watch: {},

  mounted() {
    this.data = new DefaultWorkBookData()
    this.visible = true
  },

  methods: {
    setData() {
      // A1 设置数字
      this.$refs.univerRef?.setData({ pos: [0, 0, 1, 1], value: 1 })

      // B1:C2 都设置字符串
      this.$refs.univerRef?.setData({ pos: [0, 1, 2, 2], value: 'test' })
      // D1:E2 都设置数字和背景色
      this.$refs.univerRef?.setData({
        pos: [0, 3, 2, 2],
        value: {
          v: 2,
          s: {
            bg: { rgb: 'red' }
          }
        }
      })
      // D1:E2 都设置数字和背景色
      this.$refs.univerRef?.setData({
        pos: [3, 6, 5, 3],
        value: {
          v: 2,
          s: {
            bg: { rgb: 'yellow' },
            bd: {
              t: {
                s: 1,
                cl: {
                  rgb: '#000000'
                }
              },
              l: {
                s: 1,
                cl: {
                  rgb: '#000000'
                }
              },
              r: {
                s: 1,
                cl: {
                  rgb: '#000000'
                }
              },
              b: {
                s: 1,
                cl: {
                  rgb: '#000000'
                }
              }
            }
          }
        }
      })
    },
    getData() {
      const result = this.$refs.univerRef?.getData()
      utils.copyToClipboard(JSON.stringify(result, null, 2))
      console.log(JSON.stringify(result, null, 2))
    },
    exportExcel() {
      const allSheets = this.$refs.univerRef.getData().sheets // 获取所有的sheet表
      const wb = XLSX.utils.book_new()

      // 处理每个sheet表
      Object.entries(allSheets).forEach(([key, value]) => {
        const sheetData = this.getSheetData(value.cellData) // 表内数据获取
        const ws = XLSX.utils.aoa_to_sheet(sheetData)
        // 合并单元格
        const mergeData = this.getSheetMerge(value.mergeData) // 表内合并单元格获取
        ws['!merges'] = mergeData
        XLSX.utils.book_append_sheet(wb, ws, value.name)
      })
      // 导出Excel文件
      XLSX.writeFile(wb, '无标题表格.xlsx')
    },
    /**
     * @description: 获取每个sheet表内的数据，先获取行数据，再获取每行的列数据。
     * @param {*} cellData 
     */
    getSheetData(cellData) {
      const getRowArray = (data) => {
        const cloumnArray = new Array()
        Object.entries(data).forEach(([key, value]) => {
          cloumnArray[key] = value ? value.v : ''
        })
        return cloumnArray
      }

      const sheetData = cellData || {}
      const rowArray = new Array()
      Object.entries(sheetData).forEach(([key, value]) => {
        console.log(key, value)
        rowArray[key] = getRowArray(value)
      })
      return rowArray
    },
    getSheetMerge(mergeData) {
      const merges = []
      mergeData.forEach((m) => {
        const { startRow, startColumn, endRow, endColumn } = m
        merges.push({ s: { r: startRow, c: startColumn }, e: { r: endRow, c: endColumn } })
      })
      return merges
    }
  }
}
</script>

<style lang="scss" scoped>
.index {
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;

  display: flex;
  flex-direction: column;
}
</style>
