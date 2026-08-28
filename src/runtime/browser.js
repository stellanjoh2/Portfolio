export function isSafari() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return /Safari/i.test(ua) && !/(Chrome|Chromium|CriOS|Edg|OPR|Brave|SamsungBrowser)/i.test(ua);
}
