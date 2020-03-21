chainWebpack: config => {
  // 修复HMR
  config.resolve.symlinks(true);
  config.module
    .rule('less')
    .loader('style-loader!css-loader!less-loader')
    .test(/\.less$/)
}
