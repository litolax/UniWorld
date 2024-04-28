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
          <Button onClick={() => setDisableModalState(true)}>Выключить</Button>
        </>
      )
    } else {
      return (
        <>
          <Button onClick={enable}>Включить</Button>
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
      sendErrorNotification('Двухфакторная аутентификация', 'Код введен не верно')
      return
    }

    setState(true)
    setQRCode('')
    setSubmitCode('')

    sendSuccessNotification('Двухфакторная аутентификация', 'Успешно включена')
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
      sendSuccessNotification('Двухфакторная аутентификация', 'Успешно отключена')
      setState(false)
      setDisableModalState(false)
      setQRCode('')
      setSubmitCode('')
      setPassword('')
    } else {
      sendErrorNotification('Двухфакторная аутентификация', 'Пароль или код введены не верно')
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
        Состояние двухфакторной аутентификации:{' '}
        {
          <Badge variant='light' color={state ? 'green' : 'red'}>
            {state ? 'Включена' : 'Выключена'}
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
              Отсканируйте QR код или введите код в приложении
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
              Введите 2FA код
            </Title>

            <PinInput
              length={6}
              type='number'
              value={submitCode}
              onChange={(e) => setSubmitCode(e)}
            />
          </div>

          <Flex gap={'1rem'}>
            <Button onClick={submit}>Подтвердить</Button>
            <Button onClick={cancel}>Отменить</Button>
          </Flex>
        </>
      )}

      {renderButtons()}

      <Modal
        opened={disableModalState}
        onClose={() => setDisableModalState(false)}
        title='Выключение двухфакторной аутентификации'
      >
        <Flex direction={'column'} gap={'1rem'}>
          <PasswordInput
            required
            label={'Пароль'}
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
            radius='md'
          />

          <Text>Введите 2FA код</Text>
          <PinInput
            length={6}
            type='number'
            value={submitCode}
            onChange={(e) => setSubmitCode(e)}
          />

          <Button onClick={disable}>Подтвердить</Button>
        </Flex>
      </Modal>
    </div>
  )
}

export default MFA
