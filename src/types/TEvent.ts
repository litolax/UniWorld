import { ObjectID } from 'bson'
import { EEventType } from './EEventType'

export type TEvent = {
  _id: ObjectID
  createdBy: string
  title: string
  description: string
  location: string
  type: EEventType
  participants: ObjectID[]
  startDate?: Date
  endDate?: Date
  eventDate?: Date
}
