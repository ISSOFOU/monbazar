// Formats an ISO timestamp into a short, human-readable French string.
export function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return iso;

  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.round(diffMs / 60000);

  if (diffMin < 1) return "À l'instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `Il y a ${diffH} h`;
  const diffD = Math.round(diffH / 24);
  if (diffD === 1) return 'Hier';
  if (diffD < 7) return `Il y a ${diffD} j`;

  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Short time for chat message bubbles (HH:MM).
export function formatMessageTime(iso: string): string {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return iso;
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}
