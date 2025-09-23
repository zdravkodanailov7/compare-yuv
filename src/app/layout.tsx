import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CompareYUV",
  description: "Transform your photos into stunning before-and-after comparisons. Upload, compare, and share your progress with interactive sliders.",
  keywords: "before after, image comparison, photo comparison, progress tracking, before after photos, image slider, visual comparison",
  authors: [{ name: "CompareYUV Team" }],
  creator: "CompareYUV",
  publisher: "CompareYUV",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "CompareYUV",
    description: "Transform your photos into stunning before-and-after comparisons. Upload, compare, and share your progress with interactive sliders.",
    type: "website",
    locale: "en_US",
    siteName: "CompareYUV",
    images: [
      {
        url: "/vercel.svg", // You can replace this with a proper logo/og image
        width: 1200,
        height: 630,
        alt: "CompareYUV - Before and After Image Comparison Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CompareYUV",
    description: "Transform your photos into stunning before-and-after comparisons. Upload, compare, and share your progress with interactive sliders.",
    images: ["/vercel.svg"], // Same as Open Graph image
    creator: "@CompareYUV",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification-code", // Add your actual verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/vercel.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
