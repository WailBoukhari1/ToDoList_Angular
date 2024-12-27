import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task } from '../models/task.model';
import { TaskService } from './task.service';

export interface SearchFilters {
  query: string;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private readonly searchFilters = new BehaviorSubject<SearchFilters>({ query: '' });
  private readonly searchFilters$ = this.searchFilters.asObservable();

  constructor(private taskService: TaskService) {}

  getFilteredTasks(): Observable<Task[]> {
    return combineLatest([
      this.taskService.getTasks(),
      this.searchFilters$
    ]).pipe(
      map(([tasks, filters]) => this.filterTasks(tasks, filters))
    );
  }

  searchTasks(query: string): void {
    this.searchFilters.next({ query });
  }

  private filterTasks(tasks: Task[], filters: SearchFilters): Task[] {
    const { query } = filters;
    if (!query) return tasks;

    const searchTerm = query.toLowerCase();
    return tasks.filter(task => 
      this.isTaskMatchingSearch(task, searchTerm)
    );
  }

  private isTaskMatchingSearch(task: Task, searchTerm: string): boolean {
    return (
      task.title.toLowerCase().includes(searchTerm) ||
      task.description?.toLowerCase().includes(searchTerm) ||
      task.status.toLowerCase().includes(searchTerm) ||
      task.priority.toLowerCase().includes(searchTerm)
    );
  }
} 