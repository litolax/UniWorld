import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { Container, Paper, Text, Title } from '@mantine/core'
import Wrapper from '../components/Wrapper'

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
  const locale = ctx.locale ? ctx.locale : 'ru'
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'errors'])),
    },
  }
}
