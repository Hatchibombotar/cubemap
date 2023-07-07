module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {
      remove: false,
      overrideBrowserslist: [
        "iOS >= 12"
      ]
    },
    "postcss-preset-env": {
      remove: false,
      overrideBrowserslist: [
        "iOS >= 12"
      ]
    }
  }
}
