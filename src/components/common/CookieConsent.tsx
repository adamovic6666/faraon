"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ConsentOptions = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

type CookieConsentProps = {
  onPreferenceChange?: (prefs: ConsentOptions) => void;
};

const STORAGE_KEY = "cookie-consent-preferences";

const defaultPreferences: ConsentOptions = {
  necessary: true,
  analytics: false,
  marketing: false,
};

const CookieConsent = ({ onPreferenceChange }: CookieConsentProps) => {
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [preferences, setPreferences] =
    useState<ConsentOptions>(defaultPreferences);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const rawPreferences = localStorage.getItem(STORAGE_KEY);

    if (!rawPreferences) {
      setShowBanner(true);
      return;
    }

    try {
      const parsedPreferences = JSON.parse(rawPreferences) as ConsentOptions;
      const sanitizedPreferences: ConsentOptions = {
        necessary: true,
        analytics: Boolean(parsedPreferences.analytics),
        marketing: Boolean(parsedPreferences.marketing),
      };

      setPreferences(sanitizedPreferences);
      onPreferenceChange?.(sanitizedPreferences);
    } catch {
      setShowBanner(true);
    }
  }, [mounted, onPreferenceChange]);

  const savePreferences = (nextPreferences: ConsentOptions) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPreferences));
    setPreferences(nextPreferences);
    onPreferenceChange?.(nextPreferences);
    setShowBanner(false);
    setShowModal(false);
  };

  if (!mounted) return null;

  return (
    <>
      {showBanner && (
        <div className="fixed inset-x-0 bottom-0 z-[1000] border-t border-black/10 bg-white/95 backdrop-blur-sm">
          <div className="mx-auto flex w-full max-w-frame flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between xl:px-0">
            <p className="text-sm leading-relaxed text-black/80 md:max-w-[62ch]">
              Koristimo kolačiće za funkcionalnost sajta, analitiku i
              unapređenje korisničkog iskustva. Možete prihvatiti sve, odbiti
              opcione kolačiće ili podesiti izbor.
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setShowModal(true);
                  setShowBanner(false);
                }}
                className="rounded-full border border-black/20 px-4 py-2 text-sm font-medium text-black/80 transition hover:bg-black/5"
              >
                Podešavanja
              </button>

              <button
                onClick={() =>
                  savePreferences({
                    necessary: true,
                    analytics: false,
                    marketing: false,
                  })
                }
                className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand/90"
              >
                Odbij opcione
              </button>

              <button
                onClick={() =>
                  savePreferences({
                    necessary: true,
                    analytics: true,
                    marketing: true,
                  })
                }
                className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-black/80 transition hover:bg-primary/90"
              >
                Prihvati sve
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[1100] grid place-items-center bg-black/60 p-4">
          <div className="w-full max-w-2xl rounded-[24px] bg-white p-5 shadow-2xl md:p-7">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-black md:text-2xl">
                Podešavanja kolačića
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-full border border-black/15 px-3 py-1 text-sm font-medium text-black/70 transition hover:bg-black/5"
              >
                Zatvori
              </button>
            </div>

            <p className="mb-5 text-sm leading-relaxed text-black/70">
              Neophodni kolačići su uvek uključeni. Opcionim kategorijama možete
              upravljati ispod. Više informacija možete pronaći u
              <Link
                href="#"
                className="ml-1 underline decoration-black/30 underline-offset-4 hover:decoration-black"
              >
                politici privatnosti
              </Link>
              .
            </p>

            <div className="space-y-3">
              <div className="rounded-2xl border border-black/10 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-black">Neophodni</p>
                  <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-black/70">
                    Uvek aktivni
                  </span>
                </div>
              </div>

              <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-black/10 p-4">
                <div>
                  <p className="font-semibold text-black">Analitika</p>
                  <p className="text-sm text-black/65">
                    Meri posete i pomaže poboljšanje sadržaja.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={() =>
                    setPreferences((currentPreferences) => ({
                      ...currentPreferences,
                      analytics: !currentPreferences.analytics,
                    }))
                  }
                  className="h-5 w-5 accent-brand"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-black/10 p-4">
                <div>
                  <p className="font-semibold text-black">Marketing</p>
                  <p className="text-sm text-black/65">
                    Prikazuje relevantnije ponude i kampanje.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={() =>
                    setPreferences((currentPreferences) => ({
                      ...currentPreferences,
                      marketing: !currentPreferences.marketing,
                    }))
                  }
                  className="h-5 w-5 accent-brand"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                onClick={() =>
                  savePreferences({
                    necessary: true,
                    analytics: false,
                    marketing: false,
                  })
                }
                className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand/90"
              >
                Odbij opcione
              </button>
              <button
                onClick={() =>
                  savePreferences({
                    necessary: true,
                    analytics: true,
                    marketing: true,
                  })
                }
                className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-black/80 transition hover:bg-primary/90"
              >
                Prihvati sve
              </button>
              <button
                onClick={() => savePreferences(preferences)}
                className="rounded-full border border-black/20 px-4 py-2 text-sm font-medium text-black/80 transition hover:bg-black/5"
              >
                Sačuvaj izbor
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsent;
