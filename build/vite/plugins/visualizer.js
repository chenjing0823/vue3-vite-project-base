import visualizer from 'rollup-plugin-visualizer'
import { ANALYSIS } from '../../constant'

export function ConfigVisualizerConfig() {
  if (ANALYSIS) {
    return visualizer({
      emitFile: true, //在打包完的dist，否则在项目目录下
      filename: 'stats.html', //分析图生成的文件名
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  }
  return []
}
