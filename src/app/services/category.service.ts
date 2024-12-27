import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly categories = new BehaviorSubject<Category[]>([]);
  readonly categories$ = this.categories.asObservable();

  constructor(private storageService: LocalStorageService) {
    this.initializeCategories();
  }

  private initializeCategories(): void {
    const savedCategories = this.storageService.getCategories();
    this.categories.next(savedCategories);
  }

  getCategories(): Observable<Category[]> {
    return this.categories$;
  }

  private isCategoryNameTaken(name: string, excludeId?: string): boolean {
    return this.categories.value.some(category => 
      category.name.toLowerCase() === name.toLowerCase() && 
      category.id !== excludeId
    );
  }

  addCategory(name: string): Category {
    if (this.isCategoryNameTaken(name)) {
      throw new Error('A category with this name already exists');
    }

    const newCategory: Category = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.updateCategories([...this.categories.value, newCategory]);
    return newCategory;
  }

  updateCategory(id: string, name: string): Category {
    if (this.isCategoryNameTaken(name, id)) {
      throw new Error('A category with this name already exists');
    }

    const updatedCategories = this.categories.value.map(category => 
      category.id === id 
        ? { ...category, name, updatedAt: new Date() }
        : category
    );
    
    this.updateCategories(updatedCategories);
    return updatedCategories.find(c => c.id === id)!;
  }

  deleteCategory(id: string): void {
    this.updateCategories(
      this.categories.value.filter(category => category.id !== id)
    );
  }

  getCategoryById(id: string): Category | undefined {
    return this.categories.value.find(category => category.id === id);
  }

  private updateCategories(categories: Category[]): void {
    this.categories.next(categories);
    this.storageService.setCategories(categories);
  }
}
