import { Button, Select, Title } from '@mantine/core'
import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import { ELanguage } from '../../../src/types/ELanguage'
import { useRouter } from 'next/router'
import { API } from '../../../src/server/API'
import { TAccount } from '../../../src/types/TAccount'

export const Main = (props: { account: TAccount }): JSX.Element => {
  const [language, setLanguage] = useState<ELanguage | null>(
    props.account?.locale ?? ELanguage.RUSSIAN,
  )
  const languages = [
    { value: 'ru', label: 'Русский' },
    { value: 'en', label: 'English' },
  ]
  const router = useRouter()

  const { t } = useTranslation('main')

  const selectLanguage = async (newLanguage: string | null) => {
    newLanguage = newLanguage ?? 'ru'
    setLanguage(newLanguage as ELanguage)
    await API.updateAccountLocale(props.account!.email, newLanguage)
  }

  const saveButtons = () => {
    router.reload()
  }

  return (
    <div>
      <Title order={1} mb={'1rem'}>
        {t('ui.views.main.sections.settings.main.header')}
      </Title>
      <div
        style={{
          width: '200px',
          marginBottom: '1.5rem',
        }}
      >
        <Select
          label={t('ui.views.main.sections.settings.main.language.title')}
          placeholder={t<string>('ui.views.main.sections.settings.main.language.placeholder')}
          nothingFoundMessage={t('ui.views.main.sections.settings.main.language.nothingFound')}
          value={language}
          data={languages}
          onChange={selectLanguage}
          checkIconPosition='right'
        />
      </div>
      <Button onClick={saveButtons}>{t('ui.views.main.sections.settings.save')}</Button>
    </div>
  )
}

export default Main
