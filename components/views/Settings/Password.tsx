import { Button, Flex, PasswordInput, Title } from '@mantine/core'
import { useTranslation } from 'next-i18next'
import { useContext, useState } from 'react'
import { StoreContext } from '../../../src/stores/CombinedStores'
import { sendErrorNotification, sendSuccessNotification } from '../../../src/utils'

export const Password = (): JSX.Element => {
  const context = useContext(StoreContext)
  const { t } = useTranslation('main')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [repeatedNewPassword, setRepeatedNewPassword] = useState('')

  const changePassword = async () => {
    const email = context.accountStore.account?.email

    if (newPassword.length < 6) {
      sendErrorNotification('Новый пароль слишком короткий')
      return
    }

    if (newPassword != repeatedNewPassword) {
      sendErrorNotification('Новые пароли не совпадают')
      return
    }

    const response = await fetch('/api/account/password/change', {
      method: 'POST',
      body: JSON.stringify({ email, oldPassword, newPassword }),
    })

    if (!response.ok) {
      switch (response.status) {
        case 404: {
          sendErrorNotification(t('errors:notFound.account.email'))
          return
        }
        case 409: {
          sendErrorNotification(t('errors:notFound.account.password'))
          return
        }
        default: {
          throw new Error(response.statusText)
        }
      }
    }

    sendSuccessNotification('Пароль успешно изменен')
    setOldPassword('')
    setNewPassword('')
    setRepeatedNewPassword('')
  }

  return (
    <div>
      <Title order={1} mb={'1rem'}>
        {t('ui.views.main.sections.settings.password.header')}
      </Title>

      <Title order={3} mb={'1rem'}>
        {t('Смена пароля')}
      </Title>

      <Flex
        direction={'column'}
        gap={'0.5rem'}
        style={{
          width: '30rem',
          marginBottom: '1rem',
        }}
      >
        <Title order={5}>{t('Старый пароль')}</Title>
        <PasswordInput value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />

        <Title order={5}>{t('Новый пароль')}</Title>
        <PasswordInput value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

        <Title order={5}>{t('Повторение нового пароля')}</Title>
        <PasswordInput
          value={repeatedNewPassword}
          onChange={(e) => setRepeatedNewPassword(e.target.value)}
        />
      </Flex>

      <Button onClick={changePassword}>Изменить пароль</Button>
    </div>
  )
}

export default Password
