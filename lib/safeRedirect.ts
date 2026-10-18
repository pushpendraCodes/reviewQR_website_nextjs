/** Only same-site paths are allowed as post-login destinations (blocks `//evil.com`, `https://…`, `/\evil.com`). */
export const safeRedirect = (value: string | null | undefined, fallback = "/dashboard"): string => {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return fallback;
  return value;
};
