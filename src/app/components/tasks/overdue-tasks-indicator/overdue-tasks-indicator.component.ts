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
  templateUrl: './overdue-tasks-indicator.component.html',
  styleUrls: ['./overdue-tasks-indicator.component.scss']
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