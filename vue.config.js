const webpack = require('webpack');
const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin //Webpack包文件分析器
const CompressionPlugin = require('compression-webpack-plugin') //Gzip

function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  lintOnSave: false,
  // publicPath: '/', // 部署项目路径
  publicPath:"./",
  // baseUrl: process.env_NODE_ENV == 'production' ? '/vehiclerepair/' : '', // 部署项目路径
  devServer: {
    port: 8086, // 端口号
    // host: '10.1.',
    open: false, // 配置自动启动浏览器
    proxy: {
      '/vehiclerepair': {
        // target: 'http://10.1.4.68:8080/vehiclerepair',
        // target: 'http://10.1.4.64:8080/vehiclerepair',
        target: 'http://10.1.30.210:50081/vehiclerepair',
        changeOrigin: true,
        pathRewrite: {
          '^/vehiclerepair': '/'
        }
      }
    }
  },
  // configureWebpack: {
  //   // webpack 配置项
  //   // resolve: {
  //   //   alias: {
  //   //     vue$: 'vue/dist/vue.esm.js'
  //   //     // '@': resolve('src'),
  //   //     // 'views': resolve('src/views')
  //   //   }
  //   // },
  //   plugins: [
  //     new webpack.ProvidePlugin({
  //       $: 'jquery',
  //       jQuery: 'jquery',
  //       'windows.jQuery': 'jquery'
  //     })
  //   ]
  // },
  chainWebpack: config => {
    config.entry('polyfill').add('@babel/polyfill')
  } ,
  configureWebpack: {
    // "plugins": ["@babel/plugin-syntax-dynamic-import"],
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "windows.jQuery": "jquery"
      })
    ],
   
  },
  css: {
    loaderOptions: {
      sass: {
        // data: `@import "@/assets/css/global.scss";`
        prependData: `@import "~@/assets/scss/index.scss";`
      }
    }
  }
};
