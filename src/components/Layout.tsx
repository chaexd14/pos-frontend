import React from 'react'

type Props = {
  children: React.ReactNode
}

export const Layout = ({ children }: Props) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: 20, borderBottom: '1px solid #eee' }}>Header</header>
      <main style={{ flex: 1, padding: 20 }}>{children}</main>
      <footer style={{ padding: 20, borderTop: '1px solid #eee' }}>Footer</footer>
    </div>
  )
}
