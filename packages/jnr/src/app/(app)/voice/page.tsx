'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useVoiceSettings, useAudioRecording, useTTS } from '@/lib/voice/hooks';
import { ELEVENLABS_VOICES } from '@/lib/voice/types';

/**
 * Voice Designer Page - iOS Style
 *
 * Create and customize your voice with ElevenLabs.
 */

type Step = 'select' | 'record' | 'preview' | 'creating' | 'done';

export default function VoicePage() {
  const { settings, updateSettings, isLoaded } = useVoiceSettings();
  const { isRecording, duration, audioUrl, startRecording, stopRecording, clearRecording } = useAudioRecording();
  const { speak, isSpeaking, availableVoices } = useTTS(settings);

  const [step, setStep] = useState<Step>('select');
  const [voiceName, setVoiceName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCreateVoice = async () => {
    if (!audioUrl || !voiceName.trim()) return;

    setIsCreating(true);
    setError(null);
    setStep('creating');

    try {
      // Convert audio URL to blob
      const response = await fetch(audioUrl);
      const audioBlob = await response.blob();

      // Create FormData
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('name', voiceName.trim());

      // Upload to API
      const result = await fetch('/api/voice/create', {
        method: 'POST',
        body: formData,
      });

      if (!result.ok) {
        throw new Error('Failed to create voice');
      }

      const data = await result.json();

      // Save the new voice
      updateSettings({ selectedVoiceId: data.voiceId });
      setStep('done');
    } catch (err) {
      console.error(err);
      setError('Failed to create voice. Please try again.');
      setStep('record');
    } finally {
      setIsCreating(false);
    }
  };

  const handleSelectPreset = (voiceId: string) => {
    updateSettings({ selectedVoiceId: voiceId });
  };

  const handleTestVoice = () => {
    speak('Hello! This is what I sound like. Nice to meet you!');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#f2f2f7] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
          <h1 className="text-[17px] font-semibold text-black">Voice</h1>
          <div className="w-12" /> {/* Spacer */}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-safe">
        {/* Voice Selection Section */}
        <div className="px-4 pt-6">
          <p className="text-[13px] text-gray-500 uppercase tracking-wide px-4 mb-2">
            Select a Voice
          </p>
          <div className="bg-white rounded-xl overflow-hidden">
            {/* Preset Voices */}
            {ELEVENLABS_VOICES.map((voice, index) => (
              <button
                key={voice.id}
                onClick={() => handleSelectPreset(voice.id)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left
                          ${index !== ELEVENLABS_VOICES.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <div>
                  <p className="text-[17px] text-black">{voice.name}</p>
                  {voice.description && (
                    <p className="text-[13px] text-gray-500">{voice.description}</p>
                  )}
                </div>
                {settings.selectedVoiceId === voice.id && (
                  <span className="text-blue-500 text-xl">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Test Voice Button */}
        <div className="px-4 py-4">
          <button
            onClick={handleTestVoice}
            disabled={isSpeaking}
            className="w-full py-3 bg-white rounded-xl text-blue-500 text-[17px] font-medium
                     disabled:opacity-50 active:bg-gray-50"
          >
            {isSpeaking ? 'Speaking...' : '🔊 Test Voice'}
          </button>
        </div>

        {/* Create Custom Voice Section */}
        <div className="px-4 pt-2">
          <p className="text-[13px] text-gray-500 uppercase tracking-wide px-4 mb-2">
            Create Custom Voice
          </p>
          <div className="bg-white rounded-xl p-4">
            {step === 'select' && (
              <div className="text-center py-4">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🎤</span>
                </div>
                <h3 className="text-[17px] font-semibold text-black mb-2">
                  Clone Your Voice
                </h3>
                <p className="text-[15px] text-gray-500 mb-4">
                  Record 30+ seconds of speech to create a voice that sounds like you.
                </p>
                <button
                  onClick={() => setStep('record')}
                  className="w-full py-3 bg-blue-500 text-white rounded-xl text-[17px] font-medium
                           active:bg-blue-600"
                >
                  Start Recording
                </button>
              </div>
            )}

            {step === 'record' && (
              <div className="text-center py-4">
                {/* Recording Indicator */}
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4
                              ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-200'}`}>
                  <span className="text-4xl">
                    {isRecording ? '🔴' : '🎤'}
                  </span>
                </div>

                {/* Duration */}
                <p className="text-3xl font-light text-black mb-2">
                  {formatDuration(duration)}
                </p>
                <p className="text-[15px] text-gray-500 mb-4">
                  {isRecording
                    ? 'Recording... Read aloud or talk naturally'
                    : audioUrl
                      ? 'Recording complete!'
                      : 'Tap to start recording'}
                </p>

                {/* Error */}
                {error && (
                  <p className="text-red-500 text-[15px] mb-4">{error}</p>
                )}

                {/* Controls */}
                {!audioUrl ? (
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`w-full py-3 rounded-xl text-[17px] font-medium
                              ${isRecording
                        ? 'bg-red-500 text-white'
                        : 'bg-blue-500 text-white'}`}
                  >
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                  </button>
                ) : (
                  <div className="space-y-3">
                    {/* Voice Name Input */}
                    <input
                      type="text"
                      value={voiceName}
                      onChange={(e) => setVoiceName(e.target.value)}
                      placeholder="Name your voice..."
                      className="w-full px-4 py-3 bg-gray-100 rounded-xl text-[17px] text-black
                               placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          clearRecording();
                          setVoiceName('');
                        }}
                        className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl text-[17px] font-medium"
                      >
                        Re-record
                      </button>
                      <button
                        onClick={handleCreateVoice}
                        disabled={!voiceName.trim()}
                        className="flex-1 py-3 bg-blue-500 text-white rounded-xl text-[17px] font-medium
                                 disabled:opacity-50"
                      >
                        Create Voice
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 'creating' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-[17px] text-black">Creating your voice...</p>
                <p className="text-[15px] text-gray-500">This may take a moment</p>
              </div>
            )}

            {step === 'done' && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">✅</span>
                </div>
                <h3 className="text-[17px] font-semibold text-black mb-2">
                  Voice Created!
                </h3>
                <p className="text-[15px] text-gray-500 mb-4">
                  Your custom voice &quot;{voiceName}&quot; is ready to use.
                </p>
                <button
                  onClick={handleTestVoice}
                  className="w-full py-3 bg-blue-500 text-white rounded-xl text-[17px] font-medium"
                >
                  🔊 Test Your Voice
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Voice Settings */}
        <div className="px-4 py-6">
          <p className="text-[13px] text-gray-500 uppercase tracking-wide px-4 mb-2">
            Voice Settings
          </p>
          <div className="bg-white rounded-xl overflow-hidden">
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
                className="w-full h-1 bg-gray-200 rounded-full appearance-none
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
                className="w-full h-1 bg-gray-200 rounded-full appearance-none
                         [&::-webkit-slider-thumb]:appearance-none
                         [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
                         [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full
                         [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border
                         [&::-webkit-slider-thumb]:border-gray-200"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
