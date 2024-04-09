import { GetServerSideProps } from 'next'
import path from 'path'
import Header from '../components/Header'
import Footer from '../components/Footer'

path.resolve('./next.config.js')

export default function Home() {
  return (
    <>
      <Header />
      <Footer />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    // redirect: (await authRedirect(ctx)) ?? {
    // 	destination: '/profile/@me' //TODO PATH
    // },
    props: {},
  }
}
