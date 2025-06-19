const path = require('path')
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    historyApiFallback: true,
    hot: true,
    static: {
      directory: path.join(__dirname, 'public'),
    },
    client: {
      overlay: false // Отключает overlay-уведомления
    }
  }

})
module.exports = {
  css: {
    loaderOptions: {
      sass: {
        implementation: require('sass')
      }
    }
  }
}