import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Button, Flex, TextInput, Title } from '@mantine/core'
import { Carousel } from '@mantine/carousel'
import { useState } from 'react'
import { dataFix, sendErrorNotification, sendSuccessNotification, truncateText } from '../src/utils'
import { useTranslation } from 'next-i18next'
import { connectToDatabase } from '../src/server/database'
import { TFeedback } from '../src/types/TFeedback'
import { TAccount } from '../src/types/TAccount'
import { getAccountByEmail } from '../src/server/account'
import { authRedirect } from '../src/server/authRedirect'
import { getSession } from 'next-auth/react'
import Wrapper from '../components/Wrapper'
import { EModerationState } from '../src/types/EModerationState'

export default function Feedback(props: { account: TAccount; feedbacks: TFeedback[] }) {
  const { t } = useTranslation('feedback')
  const [feedback, setFeedback] = useState('')
  const [feedbacks, setFeedbacks] = useState(
    props.feedbacks.filter((f) => f.moderationState === EModerationState.Accepted),
  )

  const feedbacksCarouselSlides = feedbacks.map((f) => (
    <>
      <Carousel.Slide>
        <Flex ta={'center'} direction={'column'} gap={'xs'} mt={'xl'}>
          <Title order={2}>
            {t('feedback')}: {truncateText(f.content, 250)}
          </Title>
          <Title order={2}>
            {t('createdBy')}: {f.createdBy}
          </Title>
        </Flex>
      </Carousel.Slide>
    </>
  ))

  const sendFeedback = async () => {
    if (feedback.length < 3) {
      sendErrorNotification(t('errors:tooLittle.feedback'))
      return
    }
    const response = await fetch('/api/feedback', {
      method: 'POST',
      body: JSON.stringify({ content: feedback, email: props.account.email }),
    })

    if (!response.ok) {
      switch (response.status) {
        case 404: {
          sendErrorNotification(t('errors:invalid.request'))
          return
        }
        default: {
          throw new Error(response.statusText)
        }
      }
    }

    sendSuccessNotification(t('thanks'))
    setFeedback('')
  }
  return (
    <Wrapper>
      <Flex
        direction={'column'}
        ta='center'
        w={'1000px'}
        ml={'auto'}
        mr={'auto'}
        gap={'1rem'}
        justify={'center'}
        align={'center'}
      >
        <Title order={1} mt={'xl'}>
          {t('title')}
        </Title>

        <TextInput
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          w={'30rem'}
          size={'xl'}
        ></TextInput>

        <Button w={'15rem'} onClick={sendFeedback}>
          {t('sendButton')}
        </Button>
      </Flex>

      <Title order={1} ta='center' mt={'8rem'}>
        {t('allFeedbacks')}
      </Title>

      <Carousel
        mt={'2rem'}
        slideSize='70%'
        height={200}
        slideGap='xl'
        controlsOffset='xl'
        controlSize={40}
        loop
        draggable={false}
      >
        {feedbacksCarouselSlides}
      </Carousel>
    </Wrapper>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { db } = await connectToDatabase()
  const session = await getSession(ctx)

  let account: TAccount | null = null

  if (session && session.user?.email) {
    account = dataFix(await getAccountByEmail(session.user?.email)) as TAccount
  }

  const feedbacksCollection = db.collection('feedbacks')
  const feedbacks = JSON.parse(
    JSON.stringify((await feedbacksCollection.find({}).toArray()) as TFeedback[]),
  )

  return {
    redirect: await authRedirect(ctx),
    props: {
      account,
      feedbacks,
      ...(await serverSideTranslations(ctx.locale || 'ru', ['feedback', 'common', 'errors'])),
    },
  }
}
