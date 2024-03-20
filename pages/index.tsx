import { GetServerSideProps } from 'next'
import path from 'path'
import Header from '../components/Header'

path.resolve('./next.config.js')

export default function Home() {
  return (
    <>
      <Header />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  console.log(ctx)
  return {
    // redirect: (await authRedirect(ctx)) ?? {
    // 	destination: '/profile/@me' //TODO PATH
    // },
    props: {},
  }
}
