import { notifications } from '@mantine/notifications'
import { EEventType } from './types/EEventType'
import { EAccountModerationState } from './types/EAccountModerationState'

export const sendNotification = (
  title: string,
  message: string = '',
  closeDelay: number = 3000,
) => {
  notifications.show({
    title,
    message,
    withCloseButton: false,
    withBorder: true,
    autoClose: closeDelay,
  })
}

export const sendErrorNotification = (
  title: string,
  message: string = '',
  closeDelay: number = 3000,
) => {
  notifications.show({
    title,
    message,
    withCloseButton: false,
    withBorder: true,
    autoClose: closeDelay,
    color: 'red',
  })
}

export const sendSuccessNotification = (
  title: string,
  message: string = '',
  closeDelay: number = 3000,
) => {
  notifications.show({
    title,
    message,
    withCloseButton: false,
    withBorder: true,
    autoClose: closeDelay,
    color: 'green',
  })
}

export const uuidv4 = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const dataFix = (obj: any) => {
  if (!obj) return
  const newObj: any = {}
  Object.keys(obj).forEach((key) => {
    let value = obj[key]
    if (value !== null) {
      // If array, loop...
      if (Array.isArray(value)) {
        value = value.map((item) => dataFix(item))
      }
      // ...if property is date/time, stringify/parse...
      else if (typeof value === 'object' && typeof value.getMonth === 'function') {
        value = JSON.parse(JSON.stringify(value))
      }
      // ...and if a deep object, loop.
      else if (typeof value === 'object') {
        value = dataFix(value)
      }
    }

    newObj[key] = value
  })
  return newObj
}

export const generatePassword = (length: number): string => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+'
  let password = ''

  for (let i = 0; i < length; ++i) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    password += charset[randomIndex]
  }

  return password
}

export const chunk = <T>(array: T[], size: number): T[][] => {
  if (!array.length) {
    return []
  }
  const head = array.slice(0, size)
  const tail = array.slice(size)
  return [head, ...chunk(tail, size)]
}

export const truncateText = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...'
  }

  return text
}

export const getStringFromEventType = (type: EEventType) =>
  type === EEventType.Organized ? 'fields.types.organized' : 'fields.types.unplanned'

export const getStringFromAccountModerationState = (state: EAccountModerationState) => {
  switch (state) {
    case EAccountModerationState.Banned: {
      return 'moderation.account.states.banned'
    }
    case EAccountModerationState.Unbanned: {
      return 'moderation.account.states.unbanned'
    }
    default: {
      return 'moderation.account.states.none'
    }
  }
}
