import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  registrationSuccess: boolean = false;
  imageUrl: string = './BGlogin.png';

  constructor(private router: Router) {}

  onSubmit() {
    console.log('Username:', this.username);
    console.log('Email:', this.email);
    console.log('Password:', this.password);

    this.registrationSuccess = true;

    this.username = '';
    this.email = '';
    this.password = '';
  }
}