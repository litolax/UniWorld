import { GetServerSideProps } from 'next'
import path from 'path'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Title, Text, Container, Accordion, Center } from '@mantine/core'
import Wrapper from '../components/Wrapper'
import classes from '../styles/Accordion.module.css'
import { useTranslation } from 'next-i18next'
import { getAccountByEmail } from '../src/server/account'
import { TAccount } from '../src/types/TAccount'
import { getSession } from 'next-auth/react'
import { connectToDatabase } from '../src/server/database'

path.resolve('./next.config.js')
path.resolve('./next.config.mjs')

const faqInfo = [
  {
    emoji: '👩‍🦰',
    value: 'main.faq.1.value',
    description: 'main.faq.1.description',
  },
  {
    emoji: '👀',
    value: 'main.faq.2.value',
    description: 'main.faq.2.description',
  },
  {
    emoji: '👨‍👩‍👧‍👦',
    value: 'main.faq.3.value',
    description: 'main.faq.3.description',
  },
  {
    emoji: '👩‍🎓',
    value: 'main.faq.4.value',
    description: 'main.faq.4.description',
  },
  {
    emoji: '🚨',
    value: 'main.faq.5.value',
    description: 'main.faq.5.description',
  },
]

export default function Home() {
  const { t } = useTranslation()

  const faqItems = faqInfo.map((item) => (
    <Accordion.Item key={item.value} value={t(item.value)}>
      <Accordion.Control icon={item.emoji}>{t(item.value)}</Accordion.Control>
      <Accordion.Panel>{t(item.description)}</Accordion.Panel>
    </Accordion.Item>
  ))

  return (
    <Wrapper>
      <Container>
        <Center mt={'15vh'} mb={'2vh'}>
          <Title order={1}>{t('main.title')}</Title>
        </Center>

        <Center mb={'2vh'}>
          <Text size='xl' ta='center' mb={'2vh'}>
            {t('main.description')}
          </Text>
        </Center>

        <Center mb={'2vh'}>
          <Title order={1} ta={'center'}>
            {t('main.faq.title')}
          </Title>
        </Center>

        <Center mb={'2vh'}>
          <Accordion maw={400} classNames={classes}>
            {faqItems}
          </Accordion>
        </Center>
      </Container>
    </Wrapper>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  connectToDatabase()

  const session = await getSession(ctx)
  let currentAccount
  if (session && session.user?.email) {
    currentAccount = JSON.parse(
      JSON.stringify(await getAccountByEmail(session.user?.email)),
    ) as TAccount
  }
  const locale = currentAccount ? currentAccount.locale : ctx.locale ? ctx.locale : 'ru'
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}
