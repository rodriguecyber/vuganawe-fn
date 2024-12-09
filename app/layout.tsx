import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/context/auth-context';
import { CourseProvider } from '@/lib/context/course-context';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Learning Platform',
  description: 'A modern platform for online learning',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CourseProvider>
            {children}
            <Toaster />
          </CourseProvider>
        </AuthProvider>
      </body>
    </html>
  );
}