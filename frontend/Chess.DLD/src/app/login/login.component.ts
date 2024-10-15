import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onSubmit() {
    console.log('Username:', this.username);
    console.log('Password:', this.password);

    if (this.username === 'test' && this.password === 'password') {
      this.router.navigate(['/home']);
    } else {
      // alert('Invalid credentials');
      this.router.navigate(['/home']);
    }
  }
}
