import { DesignThemeProvider } from '@/context/DesignThemeContext';

export const metadata = {
  title: 'Welcome | OpenClaw-OS',
  description: 'Get started with OpenClaw-OS',
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
