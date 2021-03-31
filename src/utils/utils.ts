export function removeKeys(obj: Record<string, unknown>, keys: string[]): Record<string, unknown> {
  const copy = { ...obj };
  for (const key of keys) {
    delete copy[key];
  }
  return copy;
}
