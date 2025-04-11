import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GigaCaptcha',
  description: 'The World's Most Hilarious CAPTCHA! 🤣'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
