import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { LocalStorageService } from './local-storage.service';
import { v4 as uuidv4 } from 'uuid';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);

  constructor(private storageService: LocalStorageService) {
    this.loadTasks();
  }

  private loadTasks(): void {
    const tasks = this.storageService.getTasks();
    this.tasksSubject.next(tasks);
  }

  getTasks(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  addTask(taskData: Partial<Task>): void {
    const task: Task = {
      id: uuidv4(),
      ...taskData,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Task;

    const currentTasks = this.tasksSubject.value;
    this.tasksSubject.next([...currentTasks, task]);
    this.storageService.setTasks(this.tasksSubject.value);
  }

  updateTask(taskId: string, taskData: Partial<Task>): void {
    const currentTasks = this.tasksSubject.value;
    const updatedTasks = currentTasks.map(task => 
      task.id === taskId 
        ? { ...task, ...taskData, updatedAt: new Date() }
        : task
    );

    this.tasksSubject.next(updatedTasks);
    this.storageService.setTasks(updatedTasks);
  }

  deleteTask(taskId: string): void {
    const currentTasks = this.tasksSubject.value;
    const updatedTasks = currentTasks.filter(task => task.id !== taskId);
    
    this.tasksSubject.next(updatedTasks);
    this.storageService.setTasks(updatedTasks);
  }

  getTaskById(taskId: string): Observable<Task | null> {
    return this.tasksSubject.asObservable().pipe(
      map(tasks => tasks.find(task => task.id === taskId) || null)
    );
  }
}
