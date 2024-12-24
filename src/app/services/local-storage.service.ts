import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly TASKS_KEY = 'tasks';
  private readonly CATEGORIES_KEY = 'categories';

  constructor() {
    // Initialize storage if empty
    if (!this.getTasks()) {
      this.setTasks([]);
    }
    if (!this.getCategories()) {
      this.setCategories([]);
    }
  }

  // Tasks
  getTasks(): Task[] {
    const tasks = localStorage.getItem(this.TASKS_KEY);
    return tasks ? JSON.parse(tasks) : [];
  }

  setTasks(tasks: Task[]): void {
    localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
  }

  addTask(task: Task): void {
    const tasks = this.getTasks();
    tasks.push(task);
    this.setTasks(tasks);
  }

  updateTask(taskId: string, updatedTask: Task): void {
    const tasks = this.getTasks();
    const index = tasks.findIndex(task => task.id === taskId);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updatedTask };
      this.setTasks(tasks);
    }
  }

  deleteTask(taskId: string): void {
    const tasks = this.getTasks();
    const filteredTasks = tasks.filter(task => task.id !== taskId);
    this.setTasks(filteredTasks);
  }

  // Categories
  getCategories(): Category[] {
    const categories = localStorage.getItem(this.CATEGORIES_KEY);
    return categories ? JSON.parse(categories) : [];
  }

  setCategories(categories: Category[]): void {
    localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories));
  }

  addCategory(category: Category): void {
    const categories = this.getCategories();
    categories.push(category);
    this.setCategories(categories);
  }

  updateCategory(categoryId: string, updatedCategory: Category): void {
    const categories = this.getCategories();
    const index = categories.findIndex(category => category.id === categoryId);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...updatedCategory };
      this.setCategories(categories);
    }
  }

  deleteCategory(categoryId: string): void {
    const categories = this.getCategories();
    const filteredCategories = categories.filter(category => category.id !== categoryId);
    this.setCategories(filteredCategories);

    // Also remove category reference from tasks
    const tasks = this.getTasks();
    const updatedTasks = tasks.map(task => {
      if (task.categoryId === categoryId) {
        return { ...task, categoryId: null };
      }
      return task;
    });
    this.setTasks(updatedTasks);
  }

  // Utility methods
  clearStorage(): void {
    localStorage.removeItem(this.TASKS_KEY);
    localStorage.removeItem(this.CATEGORIES_KEY);
  }

  getCategoryById(categoryId: string): Category | null {
    const categories = this.getCategories();
    return categories.find(category => category.id === categoryId) || null;
  }

  getTaskById(taskId: string): Task | null {
    const tasks = this.getTasks();
    return tasks.find(task => task.id === taskId) || null;
  }

  // Search and filter methods
  searchTasks(query: string): Task[] {
    const tasks = this.getTasks();
    return tasks.filter(task => 
      task.title.toLowerCase().includes(query.toLowerCase()) ||
      task.description?.toLowerCase().includes(query.toLowerCase())
    );
  }

  getTasksByCategory(categoryId: string): Task[] {
    const tasks = this.getTasks();
    return tasks.filter(task => task.categoryId === categoryId);
  }

  getTasksByStatus(status: string): Task[] {
    const tasks = this.getTasks();
    return tasks.filter(task => task.status === status);
  }
}
