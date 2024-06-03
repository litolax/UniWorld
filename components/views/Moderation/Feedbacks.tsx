import { TFeedback } from '../../../src/types/TFeedback'
import { Button, Container, Flex, Modal, Pagination, Paper, Table, Title } from '@mantine/core'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/navigation'
import { chunk, sendSuccessNotification, truncateText } from '../../../src/utils'
import { useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { EModerationState } from '../../../src/types/EModerationState'

export const Feedbacks = (props: { feedbacks: TFeedback[] }): JSX.Element => {
  const defaultPage = 1

  const { t } = useTranslation()
  const router = useRouter()
  const [activePage, setPage] = useState(defaultPage)
  const [currentFeedback, setCurrentFeedback] = useState<TFeedback>(props.feedbacks[0])
  const [opened, { open, close }] = useDisclosure(false)

  const feedbacks = chunk(
    props.feedbacks.filter((f) => f.moderationState === EModerationState.InReview),
    5,
  )

  const rows = feedbacks[activePage - 1]?.map((e) => {
    return (
      <Table.Tr key={e._id.toString()}>
        <Table.Td>{truncateText(e.createdBy, 35)}</Table.Td>
        <Table.Td>{truncateText(e.content, 40)}</Table.Td>
        <Table.Td>
          <Button
            onClick={() => {
              setCurrentFeedback(e)
              open()
            }}
          >
            {t('fields.open')}
          </Button>
        </Table.Td>
      </Table.Tr>
    )
  })

  const acceptFeedback = async () => {
    const response = await fetch('/api/feedback/moderation', {
      method: 'POST',
      body: JSON.stringify({ feedback: currentFeedback, method: 'accept' }),
    })

    if (!response.ok) {
      switch (response.status) {
        default: {
          throw new Error(response.statusText)
        }
      }
    }

    currentFeedback.moderationState = EModerationState.Accepted
    sendSuccessNotification('Отзыв успешно принят')
  }

  const declineFeedback = async () => {
    const response = await fetch('/api/feedback/moderation', {
      method: 'POST',
      body: JSON.stringify({ feedback: currentFeedback, method: 'decline' }),
    })

    if (!response.ok) {
      switch (response.status) {
        default: {
          throw new Error(response.statusText)
        }
      }
    }

    currentFeedback.moderationState = EModerationState.Declined
    sendSuccessNotification('Отзыв успешно отклонен')
  }

  return (
    <div>
      <Container fluid>
        <Title order={1} mb={'xl'} ta={'center'}>
          {t('eventsTitle')}
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
                  <Table.Th>{t('fields.content')}</Table.Th>
                  <Table.Th>{t('fields.action')}</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>

            <Pagination total={feedbacks.length} value={activePage} onChange={setPage} mt={'sm'} />
            <Button onClick={() => router.push('/main')} mt={'lg'}>
              {t('gotoMain')}
            </Button>
          </Flex>
        </Paper>
      </Container>
      <Modal opened={opened} onClose={close} title='Модерация отзыва' centered>
        <Flex gap={'xl'} direction={'column'}>
          <Title order={4}>{currentFeedback.createdBy}</Title>
          <Title order={5}>{currentFeedback.content}</Title>

          <Flex gap={'xl'} direction={'row'}>
            <Button onClick={acceptFeedback}>Принять</Button>
            <Button onClick={declineFeedback}>Отклонить</Button>
          </Flex>
        </Flex>
      </Modal>
    </div>
  )
}

export default Feedbacks
