import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import { getAccountByEmail } from './account'
import { TAccount } from '../types/TAccount'
import { ObjectID } from 'bson'
import { ELanguage } from '../types/ELanguage'
import { EAccountModerationState } from '../types/EAccountModerationState'
import { ESex } from '../types/ESex'
import * as argon2 from 'argon2'

dotenv.config({ path: './.env.local' })

const MONGODB_URI = process.env.MONGODB_URI ?? ''
const MONGODB_DB = process.env.DB_NAME ?? ''
const dev = process.env.NODE_ENV !== 'production'

if (!MONGODB_URI) {
  throw new Error('Define the MONGODB_URI environmental variable')
}

if (!MONGODB_DB) {
  throw new Error('Define the MONGODB_DB environmental variable')
}

let cachedClient: any = null
let cachedDb: any = null

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return {
      client: cachedClient,
      db: cachedDb,
    }
  }

  const client = new MongoClient(
    dev
      ? `${process.env.MONGODB_URI}`
      : `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URI}`,
  )
  await client.connect()
  const db = client.db(MONGODB_DB)

  cachedClient = client
  cachedDb = db

  let adminAccount = JSON.parse(
    JSON.stringify(await getAccountByEmail('admin@mail.ru')),
  ) as TAccount

  if (!adminAccount) {
    adminAccount = {
      _id: new ObjectID(),
      email: 'admin@mail.ru',
      username: 'admin',
      sex: ESex.Male,
      password: await argon2.hash('admin'),
      locale: ELanguage.RUSSIAN,
      mFAEnabled: false,
      admin: true,
      moderationState: EAccountModerationState.Unbanned,
    }

    await db.collection('accounts').insertOne(adminAccount)
  }

  return {
    client: cachedClient,
    db: cachedDb,
  }
}
