import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';
import { Observable } from 'rxjs';
import { MaterialModule } from '../../../shared/material.module';
import { CategoryFormComponent } from '../category-form/category-form.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, MaterialModule, CategoryFormComponent],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  categories$!: Observable<Category[]>;

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.categories$ = this.categoryService.getCategories();
  }

  openCategoryForm(category?: Category): void {
    const dialogRef = this.dialog.open(CategoryFormComponent, {
      width: '400px',
      data: category
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.showSuccessMessage(category ? 'Category updated' : 'Category created');
      }
    });
  }

  deleteCategory(category: Category): void {
    if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
      this.categoryService.deleteCategory(category.id);
      this.showSuccessMessage('Category deleted');
    }
  }

  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}
