import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { NgChartsModule } from 'ng2-charts';
import { TaskService } from '../../services/task.service';
import { CategoryService } from '../../services/category.service';
import { Task, Status, Priority } from '../../models/task.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MaterialModule, NgChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  tasks$: Observable<Task[]>;
  totalTasks = 0;
  pendingTasks = 0;
  completedTasks = 0;

  // Chart configurations
  tasksByStatusChartData = {
    labels: ['Completed', 'In Progress', 'Pending'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#10B981', '#F59E0B', '#6366F1']
    }]
  };

  tasksByPriorityChartData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [{
      label: 'Tasks by Priority',
      data: [0, 0, 0],
      backgroundColor: ['#EF4444', '#F59E0B', '#10B981']
    }]
  };

  doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      }
    },
    cutout: '75%'
  };

  barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  constructor(private taskService: TaskService) {
    this.tasks$ = this.taskService.getTasks();
  }

  ngOnInit(): void {
    this.tasks$.subscribe(tasks => {
      this.updateDashboardStats(tasks);
      this.updateChartData(tasks);
    });
  }

  private updateDashboardStats(tasks: Task[]): void {
    this.totalTasks = tasks.length;
    this.completedTasks = tasks.filter(t => t.status === Status.COMPLETED).length;
    this.pendingTasks = this.totalTasks - this.completedTasks;
  }

  private updateChartData(tasks: Task[]): void {
    // Update status chart
    const completed = tasks.filter(t => t.status === Status.COMPLETED).length;
    const inProgress = tasks.filter(t => t.status === Status.IN_PROGRESS).length;
    const pending = tasks.filter(t => t.status === Status.PENDING).length;
    
    this.tasksByStatusChartData.datasets[0].data = [completed, inProgress, pending];

    // Update priority chart
    const highPriority = tasks.filter(t => t.priority === Priority.HIGH).length;
    const mediumPriority = tasks.filter(t => t.priority === Priority.MEDIUM).length;
    const lowPriority = tasks.filter(t => t.priority === Priority.LOW).length;
    
    this.tasksByPriorityChartData.datasets[0].data = [highPriority, mediumPriority, lowPriority];
  }

  getCompletionRate(): number {
    return this.totalTasks ? (this.completedTasks / this.totalTasks) * 100 : 0;
  }

  isOverdue(task: Task): boolean {
    if (!task.dueDate) return false;
    return new Date(task.dueDate) < new Date() && task.status !== Status.COMPLETED;
  }
} 