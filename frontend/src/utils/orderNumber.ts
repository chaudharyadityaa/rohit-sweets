/**
 * TEMPORARY order reference, generated in the browser.
 * Replaced in Checkpoint 12 by sequential numbers (RS-1001, RS-1002, ...) from the backend.
 */
export function generateTempOrderNumber(now: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  const date = `${pad(now.getMonth() + 1)}${pad(now.getDate())}`
  const time = `${pad(now.getHours())}${pad(now.getMinutes())}`
  const random = pad(Math.floor(Math.random() * 100))
  return `RS-${date}-${time}-${random}`
}