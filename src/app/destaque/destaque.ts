import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Produto } from '../model/produto';
import { ProdutoService } from '../services/produto-service';

@Component({
  selector: 'app-destaque',
  imports: [CommonModule],
  templateUrl: './destaque.html',
  styleUrl: './destaque.css',
})
export class Destaque {

  // Pacotes em destaque carregados do backend
  lista: Produto[] = [];
  mensagem: string = '';

  constructor(private router: Router, private service: ProdutoService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.service.carregarDestaques().subscribe({
      next: (dados) => {
        this.lista = dados;
        if (this.lista.length <= 0) this.mensagem = 'Não existem destaques no momento!';
        this.cdr.detectChanges(); // atualiza a tela (Angular 21 sem zone.js)
      },
      error: (err) => {
        this.mensagem = 'Ocorreu um erro, tente mais tarde!';
        this.cdr.detectChanges();
      }
    });
  }

  verDetalhe(obj: Produto) {
    localStorage.setItem('produto', JSON.stringify(obj));
    this.router.navigate(['/detalhe']);
  }

}
