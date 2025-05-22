import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/context/auth-context';
import { LevelProvider } from '@/lib/context/level-context';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import Toastify styles globally


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Student',
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
          <LevelProvider>
            {children}
            <ToastContainer />
          </LevelProvider>
        </AuthProvider>
      </body>
    </html>
  );
}