import {
  Badge,
  Button,
  Flex,
  Image,
  Modal,
  PasswordInput,
  PinInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { useTranslation } from 'next-i18next'
import { useContext, useState } from 'react'
import { StoreContext } from '../../../src/stores/CombinedStores'
import { sendErrorNotification, sendSuccessNotification } from '../../../src/utils'

export const MFA = (): JSX.Element => {
  const { t } = useTranslation('main')

  const context = useContext(StoreContext)
  const account = context.accountStore.account

  const [state, setState] = useState(account?.mFAEnabled ?? false)
  const [QRCode, setQRCode] = useState('')
  const [secret, setSecret] = useState('')
  const [submitCode, setSubmitCode] = useState('')
  const [password, setPassword] = useState('')
  const [disableModalState, setDisableModalState] = useState(false)

  const renderButtons = () => {
    if (QRCode) {
      return <></>
    }

    if (state) {
      return (
        <>
          <Button onClick={() => setDisableModalState(true)}>
            {t('ui.views.main.sections.settings.mfa.disable')}
          </Button>
        </>
      )
    } else {
      return (
        <>
          <Button onClick={enable}>{t('ui.views.main.sections.settings.mfa.enable')}</Button>
        </>
      )
    }
  }

  const enable = async () => {
    const email = account?.email
    const response = await fetch('/api/mfa/enable', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })

    if (!response.ok) throw new Error(response.statusText)
    const result = await response.json()

    setQRCode(result.qr)
    setSecret(result.secret)
  }

  const submit = async () => {
    const email = account?.email

    const response = await fetch('/api/mfa/submit', {
      method: 'POST',
      body: JSON.stringify({ email, submitCode }),
    })

    if (!response.ok) throw new Error(response.statusText)
    const result = (await response.json()).result as boolean

    if (!result) {
      sendErrorNotification(
        t('ui.views.main.sections.settings.mfa.header'),
        t<string>('ui.views.main.sections.settings.mfa.notifications.invalidCode'),
      )
      return
    }

    setState(true)
    setQRCode('')
    setSubmitCode('')

    sendSuccessNotification(
      t('ui.views.main.sections.settings.mfa.header'),
      t<string>('ui.views.main.sections.settings.mfa.notifications.enabledSuccessfully'),
    )
  }

  const disable = async () => {
    const email = account?.email

    const response = await fetch('/api/mfa/disable', {
      method: 'POST',
      body: JSON.stringify({ email, password, submitCode }),
    })

    if (!response.ok) throw new Error(response.statusText)

    const result = (await response.json()).result as boolean

    if (result) {
      sendSuccessNotification(
        t('ui.views.main.sections.settings.mfa.header'),
        t<string>('ui.views.main.sections.settings.mfa.notifications.disabledSuccessfully'),
      )

      setState(false)
      setDisableModalState(false)
      setQRCode('')
      setSubmitCode('')
      setPassword('')
    } else {
      sendErrorNotification(
        t('ui.views.main.sections.settings.mfa.header'),
        t<string>('ui.views.main.sections.settings.mfa.notifications.invalidPasswordOrCode'),
      )
    }
  }

  const cancel = async () => {
    setState(false)
    setQRCode('')
    setSubmitCode('')
    setPassword('')
  }

  return (
    <div>
      <Title order={1} mb={'2rem'}>
        {t('ui.views.main.sections.settings.mfa.header')}
      </Title>

      <Title order={4} mb={'1rem'}>
        {t('ui.views.main.sections.settings.mfa.mfaState.title')}:{' '}
        {
          <Badge variant='light' color={state ? 'green' : 'red'}>
            {t(
              state
                ? 'ui.views.main.sections.settings.mfa.mfaState.enabled'
                : 'ui.views.main.sections.settings.mfa.mfaState.disabled',
            )}
          </Badge>
        }
      </Title>

      {QRCode && (
        <>
          <div
            style={{
              marginBottom: '1rem',
            }}
          >
            <Title order={5} mb={'0.5rem'}>
              {t('ui.views.main.sections.settings.mfa.scanQr')}
            </Title>

            <Flex direction={'column'} gap={'1rem'}>
              <Image src={QRCode} alt={'QRCode'} w={'11rem'} />
              <TextInput w={'11rem'} readOnly value={secret} />
            </Flex>
          </div>

          <div
            style={{
              width: '30rem',
              marginBottom: '1rem',
            }}
          >
            <Title order={5} mb={'0.5rem'}>
              {t('ui.views.main.sections.settings.mfa.enterCode')}
            </Title>

            <PinInput
              length={6}
              type='number'
              value={submitCode}
              onChange={(e) => setSubmitCode(e)}
            />
          </div>

          <Flex gap={'1rem'}>
            <Button onClick={submit}>{t('ui.views.main.sections.settings.mfa.submit')}</Button>
            <Button onClick={cancel}>{t('ui.views.main.sections.settings.mfa.cancel')}</Button>
          </Flex>
        </>
      )}

      {renderButtons()}

      <Modal
        opened={disableModalState}
        onClose={() => setDisableModalState(false)}
        title={t('ui.views.main.sections.settings.mfa.disablingMfa')}
      >
        <Flex direction={'column'} gap={'1rem'}>
          <PasswordInput
            required
            label={t('ui.views.main.sections.settings.mfa.password')}
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
            radius='md'
          />

          <Text>{t('ui.views.main.sections.settings.mfa.enterCode')}</Text>
          <PinInput
            length={6}
            type='number'
            value={submitCode}
            onChange={(e) => setSubmitCode(e)}
          />

          <Button onClick={disable}>{t('ui.views.main.sections.settings.mfa.submit')}</Button>
        </Flex>
      </Modal>
    </div>
  )
}

export default MFA
