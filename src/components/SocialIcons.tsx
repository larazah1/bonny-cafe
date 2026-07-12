const ICONS: Record<string, React.ReactNode> = {
  instagram: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
      <path
        d="M4 4l16 16M20 4 4 20"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <path
        d="M16.5 3c.3 2.2 1.8 3.8 4 4.1v2.9c-1.5.1-2.8-.4-4-1.2v6.1a5.4 5.4 0 1 1-5.4-5.4c.3 0 .6 0 .9.1v3a2.4 2.4 0 1 0 1.7 2.3V3h2.8Z"
        stroke="currentColor"
        strokeWidth="0.6"
        fill="currentColor"
      />
    </svg>
  ),
};

const LABELS: Record<string, string> = {
  instagram: "Instagram",
  x: "X",
  tiktok: "TikTok",
};

export function SocialIcons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex gap-3 ${className}`}>
      {Object.entries(ICONS).map(([key, icon]) => (
        <a
          key={key}
          href="#"
          aria-label={LABELS[key]}
          title={LABELS[key]}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-current/20 text-current transition-colors hover:bg-current/10"
        >
          {icon}
        </a>
      ))}
    </div>
  );
}
