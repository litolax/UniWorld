import { Button, Flex, Title } from '@mantine/core'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'next-i18next'
import { signOut, useSession } from 'next-auth/react'

export default function Header() {
  const router = useRouter()
  const { t } = useTranslation()
  const session = useSession()
  const authorized = session.status === 'authenticated'

  const signOutAccount = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  const headerButtons = () => {
    if (authorized) {
      return (
        <>
          <Button onClick={signOutAccount}>{t('buttons.signOut')}</Button>
        </>
      )
    } else {
      return (
        <>
          <Button onClick={() => router.push('/signIn')}>{t('buttons.signIn')}</Button>
          <Button onClick={() => router.push('/signUp')}>{t('buttons.signUp')}</Button>
        </>
      )
    }
  }

  return (
    <header
      style={{
        backgroundColor: 'rgb(74, 74, 74)',
      }}
    >
      <Flex gap={'30%'} align={'center'} justify={'center'} h={'7vh'}>
        <Flex gap='xl' justify='flex-end' align='center' direction='row' wrap='nowrap'>
          <Title order={1} onClick={() => router.push('/')}>
            {t('header.companyName')}
          </Title>
        </Flex>
        <Flex gap='xl' justify='flex-end' align='center' direction='row' wrap='nowrap'>
          {headerButtons()}
        </Flex>
      </Flex>
    </header>
  )
}
