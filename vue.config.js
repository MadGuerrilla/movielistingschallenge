module.exports = {
  lintOnSave: false,
  css: {
    loaderOptions: {
      sass: {
        data: '\n@import "@/assets/scss/_colors.scss";\n        '
      }
    },
    sourceMap: true
  }
}
