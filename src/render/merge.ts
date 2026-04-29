type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

export function deepMerge<T extends JsonValue>(base: T, override: T): T {
  if (Array.isArray(base) && Array.isArray(override)) {
    return [...base, ...override] as T;
  }

  if (
    typeof base === 'object' &&
    typeof override === 'object' &&
    base !== null &&
    override !== null &&
    !Array.isArray(base) &&
    !Array.isArray(override)
  ) {
    const result: Record<string, JsonValue> = { ...base };

    for (const [key, value] of Object.entries(override)) {
      const current = result[key];
      result[key] = current === undefined ? value : deepMerge(current, value);
    }

    return result as T;
  }

  return override;
}
