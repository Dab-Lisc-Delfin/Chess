import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataService } from '../data.service';
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
  imageUrl: string = './BGlogin.png';
  userExist:boolean = false
  usergood:boolean = false
  constructor(private router: Router, private dataService: DataService) {}

  onSubmit() {
    this.dataService.GetRegister(this.username, this.password, this.email).subscribe(
      response => {
        if (response.trim() === 'User already exist') {
          this.userExist = true;
          this.username = '';
        } else {
          this.username = '';
          this.password = '';
          this.email = '';
          this.userExist = false;
          this.usergood = true;
        }
      },
      error => {
      }
    );
  }
}