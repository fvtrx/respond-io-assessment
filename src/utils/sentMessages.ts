export type StoredMessage = {
  id: number;
  userId: number;
  body: string;
  createdAt: string;
};

function storageKey(accountId: string, contactId: number): string {
  return `chatly_sent_${accountId}_${contactId}`;
}

function readMessages(accountId: string, contactId: number): StoredMessage[] {
  try {
    const raw = localStorage.getItem(storageKey(accountId, contactId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeMessages(
  accountId: string,
  contactId: number,
  messages: StoredMessage[],
): void {
  try {
    localStorage.setItem(
      storageKey(accountId, contactId),
      JSON.stringify(messages),
    );
  } catch {}
}

export function getSentMessages(
  accountId: string,
  contactId: number,
): StoredMessage[] {
  return readMessages(accountId, contactId);
}

export function saveSentMessage(
  accountId: string,
  contactId: number,
  message: StoredMessage,
): void {
  const existing = readMessages(accountId, contactId);
  const exists = existing.some((m) => m.id === message.id);
  const updated = exists
    ? existing.map((m) => (m.id === message.id ? message : m))
    : [...existing, message];
  writeMessages(accountId, contactId, updated);
}
