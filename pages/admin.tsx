import Header from '../components/Header'
import Footer from '../components/Footer'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { Container, Group, Paper, Title } from '@mantine/core'
import classes from '../styles/AuthenticationTitle.module.css'
import { DonutChart } from '@mantine/charts'

export default function Admin() {
  const { t } = useTranslation()
  const data = [
    { name: 'Mans', value: 400, color: 'indigo.6' },
    { name: 'Women', value: 300, color: 'pink.6' },
  ]

  return (
    <div>
      <Header />
      <div
        style={{
          marginTop: '15vh',
        }}
      >
        <Container size={460} my={40}>
          <Title ta='center' className={classes.title}>
            {'Админ панель'}
          </Title>

          <Paper
            withBorder
            shadow='md'
            p={30}
            mt={30}
            radius='md'
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Group
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Title order={3}>Статистика пользователей</Title>
              <DonutChart withLabelsLine data={data} />
            </Group>
          </Paper>
        </Container>
      </div>
      <Footer />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'ru', ['common', 'errors'])),
    },
  }
}
