import { Button, Flex, Paper, Select, Textarea, TextInput, Title } from '@mantine/core'
import { useTranslation } from 'next-i18next'
import { DateInput, DateTimePicker } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { EEventType } from '../../../src/types/EEventType'
import { sendSuccessNotification } from '../../../src/utils'
import { useContext } from 'react'
import { StoreContext } from '../../../src/stores/CombinedStores'

export const Create = (): JSX.Element => {
  const context = useContext(StoreContext)
  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      location: '',
      type: EEventType.Organized.toString(),
      startDate: new Date(),
      endDate: new Date(),
      eventDate: new Date(),
    },

    validate: {},
  })
  const { t } = useTranslation('main')

  const createEvent = async () => {
    const values = form.values
    const { title, description, location, type, startDate, endDate, eventDate } = values

    const response = await fetch('/api/event', {
      method: 'POST',
      body: JSON.stringify({
        createdBy: context.accountStore.account?.email,
        title,
        description,
        location,
        type,
        startDate,
        endDate,
        eventDate,
      }),
    })

    if (!response.ok) {
      switch (response.status) {
        default: {
          throw new Error(response.statusText)
        }
      }
    }

    sendSuccessNotification(t('ui.views.main.sections.event.create.createdSuccessfully'))
    form.reset()
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '4rem',
      }}
    >
      <Title order={1} mb={'1rem'}>
        {t('ui.views.main.sections.event.create.header')}
      </Title>

      <form
        onSubmit={form.onSubmit(createEvent)}
        style={{
          width: '25rem',
        }}
      >
        <Paper radius='xs' withBorder p={'md'}>
          <Flex direction={'column'} justify='space-between' gap={15} mb={'1.5rem'}>
            <TextInput
              label={t('ui.views.main.sections.event.create.fields.names.title')}
              value={form.values.title}
              onChange={(event) => form.setFieldValue('title', event.currentTarget.value)}
            />
            <Textarea
              label={t('ui.views.main.sections.event.create.fields.names.description')}
              autosize
              maxRows={3}
              value={form.values.description}
              onChange={(event) => form.setFieldValue('description', event.currentTarget.value)}
            />
            <TextInput
              label={t('ui.views.main.sections.event.create.fields.names.location')}
              value={form.values.location}
              onChange={(event) => form.setFieldValue('location', event.currentTarget.value)}
            />
            <Select
              label={t('ui.views.main.sections.event.create.fields.names.type')}
              value={form.values.type}
              data={[
                {
                  value: EEventType.Organized.toString(),
                  label: t('ui.views.main.sections.event.create.fields.names.organized'),
                },
                {
                  value: EEventType.Unplanned.toString(),
                  label: t('ui.views.main.sections.event.create.fields.names.unplanned'),
                },
              ]}
              onChange={(value) =>
                form.setFieldValue('type', value ?? EEventType.Organized.toString())
              }
              checkIconPosition='right'
            />
            {form.values.type === EEventType.Organized.toString() && (
              <>
                <DateTimePicker
                  label={t('ui.views.main.sections.event.create.fields.names.startDate')}
                  minDate={new Date(Date.now())}
                  defaultValue={new Date(form.values.startDate.toString())}
                  onChange={(value) =>
                    form.setFieldValue(
                      'startDate',
                      new Date(value?.toISOString() ?? new Date().toISOString()),
                    )
                  }
                />
                <DateTimePicker
                  label={t('ui.views.main.sections.event.create.fields.names.endDate')}
                  onChange={(value) =>
                    form.setFieldValue(
                      'endDate',
                      new Date(value?.toISOString() ?? new Date().toISOString()),
                    )
                  }
                />
              </>
            )}
            {form.values.type === EEventType.Unplanned.toString() && (
              <>
                <DateInput
                  label={t('ui.views.main.sections.event.create.fields.names.eventDate')}
                  minDate={new Date(Date.now())}
                  defaultValue={new Date(form.values.eventDate.toString())}
                  onChange={(value) =>
                    form.setFieldValue(
                      'eventDate',
                      new Date(value?.toISOString() ?? new Date().toISOString()),
                    )
                  }
                />
              </>
            )}
          </Flex>
          <Button
            type='submit'
            style={{
              display: 'flex',
              margin: '0 auto',
            }}
          >
            {t('ui.views.main.sections.event.create.submit')}
          </Button>
        </Paper>
      </form>
    </div>
  )
}

export default Create
