import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../../src/server/database'
import { TAccount } from '../../../../src/types/TAccount'
import { Totp } from 'time2fa'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const requestBody = req.body
  if (!requestBody) return res.json({})

  const { email, submitCode } = JSON.parse(requestBody) as {
    email: string
    submitCode: string
  }

  const { db } = await connectToDatabase()
  const collection = await db.collection('accounts')

  const account = (await collection.findOne({ email })) as TAccount

  if (!account) {
    return res.status(404).json({})
  }

  let valid: boolean = false
  try {
    valid = Totp.validate({ passcode: submitCode, secret: account.mfaSecret ?? '' })
  } catch (e) {
    console.error(e)
  }

  if (valid) {
    await collection.updateOne({ email }, { $set: { mFAEnabled: true } })
  }

  return res.status(200).json({ result: valid })
}
