import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../../src/server/database'
import { TFeedback } from '../../../../src/types/TFeedback'
import { ObjectID } from 'bson'
import { EModerationState } from '../../../../src/types/EModerationState'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const requestBody = req.body
  if (!requestBody) return res.json({})

  const { feedback, method } = JSON.parse(requestBody) as {
    feedback: TFeedback
    method: string
  }

  const { db } = await connectToDatabase()
  const collection = await db.collection('feedbacks')

  await collection.updateOne(
    { _id: new ObjectID(feedback._id) },
    {
      $set: {
        moderationState:
          method === 'accept' ? EModerationState.Accepted : EModerationState.Declined,
      },
    },
  )

  return res.status(200).json({})
}
