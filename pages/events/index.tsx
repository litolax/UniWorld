import { Button, Container, Flex, Pagination, Paper, Table, Title } from '@mantine/core'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { authRedirect } from '../../src/server/authRedirect'
import { TEvent } from '../../src/types/TEvent'
import { connectToDatabase } from '../../src/server/database'
import { useState } from 'react'
import { chunk, getStringFromEventType, truncateText } from '../../src/utils'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'next-i18next'

export default function Events(props: { events: TEvent[] }) {
  const { t } = useTranslation('events')
  const router = useRouter()
  const [activePage, setPage] = useState(1)

  const events = chunk(props.events, 5)

  const rows = events[activePage - 1].map((event) => (
    <Table.Tr key={event._id.toString()}>
      <Table.Td>{truncateText(event.createdBy, 35)}</Table.Td>
      <Table.Td>{truncateText(event.title, 45)}</Table.Td>
      <Table.Td>{truncateText(event.location, 30)}</Table.Td>
      <Table.Td>{t(getStringFromEventType(event.type))}</Table.Td>
      <Table.Td>
        <Button onClick={() => router.push(`/events/${event._id}`)}>{t('fields.open')}</Button>
      </Table.Td>
    </Table.Tr>
  ))

  return (
    <div>
      <Header />
      <div
        style={{
          marginTop: '15vh',
        }}
      >
        <Container fluid>
          <Title order={1} mb={'10px'} ta='center'>
            {t('title')}
          </Title>

          <Paper
            withBorder
            shadow='md'
            p={30}
            mt={30}
            radius={'xl'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '85rem',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            <Flex direction={'column'} align={'center'}>
              <Table highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>{t('fields.createdBy')}</Table.Th>
                    <Table.Th>{t('fields.title')}</Table.Th>
                    <Table.Th>{t('fields.location')}</Table.Th>
                    <Table.Th>{t('fields.type')}</Table.Th>
                    <Table.Th>{t('fields.action')}</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>

              <Pagination total={events.length} value={activePage} onChange={setPage} mt='sm' />
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

  const eventsCollection = db.collection('events')
  const events = JSON.parse(JSON.stringify((await eventsCollection.find({}).toArray()) as TEvent[]))

  return {
    redirect: await authRedirect(ctx),
    props: {
      events,
      ...(await serverSideTranslations(ctx.locale ?? 'ru', ['events', 'main', 'common', 'errors'])),
    },
  }
}
