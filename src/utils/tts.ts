import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
import { EXPO_PUBLIC_SPEECH_KEY, EXPO_PUBLIC_SPEECH_REGION } from "@env";

const speechKey = EXPO_PUBLIC_SPEECH_KEY;
const serviceRegion = EXPO_PUBLIC_SPEECH_REGION;

export const speakQuote = (text: string) => {
  const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
    speechKey,
    serviceRegion
  );
  speechConfig.speechSynthesisVoiceName = "en-IN-RehaanNeural";
  const audioConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
  const synthesizer = new SpeechSDK.SpeechSynthesizer(
    speechConfig,
    audioConfig
  );

  synthesizer.speakTextAsync(
    text,
    (result) => {
      if (result.reason !== SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
        console.error("Speech synthesis failed:", result.errorDetails);
      }
      synthesizer.close();
    },
    (error) => {
      console.error("Speech synthesis error:", error);
      synthesizer.close();
    }
  );
};
