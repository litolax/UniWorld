// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

// eslint-disable-next-line no-undef
module.exports = {
  plugins: {
    'postcss-preset-mantine': {},
  },
  i18n: {
    locales: ['en-US', 'ru-RU'],
    defaultLocale: 'en-US',
    localeDetection: false,
    localePath: path.resolve('./public/locales'),
  },
}
