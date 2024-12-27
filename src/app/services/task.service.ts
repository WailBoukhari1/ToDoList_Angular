import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Status, Task } from '../models/task.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly tasks = new BehaviorSubject<Task[]>([]);
  private readonly overdueTasksCount = new BehaviorSubject<number>(0);
  
  readonly tasks$ = this.tasks.asObservable();
  readonly overdueTasks$ = this.overdueTasksCount.asObservable();

  constructor(private storageService: LocalStorageService) {
    this.initializeTasks();
  }

  private initializeTasks(): void {
    const savedTasks = this.storageService.getTasks();
    this.tasks.next(savedTasks);
    this.updateOverdueTasks();
  }

  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  addTask(task: Partial<Task>): Task {
    const newTask: Task = {
      id: crypto.randomUUID(),
      ...task,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Task;
    
    this.updateTasks([...this.tasks.value, newTask]);
    return newTask;
  }

  updateTask(id: string, updates: Partial<Task>): Task {
    const updatedTasks = this.tasks.value.map(task => 
      task.id === id 
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    );
    
    this.updateTasks(updatedTasks);
    return updatedTasks.find(t => t.id === id)!;
  }

  deleteTask(id: string): void {
    this.updateTasks(
      this.tasks.value.filter(task => task.id !== id)
    );
  }

  getTaskById(id: string): Observable<Task | undefined> {
    return this.tasks$.pipe(
      map(tasks => tasks.find(task => task.id === id))
    );
  }

  private updateTasks(tasks: Task[]): void {
    this.tasks.next(tasks);
    this.storageService.setTasks(tasks);
    this.updateOverdueTasks();
  }

  private updateOverdueTasks(): void {
    const now = new Date();
    const overdueCount = this.tasks.value.filter(task => 
      task.dueDate && 
      new Date(task.dueDate) < now && 
      task.status !== Status.COMPLETED
    ).length;
    this.overdueTasksCount.next(overdueCount);
  }
}
