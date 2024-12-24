import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Task } from '../models/task.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks = new BehaviorSubject<Task[]>([]);

  constructor(private storageService: StorageService) {
    const savedTasks = this.storageService.getTasks();
    this.tasks.next(savedTasks);
  }

  getTasks(): Observable<Task[]> {
    return this.tasks.asObservable();
  }

  addTask(task: Partial<Task>): void {
    const newTask: Task = {
      id: crypto.randomUUID(),
      ...task,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Task;
    
    const currentTasks = this.tasks.value;
    const updatedTasks = [...currentTasks, newTask];
    
    this.tasks.next(updatedTasks);
    this.storageService.saveTasks(updatedTasks);
  }

  updateTask(id: string, updates: Partial<Task>): void {
    const currentTasks = this.tasks.value;
    const updatedTasks = currentTasks.map(task => 
      task.id === id 
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    );
    
    this.tasks.next(updatedTasks);
    this.storageService.saveTasks(updatedTasks);
  }

  deleteTask(id: string): void {
    const currentTasks = this.tasks.value;
    const updatedTasks = currentTasks.filter(task => task.id !== id);
    
    this.tasks.next(updatedTasks);
    this.storageService.saveTasks(updatedTasks);
  }

  getTaskById(id: string): Observable<Task | undefined> {
    return this.tasks.asObservable().pipe(
      map(tasks => tasks.find(task => task.id === id))
    );
  }
}
