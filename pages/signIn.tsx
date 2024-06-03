import {
  Anchor,
  Button,
  Container,
  Flex,
  Group,
  Modal,
  Paper,
  PasswordInput,
  PinInput,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'
import classes from '../styles/AuthenticationTitle.module.css'
import { useRouter } from 'next/navigation'
import { useForm } from '@mantine/form'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { sendErrorNotification } from '../src/utils'
import { signIn } from 'next-auth/react'
import { useDisclosure } from '@mantine/hooks'
import { useState } from 'react'
import Wrapper from '../components/Wrapper'

export default function SignIn() {
  const router = useRouter()
  const { t } = useTranslation('signIn')
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : t('fields.email.invalid')),
    },
  })
  const [opened, { open, close }] = useDisclosure(false)
  const [mfa, setMfa] = useState('')

  const signInAccount = async () => {
    const email = form.values.email
    const password = form.values.password

    const response = await fetch('/api/signIn', {
      method: 'POST',
      body: JSON.stringify({ email, password, mfa }),
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
        case 410: {
          sendErrorNotification(t('errors:invalid.mfaCode'))
          return
        }
        case 411: {
          sendErrorNotification(t('errors:youAre.banned'))
          return
        }
        default: {
          throw new Error(response.statusText)
        }
      }
    }

    await signIn('credentials', { email, password, redirect: false })

    // redirect to main after sign Up
    router.push('/main')
  }

  const validateMfa = async () => {
    const email = form.values.email

    const response = await fetch('/api/account/hasMfa', {
      method: 'POST',
      body: JSON.stringify({ email }),
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

    const mFAEnabled = (await response.json()).mFAEnabled

    if (mFAEnabled) {
      open()
    } else {
      signInAccount()
      close()
    }
  }

  return (
    <Wrapper>
      <div
        style={{
          marginTop: '15vh',
        }}
      >
        <Container size={460} my={40}>
          <Title ta='center' className={classes.title}>
            {t('welcome')}
          </Title>

          <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
            <form onSubmit={form.onSubmit(validateMfa)}>
              <Stack>
                <TextInput
                  required
                  label={t<string>('fields.email.label')}
                  placeholder={t<string>('fields.email.placeholder')}
                  value={form.values.email}
                  onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                  error={form.errors.email && t('fields.email.invalid')}
                  radius='md'
                />

                <PasswordInput
                  required
                  label={t<string>('fields.password.label')}
                  placeholder={t<string>('fields.password.placeholder')}
                  value={form.values.password}
                  onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                  radius='md'
                />
              </Stack>

              <Group justify='space-between' mt='xl'>
                <Anchor
                  component='button'
                  type='button'
                  c='dimmed'
                  size='xs'
                  onClick={() => router.push('/signUp')}
                >
                  {t('doNotHaveAccount')}
                </Anchor>
                <Button type='submit' radius='xl'>
                  {t('signIn')}
                </Button>
              </Group>
            </form>
          </Paper>
        </Container>
      </div>
      <Modal opened={opened} onClose={close} title={t('mfaModalTitle')} centered>
        <Flex direction={'column'} gap={'1rem'}>
          <Title order={5}>{t('mfaCode')}</Title>
          <PinInput length={6} type='number' value={mfa} onChange={(e) => setMfa(e)} />
          <Button onClick={signInAccount}>{t('submit')}</Button>
        </Flex>
      </Modal>
    </Wrapper>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'ru', ['common', 'signIn', 'errors'])),
    },
  }
}
