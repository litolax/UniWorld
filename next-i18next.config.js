// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

// eslint-disable-next-line no-undef
module.exports = {
  plugins: {
    'postcss-preset-mantine': {},
  },
  i18n: {
    defaultLocale: 'ru',
    localeDetection: false,
    locales: ['ru', 'en'],
    localePath: path.resolve('./public/locales'),
  },
}
