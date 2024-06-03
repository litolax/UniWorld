import { TFeedback } from '../../../src/types/TFeedback'
import { Button, Container, Flex, Modal, Pagination, Paper, Table, Title } from '@mantine/core'
import { useTranslation } from 'next-i18next'
import { chunk, sendSuccessNotification, truncateText } from '../../../src/utils'
import { useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { EModerationState } from '../../../src/types/EModerationState'

export const Feedbacks = (props: { feedbacks: TFeedback[] }): JSX.Element => {
  const defaultPage = 1

  const { t } = useTranslation('feedback')
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
            {t('moderation.open')}
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
    sendSuccessNotification(t('moderation.accepted'))
    close()
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
    sendSuccessNotification(t('moderation.declined'))
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
                  <Table.Th>{t('moderation.createdBy')}</Table.Th>
                  <Table.Th>{t('moderation.content')}</Table.Th>
                  <Table.Th>{t('moderation.action')}</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>

            <Pagination total={feedbacks.length} value={activePage} onChange={setPage} mt={'sm'} />
          </Flex>
        </Paper>
      </Container>
      <Modal opened={opened} onClose={close} title={t('moderation.modalName')} centered>
        <Flex gap={'md'} direction={'column'}>
          <Title order={4}>{currentFeedback.createdBy}</Title>
          <Title order={5}>{currentFeedback.content}</Title>

          <Flex gap={'md'} direction={'row'}>
            <Button onClick={acceptFeedback}>{t('moderation.accept')}</Button>
            <Button onClick={declineFeedback}>{t('moderation.decline')}</Button>
          </Flex>
        </Flex>
      </Modal>
    </div>
  )
}

export default Feedbacks
