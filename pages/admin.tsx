import Header from '../components/Header'
import Footer from '../components/Footer'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { Container, Flex, Paper, Title } from '@mantine/core'
import classes from '../styles/AuthenticationTitle.module.css'
import { DonutChart } from '@mantine/charts'
import { connectToDatabase } from '../src/server/database'
import { TAccount } from '../src/types/TAccount'
import { ESex } from '../src/types/ESex'
import { TEvent } from '../src/types/TEvent'
import { EEventType } from '../src/types/EEventType'

export default function Admin(props: {
  mans: number
  womens: number
  organized: number
  unplanned: number
}) {
  const { t } = useTranslation('admin')
  const usersData = [
    { name: t('mans'), value: props.mans, color: 'indigo.6' },
    { name: t('womens'), value: props.womens, color: 'pink.6' },
  ]

  const eventsData = [
    { name: t('organized'), value: props.organized, color: 'indigo.6' },
    { name: t('unplanned'), value: props.unplanned, color: 'pink.6' },
  ]

  return (
    <div>
      <Header />
      <div
        style={{
          marginTop: '15vh',
        }}
      >
        <Container>
          <Title ta='center' className={classes.title}>
            {t('title')}
          </Title>

          <br />

          <Title order={2} ta='center'>
            {t('statistics')}
          </Title>

          <Paper
            withBorder
            shadow='md'
            p={30}
            mt={30}
            radius='md'
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Flex gap={'10rem'} justify='center' align='center' direction='row'>
              <Flex gap='xl' justify='center' align='center' direction='column'>
                <Title order={3}>{t('accounts')}</Title>
                <DonutChart withLabelsLine data={usersData} size={200} />
              </Flex>

              <Flex gap='xl' justify='center' align='center' direction='column'>
                <Title order={3}>{t('events')}</Title>
                <DonutChart withLabelsLine data={eventsData} size={200} />
              </Flex>
            </Flex>
          </Paper>
        </Container>
      </div>
      <Footer />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { db } = await connectToDatabase()

  const accountsCollection = db.collection('accounts')
  const accounts = (await accountsCollection.find({}).toArray()) as TAccount[]
  const mans = accounts.filter((a) => a.sex === ESex.Male).length
  const womens = accounts.length - mans

  const eventsCollection = db.collection('events')
  const events = (await eventsCollection.find({}).toArray()) as TEvent[]
  const organized = events.filter((e) => e.type === EEventType.Organized).length
  const unplanned = events.length - organized

  return {
    props: {
      mans,
      womens,
      organized,
      unplanned,
      ...(await serverSideTranslations(ctx.locale || 'ru', ['admin', 'common', 'errors'])),
    },
  }
}
