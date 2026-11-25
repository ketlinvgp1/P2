import { ChangeDetectorRef, Component } from '@angular/core';
import { Partida } from '../model/partida';
import { PartidaService } from '../services/partida-service';
import { CommonModule } from '@angular/common';
import { Produto } from '../model/produto';

@Component({
  imports: [CommonModule],
  selector: 'app-detalhe',
  styleUrl: './detalhe.css',
  templateUrl: './detalhe.html',
})

export class Detalhe {

  // Produto que será exibido na página
  obj: Produto = new Produto();

  // Mensagem de erro
  mensagem: string = "";

  // Preço da viagem de acordo com o local escolhido
  valorPartida = 0;

  // Local de partida escolhido
  partidaSelecionada: Partida | null = null;

  // Locais de partida carregados do backend
  // acrescimo = percentual somado ao preço do pacote
  partidas: Partida[] = [];

  constructor(private service: PartidaService, private cdr: ChangeDetectorRef) {}


  // Carrega o produto salvo no localStorage
  ngOnInit() {

    let json = localStorage.getItem("produto");

    if (json == null) {

      this.mensagem = "Produto Invalido, verifique!";

    } else {

      this.mensagem = "";

      this.obj = JSON.parse(json);

    }

    // Busca os locais de partida no backend
    this.service.listar().subscribe({
      next: (dados) => {
        this.partidas = dados;
        this.cdr.detectChanges(); // atualiza a tela (Angular 21 sem zone.js)
      },
      error: (err) => {
        this.mensagem = 'Não foi possível carregar os locais de partida.';
        this.cdr.detectChanges();
      }
    });

  }


  // Define o preço de acordo com o local de partida
  alterarPartida(event: any) {

    // Pega o preço do produto selecionado na vitrine
    let preco = this.obj.promo > 0
      ? this.obj.promo
      : this.obj.valor;

    // Procura o local escolhido na lista
    this.partidaSelecionada =
      this.partidas.find(p => p.codigo == event.target.value) || null;

    if (this.partidaSelecionada == null) {
      this.valorPartida = 0;
      return;
    }

    // Aplica o acréscimo do local de partida (arredondado em 2 casas)
    let valor = preco * (1 + this.partidaSelecionada.acrescimo / 100);
    this.valorPartida = Math.round(valor * 100) / 100;

  }


  // Adiciona o produto à cesta
  adicionarCesta(produto: Produto): void {

    // Obriga a escolher o local de partida
    if (this.partidaSelecionada == null) {
      alert('Selecione o local de partida!');
      return;
    }

    let partida = this.partidaSelecionada.nome;

    // Recupera a cesta do localStorage
    let dados = localStorage.getItem('cesta');

    let cesta: any[] = [];

    // Verifica se a cesta já existe
    if (dados != null) {

      cesta = JSON.parse(dados);

    }

    let encontrado = false;

    // Verifica se o produto já está na cesta
    for (let item of cesta) {

      if (item.codigo == produto.codigo && item.partida == partida) {

        item.qtdCesta = item.qtdCesta + 1;

        item.valorTotal =
          item.precoUnitario * item.qtdCesta;

        encontrado = true;

      }

    }

    // Se o produto ainda não estiver na cesta
    if (encontrado == false) {

      let preco = this.valorPartida;

      let item = {

        ...produto,

        partida: partida,

        qtdCesta: 1,

        precoUnitario: preco,

        valorTotal: preco

      };

      cesta.push(item);

    }

    // Salva a cesta
    localStorage.setItem(
      'cesta',
      JSON.stringify(cesta)
    );

    alert('Produto adicionado à cesta!');

  }

}