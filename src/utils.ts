import { notifications } from '@mantine/notifications'

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
