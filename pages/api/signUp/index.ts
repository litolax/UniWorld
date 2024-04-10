import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../src/server/database'
import { TAccount } from '../../../src/types/TAccount'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const requestBody = req.body
  if (!requestBody) return res.json({})

  const account = JSON.parse(requestBody) as TAccount
  const { db } = await connectToDatabase()
  const collection = await db.collection('accounts')

  const accounts = (await collection.find({ email: account.email }).toArray()) as TAccount[]

  if (accounts.length > 0) {
    return res.status(409).json({})
  }

  collection.insertOne(account)

  return res.status(200).json({})
}
