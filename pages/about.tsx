import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { authRedirect } from '../src/server/authRedirect'
import { Container, Paper, Text, Title } from '@mantine/core'
import Wrapper from '../components/Wrapper'
import { getSession } from 'next-auth/react'
import { getAccountByEmail } from '../src/server/account'
import { TAccount } from '../src/types/TAccount'

export default function About() {
  const { t } = useTranslation('feedback')

  return (
    <Wrapper>
      <Container
        style={{
          marginTop: '5rem',
        }}
      >
        <Title order={1} ta={'center'} my='xl'>
          {t('common:footer.aboutUsInfo.title')}
        </Title>
        <Paper withBorder shadow='md' p='xl' radius='md' my='lg'>
          <Title order={2} mb='md' ta={'center'}>
            {t('common:footer.aboutUsInfo.ourStory')}
          </Title>
          <Text>{t('common:footer.aboutUsInfo.aboutUsContent')}</Text>
        </Paper>
      </Container>
    </Wrapper>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  let currentAccount
  if (session && session.user?.email) {
    currentAccount = JSON.parse(
      JSON.stringify(await getAccountByEmail(session.user?.email)),
    ) as TAccount
  }
  const locale = currentAccount ? currentAccount.locale : ctx.locale ? ctx.locale : 'ru'
  return {
    redirect: await authRedirect(ctx),
    props: {
      ...(await serverSideTranslations(locale, ['common', 'errors'])),
    },
  }
}
