import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../src/server/database'
import { TAccount } from '../../../src/types/TAccount'
import * as argon2 from 'argon2'
import { Totp } from 'time2fa'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const requestBody = req.body
  if (!requestBody) return res.json({})

  const { password, email, mfa } = JSON.parse(requestBody) as {
    password: string
    email: string
    mfa: string
  }

  const { db } = await connectToDatabase()
  const collection = await db.collection('accounts')

  const account = (await collection.findOne({ email })) as TAccount

  if (!account) {
    return res.status(404).json({})
  }

  if (!(await argon2.verify(account.password, password))) {
    return res.status(409).json({})
  }

  let valid: boolean = false
  if (account.mFAEnabled) {
    try {
      valid = Totp.validate({ passcode: mfa, secret: account.mfaSecret ?? '' })
    } catch (e) {
      console.error(e)
    }
  }

  if (account.mFAEnabled && !valid) {
    return res.status(410).json({})
  }

  return res.status(200).json({})
}
