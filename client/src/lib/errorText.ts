export function toErrorText(value: unknown): string {
  if (!value) return '';
  if (typeof value === 'string') return value;

  if (Array.isArray(value)) {
    return value
      .map((item) => toErrorText(item))
      .map((item) => item.trim())
      .filter(Boolean)
      .join(', ');
  }

  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    if (typeof obj.path === 'string' && typeof obj.message === 'string') {
      return `${obj.path}: ${obj.message}`;
    }
    if (typeof obj.message === 'string') return obj.message;

    return Object.values(obj)
      .map((item) => toErrorText(item))
      .map((item) => item.trim())
      .filter(Boolean)
      .join(', ');
  }

  return String(value);
}
