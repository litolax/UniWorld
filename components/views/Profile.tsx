import { Avatar, Paper, Title } from '@mantine/core'
import { useTranslation } from 'next-i18next'
import { ESex } from '../../src/types/ESex'
import { useContext } from 'react'
import { StoreContext } from '../../src/stores/CombinedStores'

const mockName = 'John Doe'
const mockEmail = 'JohnDoe@mail.me'

export const Profile = (): JSX.Element => {
  const { t } = useTranslation('main')
  const context = useContext(StoreContext)
  const account = context.accountStore.account
  const avatarUrl = account?.sex === ESex.Male ? 'avatar-10.png' : 'avatar-8.png'

  return (
    <Paper
      radius='xl'
      withBorder
      p={'xl'}
      style={{
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '50vw',
      }}
    >
      <Avatar
        src={
          'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/' + avatarUrl
        }
        size={120}
        radius={120}
        mx='auto'
      />
      <Title ta='center' fw={500} mt='md' order={2}>
        {t('common:username')}: {account?.username ?? mockName}
      </Title>
      <Title ta='center' fw={500} mt='md' order={3}>
        {t('common:email')}: {account?.email ?? mockEmail}
      </Title>
      <Title ta='center' fw={500} mt='md' order={3}>
        {t('common:sex.label')}: {t(`common:sex.${account?.sex === ESex.Male ? 'male' : 'female'}`)}
      </Title>
    </Paper>
  )
}
