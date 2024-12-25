import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { CategoryService } from '../../../services/category.service';
import { Task, Priority, Status } from '../../../models/task.model';
import { Category } from '../../../models/category.model';
import { Observable } from 'rxjs';
import { MaterialModule } from '../../../shared/material.module';
import { MatSnackBar } from '@angular/material/snack-bar';

export class CustomValidators {
  static futureDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inputDate = new Date(control.value);
    
    return inputDate < today ? { pastDate: true } : null;
  }

  static maxLength(max: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      return control.value.length > max ? { maxLength: { max, actual: control.value.length } } : null;
    };
  }
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MaterialModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  categories$: Observable<Category[]>;
  isEditMode = false;
  taskId: string | null = null;
  
  priorities = Object.values(Priority);
  statuses = Object.values(Status);

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.categories$ = this.categoryService.getCategories();
    this.taskForm = this.createForm();
  }

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id');
    if (this.taskId) {
      this.isEditMode = true;
      this.taskService.getTaskById(this.taskId).subscribe(task => {
        if (task) {
          this.taskForm.patchValue({
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            priority: task.priority,
            status: task.status,
            categoryId: task.categoryId
          });
        }
      });
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [
        Validators.required, 
        Validators.minLength(3),
        CustomValidators.maxLength(50)
      ]],
      description: ['', [
        Validators.required,
        CustomValidators.maxLength(500)
      ]],
      dueDate: ['', [
        Validators.required,
        CustomValidators.futureDateValidator
      ]],
      priority: ['', Validators.required],
      status: ['', Validators.required],
      categoryId: ['']
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      try {
        const taskData = this.taskForm.value;
        
        if (this.isEditMode && this.taskId) {
          this.taskService.updateTask(this.taskId, taskData);
          this.showSuccessMessage('Task updated successfully');
        } else {
          this.taskService.addTask(taskData);
          this.showSuccessMessage('Task created successfully');
        }
        
        this.router.navigate(['/tasks']);
      } catch (error) {
        this.showErrorMessage('An error occurred while saving the task');
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/tasks']);
  }

  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}
