import {
  Button,
  Container,
  Flex,
  Modal,
  Pagination,
  Paper,
  Table,
  Text,
  Title,
} from '@mantine/core'
import { useTranslation } from 'next-i18next'
import {
  chunk,
  getStringFromEventType,
  sendSuccessNotification,
  truncateText,
} from '../../../src/utils'
import { useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { TEvent } from '../../../src/types/TEvent'
import { EEventType } from '../../../src/types/EEventType'
import dayjs from 'dayjs'

export const Events = (props: { events: TEvent[] }): JSX.Element => {
  const defaultPage = 1

  const { t } = useTranslation('events')
  const [activePage, setPage] = useState(defaultPage)
  const [events, setEvents] = useState(props.events)
  const [currentEvent, setCurrentEvent] = useState<TEvent | null>(null)
  const [opened, { open, close }] = useDisclosure(false)

  const chunkedEvents = chunk(events, 5)

  const rows = chunkedEvents[activePage - 1]?.map((e) => {
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
          <Button
            onClick={() => {
              setCurrentEvent(e)
              open()
            }}
          >
            {t('moderation.open')}
          </Button>
        </Table.Td>
      </Table.Tr>
    )
  })

  const removeEvent = async () => {
    const response = await fetch('/api/event/remove', {
      method: 'POST',
      body: JSON.stringify({ id: currentEvent?._id }),
    })

    if (!response.ok) {
      switch (response.status) {
        default: {
          throw new Error(response.statusText)
        }
      }
    }

    setEvents((prevState) => prevState.filter((e) => e._id != currentEvent?._id))
    sendSuccessNotification(t('moderation.removed'))
    close()
  }

  return (
    <div>
      <Container fluid>
        <Title order={1} mb={'xl'} ta={'center'}>
          {t('moderation.title')}
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
                  <Table.Th>{t('fields.eventDate')}</Table.Th>
                  <Table.Th>{t('fields.type')}</Table.Th>
                  <Table.Th>{t('fields.action')}</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>

            <Pagination
              total={chunkedEvents.length}
              value={activePage}
              onChange={setPage}
              mt={'sm'}
            />
          </Flex>
        </Paper>
      </Container>
      <Modal opened={opened} onClose={close} title={t('moderation.modalName')} centered>
        <Flex gap={'md'} direction={'column'}>
          <Flex direction={'column'} gap={'1rem'} style={{ wordBreak: 'break-word' }}>
            <Text size={'xl'}>
              {t('fields.description')}: {currentEvent?.description}
            </Text>
            <Text size={'xl'}>
              {t('fields.location')}: {currentEvent?.location}
            </Text>
            <Text size={'xl'}>
              {t('fields.type')}:{' '}
              {t(getStringFromEventType(currentEvent?.type ?? EEventType.Organized))}
            </Text>
            <Text size={'xl'}>
              {t('fields.createdBy')}: {currentEvent?.createdBy}
            </Text>
            <Text size={'xl'}>
              {t('fields.eventDate')}:{' '}
              {currentEvent?.type === EEventType.Organized
                ? `${dayjs(currentEvent?.startDate).format('YYYY-MM-DD')} - ${dayjs(currentEvent?.endDate).format('YYYY-MM-DD')}`
                : `${dayjs(currentEvent?.eventDate).format('YYYY-MM-DD HH:mm')}`}
            </Text>
            <Text size={'xl'}>
              {t('fields.respondedAccountsAmount', { amount: currentEvent?.participants.length })}
            </Text>
          </Flex>

          <Flex gap={'md'} direction={'row'}>
            <Button onClick={removeEvent}>{t('moderation.remove')}</Button>
          </Flex>
        </Flex>
      </Modal>
    </div>
  )
}

export default Events
