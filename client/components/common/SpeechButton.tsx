import { useI18n } from "@/lib/i18n.tsx";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

export default function SpeechButton({
  onText,
}: {
  onText: (text: string) => void;
}) {
  const { lang } = useI18n();
  const Rec: any =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;
  const supported = Boolean(Rec);
  const [listening, setListening] = useState(false);
  const recogRef = useRef<any>(null);

  useEffect(() => {
    if (!supported) return;
    const recog = new Rec();
    recog.lang = lang === "hi" ? "hi-IN" : "en-IN";
    recog.interimResults = false;
    recog.continuous = false;
    recog.onresult = (e: any) => {
      const text = Array.from(e.results)
        .map((r: any) => r[0]?.transcript)
        .join(" ")
        .trim();
      if (text) onText(text);
    };
    recog.onend = () => setListening(false);
    recog.onerror = () => setListening(false);
    recogRef.current = recog;
    return () => {
      try {
        recog.stop();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const toggle = () => {
    if (!supported) return;
    const r = recogRef.current;
    if (!r) return;
    if (listening) {
      try {
        r.stop();
      } catch {}
      setListening(false);
    } else {
      try {
        r.start();
        setListening(true);
      } catch {}
    }
  };

  if (!supported) return null;

  return (
    <Button
      type="button"
      size="sm"
      variant={listening ? "destructive" : "secondary"}
      onClick={toggle}
      aria-label={listening ? "Stop recording" : "Start recording"}
    >
      {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      {listening ? "Listening" : "Speak"}
    </Button>
  );
}
