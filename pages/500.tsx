import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/navigation'
import { Button, Flex, Title } from '@mantine/core'
import { getSession } from 'next-auth/react'
import { getAccountByEmail } from '../src/server/account'
import { TAccount } from '../src/types/TAccount'

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
