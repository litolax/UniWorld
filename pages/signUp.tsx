import {
  Anchor,
  Button,
  Checkbox,
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

export default function SignUp() {
  const router = useRouter()
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  })

  return (
    <div>
      <Header />
      <div
        style={{
          marginTop: '15vh',
        }}
      >
        <Container size={420} my={40}>
          <Title ta='center' className={classes.title}>
            Welcome to UniWorld!
          </Title>

          <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
            <form onSubmit={form.onSubmit(() => {})}>
              <Stack>
                <TextInput
                  required
                  label='Name'
                  placeholder='Your name'
                  value={form.values.name}
                  onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
                  radius='md'
                />

                <TextInput
                  required
                  label='Email'
                  placeholder='hello@mantine.dev'
                  value={form.values.email}
                  onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                  error={form.errors.email && 'Invalid email'}
                  radius='md'
                />

                <PasswordInput
                  required
                  label='Password'
                  placeholder='Your password'
                  value={form.values.password}
                  onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                  error={form.errors.password && 'Password should include at least 6 characters'}
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
                  Already have an account? Sign In
                </Anchor>
                <Button type='submit' radius='xl'>
                  Register
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
