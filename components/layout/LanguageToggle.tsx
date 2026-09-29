"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: {
          new (
            options: {
              pageLanguage: string;
              includedLanguages: string;
              layout: unknown;
              autoDisplay: boolean;
            },
            elementId: string
          ): unknown;
          InlineLayout: {
            SIMPLE: unknown;
            HORIZONTAL: unknown;
            VERTICAL: unknown;
          };
        };
      };
    };
  }
}

type Lang = "en" | "it";

const CONTAINER_ID = "google_translate_element";
const SCRIPT_ID = "google-translate-script";
const COOKIE_NAME = "googtrans";

function readCookie(): Lang {
  if (typeof document === "undefined") return "en";
  const cookies = document.cookie.split(";").map((c) => c.trim());
  for (const c of cookies) {
    if (c.startsWith(`${COOKIE_NAME}=`)) {
      const value = c.slice(COOKIE_NAME.length + 1);
      const target = value.split("/").pop();
      if (target === "it") return "it";
    }
  }
  return "en";
}

function writeCookie(lang: Lang) {
  const host = window.location.hostname;
  const domainCandidates = ["", host, `.${host}`];

  // Clear existing cookie across all plausible domain scopes
  for (const d of domainCandidates) {
    const domainAttr = d ? `; domain=${d}` : "";
    document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domainAttr}`;
  }

  if (lang === "en") return;

  // Set the cookie that makes Google auto-translate on next page load
  const value = `/en/${lang}`;
  for (const d of domainCandidates) {
    const domainAttr = d ? `; domain=${d}` : "";
    document.cookie = `${COOKIE_NAME}=${value}; path=/${domainAttr}`;
  }
}

export function LanguageToggle() {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    setLang(readCookie());

    function initWidget(): boolean {
      const container = document.getElementById(CONTAINER_ID);
      if (!container) return false;
      if (container.dataset.initialized === "1") return true;
      if (!window.google?.translate?.TranslateElement) return false;

      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,it",
            layout:
              window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          CONTAINER_ID
        );
        container.dataset.initialized = "1";
        return true;
      } catch {
        return false;
      }
    }

    window.googleTranslateElementInit = () => {
      if (initWidget()) return;
      let attempts = 0;
      const poll = window.setInterval(() => {
        attempts += 1;
        if (initWidget() || attempts > 50) {
          window.clearInterval(poll);
        }
      }, 100);
    };

    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else if (window.google?.translate) {
      window.googleTranslateElementInit();
    }
  }, []);

  function handleChange(next: Lang) {
    if (next === lang) return;
    writeCookie(next);
    window.location.reload();
  }

  return (
    <>
      {/* Hidden container Google Translate needs to initialize */}
      <div id={CONTAINER_ID} className="google-translate-host" aria-hidden="true" />

      {/* Visible EN / IT toggle */}
      <div
        className="inline-flex items-center rounded-full bg-white/10 border border-white/20 p-0.5"
        role="group"
        aria-label="Language"
      >
        <button
          type="button"
          onClick={() => handleChange("en")}
          aria-pressed={lang === "en"}
          className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            lang === "en"
              ? "bg-accent text-midnight"
              : "text-white/80 hover:text-white"
          }`}
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => handleChange("it")}
          aria-pressed={lang === "it"}
          className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            lang === "it"
              ? "bg-accent text-midnight"
              : "text-white/80 hover:text-white"
          }`}
        >
          IT
        </button>
      </div>
    </>
  );
}