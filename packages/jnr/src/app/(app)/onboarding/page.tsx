'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

/**
 * Onboarding Page - iOS Style
 *
 * Simple onboarding flow:
 * 1. Enter name
 * 2. Pick a color
 * 3. Select or create voice
 */

const COLORS = [
  { name: 'Green', color: '#4CAF50' },
  { name: 'Blue', color: '#2196F3' },
  { name: 'Purple', color: '#9C27B0' },
  { name: 'Pink', color: '#E91E63' },
  { name: 'Orange', color: '#FF9800' },
  { name: 'Red', color: '#F44336' },
];

const VOICES = [
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', emoji: '👧', description: 'Cheerful child voice' },
  { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', emoji: '👨', description: 'Warm, friendly' },
  { id: 'jsCqWAovK2LkecY7zXl4', name: 'Freya', emoji: '👩', description: 'Soft and gentle' },
  { id: 'browser', name: 'System', emoji: '🔊', description: 'Device default' },
];

type Step = 'name' | 'color' | 'voice' | 'done';

export default function OnboardingPage() {
  const router = useRouter();
  const { settings, updateSettings } = useApp();
  const [step, setStep] = useState<Step>('name');
  const [name, setName] = useState(settings.childName || '');
  const [color, setColor] = useState(settings.primaryColor || '#4CAF50');
  const [voice, setVoice] = useState(settings.selectedVoiceId || 'browser');

  const handleNext = () => {
    if (step === 'name' && name.trim()) {
      updateSettings({ childName: name.trim() });
      setStep('color');
    } else if (step === 'color') {
      updateSettings({ primaryColor: color });
      setStep('voice');
    } else if (step === 'voice') {
      updateSettings({
        selectedVoiceId: voice === 'browser' ? null : voice,
        hasCompletedOnboarding: true,
      });
      setStep('done');
      // Navigate to app after short delay
      setTimeout(() => router.push('/app'), 1000);
    }
  };

  const testVoice = async (voiceId: string) => {
    const text = `Hello ${name || 'there'}! Nice to meet you.`;

    if (voiceId !== 'browser') {
      try {
        const response = await fetch('/api/voice/speak', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, voiceId }),
        });
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          audio.play();
          return;
        }
      } catch {
        // Fallback
      }
    }

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-[#f2f2f7] safe-area-inset"
      style={{ '--accent': color } as React.CSSProperties}
    >
      {/* Progress Bar */}
      <div className="h-1 bg-gray-200">
        <div
          className="h-full transition-all duration-500"
          style={{
            backgroundColor: color,
            width: step === 'name' ? '25%' : step === 'color' ? '50%' : step === 'voice' ? '75%' : '100%',
          }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Step: Name */}
        {step === 'name' && (
          <div className="w-full max-w-sm text-center animate-fadeIn">
            <div className="text-6xl mb-6">👋</div>
            <h1 className="text-[28px] font-bold text-black mb-2">What&apos;s your name?</h1>
            <p className="text-[17px] text-gray-500 mb-8">
              We&apos;ll personalize everything just for you
            </p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              autoFocus
              className="w-full px-4 py-4 text-[20px] text-center bg-white rounded-2xl border-2 border-gray-200
                       focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
            <button
              onClick={handleNext}
              disabled={!name.trim()}
              className="w-full mt-6 py-4 text-white text-[17px] font-semibold rounded-2xl
                       disabled:opacity-40 active:opacity-80 transition-opacity"
              style={{ backgroundColor: color }}
            >
              Continue
            </button>
          </div>
        )}

        {/* Step: Color */}
        {step === 'color' && (
          <div className="w-full max-w-sm text-center animate-fadeIn">
            <div className="text-6xl mb-6">🎨</div>
            <h1 className="text-[28px] font-bold text-black mb-2">Pick your color</h1>
            <p className="text-[17px] text-gray-500 mb-8">
              Choose your favorite color, {name}
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {COLORS.map((c) => (
                <button
                  key={c.color}
                  onClick={() => setColor(c.color)}
                  className={`aspect-square rounded-2xl flex items-center justify-center transition-all ${
                    color === c.color ? 'scale-110 ring-4 ring-offset-2 ring-gray-300' : ''
                  }`}
                  style={{ backgroundColor: c.color }}
                >
                  {color === c.color && (
                    <span className="text-white text-2xl">✓</span>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={handleNext}
              className="w-full py-4 text-white text-[17px] font-semibold rounded-2xl active:opacity-80"
              style={{ backgroundColor: color }}
            >
              Continue
            </button>
          </div>
        )}

        {/* Step: Voice */}
        {step === 'voice' && (
          <div className="w-full max-w-sm text-center animate-fadeIn">
            <div className="text-6xl mb-6">🎤</div>
            <h1 className="text-[28px] font-bold text-black mb-2">Choose your voice</h1>
            <p className="text-[17px] text-gray-500 mb-6">
              This is how you&apos;ll sound, {name}
            </p>
            <div className="space-y-3 mb-6">
              {VOICES.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVoice(v.id)}
                  className={`w-full flex items-center gap-4 p-4 bg-white rounded-2xl border-2 transition-all ${
                    voice === v.id ? 'border-[var(--accent)]' : 'border-gray-200'
                  }`}
                  style={{ borderColor: voice === v.id ? color : undefined }}
                >
                  <span className="text-3xl">{v.emoji}</span>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-black">{v.name}</p>
                    <p className="text-[13px] text-gray-500">{v.description}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      testVoice(v.id);
                    }}
                    className="px-3 py-1.5 text-[13px] rounded-full"
                    style={{ backgroundColor: `${color}20`, color }}
                  >
                    Test
                  </button>
                </button>
              ))}
            </div>
            <button
              onClick={handleNext}
              className="w-full py-4 text-white text-[17px] font-semibold rounded-2xl active:opacity-80"
              style={{ backgroundColor: color }}
            >
              Let&apos;s Go!
            </button>
          </div>
        )}

        {/* Step: Done */}
        {step === 'done' && (
          <div className="w-full max-w-sm text-center animate-fadeIn">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-[28px] font-bold text-black mb-2">All set, {name}!</h1>
            <p className="text-[17px] text-gray-500">
              Let&apos;s start communicating
            </p>
            <div className="mt-8">
              <div
                className="w-12 h-12 mx-auto border-4 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: color, borderTopColor: 'transparent' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Skip button */}
      {step !== 'done' && (
        <div className="p-6 text-center safe-bottom">
          <button
            onClick={() => {
              updateSettings({ hasCompletedOnboarding: true });
              router.push('/app');
            }}
            className="text-[15px] text-gray-400"
          >
            Skip for now
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
