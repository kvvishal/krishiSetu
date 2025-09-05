import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { startAutoSync, putRecord } from "@/lib/localdb";
import { useEffect, useMemo, useState } from "react";
import { Check, Cloud, Database, Headphones, MessageCircle, Radio, Shield, ShoppingCart, Smartphone, Sprout, WifiOff } from "lucide-react";

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100/60 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
      {children}
    </span>
  );
}

function Feature({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-emerald-500 text-white">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

export default function Index() {
  const { t } = useI18n();
  const [syncState, setSyncState] = useState<"idle" | "syncing" | "done">("idle");

  useEffect(() => {
    startAutoSync();
  }, []);

  const onQuickSave = async () => {
    setSyncState("syncing");
    const rec = {
      id: crypto.randomUUID(),
      type: "crop" as const,
      payload: { crop: "Wheat", soil: "Loam", season: "Rabi" },
      updatedAt: Date.now(),
    };
    await putRecord(rec, true);
    setSyncState("done");
    setTimeout(() => setSyncState("idle"), 2000);
  };

  const features = useMemo(
    () => [
      { icon: Smartphone, title: t("section1Title"), desc: t("section1Desc") },
      { icon: Radio, title: t("section2Title"), desc: t("section2Desc") },
      { icon: Sprout, title: t("section3Title"), desc: t("section3Desc") },
      { icon: Cloud, title: t("section4Title"), desc: t("section4Desc") },
      { icon: Headphones, title: t("section5Title"), desc: t("section5Desc") },
      { icon: ShoppingCart, title: t("section6Title"), desc: t("section6Desc") },
      { icon: Shield, title: t("section7Title"), desc: t("section7Desc") },
      { icon: Database, title: t("section8Title"), desc: t("section8Desc") },
    ],
    [t],
  );

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-50 via-white to-white dark:from-emerald-950/40 dark:via-background dark:to-background" />
        <div className="container grid gap-10 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <Badge>
              <WifiOff className="h-3.5 w-3.5" /> {t("offlineReady")}
            </Badge>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">
              {t("brand")} — {t("tagline")}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">{t("heroLead")}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button className="shadow-lg shadow-emerald-300/30">{t("ctaGetStarted")}</Button>
              <Button variant="outline" onClick={onQuickSave}>
                <Database className="mr-2 h-4 w-4" /> Save sample record
              </Button>
              {syncState === "syncing" && (
                <Badge>
                  <span className="inline-flex items-center gap-1"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-600" />{t("syncing")}</span>
                </Badge>
              )}
              {syncState === "done" && (
                <Badge>
                  <Check className="h-3.5 w-3.5" /> {t("synced")}
                </Badge>
              )}
            </div>
            <div className="mt-8 grid max-w-md grid-cols-3 gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2"><Sprout className="h-4 w-4 text-emerald-600" /> AI/ML</div>
              <div className="flex items-center gap-2"><Smartphone className="h-4 w-4 text-emerald-600" /> Android-first</div>
              <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-emerald-600" /> Encrypted</div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl border bg-gradient-to-br from-emerald-500/20 to-amber-400/20 p-6 shadow-xl">
              <div className="grid h-full grid-rows-3 gap-3 text-sm">
                <div className="rounded-xl border bg-background/80 p-4 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Crop Advisory</span>
                    <span className="text-xs text-muted-foreground">offline</span>
                  </div>
                  <p className="mt-1 text-muted-foreground">Suggested: Wheat • Irrigation: 25mm/week • Pest: Monitor for aphids</p>
                </div>
                <div className="rounded-xl border bg-background/80 p-4 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Soil & Weather</span>
                    <span className="text-xs text-muted-foreground">sync ready</span>
                  </div>
                  <p className="mt-1 text-muted-foreground">Loam • Moisture: 38% • Rain next 3d: 22mm</p>
                </div>
                <div className="rounded-xl border bg-background/80 p-4 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Market Matches</span>
                    <span className="text-xs text-muted-foreground">nearby</span>
                  </div>
                  <p className="mt-1 text-muted-foreground">2 buyers within 20km offering fair price bands</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-16 md:py-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Feature key={i} icon={f.icon} title={f.title} desc={f.desc} />
          ))}
        </div>
      </section>

      {/* Quick actions for USSD/SMS/IVR */}
      <section className="container pb-20">
        <h2 className="text-xl font-semibold">{t("quickActions")}</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href="tel:+910800000000" className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-accent">
            <Headphones className="h-4 w-4" /> {t("actionIVR")}
          </a>
          <a href="sms:+910800000000?body=ADVISORY" className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-accent">
            <MessageCircle className="h-4 w-4" /> {t("actionSMS")}
          </a>
          <a href="#ussd" className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-accent">
            <Radio className="h-4 w-4" /> {t("actionUSSD")}
          </a>
        </div>
      </section>
    </main>
  );
}
