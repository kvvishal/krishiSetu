import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { useEffect, useState } from "react";

export default function Header() {
  const { t, lang, setLang } = useI18n();
  const [canInstall, setCanInstall] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setCanInstall(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const onInstall = async () => {
    if (!canInstall) return;
    canInstall.prompt();
    await canInstall.userChoice;
    setCanInstall(null);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-emerald-500" />
          <span className="text-lg font-extrabold tracking-tight">{t("brand")}</span>
        </a>
        <div className="flex items-center gap-2">
          <select
            aria-label="Language"
            value={lang}
            onChange={(e) => setLang(e.target.value as any)}
            className="h-9 rounded-md border bg-background px-2 text-sm"
          >
            <option value="en">EN</option>
            <option value="hi">हिं</option>
          </select>
          {canInstall && (
            <Button size="sm" onClick={onInstall}>{t("ctaInstall")}</Button>
          )}
        </div>
      </div>
    </header>
  );
}
