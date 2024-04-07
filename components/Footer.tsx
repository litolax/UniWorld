import { Divider } from '@mantine/core'

export default function Footer() {
  return (
    <footer
      style={{
        position: 'fixed',
        left: '0',
        bottom: '0',
        width: '100%',
        textAlign: 'center',
        height: '25px',
      }}
    >
      <Divider label={'© 2024 UniWorld — Все права защищены.'} />
    </footer>
  )
}
