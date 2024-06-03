import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../../src/server/database'
import { ObjectID } from 'bson'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const requestBody = req.body
  if (!requestBody) return res.json({})

  const { id } = JSON.parse(requestBody) as {
    id: string
  }

  const { db } = await connectToDatabase()
  const collection = await db.collection('events')

  await collection.deleteOne({ _id: new ObjectID(id) })

  return res.status(200).json({})
}
