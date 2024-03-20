import '../styles/globals.css'
import '@mantine/core/styles.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { appWithTranslation } from 'next-i18next'
import { MantineProvider } from '@mantine/core'

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  return (
    <MantineProvider>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </MantineProvider>
  )
}

export default appWithTranslation(App)
