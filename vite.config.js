import { createVitePlugins } from "./build/vite/plugins";
import { defineConfig } from "vite";
import dotenv from "dotenv";
import path from "path";
import autoprefixer from "autoprefixer";
import { API_BASE_URL } from "./build/constant";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 当使用loadEnv函数加载环境变量时，可能会导致Vue开发者工具（vue-devtools）不可用的问题。
  // loadEnv函数是Vite构建工具提供的一个函数，用于加载环境变量。它会根据当前的环境模式（development、production等）加载对应的环境变量文件。
  // 然而，由于Vite的设计原理，当使用loadEnv函数加载环境变量时，会导致Vue开发者工具无法检测到Vue实例，从而无法正常工作。

  // 目前 --mode 恒等于 .env文件内的 NODE_ENV。 后续环境保持同理即可
  dotenv.config({ path: `./.env.${mode}` });
  const { VITE_GATEWAY_URL } = process.env;
  const isBuild = command === "build";
  return {
    base: "./",
    resolve: {
      alias: [
        {
          find: "@univerjs",
          replacement: path.join(__dirname, "/node_modules/@univerjs"),
        },
        {
          find: "@tinymce",
          replacement: path.join(__dirname, "/node_modules/@tinymce"),
        },
        {
          find: "@",
          replacement: path.join(__dirname, "/src"),
        },
      ],
    },
    // plugins
    plugins: createVitePlugins(isBuild),

    // css
    css: {
      postcss: {
        plugins: [
          autoprefixer({
            overrideBrowserslist: [
              "Android 4.1",
              "iOS 7.1",
              "Chrome > 31",
              "ff > 31",
              "ie >= 8",
            ],
            grid: true,
          }),
        ],
      },
      preprocessorOptions: {
        scss: {
          // 注意，键名是scss不是sass！
          // 这里写你想导入全局scss变量的路径，注意只能写相对路径，alias貌似在css中不会生效
          additionalData: `
                    @import './src/assets/scss/tools-mixins.scss';
                `,
        },
      },
    },
    // server
    server: {
      hmr: { overlay: false }, // 禁用或配置 HMR 连接 设置 server.hmr.overlay 为 false 可以禁用服务器错误遮罩层
      // 服务配置
      port: 3000, // 类型： number 指定服务器端口;
      open: true, // 类型： boolean | string在服务器启动时自动在浏览器中打开应用程序；
      cors: true, // 类型： boolean | CorsOptions 为开发服务器配置 CORS。默认启用并允许任何源
      host: "0.0.0.0", // IP配置，支持从IP启动
      proxy: {
        [API_BASE_URL]: {
          target: VITE_GATEWAY_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${API_BASE_URL}`), ""),
        },
        "/mock": {
          target: "http://yapi.xbongbong.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/mock/, "/mock/1385"),
        },
      },
    },
    build: {
      minify: "terser",
      terserOptions: {
        // 清除console和debugger
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        manualChunks: undefined,
        input: {
          main: path.join(__dirname, "index.html")
        },
        output: {
          // 静态资源打包做处理
          chunkFileNames: "static/[name]-[hash].js",
          entryFileNames: "static/[name]-[hash].js",
          assetFileNames: "static/[name]-[hash].[ext]",
        },
      },
    },
  };
});
