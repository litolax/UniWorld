import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../src/server/database'
import { TFeedback } from '../../../src/types/TFeedback'
import { ObjectId } from 'bson'
import { EModerationState } from '../../../src/types/EModerationState'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const requestBody = req.body

  const { db } = await connectToDatabase()
  const collection = await db.collection('feedbacks')

  if (req.method === 'POST') {
    if (!requestBody) return res.json({})

    const { content, email } = JSON.parse(requestBody) as {
      content: string
      email: string
    }

    const feedback: TFeedback = {
      _id: new ObjectId(),
      content,
      createdBy: email,
      moderationState: EModerationState.InReview,
    }

    await collection.insertOne(feedback)
    return res.status(200).json({ feedback })
  } else if (req.method === 'GET') {
    const feedbacks = collection.find({}).toArray() as TFeedback[]
    return res.status(200).json({ feedbacks })
  }

  return res.status(400)
}
