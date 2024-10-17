import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  imageUrl: string = './BGlogin.png';
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
