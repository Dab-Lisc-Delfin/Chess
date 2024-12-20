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
  wrongLogin: boolean = false;
  sessionID: string | null = null;
  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit() {
    
  }

  onSubmit() {

    this.dataService.GetLogin(this.username, this.password).subscribe(
      (response: any) => {
        if (response === "{message : failure}") {
          this.wrongLogin = true;
        } else {
          this.router.navigate(['/home']);
        }
      },
      (error: any) => {
        // console.error('Login failed:', error);
      }
    );
  }
}
