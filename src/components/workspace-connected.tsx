import { workspace } from "@/lib/data";

/**
 * The green "Workspace connected" pill shared by the floating top bar and the
 * workspace row. Renders nothing when the demo workspace is offline.
 */
export function WorkspaceConnected({ className = "" }: { className?: string }) {
  if (!workspace.connected) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-emerald-200/70 bg-emerald-50/80 px-2.5 py-1 text-[11px] font-medium text-emerald-700 ${className}`}
    >
      <span
        className="h-1.5 w-1.5 rounded-full bg-emerald-500"
        aria-hidden="true"
      />
      Workspace connected
    </span>
  );
}
