import { Accordion, AppShell, Button, Flex, ScrollArea } from '@mantine/core'
import { useTranslation } from 'next-i18next'
import { GetServerSideProps } from 'next'
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

export default function MainMenu() {
  const { t } = useTranslation('main')
  const [currentPage, setCurrentPage] = useState(EMainViewPage.None)
  const [settingPage, setSettingsPage] = useState(ESettingPage.None)
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
        <AppShell.Section key={1}>{t('ui.views.main.title')}</AppShell.Section>
        <AppShell.Section key={2} grow component={ScrollArea}>
          {mainViewTabs.map(createTabs)}
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main
        style={{
          height: '100vh',
          backgroundColor: 'rgb(36, 36, 36)',
        }}
      >
        {currentPage === EMainViewPage.Profile && <Profile />}
        {currentPage === EMainViewPage.Settings && <Settings currentPage={settingPage} />}
      </AppShell.Main>
      <AppShell.Footer>
        <Footer />
      </AppShell.Footer>
    </AppShell>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'ru', ['common', 'main', 'errors'])),
    },
  }
}
