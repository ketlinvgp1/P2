import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../services/cliente-service';
import { Cliente } from '../model/cliente';

@Component({
  imports: [RouterLink, CommonModule, FormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  // obj.email recebe o e-mail OU o CPF digitado
  obj: Cliente = new Cliente();
  mensagem: string = '';

  constructor(private router: Router, private service: ClienteService, private cdr: ChangeDetectorRef) {}

  fazerLogin() {

    if (this.obj.email == '' || this.obj.senha == '') {
      this.mensagem = 'Preencha o e-mail (ou CPF) e a senha!';
      return;
    }

    this.service.login(this.obj).subscribe({
      next: (dados) => { // se der certo vamos realizar o próximo passo
        // Se o login falhar o backend devolve um cliente com codigo 0
        if (dados.codigo == 0) {
          this.mensagem = 'E-mail/CPF ou senha inválidos! Se você pediu uma nova senha, use "Alterar senha".';
        } else {
          localStorage.setItem('cliente', JSON.stringify(dados));
          this.router.navigate(['/cesta']);
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
