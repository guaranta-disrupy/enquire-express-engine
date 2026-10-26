module.exports = {
  // VUE_APP_PUBLIC_PATH lets the engine be served under a sub-path behind a
  // reverse proxy (e.g. "/x/"); defaults to the domain root.
  publicPath: process.env.VUE_APP_PUBLIC_PATH || '/',
  devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 7878,
    https: false,
    hotOnly: false,
    disableHostCheck: true
  }
}
