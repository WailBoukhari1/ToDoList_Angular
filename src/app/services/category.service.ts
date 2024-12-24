import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly STORAGE_KEY = 'categories';
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  categories$ = this.categoriesSubject.asObservable();

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const categories = JSON.parse(stored, (key, value) => {
        if (key === 'createdAt' || key === 'updatedAt') {
          return new Date(value);
        }
        return value;
      });
      this.categoriesSubject.next(categories);
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.categoriesSubject.value));
  }

  getCategories(): Observable<Category[]> {
    return this.categories$;
  }

  getCategoryById(id: string): Observable<Category | undefined> {
    return this.categories$.pipe(
      map(categories => categories.find(category => category.id === id))
    );
  }

  addCategory(name: string): void {
    // Vérifier si la catégorie existe déjà
    const exists = this.categoriesSubject.value.some(
      cat => cat.name.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
      throw new Error('Une catégorie avec ce nom existe déjà');
    }

    const newCategory: Category = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const currentCategories = this.categoriesSubject.value;
    this.categoriesSubject.next([...currentCategories, newCategory]);
    this.saveToLocalStorage();
  }

  updateCategory(id: string, name: string): void {
    // Vérifier si le nouveau nom existe déjà pour une autre catégorie
    const exists = this.categoriesSubject.value.some(
      cat => cat.id !== id && cat.name.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
      throw new Error('Une catégorie avec ce nom existe déjà');
    }

    const currentCategories = this.categoriesSubject.value;
    const updatedCategories = currentCategories.map(category =>
      category.id === id
        ? { ...category, name, updatedAt: new Date() }
        : category
    );
    this.categoriesSubject.next(updatedCategories);
    this.saveToLocalStorage();
  }

  deleteCategory(id: string): void {
    const currentCategories = this.categoriesSubject.value;
    this.categoriesSubject.next(currentCategories.filter(category => category.id !== id));
    this.saveToLocalStorage();
  }
}
