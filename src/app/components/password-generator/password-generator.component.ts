import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PasswordGeneratorService } from '../../services/password-generator.service';

@Component({
  selector: 'app-password-generator',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatSnackBarModule,
  ],
  templateUrl: './password-generator.component.html',
  styleUrl: './password-generator.component.scss',
})
export class PasswordGeneratorComponent {
  password = '';
  copied = false;

  private readonly passwordService = inject(PasswordGeneratorService);
  private readonly clipboard = inject(Clipboard);
  private readonly snackBar = inject(MatSnackBar);

  generatePassword(): void {
    this.password = this.passwordService.generate();
    this.copied = false;
  }

  copyPassword(): void {
    if (!this.password) return;
    this.clipboard.copy(this.password);
    this.copied = true;
    this.snackBar.open('Password copied!', '', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: 'snackbar-success',
    });
    setTimeout(() => (this.copied = false), 2500);
  }
}
