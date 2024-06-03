import { Button, Flex, PasswordInput, Title } from '@mantine/core'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import { sendErrorNotification, sendSuccessNotification } from '../../../src/utils'
import { TAccount } from '../../../src/types/TAccount'

export const Password = (props: { account: TAccount }): JSX.Element => {
  const { t } = useTranslation('main')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [repeatedNewPassword, setRepeatedNewPassword] = useState('')

  const changePassword = async () => {
    if (newPassword.length < 6) {
      sendErrorNotification(
        t('ui.views.main.sections.settings.password.errors.newPasswordTooLittle'),
      )
      return
    }

    if (newPassword != repeatedNewPassword) {
      sendErrorNotification(
        t('ui.views.main.sections.settings.password.errors.newPasswordsMismatch'),
      )
      return
    }

    const response = await fetch('/api/account/password/change', {
      method: 'POST',
      body: JSON.stringify({ email: props.account.email, oldPassword, newPassword }),
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

    sendSuccessNotification(t('ui.views.main.sections.settings.password.successfullyChanged'))
    setOldPassword('')
    setNewPassword('')
    setRepeatedNewPassword('')
  }

  const resetPassword = async () => {
    const response = await fetch('/api/account/password/reset', {
      method: 'POST',
      body: JSON.stringify({
        email: props.account.email,
        subject: t('ui.views.main.sections.settings.password.reset.email.subject'),
        text: t('ui.views.main.sections.settings.password.reset.email.text'),
      }),
    })

    if (!response.ok) {
      switch (response.status) {
        case 404: {
          sendErrorNotification(t('errors:notFound.account.email'))
          return
        }
        default: {
          throw new Error(response.statusText)
        }
      }
    }

    sendSuccessNotification(t('ui.views.main.sections.settings.password.reset.success'))
  }

  return (
    <div>
      <Title order={1} mb={'1rem'}>
        {t('ui.views.main.sections.settings.password.header')}
      </Title>

      <Title order={3} mb={'1rem'}>
        {t('ui.views.main.sections.settings.password.changePassword')}
      </Title>

      <Flex
        direction={'column'}
        gap={'0.5rem'}
        style={{
          width: '30rem',
          marginBottom: '1rem',
        }}
      >
        <Title order={5}>{t('ui.views.main.sections.settings.password.oldPassword')}</Title>
        <PasswordInput value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />

        <Title order={5}>{t('ui.views.main.sections.settings.password.newPassword')}</Title>
        <PasswordInput value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

        <Title order={5}>{t('ui.views.main.sections.settings.password.repeatNewPassword')}</Title>
        <PasswordInput
          value={repeatedNewPassword}
          onChange={(e) => setRepeatedNewPassword(e.target.value)}
        />
      </Flex>

      <Flex gap={'1rem'}>
        <Button onClick={changePassword}>
          {t('ui.views.main.sections.settings.password.changePasswordButton')}
        </Button>

        <Button onClick={resetPassword}>
          {t('ui.views.main.sections.settings.password.reset.button')}
        </Button>
      </Flex>
    </div>
  )
}

export default Password
