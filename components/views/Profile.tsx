import { Avatar, Button, Group, Input, Paper, Radio, Title } from '@mantine/core'
import { useTranslation } from 'next-i18next'
import { ESex } from '../../src/types/ESex'
import { useState } from 'react'
import { sendErrorNotification, sendSuccessNotification } from '../../src/utils'
import { TAccount } from '../../src/types/TAccount'

const mockName = 'John Doe'
const mockEmail = 'JohnDoe@mail.me'

export const Profile = (props: { account: TAccount }): JSX.Element => {
  const { t } = useTranslation('main')

  const [editorMode, setEditorMode] = useState(false)
  const [username, setUsername] = useState(props.account?.username)
  const [sex, setSex] = useState(props.account?.sex)

  const avatarUrl = sex === ESex.Male ? 'avatar-10.png' : 'avatar-8.png'

  const updateProfile = async () => {
    const response = await fetch('/api/account/updateProfile', {
      method: 'POST',
      body: JSON.stringify({ email: props.account?.email, username, sex }),
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

    sendSuccessNotification(t('ui.views.main.sections.profile.successfullyUpdated'))
    setEditorMode(false)
  }

  return (
    <div style={{ marginTop: '15vh' }}>
      <Paper
        radius='xl'
        withBorder
        p={'xl'}
        style={{
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '50vw',
        }}
      >
        <Avatar
          src={
            'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/' + avatarUrl
          }
          size={120}
          radius={120}
          mx='auto'
        />

        {editorMode ? (
          <>
            <Group gap={'xl'}>
              <Title ta='center' fw={500} mt='md' order={2}>
                {t('common:username')}:
              </Title>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  paddingTop: '20px',
                  width: '20rem',
                }}
              />
            </Group>

            <Group gap={'xl'}>
              <Title ta='center' fw={500} mt='md' order={3}>
                {t('common:sex.label')}:
              </Title>
              <Radio.Group
                withAsterisk
                mt={'md'}
                value={sex === ESex.Male ? 'male' : 'female'}
                onChange={(e) => (e === 'male' ? setSex(ESex.Male) : setSex(ESex.Female))}
                style={{
                  paddingTop: '5px',
                }}
              >
                <Group>
                  <Radio value={'male'} label={t('common:sex.male')} />
                  <Radio value={'female'} label={t('common:sex.female')} />
                </Group>
              </Radio.Group>
            </Group>

            <br />

            <Button onClick={updateProfile}>{t('ui.views.main.sections.profile.save')}</Button>
          </>
        ) : (
          <>
            <Title ta='center' fw={500} mt='md' order={2}>
              {t('common:username')}: {username ?? mockName}
            </Title>
            <Title ta='center' fw={500} mt='md' order={3}>
              {t('common:email')}: {props.account?.email ?? mockEmail}
            </Title>
            <Title ta='center' fw={500} mt='md' order={3}>
              {t('common:sex.label')}: {t(`common:sex.${sex === ESex.Male ? 'male' : 'female'}`)}
            </Title>

            <Button onClick={() => setEditorMode(true)}>
              {t('ui.views.main.sections.profile.editMode')}
            </Button>
          </>
        )}
      </Paper>
    </div>
  )
}
