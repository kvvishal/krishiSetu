import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Lang = "en" | "hi";

type Dict = Record<string, { en: string; hi: string }>;

const dict: Dict = {
  brand: { en: "KrishiSetu", hi: "कृषि सेतु" },
  tagline: {
    en: "AI-powered, offline-first farming for every Indian farmer",
    hi: "हर किसान के लिए एआई समर्थ, ऑफ़लाइन-फ़र्स्ट खेती",
  },
  ctaGetStarted: { en: "Get Started", hi: "शुरू करें" },
  ctaInstall: { en: "Install App", hi: "एप इंस्टॉल करें" },
  heroLead: {
    en: "Android-first PWA that works fully offline. Crop advice, soil & weather insights, and market access — even without internet.",
    hi: "एंड्रॉइड-फ़र्स्ट PWA जो पूरी तरह ऑफ़लाइन काम करता है। फसल सलाह, मिट्टी और मौसम जानकारी, और बाज़ार तक पहुँच — बिना इंटरनेट के।",
  },
  section1Title: { en: "Offline-first Mobile App", hi: "ऑफ़लाइन-फ़र्स्ट मोबाइल ऐप" },
  section1Desc: {
    en: "All critical data is stored securely on-device (IndexedDB). Background sync updates the cloud when connectivity returns.",
    hi: "सभी महत्वपूर्ण डेटा डिवाइस पर सुरक्षित रहता है (IndexedDB)। कनेक्टिविटी आते ही बैकग्राउंड सिंक क्लाउड में अपडेट कर देता है।",
  },
  section2Title: { en: "USSD • SMS • IVR", hi: "USSD • SMS • IVR" },
  section2Desc: {
    en: "Feature-phone friendly access via text menus, two-way SMS, and regional-language IVR for advisories and updates.",
    hi: "फ़ीचर-फ़ोन उपयोगकर्ताओं के लिए टेक्स्ट मेन्यू, द्विदिश SMS और क्षेत्रीय भाषा IVR से सलाह और अपडेट।",
  },
  section3Title: { en: "On-device AI/ML", hi: "ऑन-डिवाइस एआई/एमएल" },
  section3Desc: {
    en: "Lightweight models power crop, irrigation, and pest recommendations — available even when offline.",
    hi: "हल्के मॉडल फसल, सिंचाई और कीट संबंधी सिफ़ारिशें प्रदान करते हैं — ऑफ़लाइन भी उपलब्ध।",
  },
  section4Title: { en: "Local + Cloud Sync", hi: "लोकल + क्लाउड सिंक" },
  section4Desc: {
    en: "Your device is the source of truth. Cloud keeps data safe, analyzable, and shareable for programs and dashboards.",
    hi: "आपका डिवाइस मुख्य स्रोत है। क्लाउड डेटा को सुरक्षित, विश्लेषण योग्य और डैशबोर्ड के लिए साझा करने योग्य रखता है।",
  },
  section5Title: { en: "Community & Experts", hi: "समुदाय और विशे��ज्ञ" },
  section5Desc: {
    en: "Connect with peers and agronomists via text, voice notes, or IVR. Broadcast advisories in regional languages.",
    hi: "टेक्स्ट, वॉइस नोट्स या IVR से साथियों और कृषि विशेषज्ञों से जुड़ें। क्षेत्रीय भाषाओं में सलाह प्रसारित करें।",
  },
  section6Title: { en: "Market Linkages", hi: "मार्केट लिंकेंज" },
  section6Desc: {
    en: "List produce and discover buyers nearby. Matching ensures fair prices and reduces middlemen reliance.",
    hi: "उत्पाद सूचीबद्ध करें और आसपास के खरीदार खोजें। मैचिंग से उचित कीमत और बिचौलियों पर निर्भरता कम होती है।",
  },
  section7Title: { en: "Secure & Multilingual", hi: "सुरक्षित और बहुभाषी" },
  section7Desc: {
    en: "End-to-end encrypted sync. Full Hindi and English UI today; easily extensible to more Indian languages.",
    hi: "एंड-टू-एंड एन्क्रिप्टेड सिंक। आज ह���ंदी और अंग्रेज़ी UI; अन्य भारतीय भाषाओं तक आसानी से विस्तार योग्य।",
  },
  section8Title: { en: "Built to Scale", hi: "स्केलेबल आर्किटेक्चर" },
  section8Desc: {
    en: "Cloud-native, modular design scales to millions. Open APIs for subsidy systems, NGOs and marketplaces.",
    hi: "क्लाउड-नेटिव, मॉड्यूलर डिज़ाइन लाखों उपयोगकर्ताओं तक स्केल। सब्सिडी सिस्टम, NGO और मार्केटप्लेस के लिए ओपन API।",
  },
  quickActions: { en: "Quick Actions", hi: "त्वरित कार्य" },
  actionIVR: { en: "Dial IVR", hi: "IVR कॉल करें" },
  actionSMS: { en: "Send SMS", hi: "SMS भेजें" },
  actionUSSD: { en: "USSD Menu", hi: "USSD मेन्यू" },
  offlineReady: { en: "Offline Ready", hi: "ऑफ़लाइन तैयार" },
  syncing: { en: "Syncing...", hi: "सिंक हो रहा है..." },
  synced: { en: "All changes synced", hi: "सभी बदलाव सिंक हुए" },
  simpleTitle: { en: "Simple farming assistant", hi: "सरल खेती सहायक" },
  simpleSubtitle: { en: "Do 3 things easily", hi: "तीन आसान काम" },
  btnAdvice: { en: "Get Advice", hi: "सलाह लें" },
  btnRecord: { en: "Record Farm", hi: "खेत दर्ज करें" },
  btnMarket: { en: "Find Buyer", hi: "खरीदार खोजें" }
};

interface I18nContextValue {
  lang: Lang;
  t: (key: keyof typeof dict) => string;
  setLang: (l: Lang) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved) return saved;
    const nav = (navigator.language || "en").toLowerCase();
    return nav.startsWith("hi") ? "hi" : "en";
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };

  const t = (key: keyof typeof dict) => dict[key]?.[lang] ?? key;

  const value = useMemo(() => ({ lang, setLang, t }), [lang]);

  useEffect(() => {
    document.documentElement.lang = lang === "hi" ? "hi" : "en";
  }, [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
