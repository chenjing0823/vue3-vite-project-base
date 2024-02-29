/**
 * @name createVitePlugins
 * @description 封装plugins数组统一调用
 */
import vue from '@vitejs/plugin-vue'
import { createHtmlPlugin } from 'vite-plugin-html'
// import importToCDN, { autoComplete } from 'vite-plugin-cdn-import'
// import vueSetupExtend from 'vite-plugin-vue-setup-extend'
// import { ConfigSvgIconsPlugin } from './svgIcons'
// import { AutoImportComponents } from './autoImport'
import { AutoRegistryComponents } from './component'
import { ConfigCompressPlugin } from './compress'
// import timestampPlugin from './timestamp.js'
import { ConfigVisualizerConfig } from './visualizer'

export function createVitePlugins() {
  const vitePlugins = [
    // vue支持
    vue(),
    createHtmlPlugin()
    // timestampPlugin()
    // setup语法糖组件名支持
    // vueSetupExtend(),
  ]

  // 自动按需引入组件
  vitePlugins.push(...AutoRegistryComponents())

  // 开启.gz压缩  rollup-plugin-gzip
  vitePlugins.push(ConfigCompressPlugin())

  // vite-plugin-svg-icons
  // vitePlugins.push(ConfigSvgIconsPlugin(isBuild));

  //  rollup-plugin-visualizer
  vitePlugins.push(ConfigVisualizerConfig())
  return vitePlugins
}
