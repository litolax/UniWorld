import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../../src/server/database'
import { TAccount } from '../../../../src/types/TAccount'
import { Totp } from 'time2fa'
import * as argon2 from 'argon2'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const requestBody = req.body
  if (!requestBody) return res.json({})

  const { email, password, submitCode } = JSON.parse(requestBody) as {
    email: string
    password: string
    submitCode: string
  }

  const { db } = await connectToDatabase()
  const collection = await db.collection('accounts')

  const account = (await collection.findOne({ email })) as TAccount

  if (!account) {
    return res.status(404).json({})
  }

  let valid: boolean = true
  if (account.mFAEnabled) {
    try {
      if (submitCode) {
        valid = Totp.validate({ passcode: submitCode, secret: account.mfaSecret ?? '' })
      } else {
        valid = false
      }
    } catch (e) {
      console.error(e)
    }
  }

  if (!(await argon2.verify(account.password, password))) {
    valid = false
  }

  if (valid) {
    await collection.updateOne({ email }, { $set: { mFAEnabled: false, mfaSecret: null } })
  }

  return res.status(200).json({ result: valid })
}
