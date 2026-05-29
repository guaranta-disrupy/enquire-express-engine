module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
  ? '/'
    : '/',
  devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 7878,
    https: false,
    hotOnly: false,
    disableHostCheck: true
  }
}
