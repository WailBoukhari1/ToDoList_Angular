import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly TASKS_KEY = 'tasks';
  private readonly CATEGORIES_KEY = 'categories';

  saveCategories(categories: any[]): void {
    localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories));
  }

  getCategories(): any[] {
    const data = localStorage.getItem(this.CATEGORIES_KEY);
    return data ? JSON.parse(data) : [];
  }

  saveTasks(tasks: any[]): void {
    localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
  }

  getTasks(): any[] {
    const data = localStorage.getItem(this.TASKS_KEY);
    return data ? JSON.parse(data) : [];
  }

  clearAll(): void {
    localStorage.removeItem(this.TASKS_KEY);
    localStorage.removeItem(this.CATEGORIES_KEY);
  }
} 