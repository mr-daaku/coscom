import { ActionButton } from "./primitives";

export function Topbar({
  title,
  onToggleSidebar,
  onLogout,
}: {
  title: string;
  onToggleSidebar: () => void;
  onLogout: () => void;
}) {
  const refresh = () => {
    if (typeof window !== "undefined") window.location.reload();
  };

  const fullscreen = () => {
    if (typeof document === "undefined") return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen?.();
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-none lg:px-6">
      <button
        onClick={onToggleSidebar}
        aria-label="Toggle navigation"
        className="grid size-9 place-items-center rounded-lg border border-border text-sm lg:hidden"
      >
        ☰
      </button>
      <h2 className="flex-1 truncate text-sm font-semibold lg:text-base">{title}</h2>

      <div className="hidden w-[240px] items-center gap-2 rounded-lg border border-border bg-surface/60 px-3 py-2 md:flex">
        <span className="text-xs text-subtle">🔍</span>
        <input
          placeholder="Search payments, invoices…"
          className="w-full bg-transparent text-xs outline-none placeholder:text-subtle"
        />
      </div>

      <div className="flex items-center gap-1.5">
        <button
          aria-label="Notifications"
          className="relative grid size-9 place-items-center rounded-lg border border-border text-sm transition-all duration-200 hover:bg-surface"
        >
          🔔
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive" />
        </button>
        <button
          onClick={refresh}
          aria-label="Refresh"
          className="grid size-9 place-items-center rounded-lg border border-border text-sm transition-all duration-200 hover:bg-surface"
        >
          🔄
        </button>
        <button
          onClick={fullscreen}
          aria-label="Fullscreen"
          className="grid size-9 place-items-center rounded-lg border border-border text-sm transition-all duration-200 hover:bg-surface"
        >
          ⛶
        </button>
        <ActionButton variant="ghost" onClick={onLogout} className="ml-1 hidden sm:inline-flex">
          Log out
        </ActionButton>
      </div>
    </header>
  );
}
