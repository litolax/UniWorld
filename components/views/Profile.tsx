import { Avatar, Paper, Title } from '@mantine/core'
import { TAccount } from '../../src/types/TAccount'

const mockName = 'John Doe'
const mockEmail = 'JohnDoe@mail.me'

export const Profile = (props: { account?: TAccount }): JSX.Element => {
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
        src='https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png'
        size={120}
        radius={120}
        mx='auto'
      />
      <Title ta='center' fw={500} mt='md' order={2}>
        Имя пользователя: {props.account?.username ?? mockName}
      </Title>
      <Title ta='center' fw={500} mt='md' order={3}>
        Почта: {props.account?.email ?? mockEmail}
      </Title>
    </Paper>
  )
}
