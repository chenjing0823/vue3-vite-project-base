import { BooleanNumber, LocaleType, SheetTypes } from '@univerjs/core'

/**
 * Default workbook data
 * @type {IWorkbookData} document see https://univer.work/api/core/interfaces/IWorkbookData.html
 */

const DEFAULT_WORKBOOK_DATA = {
  id: 'workbook-01',
  locale: LocaleType.ZH_CN,
  name: 'universheet',
  sheetOrder: ['sheet-01', 'sheet-02', 'sheet-03'],
  appVersion: '3.0.0-alpha',
  sheets: {
    'sheet-01': {
      type: SheetTypes.GRID,
      id: 'sheet-01',
      cellData: {
        0: {
          0: {
            v: 'Hello World'
          }
        }
      },
      name: 'sheet1',
      // tabColor: '#ff6a00',
      hidden: BooleanNumber.FALSE,
      rowCount: 100,
      columnCount: 40,
      zoomRatio: 1,
      scrollTop: 200,
      scrollLeft: 100,
      defaultColumnWidth: 73,
      defaultRowHeight: 19,
      status: 1,
      showGridlines: 1,
      hideRow: [],
      hideColumn: [],
      rowHeader: {
        width: 46,
        hidden: BooleanNumber.FALSE
      },
      columnHeader: {
        height: 20,
        hidden: BooleanNumber.FALSE
      },
      selections: ['A2'],
      rightToLeft: BooleanNumber.FALSE,
      pluginMeta: {}
    },
    'sheet-02': {
      type: SheetTypes.GRID,
      id: 'sheet-02',
      name: 'sheet2',
      cellData: {}
    },
    'sheet-03': {
      type: SheetTypes.GRID,
      id: 'sheet-03',
      name: 'sheet3',
      cellData: {}
    }
  }
}
class DefaultWorkBookData {
  constructor() {
    Object.assign(this, DEFAULT_WORKBOOK_DATA)
  }
}

export default DefaultWorkBookData
