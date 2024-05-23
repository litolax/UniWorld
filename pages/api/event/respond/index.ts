import { NextApiRequest, NextApiResponse } from 'next'
import { ObjectId } from 'bson'
import { connectToDatabase } from '../../../../src/server/database'
import { TEvent } from '../../../../src/types/TEvent'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const requestBody = req.body
  if (!requestBody) return res.json({})

  const { eventId, respondAccountId } = JSON.parse(requestBody) as {
    eventId: ObjectId
    respondAccountId: ObjectId
  }

  const eventObjectId = new ObjectId(eventId)
  const respondAccountObjectId = new ObjectId(respondAccountId)

  const { db } = await connectToDatabase()
  const eventsCollection = await db.collection('events')

  const event = (await eventsCollection.findOne({ _id: eventObjectId })) as TEvent
  event.participants.push(respondAccountObjectId)

  await eventsCollection.updateOne(
    { _id: eventObjectId },
    { $set: { participants: event.participants } },
  )

  return res.status(200).json({})
}
