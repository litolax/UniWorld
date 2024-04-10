import '../styles/globals.css'
import '@mantine/core/styles.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { appWithTranslation } from 'next-i18next'
import { createTheme, MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  const theme = createTheme({
    /** Put your mantine theme override here */
  })

  return (
    <MantineProvider theme={theme} defaultColorScheme={'dark'}>
      <Notifications />
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </MantineProvider>
  )
}

export default appWithTranslation(App)
