import { ObjectID } from 'bson'
import { ESex } from './ESex'
import { ELanguage } from './ELanguage'

export type TAccount = {
  _id: ObjectID
  username: string
  email: string
  password: string
  sex: ESex
  locale: ELanguage
  mFAEnabled: boolean
  mfaSecret?: string
}
