import { Component } from '@angular/core';
import { PasswordGeneratorComponent } from './components/password-generator/password-generator.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PasswordGeneratorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
