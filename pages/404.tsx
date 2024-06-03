import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { Image, Container, Title, Text, Button, SimpleGrid } from '@mantine/core'
import { useRouter } from 'next/navigation'
import image from '../public/images/404.svg'
import classes from '../styles/NotFoundImage.module.css'
import { getSession } from 'next-auth/react'
import { getAccountByEmail } from '../src/server/account'
import { TAccount } from '../src/types/TAccount'

export default function Page404() {
  const { t } = useTranslation('errors')
  const router = useRouter()

  return (
    <Container className={classes.root}>
      <SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }}>
        <Image src={image.src} className={classes.mobileImage} />
        <div>
          <Title className={classes.title}>{t('somethingWentWrong')}</Title>
          <Text c='dimmed' size='lg'>
            {t('pageDoesNotExist')}
          </Text>
          <Button
            variant='outline'
            size='md'
            mt='xl'
            className={classes.control}
            onClick={() => router.push('/')}
          >
            {t('backHome')}
          </Button>
        </div>
        <Image src={image.src} className={classes.desktopImage} />
      </SimpleGrid>
    </Container>
  )
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const session = await getSession(ctx.params)
  let currentAccount
  if (session && session.user?.email) {
    currentAccount = JSON.parse(
      JSON.stringify(await getAccountByEmail(session.user?.email)),
    ) as TAccount
  }
  const locale = currentAccount ? currentAccount.locale : ctx.locale ? ctx.locale : 'ru'
  return {
    props: {
      ...(await serverSideTranslations(locale, ['errors'])),
    },
  }
}
