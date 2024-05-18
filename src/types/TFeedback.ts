import { ObjectID } from 'bson'

export type TFeedback = {
  _id: ObjectID
  createdBy: string
  content: string
}
