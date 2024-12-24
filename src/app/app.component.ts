import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { OverdueTasksIndicatorComponent } from './components/tasks/overdue-tasks-indicator/overdue-tasks-indicator.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, OverdueTasksIndicatorComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-navbar></app-navbar>
      <main class="container mx-auto py-6">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AppComponent {}
