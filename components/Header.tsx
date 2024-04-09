import { Button, Flex, Title } from '@mantine/core'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'next-i18next'

export default function Header() {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <header
      style={{
        backgroundColor: 'rgb(74, 74, 74)',
      }}
    >
      <Flex gap={'30%'} align={'center'} justify={'center'} h={'7vh'}>
        <Flex gap='xl' justify='flex-end' align='center' direction='row' wrap='nowrap'>
          <Title order={1} onClick={() => router.replace('/')}>
            {t('header.companyName')}
          </Title>
        </Flex>
        <Flex gap='xl' justify='flex-end' align='center' direction='row' wrap='nowrap'>
          <Button onClick={() => router.replace('/signIn')}>{t('buttons.signIn')}</Button>
          <Button onClick={() => router.replace('/signUp')}>{t('buttons.signUp')}</Button>
        </Flex>
      </Flex>
    </header>
  )
}
