import { ObjectID } from 'bson'
import { ESex } from './ESex'
import { ELanguage } from './ELanguage'
import { EAccountModerationState } from './EAccountModerationState'

export type TAccount = {
  _id: ObjectID
  username: string
  email: string
  password: string
  sex: ESex
  locale: ELanguage
  mFAEnabled: boolean
  mfaSecret?: string
  admin: boolean
  moderationState: EAccountModerationState
}
