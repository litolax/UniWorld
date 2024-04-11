import { ObjectID } from 'bson'
import { ESex } from './ESex'

export type TAccount = {
  _id: ObjectID
  username: string
  email: string
  password: string
  sex: ESex
}
