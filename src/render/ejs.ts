export function renderTemplate(content: string, data: Record<string, string | boolean>): string {
  return content.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_match, key: string) => {
    const value = data[key];
    return value === undefined ? '' : String(value);
  });
}
