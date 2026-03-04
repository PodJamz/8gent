'use client';

import { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { Dock } from '@/components/dock/Dock';
import { ELEVENLABS_VOICES } from '@/lib/voice/types';

/**
 * Voice Designer Page - iOS Style with Dock
 */

type Step = 'select' | 'record' | 'preview' | 'creating' | 'done';

export default function VoicePage() {
  const { settings, updateSettings, isLoaded } = useApp();

  // Voice creation state
  const [step, setStep] = useState<Step>('select');
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [voiceName, setVoiceName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const primaryColor = settings.primaryColor || '#4CAF50';

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectVoice = (voiceId: string | null) => {
    updateSettings({ selectedVoiceId: voiceId });
  };

  const testVoice = async (voiceId: string | null) => {
    const text = `Hello ${settings.childName || 'there'}! This is how I sound.`;

    if (voiceId) {
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
      utterance.rate = settings.ttsRate;
      speechSynthesis.speak(utterance);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch {
      setError('Could not access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setStep('preview');
    }
  };

  const clearRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);
    setVoiceName('');
    setStep('record');
    setError(null);
  };

  const createVoice = async () => {
    if (!audioBlob || !voiceName.trim()) return;

    setIsCreating(true);
    setStep('creating');
    setError(null);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('name', voiceName.trim());

      const response = await fetch('/api/voice/create', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to create voice');

      const data = await response.json();
      updateSettings({ selectedVoiceId: data.voiceId });
      setStep('done');
    } catch {
      setError('Failed to create voice. Please try again.');
      setStep('preview');
    } finally {
      setIsCreating(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#f2f2f7] flex items-center justify-center">
        <div
          className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: primaryColor, borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f2f7] flex flex-col">
      {/* Header */}
      <header
        className="sticky top-0 z-40 backdrop-blur-xl safe-top"
        style={{ backgroundColor: `${primaryColor}F2` }}
      >
        <div className="flex items-center justify-center px-4 py-3">
          <h1 className="text-[18px] font-semibold text-white">Voice</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-24">
        {/* Voice Selection */}
        <div className="px-4 pt-6">
          <p className="text-[13px] text-gray-500 uppercase tracking-wide px-4 mb-2">
            Select a Voice
          </p>
          <div className="bg-white rounded-xl overflow-hidden">
            {/* System Default */}
            <button
              onClick={() => handleSelectVoice(null)}
              className="w-full flex items-center justify-between px-4 py-3 border-b border-gray-100 active:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔊</span>
                <div className="text-left">
                  <p className="text-[17px] text-black">System Default</p>
                  <p className="text-[13px] text-gray-500">Device voice</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    testVoice(null);
                  }}
                  className="px-3 py-1 rounded-full text-[13px]"
                  style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                >
                  Test
                </button>
                {!settings.selectedVoiceId && (
                  <span style={{ color: primaryColor }} className="text-xl">✓</span>
                )}
              </div>
            </button>

            {/* ElevenLabs Voices */}
            {ELEVENLABS_VOICES.map((voice, index) => (
              <button
                key={voice.id}
                onClick={() => handleSelectVoice(voice.id)}
                className={`w-full flex items-center justify-between px-4 py-3 active:bg-gray-50 ${
                  index !== ELEVENLABS_VOICES.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎤</span>
                  <div className="text-left">
                    <p className="text-[17px] text-black">{voice.name}</p>
                    {voice.description && (
                      <p className="text-[13px] text-gray-500">{voice.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      testVoice(voice.id);
                    }}
                    className="px-3 py-1 rounded-full text-[13px]"
                    style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                  >
                    Test
                  </button>
                  {settings.selectedVoiceId === voice.id && (
                    <span style={{ color: primaryColor }} className="text-xl">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Create Custom Voice */}
        <div className="px-4 pt-6">
          <p className="text-[13px] text-gray-500 uppercase tracking-wide px-4 mb-2">
            Create Custom Voice
          </p>
          <div className="bg-white rounded-xl p-4">
            {step === 'select' && (
              <div className="text-center py-4">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${primaryColor}20` }}
                >
                  <span className="text-4xl">🎤</span>
                </div>
                <h3 className="text-[17px] font-semibold text-black mb-2">Clone Your Voice</h3>
                <p className="text-[15px] text-gray-500 mb-4">
                  Record 30+ seconds to create a voice that sounds like you
                </p>
                <button
                  onClick={() => setStep('record')}
                  className="w-full py-3 text-white rounded-xl text-[17px] font-medium active:opacity-80"
                  style={{ backgroundColor: primaryColor }}
                >
                  Start Recording
                </button>
              </div>
            )}

            {step === 'record' && (
              <div className="text-center py-4">
                <div
                  className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    isRecording ? 'animate-pulse' : ''
                  }`}
                  style={{ backgroundColor: isRecording ? '#ef4444' : `${primaryColor}20` }}
                >
                  <span className="text-4xl">{isRecording ? '🔴' : '🎤'}</span>
                </div>
                <p className="text-3xl font-light text-black mb-2">{formatDuration(duration)}</p>
                <p className="text-[15px] text-gray-500 mb-4">
                  {isRecording ? 'Recording... Speak clearly' : 'Tap to start'}
                </p>
                {error && <p className="text-red-500 text-[15px] mb-4">{error}</p>}
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className="w-full py-3 text-white rounded-xl text-[17px] font-medium"
                  style={{ backgroundColor: isRecording ? '#ef4444' : primaryColor }}
                >
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
              </div>
            )}

            {step === 'preview' && (
              <div className="space-y-3">
                <div className="text-center py-2">
                  <p className="text-[17px] text-black mb-1">Recording ready!</p>
                  <p className="text-gray-500 text-[15px]">{formatDuration(duration)}</p>
                </div>
                {error && <p className="text-red-500 text-[15px] text-center">{error}</p>}
                <input
                  type="text"
                  value={voiceName}
                  onChange={(e) => setVoiceName(e.target.value)}
                  placeholder={`${settings.childName || 'My'}'s Voice`}
                  className="w-full px-4 py-3 bg-[#f2f2f7] rounded-xl text-[17px] focus:outline-none"
                  style={{ borderColor: primaryColor }}
                />
                <div className="flex gap-3">
                  <button
                    onClick={clearRecording}
                    className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl text-[17px] font-medium"
                  >
                    Re-record
                  </button>
                  <button
                    onClick={createVoice}
                    disabled={!voiceName.trim()}
                    className="flex-1 py-3 text-white rounded-xl text-[17px] font-medium disabled:opacity-50"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Create Voice
                  </button>
                </div>
              </div>
            )}

            {step === 'creating' && (
              <div className="text-center py-8">
                <div
                  className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
                  style={{ borderColor: primaryColor, borderTopColor: 'transparent' }}
                />
                <p className="text-[17px] text-black">Creating your voice...</p>
              </div>
            )}

            {step === 'done' && (
              <div className="text-center py-4">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: '#34C75920' }}
                >
                  <span className="text-4xl">✅</span>
                </div>
                <h3 className="text-[17px] font-semibold text-black mb-2">Voice Created!</h3>
                <p className="text-[15px] text-gray-500 mb-4">
                  &quot;{voiceName}&quot; is ready to use
                </p>
                <button
                  onClick={() => testVoice(settings.selectedVoiceId)}
                  className="w-full py-3 text-white rounded-xl text-[17px] font-medium"
                  style={{ backgroundColor: primaryColor }}
                >
                  🔊 Test Your Voice
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dock */}
      <Dock primaryColor={primaryColor} />
    </div>
  );
}
