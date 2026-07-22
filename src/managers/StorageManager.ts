export class StorageManager {
  public saveBool(key: string, value: boolean): void {
    localStorage.setItem(key, value ? '1' : '0');
  }

  public loadBool(key: string, fallback = false): boolean {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      return fallback;
    }
    return raw === '1';
  }
}
