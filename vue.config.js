module.exports = {
  lintOnSave: process.env.NODE_ENV !== 'production',
  pages: {
    ScrollBar: {
      entry: 'src/scroll-bar',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'Scroll Bar',
    },
  },
  css: {
    requireModuleExtension: true,
    loaderOptions: {
      less: {
        modules: {
          localIdentName: '[local]_[hash:base64:8]'
        }
      }
    }
  }
}
