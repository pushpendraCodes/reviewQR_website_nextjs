/** Must match LANGUAGE_RULES in be/src/config/reviewLanguages.js. */
export const REVIEW_LANGUAGE_LIST = [
    { id: "en", label: "English", name: "English", group: "india" },
    { id: "hi", label: "हिंदी", name: "Hindi", group: "india" },
    { id: "hinglish", label: "Hinglish", name: "Hindi in English letters", group: "india" },
    { id: "mr", label: "मराठी", name: "Marathi", group: "india" },
    { id: "bn", label: "বাংলা", name: "Bengali", group: "india" },
    { id: "ta", label: "தமிழ்", name: "Tamil", group: "india" },
    { id: "te", label: "తెలుగు", name: "Telugu", group: "india" },
    { id: "gu", label: "ગુજરાતી", name: "Gujarati", group: "india" },
    { id: "kn", label: "ಕನ್ನಡ", name: "Kannada", group: "india" },
    { id: "ml", label: "മലയാളം", name: "Malayalam", group: "india" },
    { id: "pa", label: "ਪੰਜਾਬੀ", name: "Punjabi", group: "india" },
    { id: "ur", label: "اردو", name: "Urdu", group: "india" },
    { id: "zh", label: "中文", name: "Mandarin Chinese", group: "world" },
    { id: "es", label: "Español", name: "Spanish", group: "world" },
    { id: "fr", label: "Français", name: "French", group: "world" },
    { id: "ar", label: "العربية", name: "Arabic", group: "world" },
    { id: "pt", label: "Português", name: "Portuguese", group: "world" },
    { id: "ru", label: "Русский", name: "Russian", group: "world" },
    { id: "de", label: "Deutsch", name: "German", group: "world" },
    { id: "ja", label: "日本語", name: "Japanese", group: "world" },
    { id: "id", label: "Bahasa Indonesia", name: "Indonesian", group: "world" },
] as const;

export type ReviewLanguage = (typeof REVIEW_LANGUAGE_LIST)[number]["id"];

export const ALL_REVIEW_LANGUAGES: ReviewLanguage[] = REVIEW_LANGUAGE_LIST.map((l) => l.id);

/** Offered when an owner hasn't chosen languages yet. */
export const DEFAULT_REVIEW_LANGUAGES: ReviewLanguage[] = ["en", "hi", "hinglish", "mr"];
