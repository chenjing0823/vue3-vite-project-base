<template>
  <div class="index">
    <div class="btn">
      <button @click="getData" title="print current workbook data to console">Get Data</button>
      <button @click="setData" title="print current workbook data to console">setData</button>
      <button @click="getArrayData" title="print current workbook data to console">
        获取导出数据
      </button>
      <button @click="exportExcel" title="print current workbook data to console">导出</button>
      <input type="file" @change="uploadFile" />
    </div>

    <UniverSheet id="sheet" ref="univerRef" :data="data" v-if="visible" />
  </div>
</template>

<script>
import xbb from '@xbb/xbb-utils'
import UniverSheet from './components/univer-sheet.vue'
// import { DEFAULT_WORKBOOK_DATA } from './mock/default-workbook-data'
import DefaultWorkBookData from './mock/default-data'

import utils from '@/utils/index.js'
import STYLESENUM from './style-enum.js'

import ExcelJS from 'exceljs'
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx'

const rgbToArgb = (rgb) => {
  return 'FF' + rgb.substring(1) // Add FF prefix to convert RGB to ARGB
}
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
      rowStyle: {},
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
    },
    /**
     * @description: 获取每个sheet表内的数据，先获取行数据，再获取每行的列数据。
     * @param {*} cellData
     */
    getSheetData(value, styles) {
      const { cellData } = value
      const cellStyle = {}
      const cellValue = {}
      const cellFormat = (data, row) => {
        Object.entries(data).forEach(([key, value]) => {
          if (value && value.v) {
            Object.assign(cellValue, this.setCellValue({ row, cloumn: key, value: value.v }))
          }
          if (value && value.s) {
            Object.assign(
              cellStyle,
              this.setCellStyle({ row, cloumn: key, styles, styleKey: value.s })
            )
          }
        })
      }

      const sheetData = cellData || {}
      Object.entries(sheetData).forEach(([key, value]) => {
        cellFormat(value, key)
      })
      return { cellValue, cellStyle }
    },
    setCellValue({ row, cloumn, value }) {
      const cell = XLSX.utils.encode_cell({ r: +row, c: +cloumn })
      const cellValue = {}
      cellValue[cell] = value
      return cellValue
    },
    setCellStyle({ row, cloumn, styles, styleKey }) {
      const cell = XLSX.utils.encode_cell({ r: +row, c: +cloumn })
      const rowStyle = {}
      const style = styles[styleKey]
      Object.entries(style).forEach(([key, value]) => {
        if (key === 'ht') {
          // 水平对齐
          if (!rowStyle[cell]) {
            rowStyle[cell] = {}
          }
          if (!rowStyle[cell].alignment) {
            rowStyle[cell].alignment = {}
          }
          rowStyle[cell].alignment.horizontal = STYLESENUM.HORIZONTAL[value] || 'left'
        } else if (key === 'vt') {
          // 垂直对齐
          if (!rowStyle[cell]) {
            rowStyle[cell] = {}
          }
          if (!rowStyle[cell].alignment) {
            rowStyle[cell].alignment = {}
          }
          rowStyle[cell].alignment.vertical = STYLESENUM.VERTICAL[value] || 'bottom'
        } else if (key === 'tr') {
          // 字体旋转
          if (!rowStyle[cell]) {
            rowStyle[cell] = {}
          }
          if (!rowStyle[cell].alignment) {
            rowStyle[cell].alignment = {}
          }
          if (value.v && +value.v === 1) {
            rowStyle[cell].alignment.textRotation = 'vertical'
          } else {
            rowStyle[cell].alignment.textRotation = -value.a
          }
        } else if (key === 'tb') {
          // 字体换行
          if (!rowStyle[cell]) {
            rowStyle[cell] = {}
          }
          if (!rowStyle[cell].alignment) {
            rowStyle[cell].alignment = {}
          }
          rowStyle[cell].alignment.wrapText = STYLESENUM.WRAP[value] === 'wrap' // 是否换行
        } else if (key === 'cl') {
          // 字体颜色
          if (!rowStyle[cell]) {
            rowStyle[cell] = {}
          }
          if (!rowStyle[cell].font) {
            rowStyle[cell].font = {}
          }
          rowStyle[cell].font.color = {
            argb: rgbToArgb(value.rgb)
          }
        } else if (key === 'fs') {
          // 字体size
          if (!rowStyle[cell]) {
            rowStyle[cell] = {}
          }
          if (!rowStyle[cell].font) {
            rowStyle[cell].font = {}
          }
          rowStyle[cell].font.size = value
        } else if (key === 'bg') {
          // 背景色
          if (!rowStyle[cell]) {
            rowStyle[cell] = {}
          }
          rowStyle[cell].fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
              argb: rgbToArgb(value.rgb)
            }
          }
        } else if (key === 'bd') {
          // 边框
          if (!rowStyle[cell]) {
            rowStyle[cell] = {}
          }
          if (!rowStyle[cell].border) {
            rowStyle[cell].border = {}
          }
          if (value.t) {
            const type = xbb._get(value, 't.s', 0)
            const color = xbb._get(value, 't.cl.rgb', '')
            rowStyle[cell].border.top = {
              style: STYLESENUM.BORDERSTYLE[type],
              color: { argb: rgbToArgb(color) }
            }
          }
          if (value.l) {
            const type = xbb._get(value, 'l.s', 0)
            const color = xbb._get(value, 'l.cl.rgb', '')
            rowStyle[cell].border.left = {
              style: STYLESENUM.BORDERSTYLE[type],
              color: { argb: rgbToArgb(color) }
            }
          }
          if (value.r) {
            const type = xbb._get(value, 'r.s', 0)
            const color = xbb._get(value, 'r.cl.rgb', '')
            rowStyle[cell].border.right = {
              style: STYLESENUM.BORDERSTYLE[type],
              color: { argb: rgbToArgb(color) }
            }
          }
          if (value.b) {
            const type = xbb._get(value, 'b.s', 0)
            const color = xbb._get(value, 'b.cl.rgb', '')
            rowStyle[cell].border.bottom = {
              style: STYLESENUM.BORDERSTYLE[type],
              color: { argb: rgbToArgb(color) }
            }
          }
        }
      })
      return rowStyle
    },
    getSheetMerge(mergeData) {
      const merges = []
      mergeData.forEach((m) => {
        const { startRow, startColumn, endRow, endColumn } = m
        merges.push({ s: { r: startRow, c: startColumn }, e: { r: endRow, c: endColumn } })
      })
      return merges
    },
    uploadFile(event) {
      const file = event.target.files[0]
      console.log(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const workbook = XLSX.read(e.target.result, { type: 'binary' })
        console.log('workbook', workbook)
        const sheetname = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetname]
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 })
        console.log(sheet)
        console.log(data)
      }
      reader.readAsBinaryString(file)
      // Perform file upload logic here
    },
    exportExcel() {
      const allData = this.$refs.univerRef.getData() // 获取所有的sheet表
      const allSheets = allData.sheets
      const styles = allData.styles
      // 创建工作簿
      const workbook = new ExcelJS.Workbook()
      // 处理每个sheet表
      Object.entries(allSheets).forEach(([key, value]) => {
        const sheet = workbook.addWorksheet(value.name)
        sheet.properties.defaultRowHeight = value.defaultRowHeight
        sheet.properties.defaultColWidth = value.defaultColumnWidth / 8.43
        // ExcelJS中设置列宽的单位是以字符为基准，而不是像素。
        // 通常情况下，Excel中一个字符的宽度大约等于8.43个像素。

        const sheetData = this.getSheetData(value, styles).cellValue
        const sheetStyle = this.getSheetData(value, styles).cellStyle
        // 单元格赋值
        Object.entries(sheetData).forEach(([key, value]) => {
          sheet.getCell(key).value = value
        })
        // 设置合并单元格
        this.mergeCells(value.mergeData, sheet)
        // 设置样式
        Object.entries(sheetStyle).forEach(([key, value]) => {
          console.log(key, value)
          value.alignment && (sheet.getCell(key).alignment = value.alignment)
          value.fill && (sheet.getCell(key).fill = value.fill)
          value.border && (sheet.getCell(key).border = value.border)
          value.font && (sheet.getCell(key).font = value.font)
        })
        // 设置行高 列宽
        this.setRowHeightAndColWidth({ rowdata: value.rowData, colData: value.columnData, sheet })
      })
      // 导出表格文件
      workbook.xlsx
        .writeBuffer()
        .then((buffer) => {
          let file = new Blob([buffer], { type: 'application/octet-stream' })
          FileSaver.saveAs(file, 'ExcelJS.xlsx')
        })
        .catch((error) => console.log('Error writing excel export', error))
      /**
      import axios from 'axios'

      // 假设你已经生成了workbook

      // 将workbook转换为二进制数据
      const workbookData = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })

      // 创建一个FormData对象
      const formData = new FormData()
      formData.append(
        'file',
        new Blob([workbookData], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }),
        '无标题表格.xlsx'
      )

      // 发送文件到服务器
      axios
        .post('https://your-server-url/upload', formData)
        .then((response) => {
          console.log('文件上传成功')
        })
        .catch((error) => {
          console.error('文件上传失败', error)
        })
        */
    },
    /**
     * @description: 合并单元格
     */
    mergeCells(mergeData, sheet) {
      const merges = []
      mergeData.forEach((m) => {
        const { startRow, startColumn, endRow, endColumn } = m
        const startCell = XLSX.utils.encode_cell({ r: startRow, c: startColumn })
        const endCell = XLSX.utils.encode_cell({ r: endRow, c: endColumn })
        sheet.mergeCells(startCell, endCell)
        // sheet.mergeCells(startRow + 1, startColumn + 1, endRow + 1, endColumn + 1)
      })
      return merges
    },
    /**
     * @description: 设置行高 列宽
     */
    setRowHeightAndColWidth({ rowdata, colData, sheet }) {
      // 设置行高
      Object.entries(rowdata).forEach(([key, value]) => {
        let height = +value.h
        if (+value.ia !== 0 && +value.ah) {
          // ia=0 为h高度。ia=1或者没有ia 为ah高度
          height = +value.ah
        }
        sheet.getRow(+key + 1).height = height
      })
      // 设置列宽
      Object.entries(colData).forEach(([key, value]) => {
        sheet.getColumn(+key + 1).width = +value.w / 8.43
        // ExcelJS中设置列宽的单位是以字符为基准，而不是像素。
        // 通常情况下，Excel中一个字符的宽度大约等于8.43个像素。
      })
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
