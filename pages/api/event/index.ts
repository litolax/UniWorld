import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../src/server/database'
import { TEvent } from '../../../src/types/TEvent'
import { EEventType } from '../../../src/types/EEventType'
import { ObjectId } from 'bson'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const requestBody = req.body
  if (!requestBody) return res.json({})

  const { createdBy, title, description, location, type, startDate, endDate, eventDate } =
    JSON.parse(requestBody) as {
      createdBy: string
      title: string
      description: string
      location: string
      type: string
      startDate: Date
      endDate: Date
      eventDate: Date
    }

  const { db } = await connectToDatabase()
  const collection = await db.collection('events')

  const event: TEvent = {
    _id: new ObjectId(),
    createdBy,
    title,
    description,
    location,
    type: type as unknown as EEventType,
    startDate,
    endDate,
    eventDate,
    participants: [],
  }

  collection.insertOne(event)

  return res.status(200).json({})
}
