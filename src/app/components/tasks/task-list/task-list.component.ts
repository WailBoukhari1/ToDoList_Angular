import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { CategoryService } from '../../../services/category.service';
import { Task, Status, Priority } from '../../../models/task.model';
import { Category } from '../../../models/category.model';
import { Observable, map } from 'rxjs';
import { MaterialModule } from '../../../shared/material.module';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { TaskSearchComponent } from '../../task-search/task-search.component';
import { SearchService } from '../../../services/search.service';
import { TaskFilterComponent } from '../task-filter/task-filter.component';
import { MatMenuModule } from '@angular/material/menu';

interface TaskFilters {
  status?: Status;
  priority?: Priority;
  category?: string;
}

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink,   
    MaterialModule, 
    TaskSearchComponent,
    TaskFilterComponent,
    MatMenuModule
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks$: Observable<Task[]>;
  categories$: Observable<Category[]>;
  displayedColumns: string[] = ['title', 'dueDate', 'priority', 'status', 'category', 'actions'];
  overdueCount$: Observable<number>;

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    private searchService: SearchService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.tasks$ = this.searchService.getFilteredTasks();
    this.categories$ = this.categoryService.getCategories();
    this.overdueCount$ = this.tasks$.pipe(
      map(tasks => tasks.filter(task => this.isOverdue(task)).length)
    );
  }

  ngOnInit(): void {}

  getPriorityColor(priority: Priority): string {
    switch (priority) {
      case Priority.HIGH: return 'red';
      case Priority.MEDIUM: return 'orange';
      case Priority.LOW: return 'green';
      default: return '';
    }
  }

  getStatusColor(status: Status): string {
    switch (status) {
      case Status.COMPLETED: return 'green';
      case Status.IN_PROGRESS: return 'blue';
      case Status.NOT_STARTED: return 'gray';
      case Status.PENDING: return 'orange';
      default: return '';
    }
  }

  deleteTask(taskId: string): void {
    this.tasks$.pipe(
      map(tasks => tasks.find(t => t.id === taskId))
    ).subscribe(task => {
      if (task) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '300px',
          data: { title: 'Delete Task', message: `Are you sure you want to delete "${task.title}"?` }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.taskService.deleteTask(taskId);
            this.showSuccessMessage('Task deleted successfully');
          }
        });
      }
    });
  }

  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  onFilterChange(filters: TaskFilters): void {
    this.tasks$ = this.searchService.getFilteredTasks().pipe(
      map(tasks => tasks.filter(task => {
        let matches = true;
        
        if (filters.status) {
          matches = matches && task.status === filters.status;
        }
        
        if (filters.priority) {
          matches = matches && task.priority === filters.priority;
        }
        
        if (filters.category) {
          matches = matches && task.categoryId === filters.category;
        }
        
        return matches;
      }))
    );
  }

  isOverdue(task: Task): boolean {
    if (!task.dueDate || task.status === Status.COMPLETED) return false;
    return new Date(task.dueDate) < new Date();
  }

  getCategoryName(categoryId: string): string {
    const category = this.categoryService.getCategoryById(categoryId);
    return category?.name || 'Uncategorized';
  }

  toggleTaskStatus(task: Task): void {
    const newStatus = task.status === Status.COMPLETED 
      ? Status.PENDING 
      : Status.COMPLETED;
    this.taskService.updateTask(task.id, { status: newStatus });
  }

  editTask(task: Task): void {
    this.router.navigate(['/tasks', task.id, 'edit']);
  }
}
