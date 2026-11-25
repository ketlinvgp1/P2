import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet, RouterLink, CommonModule],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})

export class App {
  protected readonly title = signal('p1');

  constructor(private router: Router) {}

  // Nome do cliente logado (ou vazio se ninguém entrou)
  nomeCliente(): string {
    let dados = localStorage.getItem('cliente');
    if (dados == null) {
      return '';
    }
    return JSON.parse(dados).nome;
  }

  sair(): void {
    localStorage.removeItem('cliente');
    this.router.navigate(['/']);
  }
}
