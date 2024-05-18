import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { authRedirect } from '../../src/server/authRedirect'
import { TEvent } from '../../src/types/TEvent'
import { connectToDatabase } from '../../src/server/database'
import { ObjectId } from 'bson'
import { Container, Flex, Paper, Text, Title } from '@mantine/core'
import { useTranslation } from 'next-i18next'
import { getStringFromEventType } from '../../src/utils'

export default function Events(props: { event: TEvent }) {
  const { t } = useTranslation('events')
  const event = props.event

  return (
    <div>
      <Header />
      <div style={{ marginTop: '15vh' }}>
        <Container>
          <Title order={1} mb='10px' ta='center'>
            Событие: {event.title}
          </Title>
          <Paper withBorder shadow='md' p={30} radius='md'>
            <Flex direction={'column'} gap={'1rem'}>
              <Text size={'1.5rem'}>
                {t('fields.description')}: {event.description}
              </Text>
              <Text size={'1.5rem'}>
                {t('fields.location')}: {event.location}
              </Text>
              <Text size={'1.5rem'}>
                {t('fields.type')}: {t(getStringFromEventType(event.type))}
              </Text>
              <Text size={'1.5rem'}>
                {t('fields.createdBy')}: {event.createdBy}
              </Text>
            </Flex>
          </Paper>
        </Container>
      </div>
      <Footer />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { db } = await connectToDatabase()
  const { eventId } = ctx.query

  const eventsCollection = db.collection('events')
  const event = JSON.parse(
    JSON.stringify(
      (
        await eventsCollection.find({ _id: new ObjectId(eventId as string) }).toArray()
      )[0] as TEvent,
    ),
  )

  return {
    redirect: await authRedirect(ctx),
    props: {
      event,
      ...(await serverSideTranslations(ctx.locale ?? 'ru', ['events', 'common', 'main', 'errors'])),
    },
  }
}
