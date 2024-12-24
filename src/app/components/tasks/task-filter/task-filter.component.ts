import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material.module';
import { CategoryService } from '../../../services/category.service';
import { Observable } from 'rxjs';
import { Category } from '../../../models/category.model';
import { Status, Priority } from '../../../models/task.model';

interface TaskFilters {
  status?: Status;
  priority?: Priority;
  category?: string;
}

@Component({
  selector: 'app-task-filter',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `
    <mat-form-field appearance="outline" class="filter-field">
      <mat-label>Filter by Category</mat-label>
      <mat-select (selectionChange)="onCategoryChange($event.value)">
        <mat-option value="">All Categories</mat-option>
        @for (category of categories$ | async; track category.id) {
          <mat-option [value]="category.id">{{ category.name }}</mat-option>
        }
      </mat-select>
    </mat-form-field>
  `,
  styles: [`
    .filter-field {
      width: 200px;
    }
  `]
})
export class TaskFilterComponent {
  categories$: Observable<Category[]>;
  @Output() filterChange = new EventEmitter<TaskFilters>();

  constructor(private categoryService: CategoryService) {
    this.categories$ = this.categoryService.getCategories();
  }

  onCategoryChange(categoryId: string): void {
    this.filterChange.emit({ category: categoryId });
  }

  updateFilters(filters: TaskFilters): void {
    this.filterChange.emit(filters);
  }
} 