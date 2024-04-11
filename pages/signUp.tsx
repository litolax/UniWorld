import {
  Anchor,
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Radio,
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
import { getSexFromString } from '../src/types/ESex'

export default function SignUp() {
  const router = useRouter()
  const { t } = useTranslation('signUp')
  const form = useForm({
    initialValues: {
      email: '',
      username: '',
      password: '',
      sex: 'male',
    },

    validate: {
      username: (val) => (val.length < 4 ? 'fields.username.tooLittle' : null),
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'fields.email.invalid'),
      password: (val) => (val.length < 6 ? 'fields.password.tooLittle' : null),
      sex: (val) => (!val ? 'fields.sex.shouldBeSelected' : null),
    },
  })

  const signUp = async () => {
    const email = form.values.email
    const username = form.values.username
    const password = form.values.password
    const sex = getSexFromString(form.values.sex)

    const response = await fetch('/api/signUp', {
      method: 'POST',
      body: JSON.stringify({ username, password, email, sex }),
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
    router.push('/signIn')
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
                  withAsterisk
                  label={t<string>('fields.username.label')}
                  placeholder={t<string>('fields.username.placeholder')}
                  value={form.values.username}
                  error={form.errors.username && t<string>(form.errors.username.toString())}
                  onChange={(event) => form.setFieldValue('username', event.currentTarget.value)}
                  radius='md'
                />

                <TextInput
                  withAsterisk
                  label={t<string>('fields.email.label')}
                  placeholder={t<string>('fields.email.placeholder')}
                  value={form.values.email}
                  onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                  error={form.errors.email && t<string>(form.errors.email.toString())}
                  radius='md'
                />

                <PasswordInput
                  withAsterisk
                  label={t<string>('fields.password.label')}
                  placeholder={t<string>('fields.password.placeholder')}
                  value={form.values.password}
                  onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                  error={form.errors.password && t<string>(form.errors.password.toString())}
                  radius='md'
                />
              </Stack>

              <Radio.Group
                label={t('common:sex.label')}
                withAsterisk
                mt={'xs'}
                value={form.values.sex}
                defaultValue={'male'}
                onChange={(value) => form.setFieldValue('sex', value)}
              >
                <Group>
                  <Radio value={'male'} label={t('common:sex.male')} />
                  <Radio value={'female'} label={t('common:sex.female')} />
                </Group>
              </Radio.Group>

              <Group justify='space-between' mt='xl'>
                <Anchor
                  component='button'
                  type='button'
                  c='dimmed'
                  onClick={() => router.push('/signIn')}
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
