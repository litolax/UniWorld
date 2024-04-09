import { Button, Flex, Title } from '@mantine/core'
import { useRouter } from 'next/navigation'

export default function Header() {
  const router = useRouter()

  return (
    <header
      style={{
        backgroundColor: 'rgb(74, 74, 74)',
      }}
    >
      <Flex gap={'30%'} align={'center'} justify={'center'} h={'7vh'}>
        <Flex gap='xl' justify='flex-end' align='center' direction='row' wrap='nowrap'>
          <Title order={1} onClick={() => router.replace('/')}>
            UniWorld
          </Title>
        </Flex>
        <Flex gap='xl' justify='flex-end' align='center' direction='row' wrap='nowrap'>
          <Button onClick={() => router.replace('/signUp')}>Sign Up</Button>
          <Button onClick={() => router.replace('/signIn')}>Sign In</Button>
        </Flex>
      </Flex>
    </header>
  )
}
