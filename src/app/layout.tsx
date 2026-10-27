import type { Metadata } from 'next';
import {
  Be_Vietnam_Pro,
  Plus_Jakarta_Sans,
  JetBrains_Mono,
} from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';

const fontDisplay = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const fontSans = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const fontJakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  weight: ['500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

const fontMono = JetBrains_Mono({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Albion Codex — Wiki, Loadout Builder & Market Companion',
  description:
    'Tra cứu trang bị, bộ kỹ năng Q/W/E/Passive chi tiết, Item Power và giá chợ Albion Online chuẩn song ngữ Việt - Anh.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${fontDisplay.variable} ${fontSans.variable} ${fontJakarta.variable} ${fontMono.variable} dark`}
    >
      <head>
        <link
          rel="preconnect"
          href="https://render.albiononline.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://render.albiononline.com" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('albion-theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="font-sans bg-bg-primary text-text-primary antialiased selection:bg-accent-primary/30 selection:text-accent-primary min-h-screen">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

