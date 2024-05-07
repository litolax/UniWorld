import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../../../src/server/database'
import { TAccount } from '../../../../../src/types/TAccount'
import * as argon2 from 'argon2'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const requestBody = req.body
  if (!requestBody) return res.json({})

  const { email, oldPassword, newPassword } = JSON.parse(requestBody) as {
    email: string
    oldPassword: string
    newPassword: string
  }

  const { db } = await connectToDatabase()
  const collection = await db.collection('accounts')

  const account = (await collection.findOne({ email })) as TAccount

  if (!account) {
    return res.status(404).json({})
  }

  if (!(await argon2.verify(account.password, oldPassword))) {
    return res.status(409).json({})
  }

  await collection.updateOne({ email }, { $set: { password: await argon2.hash(newPassword) } })

  return res.status(200).json({})
}
