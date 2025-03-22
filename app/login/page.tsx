import { LoginForm } from '@/components/auth/login-form';
import Head from 'next/head';

export default function LoginPage() {
  return (
    <><Head>
      <title>Login</title>
      <meta name="description" content="login page" />
</Head>
<main className="min-h-screen flex items-center justify-center p-4 bg-muted/50">
      <LoginForm />
    </main></>
  );
}