import {
  Button,
  Container,
  Flex,
  Pagination,
  Paper,
  Select,
  Table,
  TextInput,
  Title,
} from '@mantine/core'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { authRedirect } from '../../src/server/authRedirect'
import { TEvent } from '../../src/types/TEvent'
import { connectToDatabase } from '../../src/server/database'
import { useEffect, useState } from 'react'
import { chunk, getStringFromEventType, truncateText } from '../../src/utils'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'next-i18next'
import dayjs from 'dayjs'
import { EEventType } from '../../src/types/EEventType'
import Wrapper from '../../components/Wrapper'

export default function Events(props: { events: TEvent[] }) {
  const defaultPage = 1

  const { t } = useTranslation('events')
  const router = useRouter()
  const [activePage, setPage] = useState(defaultPage)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredEvents, setFilteredEvents] = useState(props.events)
  const [eventType, setEventType] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<string | null>(null)

  useEffect(() => {
    let events = props.events

    if (searchQuery) {
      events = events.filter((event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (eventType) {
      events = events.filter((event) => event.type === +eventType)
    }

    if (sortOrder) {
      events = [...events].sort((a, b) => {
        const dateA = getEventDate(a)
        const dateB = getEventDate(b)

        if (sortOrder === 'asc') {
          return dateA.getTime() - dateB.getTime()
        } else {
          return dateB.getTime() - dateA.getTime()
        }
      })
    }

    setFilteredEvents(events)
    setPage(defaultPage)
  }, [searchQuery, eventType, sortOrder, props.events])

  const events = chunk(filteredEvents, 5)

  const rows = events[activePage - 1]?.map((e) => {
    const eventHumanDate =
      e.type === EEventType.Organized
        ? `${dayjs(e.startDate).format('YYYY-MM-DD')} - ${dayjs(e.endDate).format('YYYY-MM-DD')}`
        : `${dayjs(e.eventDate).format('YYYY-MM-DD HH:mm')}`

    return (
      <Table.Tr key={e._id.toString()}>
        <Table.Td>{truncateText(e.createdBy, 35)}</Table.Td>
        <Table.Td>{truncateText(e.title, 40)}</Table.Td>
        <Table.Td>{truncateText(e.location, 30)}</Table.Td>
        <Table.Td>{eventHumanDate}</Table.Td>
        <Table.Td>{t(getStringFromEventType(e.type))}</Table.Td>
        <Table.Td>
          <Button onClick={() => router.push(`/events/${e._id}`)}>{t('fields.open')}</Button>
        </Table.Td>
      </Table.Tr>
    )
  })

  function getEventDate(event: TEvent): Date {
    if (event.type === EEventType.Organized) {
      return new Date(event.startDate ?? 0)
    } else {
      return new Date(event.eventDate ?? 0)
    }
  }

  return (
    <Wrapper>
      <div
        style={{
          marginTop: '8vh',
          marginBottom: '1vh',
        }}
      >
        <Container fluid>
          <Title order={1} mb={'xl'} ta={'center'}>
            {t('title')}
          </Title>

          <Flex direction={'row'} ta={'center'} gap={'xl'} justify={'center'} align={'center'}>
            <TextInput
              label={t('search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              mb='md'
              size='md'
            />

            <Select
              label={t('fields.type')}
              data={[
                {
                  value: (EEventType.Organized as number).toString(),
                  label: t('fields.types.organized'),
                },
                {
                  value: (EEventType.Unplanned as number).toString(),
                  label: t('fields.types.unplanned'),
                },
              ]}
              value={eventType}
              onChange={setEventType}
              mb='md'
              size='md'
            />

            <Select
              label={t('fields.sort.order')}
              data={[
                { value: 'asc', label: t('fields.sort.asc') },
                { value: 'desc', label: t('fields.sort.desc') },
              ]}
              value={sortOrder}
              onChange={setSortOrder}
              mb='md'
              size='md'
            />
          </Flex>

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
                    <Table.Th>{t('fields.eventDate')}</Table.Th>
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
    </Wrapper>
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
