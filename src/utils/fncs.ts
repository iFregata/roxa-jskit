export function pick(original: object, ...keys: string[]) {
  const filteredEntries = Object.entries(original).filter(([key, _val]) =>
    keys.includes(key)
  );
  return Object.fromEntries(filteredEntries);
}

export const rfc339Datetime = () => {
  return new Date().toISOString();
};

