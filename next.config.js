// eslint-disable-next-line @typescript-eslint/no-var-requires
const { i18n } = require('./next-i18next.config')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  i18n,
  sassOptions: {
    prependData: '@import "./_mantine.scss";',
  },
}

// eslint-disable-next-line no-undef
module.exports = nextConfig
