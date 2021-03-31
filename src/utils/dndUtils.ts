export function generateUniqueId(id: string, suffix: string): string {
  return id + '_' + suffix;
}

export function extractId(uniqueId: string): string {
  return uniqueId.substring(0, uniqueId.indexOf('_'));
}
