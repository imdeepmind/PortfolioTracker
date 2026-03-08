'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import GlassCard from '@/components/bits/GlassCard';
import Input from '@/components/bits/Input';
import Button from '@/components/bits/Button';
import ErrorAlert from '@/components/bits/ErrorAlert';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/');
        router.refresh();
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="fixed top-20 left-20 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden mb-4">
            <Image
              src="/logo.png"
              alt="Portfolio Tracker Logo"
              width={80}
              height={80}
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Welcome back
          </h1>
          <p className="text-gray-400 mt-2">Sign in to your portfolio tracker</p>
        </div>

        <GlassCard className="shadow-2xl shadow-black/20">
          <form onSubmit={handleSubmit} className="space-y-5">
            <ErrorAlert message={error} />

            <Input
              id="username"
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />

            <Input
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

            <Button
              type="submit"
              loading={loading}
              loadingText="Signing in..."
              className="w-full"
              size="lg"
            >
              Sign in
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
