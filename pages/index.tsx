import { GetServerSideProps } from 'next'
import path from 'path'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useSession } from 'next-auth/react'
import { Title } from '@mantine/core'
import Wrapper from '../components/Wrapper'

path.resolve('./next.config.js')
path.resolve('./next.config.mjs')

export default function Home() {
  const session = useSession()
  const authorized = session.status === 'authenticated'

  return (
    <Wrapper>
      <Title order={1}>Вы {authorized ? 'авторизованы' : 'не авторизованы'}</Title>
    </Wrapper>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'ru', ['common'])),
    },
  }
}
