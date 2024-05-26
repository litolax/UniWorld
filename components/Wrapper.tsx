import React, { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'

interface WrapperProps {
  children: ReactNode
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Header />
    <div style={{ flex: '1 0 auto' }}>{children}</div>
    <Footer />
  </div>
)

export default Wrapper
