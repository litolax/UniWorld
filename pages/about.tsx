import { GetServerSideProps } from 'next'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { authRedirect } from '../src/server/authRedirect'
import { Container, Paper, Text, Title } from '@mantine/core'

export default function About() {
  const { t } = useTranslation('feedback')

  return (
    <div>
      <Header />
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
      <Footer />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    redirect: await authRedirect(ctx),
    props: {
      ...(await serverSideTranslations(ctx.locale || 'ru', ['common', 'errors'])),
    },
  }
}
