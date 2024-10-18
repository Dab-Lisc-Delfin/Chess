import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChessBoardComponent } from './chess-board/chess-board.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent }, 
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'game/:gameId', component: ChessBoardComponent },    
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
