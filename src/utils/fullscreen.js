/**
 * Utilities for Mobile Fullscreen Detection & Management
 * Strictly applies ONLY to mobile/tablet devices, never desktop.
 */

export function isMobileDevice() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;

  const ua = navigator.userAgent || navigator.vendor || window.opera || '';

  // 1. Check navigator.userAgentData if available
  if (navigator.userAgentData && typeof navigator.userAgentData.mobile === 'boolean') {
    if (navigator.userAgentData.mobile) return true;
  }

  // 2. Explicit mobile device user agents
  const isMobileUA =
    /Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|webOS|CriOS|FxiOS/i.test(
      ua
    );

  // 3. Touch screen capability
  const isTouch =
    'ontouchstart' in window ||
    (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 0);

  // 4. iPad on iOS 13+ (reports Macintosh in UA, but has multi-touch)
  const isIPad =
    (/Macintosh/i.test(ua) && isTouch && navigator.maxTouchPoints > 1) ||
    /iPad/i.test(ua);

  if (isIPad) return true;
  if (isMobileUA) return true;

  // 5. Exclude standard desktop OS
  const isDesktopOS = /Macintosh|Windows NT|Linux x86_64|CrOS/i.test(ua);
  if (isDesktopOS) {
    return false;
  }

  // Fallback for smaller touch-based mobile screens
  return isTouch && (window.innerWidth <= 1024 || window.innerHeight <= 1024);
}

export function isFullscreenActive() {
  if (typeof document === 'undefined') return false;
  return Boolean(
    document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
  );
}

export function requestMobileFullscreen() {
  // STRICT GUARD: Desktop should NEVER enter fullscreen!
  if (!isMobileDevice()) return;

  if (isFullscreenActive()) return;

  const docEl = document.documentElement;
  try {
    if (docEl.requestFullscreen) {
      docEl.requestFullscreen().catch(() => {});
    } else if (docEl.webkitRequestFullscreen) {
      docEl.webkitRequestFullscreen().catch(() => {});
    } else if (docEl.mozRequestFullScreen) {
      docEl.mozRequestFullScreen().catch(() => {});
    } else if (docEl.msRequestFullscreen) {
      docEl.msRequestFullscreen().catch(() => {});
    }
  } catch {
    // Graceful fallback if browser restricts fullscreen
  }
}

export function exitFullscreen() {
  if (!isFullscreenActive()) return;
  try {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen().catch(() => {});
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen().catch(() => {});
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen().catch(() => {});
    }
  } catch {
    // Fallback
  }
}

export function toggleMobileFullscreen() {
  if (!isMobileDevice()) return;
  if (isFullscreenActive()) {
    exitFullscreen();
  } else {
    requestMobileFullscreen();
  }
}
