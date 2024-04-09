import { GetServerSideProps } from 'next'
import path from 'path'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

path.resolve('./next.config.js')

export default function Home() {
  return (
    <>
      <Header />
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
