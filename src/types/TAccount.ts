import { ObjectID } from 'bson'

export type TAccount = {
  _id: ObjectID
  username: string
  email: string
  password: string
}
