import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../src/server/database'
import { TAccount } from '../../../src/types/TAccount'
import { ObjectID } from 'bson'
import * as argon2 from 'argon2'
import { ESex } from '../../../src/types/ESex'
import { ELanguage } from '../../../src/types/ELanguage'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const requestBody = req.body
  if (!requestBody) return res.json({})

  const { username, password, email, sex } = JSON.parse(requestBody) as {
    username: string
    password: string
    email: string
    sex: ESex
  }

  const { db } = await connectToDatabase()
  const collection = await db.collection('accounts')

  const accounts = (await collection.find({ email }).toArray()) as TAccount[]

  if (accounts.length > 0) {
    return res.status(409).json({})
  }

  const hashedPassword = await argon2.hash(password)
  const account: TAccount = {
    _id: new ObjectID(),
    email,
    username,
    sex,
    password: hashedPassword,
    locale: ELanguage.RUSSIAN,
  }

  collection.insertOne(account)

  return res.status(200).json({})
}
