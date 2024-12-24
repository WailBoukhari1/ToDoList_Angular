import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/dashboard', 
    pathMatch: 'full' 
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component')
      .then(m => m.DashboardComponent)
  },
  {
    path: 'tasks',
    loadComponent: () => import('./components/tasks/task-list/task-list.component')
      .then(m => m.TaskListComponent)
  },
  {
    path: 'tasks/new',
    loadComponent: () => import('./components/tasks/task-form/task-form.component')
      .then(m => m.TaskFormComponent)
  },
  {
    path: 'tasks/:id/edit',
    loadComponent: () => import('./components/tasks/task-form/task-form.component')
      .then(m => m.TaskFormComponent)
  },
  {
    path: 'categories',
    loadComponent: () => import('./components/categories/category-list/category-list.component')
      .then(m => m.CategoryListComponent)
  },
  { 
    path: '**', 
    redirectTo: '/dashboard' 
  }
];
