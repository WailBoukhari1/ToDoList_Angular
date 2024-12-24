import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { CategoryService } from '../../services/category.service';
import { Task, Status } from '../../models/task.model';
import { Category } from '../../models/category.model';
import { Observable } from 'rxjs';
import { MaterialModule } from '../../shared/material.module';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MaterialModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  tasks$: Observable<Task[]>;
  categories$: Observable<Category[]>;
  
  // Pour les statistiques
  pendingTasks: number = 0;
  completedTasks: number = 0;

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService
  ) {
    this.tasks$ = this.taskService.getTasks();
    this.categories$ = this.categoryService.getCategories();
  }

  ngOnInit(): void {
    // Calculer les statistiques
    this.tasks$.subscribe(tasks => {
      this.pendingTasks = tasks.filter(task => task.status !== Status.COMPLETED).length;
      this.completedTasks = tasks.filter(task => task.status === Status.COMPLETED).length;
    });
  }
} 