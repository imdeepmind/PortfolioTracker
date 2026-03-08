import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register',
  description:
    'Create an account on Portfolio Tracker to start tracking your investments, analyze risk distribution, and monitor P&L.',
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
