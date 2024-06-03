import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../../src/server/database'
import { ObjectID } from 'bson'
import { TAccount } from '../../../../src/types/TAccount'
import { EAccountModerationState } from '../../../../src/types/EAccountModerationState'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const requestBody = req.body
  if (!requestBody) return res.json({})

  const { account, method } = JSON.parse(requestBody) as {
    account: TAccount
    method: string
  }

  const { db } = await connectToDatabase()
  const collection = await db.collection('accounts')

  await collection.updateOne(
    { _id: new ObjectID(account._id) },
    {
      $set: {
        moderationState:
          method === 'ban' ? EAccountModerationState.Banned : EAccountModerationState.Unbanned,
      },
    },
  )

  return res.status(200).json({})
}
