import { getNextReset } from "../service/api/api";

// Ambil waktu reset berikutnya dari API
export async function fetchNextReset() {
  const res = await getNextReset();
  if (res.data.next_reset) {
    return new Date(res.data.next_reset);
  }
  return null;
}

// Hitung countdown dari waktu reset
export function calculateCountdown(nextReset) {
  if (!nextReset) return { hours: 0, minutes: 0, seconds: 0 };
  const now = new Date();
  const diff = nextReset - now;
  if (diff > 0) {
    const hours = Math.floor(diff / 1000 / 3600);
    const minutes = Math.floor((diff / 1000 % 3600) / 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { hours, minutes, seconds };
  }
  return { hours: 0, minutes: 0, seconds: 0 };
}