export type LineIconName =
  | "build"
  | "remodel"
  | "kitchen"
  | "outdoor"
  | "repair"
  | "visit"
  | "quality"
  | "communication"
  | "location"
  | "team"
  | "schedule"
  | "clarity"
  | "phone"
  | "email"
  | "whatsapp"
  | "map"
  | "shield";

export default function LineIcon({
  name,
  className = "h-6 w-6",
}: {
  name: LineIconName;
  className?: string;
}) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...common}>
      {name === "build" ? <path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6M8 10h.01M16 10h.01" /> : null}
      {name === "remodel" ? <path d="m4 20 6.5-6.5m2-2L20 4m-4-1 5 5M3 16l5 5M14 7l3 3M7 14l3 3" /> : null}
      {name === "kitchen" ? <path d="M4 5h16v14H4zM4 11h16M9 11v8M15 11v8M7 8h3M14 8h3" /> : null}
      {name === "outdoor" ? <path d="M3 20h18M6 20v-7h12v7M4 13l8-8 8 8M12 5V2M8 7 6 4M16 7l2-3" /> : null}
      {name === "repair" ? <path d="M14.5 6.5a4 4 0 0 0-5-5l2.2 2.2-2 2-2.2-2.2a4 4 0 0 0 5 5L20 16a2.8 2.8 0 1 1-4 4l-7.5-7.5a4 4 0 0 0-5-5" /> : null}
      {name === "visit" ? <path d="M4 20V8l8-5 8 5v12M8 20v-6h8v6M7 10h.01M17 10h.01" /> : null}
      {name === "quality" ? <path d="m12 3 2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L4.8 8.2l5-.7z" /> : null}
      {name === "communication" ? <path d="M4 5h16v11H9l-5 4zM8 9h8M8 12h5" /> : null}
      {name === "location" || name === "map" ? <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></> : null}
      {name === "team" ? <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2" /><path d="M3 20c.4-4 2.4-6 6-6s5.6 2 6 6M15 15c3 0 4.8 1.7 5 5" /></> : null}
      {name === "schedule" ? <><rect x="3" y="5" width="18" height="16" rx="1" /><path d="M7 3v4M17 3v4M3 10h18M8 14h3M13 14h3" /></> : null}
      {name === "clarity" ? <><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6S2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="2.5" /></> : null}
      {name === "phone" ? <path d="M7 3H4.5A1.5 1.5 0 0 0 3 4.5C3 13.6 10.4 21 19.5 21a1.5 1.5 0 0 0 1.5-1.5V17l-4-1-1.2 2a14.6 14.6 0 0 1-9.8-9.8L8 7z" /> : null}
      {name === "email" ? <><rect x="3" y="5" width="18" height="14" rx="1" /><path d="m3 6 9 7 9-7" /></> : null}
      {name === "whatsapp" ? <><path d="M20 11.5a8 8 0 0 1-11.8 7L3 20l1.5-5.1A8 8 0 1 1 20 11.5Z" /><path d="M8.2 8.2c.8 3.2 2.5 4.9 5.7 5.7l1.2-1.4 2 .9c-.3 1.8-1.5 2.6-3.1 2.4-4.5-.7-7.1-3.3-7.8-7.8-.2-1.6.6-2.8 2.4-3.1l.9 2z" /></> : null}
      {name === "shield" ? <path d="M12 3 20 6v5c0 5-3.4 8.2-8 10-4.6-1.8-8-5-8-10V6zM8.5 12l2.2 2.2 4.8-5" /> : null}
    </svg>
  );
}
