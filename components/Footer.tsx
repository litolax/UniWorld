import { Container, Group, Anchor, Title, Divider } from '@mantine/core'
import classes from '../styles/FooterSimple.module.css'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/navigation'

export default function Footer() {
  const router = useRouter()
  const { t } = useTranslation('common')

  const links = [
    { link: '/feedback', label: 'footer.feedback', onClick: () => router.push('/feedback') },
    { link: '/about', label: 'footer.aboutUs', onClick: () => router.push('/about') },
  ]
  const items = links.map((link) => (
    <Anchor<'a'> c='dimmed' key={link.label} href={link.link} onClick={link.onClick} size='sm'>
      {t(link.label)}
    </Anchor>
  ))

  return (
    <footer
      style={{
        width: '100%',
        textAlign: 'center',
        height: '3rem',
      }}
    >
      <Divider mb={'sm'} />
      <Container className={classes.inner}>
        <Title order={5}>{t('footer.allRights')}</Title>
        <Group>{items}</Group>
      </Container>
    </footer>
  )
}
