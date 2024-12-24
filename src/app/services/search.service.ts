import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { Task } from '../models/task.model';
import { TaskService } from './task.service';

export interface SearchFilters {
  query: string;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchFilters = new BehaviorSubject<SearchFilters>({ query: '' });

  constructor(private taskService: TaskService) {}

  getFilteredTasks(): Observable<Task[]> {
    return combineLatest([
      this.taskService.getTasks(),
      this.searchFilters
    ]).pipe(
      map(([tasks, filters]) => {
        const { query } = filters;
        if (!query) return tasks;

        const searchTerm = query.toLowerCase();
        return tasks.filter(task => 
          task.title.toLowerCase().includes(searchTerm) ||
          task.description?.toLowerCase().includes(searchTerm) ||
          task.status.toLowerCase().includes(searchTerm) ||
          task.priority.toLowerCase().includes(searchTerm)
        );
      })
    );
  }

  searchTasks(query: string): void {
    this.searchFilters.next({ query });
  }
} 