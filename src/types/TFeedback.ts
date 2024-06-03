import { ObjectID } from 'bson'
import { EModerationState } from './EModerationState'

export type TFeedback = {
  _id: ObjectID
  createdBy: string
  content: string
  moderationState: EModerationState
}
