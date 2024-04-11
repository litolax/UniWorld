import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/navigation'
import { Button, Flex, Title } from '@mantine/core'

export default function Page500() {
  const { t } = useTranslation('errors')
  const router = useRouter()

  return (
    <>
      <Flex
        justify='center'
        align='center'
        direction='column'
        style={{
          height: '100vh',
          display: 'flex',
        }}
        gap={'2rem'}
      >
        <Title order={1}>{t('somethingWentWrong')}</Title>
        <Button variant='filled' onClick={() => router.push('/')}>
          {t('backHome')}
        </Button>
      </Flex>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'ru', ['errors'])),
    },
  }
}
