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
import { TAccount } from '../src/types/TAccount'
import { ObjectID } from 'bson'
import { sendErrorNotification } from '../src/utils'

export default function SignUp() {
  const router = useRouter()
  const { t } = useTranslation('signUp')
  const form = useForm({
    initialValues: {
      email: '',
      username: '',
      password: '',
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : t('email.invalid')),
      password: (val) => (val.length < 6 ? t('password.tooLittle') : null),
    },
  })

  const signUp = async () => {
    const email = form.values.email
    const username = form.values.username
    const password = form.values.password

    const response = await fetch('/api/signUp', {
      method: 'POST',
      body: JSON.stringify({ username, password, email }),
    })

    if (!response.ok) {
      switch (response.status) {
        case 409: {
          sendErrorNotification(t('errors:already.accountExists'))
          return
        }
        default: {
          throw new Error(response.statusText)
        }
      }
    }

    // redirect to sign In after sign Up
    router.replace('/signIn')
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
            <form onSubmit={form.onSubmit(signUp)}>
              <Stack>
                <TextInput
                  required
                  label={t<string>('fields.name.label')}
                  placeholder={t<string>('fields.name.placeholder')}
                  value={form.values.username}
                  onChange={(event) => form.setFieldValue('username', event.currentTarget.value)}
                  radius='md'
                />

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
                  error={form.errors.password && t('fields.password.tooLittle')}
                  radius='md'
                />
              </Stack>

              <Group justify='space-between' mt='xl'>
                <Anchor
                  component='button'
                  type='button'
                  c='dimmed'
                  onClick={() => router.replace('/signIn')}
                  size='xs'
                >
                  {t('alreadyHaveAnAccount')}
                </Anchor>
                <Button type='submit' radius='xl'>
                  {t('signUp')}
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
      ...(await serverSideTranslations(locale || 'ru', ['common', 'errors', 'signUp'])),
    },
  }
}
