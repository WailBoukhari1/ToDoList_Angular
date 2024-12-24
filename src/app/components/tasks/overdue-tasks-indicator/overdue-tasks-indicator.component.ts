import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material.module';
import { TaskService } from '../../../services/task.service';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-overdue-tasks-indicator',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterLink],
  template: `
    <button mat-button 
            [color]="(overdueCount$ | async)! > 0 ? 'warn' : 'primary'"
            [routerLink]="['/tasks']"
            class="overdue-indicator">
      <mat-icon [class.pulse]="(overdueCount$ | async)! > 0">warning</mat-icon>
      <span>{{ overdueCount$ | async }} Overdue</span>
    </button>
  `,
  styles: [`
    .overdue-indicator {
      margin: 0 8px;
    }

    .pulse {
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
      100% {
        opacity: 1;
      }
    }
  `]
})
export class OverdueTasksIndicatorComponent implements OnInit {
  overdueCount$: Observable<number>;

  constructor(private taskService: TaskService) {
    this.overdueCount$ = this.taskService.overdueTasks$;
  }

  ngOnInit(): void {
    // Initial check for overdue tasks
    this.taskService['updateOverdueTasks']();
  }
} 