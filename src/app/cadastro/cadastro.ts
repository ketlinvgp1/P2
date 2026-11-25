import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Cliente } from '../model/cliente';
import { ClienteService } from '../services/cliente-service';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-cadastro',
  styleUrl: './cadastro.css',
  templateUrl: './cadastro.html',
})
export class Cadastro {
  obj: Cliente = new Cliente();
  mensagem: string = '';
  sucesso: boolean = false;

  // true = cliente logado alterando os próprios dados ("Meus dados")
  editando: boolean = false;

  constructor(private router: Router, private service: ClienteService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Se tem cliente logado, a tela abre preenchida para alteração
    let json = localStorage.getItem('cliente');
    if (json != null) {
      this.obj = JSON.parse(json);
      this.obj.senha = ''; // em branco = mantém a senha atual
      this.editando = true;
    }
  }

  gravar(form: NgForm) {

    // Não envia se algum campo estiver inválido
    if (form.invalid) {
      this.sucesso = false;
      this.mensagem = 'Preencha todos os campos corretamente!';
      return;
    }

    if (this.editando) {
      this.alterar();
    } else {
      this.cadastrar();
    }
  }

  // Novo cliente (POST)
  cadastrar() {
    this.service.gravar(this.obj).subscribe({
      next: (dados) => { // o backend devolve um texto
        this.mensagem = dados;
        this.sucesso = dados.includes('sucesso');
        if (this.sucesso) {
          // Leva para o login depois de 2 segundos
          setTimeout(() => this.router.navigate(['/login']), 2000);
        }
        this.cdr.detectChanges(); // atualiza a tela (Angular 21 sem zone.js)
      },
      error: (err) => {
        this.sucesso = false;
        this.mensagem = 'Ocorreu um erro, tente mais tarde!';
        this.cdr.detectChanges();
      }
    });
  }

  // Cliente logado alterando o cadastro (PUT)
  alterar() {
    this.service.alterar(this.obj).subscribe({
      next: (dados) => {
        this.mensagem = dados;
        this.sucesso = dados.includes('sucesso');
        this.cdr.detectChanges();
        if (this.sucesso) {
          this.atualizarClienteLogado();
        }
      },
      error: (err) => {
        this.sucesso = false;
        this.mensagem = 'Ocorreu um erro, tente mais tarde!';
        this.cdr.detectChanges();
      }
    });
  }

  // Busca o cliente atualizado no backend e guarda no localStorage
  atualizarClienteLogado() {
    this.service.carregar(this.obj.codigo).subscribe({
      next: (dados) => {
        localStorage.setItem('cliente', JSON.stringify(dados));
        this.obj = dados;
        this.obj.senha = '';
        // markForCheck atualiza também o cabeçalho ("Olá, Nome")
        this.cdr.markForCheck();
      }
    });
  }

  // Botão "Excluir conta": apaga a conta e os pedidos dela
  excluirConta() {
    if (!confirm('Tem certeza que deseja excluir a sua conta? Seus pedidos também serão apagados.')) {
      return;
    }

    this.service.remover(this.obj).subscribe({
      next: (dados) => {
        // Sai do login, esvazia a cesta e volta para a página inicial
        localStorage.removeItem('cliente');
        localStorage.removeItem('cesta');
        alert('Sua conta foi excluída.');
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.sucesso = false;
        this.mensagem = 'Ocorreu um erro, tente mais tarde!';
        this.cdr.markForCheck();
      }
    });
  }
}
