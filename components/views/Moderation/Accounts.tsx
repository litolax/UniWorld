import { Button, Container, Flex, Modal, Pagination, Paper, Table, Title } from '@mantine/core'
import { useTranslation } from 'next-i18next'
import {
  chunk,
  getStringFromAccountModerationState,
  sendSuccessNotification,
  truncateText,
} from '../../../src/utils'
import { useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { TAccount } from '../../../src/types/TAccount'
import { EAccountModerationState } from '../../../src/types/EAccountModerationState'

export const Accounts = (props: { accounts: TAccount[] }): JSX.Element => {
  const defaultPage = 1

  const { t } = useTranslation('admin')
  const [activePage, setPage] = useState(defaultPage)
  const [currentAccount, setCurrentAccount] = useState<TAccount | null>(null)
  const [opened, { open, close }] = useDisclosure(false)

  const accounts = chunk(
    props.accounts.filter((f) => !f.admin),
    5,
  )

  const rows = accounts[activePage - 1]?.map((e) => {
    return (
      <Table.Tr key={e._id.toString()}>
        <Table.Td>{truncateText(e.email, 35)}</Table.Td>
        <Table.Td>{truncateText(e.username, 35)}</Table.Td>
        <Table.Td>{t(getStringFromAccountModerationState(e.moderationState))}</Table.Td>
        <Table.Td>
          <Button
            onClick={() => {
              setCurrentAccount(e)
              open()
            }}
          >
            {t('moderation.account.open')}
          </Button>
        </Table.Td>
      </Table.Tr>
    )
  })

  const banAccount = async () => {
    const response = await fetch('/api/account/moderation', {
      method: 'POST',
      body: JSON.stringify({ account: currentAccount, method: 'ban' }),
    })

    if (!response.ok) {
      switch (response.status) {
        default: {
          throw new Error(response.statusText)
        }
      }
    }

    if (currentAccount) {
      currentAccount.moderationState = EAccountModerationState.Banned
    }

    sendSuccessNotification(t('moderation.account.banned'))
    close()
  }

  const unbanAccount = async () => {
    const response = await fetch('/api/account/moderation', {
      method: 'POST',
      body: JSON.stringify({ account: currentAccount, method: 'unban' }),
    })

    if (!response.ok) {
      switch (response.status) {
        default: {
          throw new Error(response.statusText)
        }
      }
    }

    if (currentAccount) {
      currentAccount.moderationState = EAccountModerationState.Unbanned
    }

    sendSuccessNotification(t('moderation.account.unbanned'))
    close()
  }

  return (
    <div>
      <Container fluid>
        <Title order={1} mb={'xl'} ta={'center'}>
          {t('moderation.accounts')}
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
                  <Table.Th>{t('moderation.account.email')}</Table.Th>
                  <Table.Th>{t('moderation.account.username')}</Table.Th>
                  <Table.Th>{t('moderation.account.states.title')}</Table.Th>
                  <Table.Th>{t('moderation.account.action')}</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>

            <Pagination total={accounts.length} value={activePage} onChange={setPage} mt={'sm'} />
          </Flex>
        </Paper>
      </Container>
      <Modal opened={opened} onClose={close} title={t('moderation.modalName')} centered>
        <Flex gap={'md'} direction={'column'}>
          <Title order={4}>{currentAccount?.email ?? ''}</Title>
          <Title order={5}>{currentAccount?.username ?? ''}</Title>
          <Title order={5}>
            {t(getStringFromAccountModerationState(currentAccount?.moderationState ?? -1))}
          </Title>

          <Flex gap={'md'} direction={'row'}>
            <Button onClick={banAccount}>{t('moderation.account.ban')}</Button>
            <Button onClick={unbanAccount}>{t('moderation.account.unban')}</Button>
          </Flex>
        </Flex>
      </Modal>
    </div>
  )
}

export default Accounts
