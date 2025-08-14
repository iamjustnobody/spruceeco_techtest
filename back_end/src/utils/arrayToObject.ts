/**
 * Helper: converts named parameters (:param) into $1, $2, $3 positional parameters
 * Returns { text, values } for pg query
 */
export function namedToPositional(sql: string, params: Record<string, any>) {
  const values: any[] = [];
  const nameIndexMap: Record<string, number> = {};
  const text = sql.replace(/:([a-zA-Z_]\w*)/g, (_, name) => {
    if (!(name in nameIndexMap)) {
      values.push(params[name]);
      nameIndexMap[name] = values.length; // 1-based
    }
    return `$${nameIndexMap[name]}`;
  });
  return { text, values };
}
