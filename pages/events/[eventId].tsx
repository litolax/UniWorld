import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { authRedirect } from '../../src/server/authRedirect'
import { TEvent } from '../../src/types/TEvent'
import { connectToDatabase } from '../../src/server/database'
import { ObjectId } from 'bson'

export default function Events(props: { event: TEvent }) {
  return (
    <div>
      <Header />
      <Footer />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { db } = await connectToDatabase()
  const { eventId } = ctx.query

  const eventsCollection = db.collection('events')
  const event = JSON.parse(
    JSON.stringify(
      (await eventsCollection.find({ _id: new ObjectId(eventId as string) }).toArray()) as TEvent,
    ),
  )

  return {
    redirect: await authRedirect(ctx),
    props: {
      event,
      ...(await serverSideTranslations(ctx.locale ?? 'ru', ['common', 'main', 'errors'])),
    },
  }
}
