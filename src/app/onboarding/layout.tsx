import { DesignThemeProvider } from '@/context/DesignThemeContext';

export const metadata = {
  title: 'Welcome | 8gent',
  description: 'Get started with 8gent',
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DesignThemeProvider>
      <div className="min-h-screen bg-white">
        {children}
      </div>
    </DesignThemeProvider>
  );
}
