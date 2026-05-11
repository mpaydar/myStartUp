"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

function subscribeIsClient(onStoreChange: () => void) {
  void onStoreChange;
  return () => {};
}

function getIsClientSnapshot() {
  return true;
}

function getIsClientServerSnapshot() {
  return false;
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
};

export function Reveal({
  children,
  className = "",
  delayMs = 0,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isClient = useSyncExternalStore(
    subscribeIsClient,
    getIsClientSnapshot,
    getIsClientServerSnapshot,
  );
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isClient || reducedMotion) return;

    const el = ref.current;
    if (!el) return;

    const markIfInView = () => {
      const r = el.getBoundingClientRect();
      const margin = 80;
      if (r.top < window.innerHeight + margin && r.bottom > -margin) {
        setVisible(true);
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setVisible(true);
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -32px 0px" },
    );

    io.observe(el);
    markIfInView();
    return () => io.disconnect();
  }, [isClient, reducedMotion]);

  const skipMotion = !isClient || reducedMotion;
  const hidden = isClient && !reducedMotion && !visible;

  const motionClass = skipMotion
    ? ""
    : `transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        hidden ? "translate-y-6 opacity-0" : "translate-y-0 opacity-100"
      }`;

  return (
    <div
      ref={ref}
      className={`${motionClass} ${className}`.trim()}
      style={
        skipMotion || hidden
          ? undefined
          : { transitionDelay: `${delayMs}ms` }
      }
    >
      {children}
    </div>
  );
}
