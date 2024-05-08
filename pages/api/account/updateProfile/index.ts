import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../../src/server/database'
import { TAccount } from '../../../../src/types/TAccount'
import { ESex } from '../../../../src/types/ESex'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const requestBody = req.body
  if (!requestBody) return res.json({})
  const { email, username, sex } = JSON.parse(requestBody) as {
    email: string
    username: string
    sex: ESex
  }

  const { db } = await connectToDatabase()
  const collection = await db.collection('accounts')

  const account = (await collection.findOne({ email })) as TAccount

  if (!account) {
    return res.status(404).json({})
  }

  await collection.updateOne({ email }, { $set: { username, sex } })

  return res.status(200).json({})
}
