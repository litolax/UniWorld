import { Button, Flex, Title } from '@mantine/core'

export default function Header() {
  return (
    <header
      style={{
        backgroundColor: 'rgb(74, 74, 74)',
      }}
    >
      <Flex gap={'30%'} align={'center'} justify={'center'} h={'7vh'}>
        <Flex gap='xl' justify='flex-end' align='center' direction='row' wrap='nowrap'>
          <Title order={1}>UniWorld</Title>
          <Button>Home</Button>
          <Button>About</Button>
          <Button>Contact us</Button>
        </Flex>
        <Flex gap='xl' justify='flex-end' align='center' direction='row' wrap='nowrap'>
          <Button>Create account</Button>
          <Button>Login</Button>
        </Flex>
      </Flex>
    </header>
  )
}
