'use client';

import Link from 'next/link';
import { useVoiceSettings, useTTS } from '@/lib/voice/hooks';
import { ELEVENLABS_VOICES } from '@/lib/voice/types';

/**
 * Settings Page - iOS Style
 *
 * User preferences, mode toggle (kid/adult), voice selection, and account settings.
 */

export default function SettingsPage() {
  const { settings, updateSettings, isLoaded } = useVoiceSettings();
  const { availableVoices } = useTTS(settings);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#f2f2f7] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const selectedVoice = [...availableVoices, ...ELEVENLABS_VOICES].find(
    (v) => v.id === settings.selectedVoiceId
  );

  return (
    <div className="min-h-screen bg-[#f2f2f7] flex flex-col">
      {/* iOS Style Header */}
      <header className="sticky top-0 z-50 bg-[#f2f2f7]/80 backdrop-blur-xl border-b border-gray-200/50">
        <div className="flex items-center justify-between px-4 py-3">
          <Link
            href="/app"
            className="text-blue-500 text-[17px] flex items-center gap-1"
          >
            <span className="text-xl">‹</span>
            <span>Back</span>
          </Link>
          <h1 className="text-[17px] font-semibold text-black">Settings</h1>
          <div className="w-12" /> {/* Spacer */}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-safe">
        {/* Display Mode */}
        <div className="px-4 pt-6">
          <p className="text-[13px] text-gray-500 uppercase tracking-wide px-4 mb-2">
            Display
          </p>
          <div className="bg-white rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-[17px] text-black">Interface Mode</span>
              <select
                className="text-[17px] text-gray-500 bg-transparent appearance-none
                         cursor-pointer pr-6 focus:outline-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0 center',
                  backgroundSize: '20px',
                }}
              >
                <option value="kid">Kid Mode</option>
                <option value="adult">Adult Mode</option>
              </select>
            </div>
          </div>
          <p className="text-[13px] text-gray-500 px-4 mt-2">
            Kid Mode shows larger cards and simpler navigation.
          </p>
        </div>

        {/* Voice Settings */}
        <div className="px-4 pt-6">
          <p className="text-[13px] text-gray-500 uppercase tracking-wide px-4 mb-2">
            Voice
          </p>
          <div className="bg-white rounded-xl overflow-hidden">
            {/* Selected Voice */}
            <Link
              href="/voice"
              className="flex items-center justify-between px-4 py-3 border-b border-gray-100 active:bg-gray-50"
            >
              <span className="text-[17px] text-black">Voice</span>
              <div className="flex items-center gap-2">
                <span className="text-[17px] text-gray-500">
                  {selectedVoice?.name || 'System Default'}
                </span>
                <span className="text-gray-300">›</span>
              </div>
            </Link>

            {/* Speech Rate */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[17px] text-black">Speech Rate</span>
                <span className="text-[15px] text-gray-500">{settings.rate.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={settings.rate}
                onChange={(e) => updateSettings({ rate: parseFloat(e.target.value) })}
                className="w-full h-1 bg-gray-200 rounded-full appearance-none accent-blue-500
                         [&::-webkit-slider-thumb]:appearance-none
                         [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
                         [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full
                         [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border
                         [&::-webkit-slider-thumb]:border-gray-200"
              />
            </div>

            {/* Volume */}
            <div className="px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[17px] text-black">Volume</span>
                <span className="text-[15px] text-gray-500">{Math.round(settings.volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.volume}
                onChange={(e) => updateSettings({ volume: parseFloat(e.target.value) })}
                className="w-full h-1 bg-gray-200 rounded-full appearance-none accent-blue-500
                         [&::-webkit-slider-thumb]:appearance-none
                         [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
                         [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full
                         [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border
                         [&::-webkit-slider-thumb]:border-gray-200"
              />
            </div>
          </div>
        </div>

        {/* AAC Settings */}
        <div className="px-4 pt-6">
          <p className="text-[13px] text-gray-500 uppercase tracking-wide px-4 mb-2">
            Communication Board
          </p>
          <div className="bg-white rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <span className="text-[17px] text-black">Card Size</span>
              <select
                className="text-[17px] text-gray-500 bg-transparent appearance-none
                         cursor-pointer pr-6 focus:outline-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0 center',
                  backgroundSize: '20px',
                }}
              >
                <option value="medium">Medium</option>
                <option value="small">Small</option>
                <option value="large">Large</option>
              </select>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-[17px] text-black">Show Labels</span>
              <div className="relative">
                <input
                  type="checkbox"
                  defaultChecked
                  className="sr-only peer"
                  id="showLabels"
                />
                <label
                  htmlFor="showLabels"
                  className="block w-[51px] h-[31px] bg-gray-200 rounded-full cursor-pointer
                           peer-checked:bg-[#34C759] transition-colors"
                >
                  <span className="absolute left-[2px] top-[2px] w-[27px] h-[27px] bg-white rounded-full
                                 shadow-sm transition-transform peer-checked:translate-x-5" />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Account */}
        <div className="px-4 pt-6 pb-8">
          <p className="text-[13px] text-gray-500 uppercase tracking-wide px-4 mb-2">
            Account
          </p>
          <div className="bg-white rounded-xl overflow-hidden">
            <button
              onClick={() => (window.location.href = '/')}
              className="w-full px-4 py-3 text-left text-red-500 text-[17px] active:bg-gray-50"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Version Info */}
        <div className="px-4 pb-8 text-center">
          <p className="text-[13px] text-gray-400">8gent v1.0.0</p>
          <p className="text-[13px] text-gray-400">Symbols © ARASAAC</p>
        </div>
      </div>
    </div>
  );
}
