import { GetServerSideProps } from 'next'
import path from 'path'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useSession } from 'next-auth/react'
import { Title } from '@mantine/core'

path.resolve('./next.config.js')
path.resolve('./next.config.mjs')

export default function Home() {
  const session = useSession()
  console.log('session: ', session)
  const authStatus = session.status === 'authenticated'
  return (
    <>
      <Header />
      <Title order={1}>Вы {authStatus ? 'авторизованы' : 'не авторизованы'}</Title>
      <Footer />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'ru', ['common'])),
    },
  }
}
