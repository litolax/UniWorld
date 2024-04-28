import {
  Anchor,
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'
import classes from '../styles/AuthenticationTitle.module.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useRouter } from 'next/navigation'
import { useForm } from '@mantine/form'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { sendErrorNotification } from '../src/utils'
import { signIn } from 'next-auth/react'
import { useEffect } from 'react'
import { Totp } from 'time2fa'
import * as qrcode from 'qrcode'

export default function SignIn() {
  useEffect(() => {
    const key = Totp.generateKey({ issuer: 'UniWorld', user: 'litolax' })

    console.log(key)

    qrcode.toDataURL(
      `otpauth://totp/${key.issuer}:${key.user}?issuer=${key.issuer}&period=30&secret=${key.secret}`,
      (err, url) => {
        console.log(url) // Returns a Data URI containing a representation of the QR Code image.
      },
    )
  }, [])
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

  const signInAccount = async () => {
    const email = form.values.email
    const password = form.values.password

    const response = await fetch('/api/signIn', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
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

    await signIn('credentials', { email, password, redirect: false })

    // redirect to main after sign Up
    router.push('/main')
  }

  return (
    <div>
      <Header />
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
            <form onSubmit={form.onSubmit(signInAccount)}>
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
      <Footer />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'ru', ['common', 'signIn', 'errors'])),
    },
  }
}
