import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categories = new BehaviorSubject<Category[]>([]);

  constructor(private storageService: StorageService) {
    const savedCategories = this.storageService.getCategories();
    this.categories.next(savedCategories);
  }

  getCategories(): Observable<Category[]> {
    return this.categories.asObservable();
  }

  private isCategoryNameTaken(name: string, excludeId?: string): boolean {
    return this.categories.value.some(category => 
      category.name.toLowerCase() === name.toLowerCase() && 
      category.id !== excludeId
    );
  }

  addCategory(name: string): void {
    if (this.isCategoryNameTaken(name)) {
      throw new Error('A category with this name already exists');
    }

    const newCategory: Category = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const currentCategories = this.categories.value;
    const updatedCategories = [...currentCategories, newCategory];
    
    this.categories.next(updatedCategories);
    this.storageService.saveCategories(updatedCategories);
  }

  updateCategory(id: string, name: string): void {
    if (this.isCategoryNameTaken(name, id)) {
      throw new Error('A category with this name already exists');
    }

    const currentCategories = this.categories.value;
    const updatedCategories = currentCategories.map(category => 
      category.id === id 
        ? { ...category, name, updatedAt: new Date() }
        : category
    );
    
    this.categories.next(updatedCategories);
    this.storageService.saveCategories(updatedCategories);
  }

  deleteCategory(id: string): void {
    const currentCategories = this.categories.value;
    const updatedCategories = currentCategories.filter(category => category.id !== id);
    
    this.categories.next(updatedCategories);
    this.storageService.saveCategories(updatedCategories);
  }

  getCategoryById(id: string): Category | undefined {
    return this.categories.value.find(category => category.id === id);
  }
}
