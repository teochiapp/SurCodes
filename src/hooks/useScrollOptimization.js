import { useEffect, useCallback, useRef, useState, useMemo } from 'react';

// ─── Detección de entornos WebView limitados (Instagram, Facebook, etc.) ───────
const isInstagramWebView = () => {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return /Instagram|FBAN|FBAV|FB_IAB|Line\/|KAKAOTALK|Twitter|Snapchat/i.test(ua);
};

const isLimitedWebView = () => {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  // WebView genérico en Android/iOS
  return isInstagramWebView() ||
    (/wv/.test(ua) && /Android/.test(ua)) ||
    (!/Safari/.test(ua) && /AppleWebKit/.test(ua) && /Mobile/.test(ua));
};

// ─── Throttle optimizado ──────────────────────────────────────────────────────
const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => { inThrottle = false; }, limit);
    }
  };
};

// ─── Hook global de scroll ────────────────────────────────────────────────────
export const useScrollOptimization = () => {
  const scrollTimerRef = useRef(null);
  const tickingRef = useRef(false);

  const handleScrollStart = useCallback(() => {
    document.body.classList.add('scrolling');
    document.body.style.setProperty('--scroll-active', '1');
  }, []);

  const handleScrollEnd = useCallback(() => {
    document.body.classList.remove('scrolling');
    document.body.style.setProperty('--scroll-active', '0');
  }, []);

  const throttledScrollEnd = useMemo(
    () => throttle(handleScrollEnd, 100),
    [handleScrollEnd]
  );

  useEffect(() => {
    const handleScroll = () => {
      if (!tickingRef.current) {
        requestAnimationFrame(() => {
          handleScrollStart();
          clearTimeout(scrollTimerRef.current);
          scrollTimerRef.current = setTimeout(() => {
            throttledScrollEnd();
          }, 100);
          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimerRef.current);
    };
  }, [handleScrollStart, throttledScrollEnd]);
};

// ─── Hook de visibilidad optimizado para WebViews ─────────────────────────────
/**
 * Reemplaza framer-motion useInView con un IntersectionObserver nativo.
 * En navegadores de Instagram y otros WebViews limitados:
 *   - Usa rootMargin 0px (sin margen negativo que puede fallar en WebViews)
 *   - Aplica un timeout de seguridad de 1.5 s para mostrar la sección igual
 */
export const useOptimizedInView = (ref, options = {}) => {
  const [inView, setInView] = useState(false);
  const limited = useMemo(() => isLimitedWebView(), []);

  useEffect(() => {
    // Si es un WebView limitado, mostrar todo inmediatamente
    if (limited) {
      setInView(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    // Timeout de seguridad: si el observer nunca dispara, forzar visibilidad
    const safetyTimer = setTimeout(() => {
      setInView(true);
    }, 1500);

    // Margen menos agresivo: 0px en WebViews, -50px en desktop
    const rootMargin = options.margin ?? '-50px';

    let observer;
    try {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setInView(true);
              clearTimeout(safetyTimer);
              observer.disconnect();
            }
          });
        },
        {
          rootMargin,
          threshold: 0.05,
        }
      );
      observer.observe(element);
    } catch {
      // Fallback si IntersectionObserver no está disponible
      setInView(true);
      clearTimeout(safetyTimer);
    }

    return () => {
      clearTimeout(safetyTimer);
      if (observer) observer.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, limited]);

  return inView;
};