import { ObjectID } from 'bson'
import { TAccount } from '../types/TAccount'
import { connectToDatabase } from './database'

export async function getAccountById(id: ObjectID): Promise<TAccount> {
  const { db } = await connectToDatabase()
  const collection = await db.collection('accounts')

  return (await collection.findOne({ _id: id })) as TAccount
}

export async function getAccountByEmail(email?: string): Promise<TAccount> {
  const { db } = await connectToDatabase()
  const collection = await db.collection('accounts')

  return (await collection.findOne({ email: email })) as TAccount
}
