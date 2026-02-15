// Voice hooks
export {
  useSpeechRecognition,
  type SpeechRecognitionStatus,
  type SpeechRecognitionError,
  type UseSpeechRecognitionReturn,
  type UseSpeechRecognitionOptions,
} from './useSpeechRecognition';

export {
  useTextToSpeech,
  type TTSStatus,
  type TTSError,
  type TTSVoice,
  type UseTextToSpeechReturn,
  type UseTextToSpeechOptions,
} from './useTextToSpeech';

export {
  useVoiceChat,
  type VoiceChatMode,
  type VoiceChatError,
  type UseVoiceChatReturn,
  type UseVoiceChatOptions,
} from './useVoiceChat';

// Scheduling hooks
export { useScheduling } from './useScheduling';

// Accessibility hooks
export {
  useReducedMotion,
  useMotionSafe,
  getReducedMotionTransition,
} from './useReducedMotion';

// UI hooks
export { useHorizontalScroll } from './useHorizontalScroll';
