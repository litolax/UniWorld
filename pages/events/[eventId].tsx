import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { authRedirect } from '../../src/server/authRedirect'
import { TEvent } from '../../src/types/TEvent'
import { connectToDatabase } from '../../src/server/database'
import { ObjectId } from 'bson'
import { Button, Container, Flex, Paper, Text, Title } from '@mantine/core'
import { useTranslation } from 'next-i18next'
import {
  getStringFromEventType,
  sendErrorNotification,
  sendSuccessNotification,
  truncateText,
} from '../../src/utils'
import { getSession } from 'next-auth/react'
import { TAccount } from '../../src/types/TAccount'
import { getAccountByEmail } from '../../src/server/account'
import { useState } from 'react'
import Wrapper from '../../components/Wrapper'

export default function Events(props: { account: TAccount; event: TEvent }) {
  const event = props.event
  const { t } = useTranslation('events')
  const [responded, setResponded] = useState(event.participants.includes(props.account._id))

  const respond = async () => {
    const response = await fetch('/api/event/respond', {
      method: 'POST',
      body: JSON.stringify({ eventId: event._id, respondAccountId: props.account._id }),
    })

    if (!response.ok) {
      switch (response.status) {
        case 404: {
          sendErrorNotification(t('errors:notFound.account.email'))
          return
        }
        default: {
          throw new Error(response.statusText)
        }
      }
    }

    event.participants.push(props.account._id)

    setResponded(true)
    sendSuccessNotification(t('respond.successfully', { name: truncateText(event.title, 35) }))
  }

  return (
    <Wrapper>
      <div style={{ marginTop: '15vh' }}>
        <Container>
          <Title order={1} mb='10px' ta='center'>
            Событие: {event.title}
          </Title>
          <Paper withBorder shadow='md' p={30} radius='md'>
            <Flex direction={'column'} gap={'1rem'}>
              <Text size={'1.5rem'}>
                {t('fields.description')}: {event.description}
              </Text>
              <Text size={'1.5rem'}>
                {t('fields.location')}: {event.location}
              </Text>
              <Text size={'1.5rem'}>
                {t('fields.type')}: {t(getStringFromEventType(event.type))}
              </Text>
              <Text size={'1.5rem'}>
                {t('fields.createdBy')}: {event.createdBy}
              </Text>
              <Text size={'1.5rem'}>
                {t('fields.respondedAccountsAmount', { amount: event.participants.length })}
              </Text>

              {event.createdBy != props.account.email && (
                <Button w={'20rem'} onClick={respond} disabled={responded}>
                  {t(!responded ? 'respond.buttons.respond' : 'respond.buttons.already')}
                </Button>
              )}
            </Flex>
          </Paper>
        </Container>
      </div>
    </Wrapper>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getSession(ctx)
  const { db } = await connectToDatabase()
  const { eventId } = ctx.query

  const eventsCollection = db.collection('events')
  const event = JSON.parse(
    JSON.stringify(
      (
        await eventsCollection.find({ _id: new ObjectId(eventId as string) }).toArray()
      )[0] as TEvent,
    ),
  )

  let currentAccount: TAccount | null = null

  if (session && session.user?.email) {
    currentAccount = JSON.parse(
      JSON.stringify(await getAccountByEmail(session.user?.email)),
    ) as TAccount
  }

  return {
    redirect: await authRedirect(ctx),
    props: {
      account: currentAccount,
      event,
      ...(await serverSideTranslations(ctx.locale ?? 'ru', ['events', 'common', 'main', 'errors'])),
    },
  }
}
