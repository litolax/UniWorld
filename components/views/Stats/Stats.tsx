import { useTranslation } from 'next-i18next'
import { Container, Flex, Paper, Title } from '@mantine/core'
import { DonutChart } from '@mantine/charts'

export default function Stats(props: {
  mans: number
  women: number
  organized: number
  unplanned: number
}) {
  const { t } = useTranslation('admin')
  const usersData = [
    { name: t('mans'), value: props.mans, color: 'indigo.6' },
    { name: t('women'), value: props.women, color: 'pink.6' },
  ]

  const eventsData = [
    { name: t('organized'), value: props.organized, color: 'grape.6' },
    { name: t('unplanned'), value: props.unplanned, color: 'lime.6' },
  ]

  return (
    <div style={{ marginTop: '8vh' }}>
      <Container>
        <Title ta='center'>{t('stats')}</Title>

        <Paper
          withBorder
          shadow='md'
          p={30}
          mt={30}
          radius='md'
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Flex direction='column' gap={'2rem'}>
            <Flex gap={'10rem'} justify='center' align='center' direction='row'>
              <Flex gap='xl' justify='center' align='center' direction='column'>
                <Title order={3}>{t('accounts')}</Title>
                <DonutChart withLabelsLine data={usersData} size={200} />
              </Flex>

              <Flex gap='xl' justify='center' align='center' direction='column'>
                <Title order={3}>{t('events')}</Title>
                <DonutChart withLabelsLine data={eventsData} size={200} />
              </Flex>
            </Flex>
          </Flex>
        </Paper>
      </Container>
    </div>
  )
}
