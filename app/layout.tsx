import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = {
  title: '전화번호 관리 시스템',
  description: '전화번호를 쉽게 관리하세요',
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
