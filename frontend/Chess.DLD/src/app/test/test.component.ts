import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestComponent {
  constructor(private router: Router) {}
  createGame() {
    const gameId = Math.random().toString(36).substring(2, 10);

    this.router.navigate([`/game/${gameId}`]);
  }
}
