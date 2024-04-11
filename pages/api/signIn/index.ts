import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../src/server/database'
import { TAccount } from '../../../src/types/TAccount'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const requestBody = req.body
  if (!requestBody) return res.json({})

  const { password, email } = JSON.parse(requestBody) as {
    password: string
    email: string
  }

  const { db } = await connectToDatabase()
  const collection = await db.collection('accounts')

  const account = (await collection.findOne({ email })) as TAccount

  if (!account) {
    return res.status(404).json({})
  }

  if (account.password !== password) {
    return res.status(409).json({})
  }

  return res.status(200).json({})
}
