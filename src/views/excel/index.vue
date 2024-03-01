<template>
  <div class="index">
    <div class="btn">
      <button @click="getData" title="print current workbook data to console">Get Data</button>
      <button @click="setData" title="print current workbook data to console">setData</button>
    </div>

    <UniverSheet id="sheet" ref="univerRef" :data="data" v-if="visible" />
  </div>
</template>

<script>
import UniverSheet from './components/univer-sheet.vue'
// import { DEFAULT_WORKBOOK_DATA } from './mock/default-workbook-data'
import DefaultWorkBookData from './mock/default-data'

import utils from '@/utils/index.js'
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
