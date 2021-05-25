export function removeKeys(obj: Record<string, unknown>, keys: string[]): Record<string, unknown> {
  const copy = { ...obj };
  for (const key of keys) {
    delete copy[key];
  }
  return copy;
}

export function joinToArray(array: string[], separator: string): string[] {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    result.push(array[i]);
    if (i < array.length - 1) {
      result.push(separator);
    }
  }
  return result;
}
