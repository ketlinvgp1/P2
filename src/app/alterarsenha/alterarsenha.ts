import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cliente } from '../model/cliente';
import { ClienteService } from '../services/cliente-service';

@Component({
  imports: [RouterLink, CommonModule, FormsModule],
  selector: 'app-alterarsenha',
  styleUrl: './alterarsenha.css',
  templateUrl: './alterarsenha.html',
})
export class AlterarSenha {

  email: string = '';
  senhaAtual: string = '';
  novaSenha: string = '';
  confirmarSenha: string = '';

  mensagem: string = '';
  sucesso: boolean = false;

  // Mesma regra de senha da tela de cadastro
  regraSenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  constructor(private router: Router,
              private service: ClienteService,
              private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Se veio da tela "Esqueci a senha", só o e-mail já vem preenchido
    // (a senha temporária o cliente digita)
    let dados = history.state;
    if (dados != null && dados.email) {
      this.email = dados.email;
    }
  }

  alterarSenha() {
    this.sucesso = false;

    if (this.email == '' || this.senhaAtual == '' || this.novaSenha == '') {
      this.mensagem = 'Preencha todos os campos!';
      return;
    }
    if (!this.regraSenha.test(this.novaSenha)) {
      this.mensagem = 'A nova senha deve ter pelo menos 8 caracteres, uma letra maiúscula, '
                    + 'uma minúscula, um número e um caractere especial.';
      return;
    }
    if (this.novaSenha != this.confirmarSenha) {
      this.mensagem = 'A confirmação não é igual à nova senha!';
      return;
    }
    if (this.novaSenha == this.senhaAtual) {
      this.mensagem = 'A nova senha deve ser diferente da senha atual!';
      return;
    }

    // Padrão do backend: "documento" leva a senha antiga e "senha" a nova
    let obj = new Cliente();
    obj.email = this.email;
    obj.documento = this.senhaAtual;
    obj.senha = this.novaSenha;

    this.service.alterarSenha(obj).subscribe({
      next: (dados) => {
        this.mensagem = dados;
        this.sucesso = dados.includes('sucesso');
        if (this.sucesso) {
          // Sai do login antigo (se houver) e volta para a tela de login
          localStorage.removeItem('cliente');
          setTimeout(() => this.router.navigate(['/login']), 2000);
        }
        this.cdr.detectChanges(); // atualiza a tela (Angular 21 sem zone.js)
      },
      error: (err) => {
        this.mensagem = 'Ocorreu um erro, tente mais tarde!';
        this.cdr.detectChanges();
      }
    });
  }
}
