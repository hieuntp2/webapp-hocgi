import type { Metadata, Viewport } from 'next';
import { Be_Vietnam_Pro, Montserrat } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { AppProvider } from '@/contexts/AppContext';

const beVietnamPro = Be_Vietnam_Pro({ 
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-primary',
});

const montserrat = Montserrat({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-heading',
});

export const metadata: Metadata = {
  title: 'TVTS Quảng Trị 2026 - Chuyến Bay Đầu Tiên',
  description: 'Ngày Hội Tư Vấn Tuyển Sinh - Định Hướng Nghề Nghiệp Quảng Trị 2026 - First Flight',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'TVTS Quảng Trị',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#D32F2F',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${beVietnamPro.variable} ${montserrat.variable} font-sans`}>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-H7XC6HPX5T"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-H7XC6HPX5T');
          `}
        </Script>
        
        <AppProvider>
          <main className="mobile-container min-h-screen bg-background-secondary">
            {children}
          </main>
        </AppProvider>
      </body>
    </html>
  );
}
