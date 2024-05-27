import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { Accordion, AppShell, Button, Flex, ScrollArea } from '@mantine/core'
import { authRedirect } from '../src/server/authRedirect'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { TMainViewTab } from '../src/types/TMainViewTab'
import { EMainViewTabType } from '../src/types/EMainViewTabType'
import { useState } from 'react'
import { EAdminViewPage } from '../src/types/EAdminViewPage'
import Stats from '../components/views/Stats/Stats'
import { connectToDatabase } from '../src/server/database'
import { TAccount } from '../src/types/TAccount'
import { ESex } from '../src/types/ESex'
import { TEvent } from '../src/types/TEvent'
import { EEventType } from '../src/types/EEventType'
import { EModerationPage } from '../src/types/EModerationPage'
import { Moderation } from '../components/views/Moderation/Moderation'
import { TFeedback } from '../src/types/TFeedback'

export default function Admin(props: {
  mans: number
  women: number
  organized: number
  unplanned: number
  feedbacks: TFeedback[]
}) {
  const { t } = useTranslation('admin')
  const [currentPage, setCurrentPage] = useState(EAdminViewPage.None)
  const [moderationPage, setModerationPage] = useState(EModerationPage.None)

  const adminViewTabs: TMainViewTab[] = [
    {
      type: EMainViewTabType.Button,
      name: 'stats',
      onClick: () => {
        setCurrentPage(EAdminViewPage.Stats)
      },
      sections: [],
    },
    {
      type: EMainViewTabType.Accordion,
      name: 'moderation.title',
      sections: [
        {
          title: 'moderation.feedbacks',
          click: () => {
            setModerationPage(EModerationPage.Feedbacks)
            setCurrentPage(EAdminViewPage.Moderation)
          },
        },
        {
          title: 'moderation.accounts',
          click: () => {
            setModerationPage(EModerationPage.Accounts)
            setCurrentPage(EAdminViewPage.Moderation)
          },
        },
        {
          title: 'moderation.events',
          click: () => {
            setModerationPage(EModerationPage.Events)
            setCurrentPage(EAdminViewPage.Moderation)
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
        <AppShell.Section>{t('title')}</AppShell.Section>
        <AppShell.Section grow component={ScrollArea}>
          {adminViewTabs.map(createTabs)}
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main
        style={{
          height: '100vh',
          backgroundColor: 'rgb(36, 36, 36)',
        }}
      >
        {currentPage === EAdminViewPage.Stats && (
          <Stats
            mans={props.mans}
            women={props.women}
            organized={props.organized}
            unplanned={props.unplanned}
          />
        )}
        {currentPage === EAdminViewPage.Moderation && (
          <Moderation currentPage={moderationPage} feedbacks={props.feedbacks} />
        )}
      </AppShell.Main>
      <AppShell.Footer>
        <Footer />
      </AppShell.Footer>
    </AppShell>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { db } = await connectToDatabase()

  const accountsCollection = db.collection('accounts')
  const accounts = (await accountsCollection.find({}).toArray()) as TAccount[]
  const mans = accounts.filter((a) => a.sex === ESex.Male).length
  const women = accounts.length - mans

  const eventsCollection = db.collection('events')
  const events = (await eventsCollection.find({}).toArray()) as TEvent[]
  const organized = events.filter((e) => e.type === EEventType.Organized).length
  const unplanned = events.length - organized

  const feedbacksCollection = db.collection('feedbacks')
  const feedbacks = JSON.parse(
    JSON.stringify((await feedbacksCollection.find({}).toArray()) as TFeedback[]),
  )

  return {
    redirect: await authRedirect(ctx),
    props: {
      mans,
      women,
      organized,
      unplanned,
      feedbacks,
      ...(await serverSideTranslations(ctx.locale || 'ru', ['admin', 'common', 'errors'])),
    },
  }
}
