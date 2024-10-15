import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChessBoardComponent } from './chess-board/chess-board.component';
import { TestComponent } from './test/test.component';

export const routes: Routes = [
    { path: 'game/:id', component: ChessBoardComponent }, 
    { path: 'test', component: TestComponent },         
    { path: '', redirectTo: '/test', pathMatch: 'full' }, 
    { path: '**', redirectTo: '/test' }             
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
