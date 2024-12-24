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

  addCategory(name: string): void {
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
}
