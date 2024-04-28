import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../../src/server/database'
import { TAccount } from '../../../../src/types/TAccount'
import { Totp } from 'time2fa'
import * as qrcode from 'qrcode'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const requestBody = req.body
  if (!requestBody) return res.json({})

  const { email } = JSON.parse(requestBody) as {
    email: string
  }

  const { db } = await connectToDatabase()
  const collection = await db.collection('accounts')

  const account = (await collection.findOne({ email })) as TAccount

  if (!account) {
    return res.status(404).json({})
  }

  const key = Totp.generateKey({ issuer: 'UniWorld', user: email })

  await collection.updateOne({ email }, { $set: { mfaSecret: key.secret } })

  const qr = await qrcode.toDataURL(
    `otpauth://totp/${key.issuer}:${key.user}?issuer=${key.issuer}&period=30&secret=${key.secret}`,
  )

  return res.status(200).json({ qr, secret: key.secret })
}
