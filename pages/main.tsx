import { Accordion, AppShell, Button, Flex, ScrollArea } from '@mantine/core'
import { useTranslation } from 'next-i18next'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Profile } from '../components/views/Profile'
import { TMainViewTab } from '../src/types/TMainViewTab'
import { EMainViewTabType } from '../src/types/EMainViewTabType'
import { useState } from 'react'
import { ESettingPage } from '../src/types/ESettingPage'
import { Settings } from '../components/views/Settings/Settings'
import { EMainViewPage } from '../src/types/EMainViewPage'
import { getSession } from 'next-auth/react'
import { TAccount } from '../src/types/TAccount'
import { getAccountByEmail } from '../src/server/account'
import { dataFix } from '../src/utils'
import { EEventPage } from '../src/types/EEventPage'
import { Event } from '../components/views/Event/Event'
import { ELanguage } from '../src/types/ELanguage'
import { useRouter } from 'next/navigation'

export default function MainMenu(props: { account: TAccount; savedLocale: ELanguage }) {
  const { t } = useTranslation('main')
  const router = useRouter()

  const [currentPage, setCurrentPage] = useState(EMainViewPage.Profile)
  const [settingPage, setSettingsPage] = useState(ESettingPage.None)
  const [eventPage, setEventPage] = useState(EEventPage.None)
  const mainViewTabs: TMainViewTab[] = [
    {
      type: EMainViewTabType.Button,
      name: 'ui.views.main.tabs.profile',
      onClick: () => {
        setCurrentPage(EMainViewPage.Profile)
      },
      sections: [],
    },
    {
      type: EMainViewTabType.Accordion,
      name: 'ui.views.main.tabs.settings',
      sections: [
        {
          title: 'ui.views.main.sections.settings.main.title',
          click: () => {
            setSettingsPage(ESettingPage.Main)
            setCurrentPage(EMainViewPage.Settings)
          },
        },
        {
          title: 'ui.views.main.sections.settings.password.title',
          click: () => {
            setSettingsPage(ESettingPage.Password)
            setCurrentPage(EMainViewPage.Settings)
          },
        },
        {
          title: 'ui.views.main.sections.settings.mfa.title',
          click: () => {
            setSettingsPage(ESettingPage.Mfa)
            setCurrentPage(EMainViewPage.Settings)
          },
        },
      ],
    },
    {
      type: EMainViewTabType.Accordion,
      name: 'ui.views.main.tabs.event',
      sections: [
        {
          title: 'ui.views.main.sections.event.view.title',
          click: () => {
            router.push('/events')
          },
        },
        {
          title: 'ui.views.main.sections.event.create.title',
          click: () => {
            setEventPage(EEventPage.Create)
            setCurrentPage(EMainViewPage.Event)
          },
        },
      ],
    },
  ]

  const createTabs = (tab: TMainViewTab, index: number) => {
    let component
    switch (tab.type) {
      case EMainViewTabType.Accordion: {
        component = (
          <Accordion key={index}>
            <Accordion.Item key={index} value={index.toString()}>
              <Accordion.Control>{t(tab.name)}</Accordion.Control>
              <Accordion.Panel>
                <Flex direction='column' gap={'1rem'} mt={'0.5rem'}>
                  {tab.sections?.map((section, i: number) => (
                    <Button onClick={section.click} key={i}>
                      {t(section.title)}
                    </Button>
                  ))}
                </Flex>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        )
        break
      }
      case EMainViewTabType.Button: {
        component = (
          <Button fullWidth mt={'0.5rem'} mb={'0.5rem'} onClick={tab.onClick}>
            {t(tab.name)}
          </Button>
        )
        break
      }
    }

    return component
  }

  return (
    <AppShell header={{ height: '7vh' }} navbar={{ width: 300, breakpoint: 'sm' }} padding='md'>
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      <AppShell.Navbar p='md'>
        <AppShell.Section>{t('ui.views.main.title')}</AppShell.Section>
        <AppShell.Section grow component={ScrollArea}>
          {mainViewTabs.map(createTabs)}
          {props.account.admin && (
            <Button fullWidth mt={'0.5rem'} mb={'0.5rem'} onClick={() => router.push('/admin')}>
              {t('admin:title')}
            </Button>
          )}
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main
        style={{
          height: '100vh',
          backgroundColor: 'rgb(36, 36, 36)',
        }}
      >
        {currentPage === EMainViewPage.Profile && <Profile account={props.account} />}
        {currentPage === EMainViewPage.Settings && (
          <Settings currentPage={settingPage} account={props.account} />
        )}
        {currentPage === EMainViewPage.Event && (
          <Event currentPage={eventPage} account={props.account} />
        )}
      </AppShell.Main>
      <AppShell.Footer>
        <Footer />
      </AppShell.Footer>
    </AppShell>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  let redirect = undefined
  const session = await getSession(ctx)
  let currentAccount: TAccount | null = null

  if (session && session.user?.email) {
    currentAccount = dataFix(await getAccountByEmail(session.user?.email)) as TAccount
  }

  const locale = currentAccount?.locale ?? ctx.locale ?? 'ru'

  if (!currentAccount) {
    redirect = {
      destination: '/',
      permanent: false,
    }
  }

  return {
    props: {
      account: currentAccount,
      savedLocale: locale,
      ...(await serverSideTranslations(locale, ['common', 'main', 'admin', 'errors'])),
    },
    redirect,
  }
}
