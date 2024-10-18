import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataService } from '../data.service';
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
  constructor(private router: Router, private dataService: DataService) {}

  onSubmit() {
    console.log('Username:', this.username);
    console.log('Password:', this.password);

    this.dataService.GetLogin(this.username, this.password).subscribe(
      (response: any) => {
        console.log('Login successful:', response);
        this.router.navigate(['/home']);
      },
      (error: any) => {
        console.error('Login failed:', error);
        alert('Invalid credentials');
      }
    );
  }
}
