import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cliente } from '../model/cliente';
import { ClienteService } from '../services/cliente-service';

@Component({
  imports: [RouterLink, CommonModule, FormsModule],
  selector: 'app-esqueci',
  styleUrl: './esqueci.css',
  templateUrl: './esqueci.html',
})
export class Esqueci {
  obj: Cliente = new Cliente();
  mensagem: string = '';
  resetou: boolean = false;
  senhaTemporaria: string = '';

  constructor(private router: Router, private service: ClienteService, private cdr: ChangeDetectorRef) {}

  // Vai para a tela de alterar senha com o e-mail já preenchido
  criarNovaSenha() {
    // Leva só o e-mail para a próxima tela (sem mostrar na URL)
    this.router.navigate(['/alterarsenha'], {
      state: { email: this.obj.email }
    });
  }

  resetarSenha() {
    this.mensagem = '';
    this.resetou = false;

    if (this.obj.email == '') {
      this.mensagem = 'Informe o seu e-mail!';
      return;
    }

    this.service.resetarSenha(this.obj).subscribe({
      next: (dados) => {
        // O backend devolve a senha temporária, ou vazio se o e-mail não existe
        if (dados == '') {
          this.mensagem = 'E-mail não encontrado!';
        } else {
          this.senhaTemporaria = dados;
          this.mensagem = 'Sua senha foi reiniciada!';
          this.resetou = true;
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
