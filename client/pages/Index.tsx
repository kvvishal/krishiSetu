import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n.tsx";
import { putRecord, startAutoSync } from "@/lib/localdb";
import { useEffect } from "react";
import { Headphones, MessageCircle, Radio, Sprout, ClipboardList, ShoppingCart, Shield, WifiOff } from "lucide-react";

export default function Index() {
  const { t } = useI18n();

  useEffect(() => {
    startAutoSync();
  }, []);

  const quickRecord = async () => {
    await putRecord({
      id: crypto.randomUUID(),
      type: "crop",
      payload: { crop: "Wheat" },
      updatedAt: Date.now(),
    });
  };

  return (
    <main>
      {/* Simple Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-50 via-white to-white dark:from-emerald-950/40 dark:via-background dark:to-background" />
        <div className="container py-10 md:py-16">
          <div className="flex items-center gap-2 text-xs text-emerald-700">
            <WifiOff className="h-3.5 w-3.5" /> {t("offlineReady")}
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">{t("brand")}</h1>
          <p className="mt-1 text-lg text-muted-foreground">{t("simpleTitle")}</p>

          {/* Three big actions */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <a href="#advice" className="group rounded-2xl border p-5 hover:bg-accent">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <Sprout className="h-6 w-6" />
              </div>
              <div className="text-lg font-semibold">{t("btnAdvice")}</div>
              <div className="text-sm text-muted-foreground">AI crop, water and pest tips</div>
            </a>
            <button onClick={quickRecord} className="rounded-2xl border p-5 text-left hover:bg-accent">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <ClipboardList className="h-6 w-6" />
              </div>
              <div className="text-lg font-semibold">{t("btnRecord")}</div>
              <div className="text-sm text-muted-foreground">Save field data offline</div>
            </button>
            <a href="#market" className="group rounded-2xl border p-5 hover:bg-accent">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <ShoppingCart className="h-6 w-6" />
              </div>
              <div className="text-lg font-semibold">{t("btnMarket")}</div>
              <div className="text-sm text-muted-foreground">Nearby buyers and prices</div>
            </a>
          </div>

          {/* Phone-friendly options */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <a href="tel:+910800000000" className="flex items-center gap-3 rounded-xl border p-4 text-base hover:bg-accent">
              <Headphones className="h-5 w-5" /> IVR
            </a>
            <a href="sms:+910800000000?body=ADVISORY" className="flex items-center gap-3 rounded-xl border p-4 text-base hover:bg-accent">
              <MessageCircle className="h-5 w-5" /> SMS
            </a>
            <a href="#ussd" className="flex items-center gap-3 rounded-xl border p-4 text-base hover:bg-accent">
              <Radio className="h-5 w-5" /> USSD
            </a>
          </div>
        </div>
      </section>

      {/* Small info cards */}
      <section id="advice" className="container pb-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border p-5">
            <Sprout className="h-5 w-5 text-emerald-600" />
            <div className="mt-2 font-semibold">AI Advice</div>
            <p className="text-sm text-muted-foreground">Works offline. Updates when online.</p>
          </div>
          <div className="rounded-xl border p-5">
            <Shield className="h-5 w-5 text-emerald-600" />
            <div className="mt-2 font-semibold">Secure</div>
            <p className="text-sm text-muted-foreground">Your data stays on your phone.</p>
          </div>
          <div className="rounded-xl border p-5">
            <ShoppingCart className="h-5 w-5 text-emerald-600" />
            <div className="mt-2 font-semibold">Market</div>
            <p className="text-sm text-muted-foreground">Find buyers near you.</p>
          </div>
          <div className="rounded-xl border p-5">
            <ClipboardList className="h-5 w-5 text-emerald-600" />
            <div className="mt-2 font-semibold">Records</div>
            <p className="text-sm text-muted-foreground">Keep simple farm notes.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
