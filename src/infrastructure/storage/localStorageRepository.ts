import { Logger } from '../logger/logger';

export class LocalStorageRepository<T> {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  public getAll(): T[] {
    try {
      const data = localStorage.getItem(this.key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      Logger.error(`Error reading from localStorage key: ${this.key}`, error);
      return [];
    }
  }

  public saveAll(items: T[]): void {
    try {
      localStorage.setItem(this.key, JSON.stringify(items));
      Logger.info(`Saved data to localStorage key: ${this.key}`);
    } catch (error) {
      Logger.error(`Error saving to localStorage key: ${this.key}`, error);
    }
  }

  public add(item: T): void {
    const items = this.getAll();
    items.push(item);
    this.saveAll(items);
  }

  public update(id: string, updatedItem: T, idField: keyof T = 'id' as keyof T): void {
    const items = this.getAll();
    const index = items.findIndex(item => item[idField] === id);
    if (index !== -1) {
      items[index] = updatedItem;
      this.saveAll(items);
    }
  }

  public remove(id: string, idField: keyof T = 'id' as keyof T): void {
    const items = this.getAll();
    const filteredItems = items.filter(item => item[idField] !== id);
    this.saveAll(filteredItems);
  }
}
