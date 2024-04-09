// eslint-disable-next-line @typescript-eslint/no-var-requires
const { i18n } = require('./next-i18next.config')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  i18n,
  outputFileTracing: false,
  localePath: path.resolve('./public/locales'),
}

// eslint-disable-next-line no-undef
module.exports = nextConfig
