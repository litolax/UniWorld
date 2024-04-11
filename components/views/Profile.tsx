import { Avatar, Paper, Title } from '@mantine/core'
import { TAccount } from '../../src/types/TAccount'
import { useTranslation } from 'next-i18next'
import { ESex } from '../../src/types/ESex'

const mockName = 'John Doe'
const mockEmail = 'JohnDoe@mail.me'

export const Profile = (props: { account?: TAccount }): JSX.Element => {
  const { t } = useTranslation('main')
  const avatarUrl = props.account?.sex === ESex.Male ? 'avatar-10.png' : 'avatar-8.png'

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
        {t('common:username')}: {props.account?.username ?? mockName}
      </Title>
      <Title ta='center' fw={500} mt='md' order={3}>
        {t('common:email')}: {props.account?.email ?? mockEmail}
      </Title>
      <Title ta='center' fw={500} mt='md' order={3}>
        {t('common:sex.label')}:{' '}
        {t(`common:sex.${props.account?.sex === ESex.Male ? 'male' : 'female'}`)}
      </Title>
    </Paper>
  )
}
