import { Accordion, AppShell, Button, Flex, ScrollArea } from '@mantine/core'
import { useTranslation } from 'next-i18next'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function MainMenu() {
  const { t } = useTranslation('main')

  const tabs = [
    {
      name: 'ui.views.main.tabs.settings',
      sections: [],
    },
  ]

  const createTabs = (
    value: { name: string; sections: { title: string; click: () => void }[] },
    index: number,
  ) => {
    return (
      <Accordion key={index}>
        <Accordion.Item key={index} value={'1'}>
          <Accordion.Control>{t(value.name)}</Accordion.Control>
          <Accordion.Panel>
            <Flex direction='column' gap={'1rem'} mt={'0.5rem'}>
              {value.sections.map((section, i: number) => (
                <Button onClick={section.click} key={i}>
                  {t(section.title)}
                </Button>
              ))}
            </Flex>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    )
  }

  return (
    <AppShell header={{ height: '7vh' }} navbar={{ width: 300, breakpoint: 'sm' }} padding='md'>
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      <AppShell.Navbar p='md'>
        <AppShell.Section>{t('ui.views.main.title')}</AppShell.Section>
        <AppShell.Section grow component={ScrollArea}>
          {tabs.map(createTabs)}
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main
        style={{
          height: '100vh',
          backgroundColor: 'rgb(36, 36, 36)',
        }}
      ></AppShell.Main>
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
