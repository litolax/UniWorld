import { useTranslation } from 'next-i18next'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Button, Flex, Title } from '@mantine/core'
import { useRouter } from 'next/navigation'
import { getAccountByEmail } from '../src/server/account'
import { TAccount } from '../src/types/TAccount'
import { getSession } from 'next-auth/react'

export default function Page403() {
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
        <Title order={1}>{t('unauthorized.forAccess')}</Title>
        <Button variant='filled' onClick={() => router.push('/')}>
          {t('backHome')}
        </Button>
      </Flex>
    </>
  )
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const session = await getSession(ctx.params)
  let currentAccount
  if (session && session.user?.email) {
    currentAccount = JSON.parse(
      JSON.stringify(await getAccountByEmail(session.user?.email)),
    ) as TAccount
  }
  const locale = currentAccount ? currentAccount.locale : ctx.locale ? ctx.locale : 'ru'
  return {
    props: {
      ...(await serverSideTranslations(locale, ['errors'])),
    },
  }
}
