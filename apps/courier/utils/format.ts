/**
 * Human-readable duration for the analytics cards.
 * Under a minute → seconds, under an hour → minutes, under a day → `1 soat 20 daq`,
 * beyond that → `3 kun 4 soat` (stale orders can produce very long spans).
 */
export const formatDuration = (
  seconds: number | null | undefined,
  units: { sec: string; min: string; hour: string; day: string }
): string | null => {
  if (seconds === null || seconds === undefined || seconds < 0) return null;

  if (seconds < 60) return `${Math.round(seconds)} ${units.sec}`;

  const totalMinutes = Math.round(seconds / 60);
  if (totalMinutes < 60) return `${totalMinutes} ${units.min}`;

  const totalHours = Math.floor(totalMinutes / 60);
  if (totalHours < 24) {
    const minutes = totalMinutes % 60;
    return minutes > 0
      ? `${totalHours} ${units.hour} ${minutes} ${units.min}`
      : `${totalHours} ${units.hour}`;
  }

  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  return hours > 0
    ? `${days} ${units.day} ${hours} ${units.hour}`
    : `${days} ${units.day}`;
};
