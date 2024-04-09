import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { getSession, signIn } from 'next-auth/react'
import { Button, Flex, Title } from '@mantine/core'

export default function Unauthorized() {
  const { t } = useTranslation('errors')

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
        <Title order={1}>{t('unauthorized.title')}</Title>
        <Title
          order={3}
          style={{
            whiteSpace: 'pre-line',
            textAlign: 'center',
          }}
        >
          {t('unauthorized.description')}
        </Title>
        <Button variant='filled' onClick={() => signIn('google')}>
          {t('unauthorized.loginWith.google')}
        </Button>
      </Flex>
    </>
  )
}

async function redirectMainPage(ctx: any) {
  const session = await getSession(ctx)
  if (session)
    return {
      destination: '/profile/@me', //TODO PATH
      permanent: false,
    }
  return undefined
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    redirect: await redirectMainPage(ctx),
    props: {
      ...(await serverSideTranslations(ctx.locale || 'ru-RU', ['errors'])),
    },
  }
}
