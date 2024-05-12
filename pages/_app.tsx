import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/charts/styles.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { appWithTranslation } from 'next-i18next'
import { createTheme, MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { useContext } from 'react'
import { observer } from 'mobx-react'
import { StoreContext } from '../src/stores/CombinedStores'

const App = observer(({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  const theme = createTheme({
    /** Put your mantine theme override here */
  })
  const context = useContext(StoreContext)

  return (
    <MantineProvider theme={theme} defaultColorScheme={'dark'}>
      <StoreContext.Provider value={context}>
        <Notifications position={'bottom-right'} />
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </StoreContext.Provider>
    </MantineProvider>
  )
})

export default appWithTranslation(App)
