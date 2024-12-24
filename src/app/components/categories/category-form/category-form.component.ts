import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../../shared/material.module';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent {
  categoryForm: FormGroup;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private dialogRef: MatDialogRef<CategoryFormComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: Category | null
  ) {
    this.isEditMode = !!data;
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
    });

    if (data) {
      this.categoryForm.patchValue({
        name: data.name
      });
    }
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      try {
        if (this.isEditMode && this.data) {
          this.categoryService.updateCategory(this.data.id, this.categoryForm.value.name);
          this.showSuccessMessage('Category updated successfully');
        } else {
          this.categoryService.addCategory(this.categoryForm.value.name);
          this.showSuccessMessage('Category created successfully');
        }
        this.dialogRef.close(true);
      } catch (error) {
        this.showErrorMessage('An error occurred while saving the category');
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
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
