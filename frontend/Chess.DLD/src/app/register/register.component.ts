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
  constructor(private router: Router, private dataService: DataService) {}

  onSubmit() {
    this.dataService.GetRegister(this.username, this.password, this.email).subscribe(
      response => {
        if(response === 'User already exist'){
          console.log(response,this.username)
          this.userExist = true;
          this.username = '';
        }else{
          console.log(response)
        }
      }, error =>{
        // console.log(error)
      }
    );
    
  }
}