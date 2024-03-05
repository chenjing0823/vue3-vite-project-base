<template>
  <div class="index">
    <editor class="text-editor" v-model="content"></editor>
  </div>
</template>

<script>
import Editor from './components/editor.vue'
export default {
  name: 'index',

  components: {
    Editor
  },

  filters: {},

  mixins: [],
  props: {},

  data() {
    return {
      content: ''
    }
  },

  computed: {},

  watch: {},

  mounted() {},

  methods: {}
}
</script>

<style lang="scss" scoped>
.index {
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;

  display: flex;
  background: #f7f8fa;
  .text-editor {
    height: 100%;
    width: 100%;
    position: relative;
    background: #ffffff;
  }
}
</style>
