import './globals.css'

export const metadata = {
  title: 'Next.js Todo App',
  description: 'Next.js + MongoDB Todo Application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}

