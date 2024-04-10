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
