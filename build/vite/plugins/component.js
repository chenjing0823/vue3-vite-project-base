// element-plus按需加载
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
export const AutoRegistryComponents = () => {
  return [
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      eslintrc: {
        enabled: true // Default `false`
      },
      cache: true,
      injectAtEnd: true
    })
  ]
}
