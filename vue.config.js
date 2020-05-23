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
      '/': {
        // target: 'http://10.1.4.68:8080/vehiclerepair',
        target: 'http://47.101.212.226:80/lhana',
        // target: 'http://10.1.4.108:1111/lhana',
        changeOrigin: true,
        pathRewrite: {
          '^/lhana': '/'
        }
      }
    }
  },
  // transpileDependencies:["webpack-dev-serve/client","vuex-along"],
  chainWebpack: config => {
    config.entry('main').add('babel-polyfill')
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
        prependData: `@import "~@/assets/scss/index.scss";`
      }
    }
  }
};
