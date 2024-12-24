import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { CategoryService } from '../../../services/category.service';
import { Task, Status, Priority } from '../../../models/task.model';
import { Category } from '../../../models/category.model';
import { Observable } from 'rxjs';
import { MaterialModule } from '../../../shared/material.module';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { TaskSearchComponent } from '../../task-search/task-search.component';
import { SearchService } from '../../../services/search.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    MaterialModule, 
    TaskSearchComponent
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks$: Observable<Task[]>;
  categories$: Observable<Category[]>;
  displayedColumns: string[] = ['title', 'dueDate', 'priority', 'status', 'category', 'actions'];

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    private searchService: SearchService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.tasks$ = this.searchService.getFilteredTasks();
    this.categories$ = this.categoryService.getCategories();
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

  deleteTask(task: Task): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { title: 'Delete Task', message: `Are you sure you want to delete "${task.title}"?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.deleteTask(task.id);
        this.showSuccessMessage('Task deleted successfully');
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
}
