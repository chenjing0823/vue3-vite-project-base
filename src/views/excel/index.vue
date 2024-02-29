<template>
  <div class="index">
    <div class="btn">
      <button @click="getData" title="print current workbook data to console">Get Data</button>
    </div>

    <UniverSheet id="sheet" ref="univerRef" :data="data" />
  </div>
</template>

<script>
import UniverSheet from './components/univer-sheet.vue'
import { DEFAULT_WORKBOOK_DATA } from './mock/default-workbook-data'
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
      data: DEFAULT_WORKBOOK_DATA
    }
  },

  computed: {},

  watch: {},

  mounted() {},

  methods: {
    getData() {
      const result = this.$refs.univerRef?.getData()
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
