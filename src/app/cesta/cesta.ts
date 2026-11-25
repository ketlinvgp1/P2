import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PedidoService } from '../services/pedido-service';
import { Pedido } from '../model/pedido';
import { ItemPedido } from '../model/item-pedido';
import { Cliente } from '../model/cliente';
import { CommonModule } from '@angular/common';
import { Partida } from '../model/partida';
import { PartidaService } from '../services/partida-service';

@Component({
  imports: [RouterLink, CommonModule],
  selector: 'app-cesta',
  styleUrl: './cesta.css',
  templateUrl: './cesta.html',
})
export class Cesta {

  produtos: any[] = [];

  // Locais de partida para trocar na cesta
  partidas: Partida[] = [];

  // Histórico de compras do cliente logado
  historico: Pedido[] = [];
  logado: boolean = false;
  mensagemHistorico: string = '';

  mensagem: string = '';
  sucesso: boolean = false;

  constructor(private router: Router, private service: PedidoService,
              private partidaService: PartidaService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {

    let dados = localStorage.getItem('cesta');

    if (dados != null) {
      this.produtos = JSON.parse(dados);
    }

    // Busca as compras anteriores do cliente
    this.carregarHistorico();

    // Busca os locais de partida no backend
    this.partidaService.listar().subscribe({
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

  // Busca no backend os pedidos do cliente logado
  carregarHistorico(): void {

    let json = localStorage.getItem('cliente');
    if (json == null) {
      this.logado = false;
      return;
    }

    this.logado = true;
    let cliente: Cliente = JSON.parse(json);

    this.service.listarCliente(cliente.codigo).subscribe({
      next: (dados) => {
        // Do pedido mais novo para o mais antigo
        this.historico = dados.sort((a: Pedido, b: Pedido) => b.codigoPedido - a.codigoPedido);
        this.mensagemHistorico = this.historico.length == 0
          ? 'Você ainda não fez nenhuma compra.'
          : '';
        this.cdr.detectChanges(); // atualiza a tela (Angular 21 sem zone.js)
      },
      error: (err) => {
        this.mensagemHistorico = 'Não foi possível carregar suas compras.';
        this.cdr.detectChanges();
      }
    });
  }

  // "2026-11-25" -> "25/11/2026"
  formatarData(data: string): string {
    if (!data) {
      return '';
    }
    let partes = data.split('-');
    return partes[2] + '/' + partes[1] + '/' + partes[0];
  }

  // Troca o local de partida de um item da cesta
  alterarPartida(item: any, event: any): void {

    let partida = this.partidas.find(p => p.codigo == event.target.value);
    if (partida == null) {
      return;
    }

    // Preço base do pacote (promoção, se houver) + acréscimo da partida
    let preco = item.promo > 0 ? item.promo : item.valor;
    let valor = preco * (1 + partida.acrescimo / 100);

    item.partida = partida.nome;
    item.precoUnitario = Math.round(valor * 100) / 100;
    item.valorTotal = item.precoUnitario * item.qtdCesta;

    // Se o mesmo destino já estiver na cesta saindo desse local, junta os dois
    let igual = this.produtos.find(
      outro => outro !== item && outro.codigo == item.codigo && outro.partida == item.partida
    );
    if (igual != null) {
      igual.qtdCesta = igual.qtdCesta + item.qtdCesta;
      igual.valorTotal = igual.precoUnitario * igual.qtdCesta;
      this.produtos = this.produtos.filter(produto => produto !== item);
    }

    localStorage.setItem('cesta', JSON.stringify(this.produtos));
  }

  // Código da partida atual do item (para o select já vir marcado)
  codigoPartida(item: any): number {
    let partida = this.partidas.find(p => p.nome == item.partida);
    return partida != null ? partida.codigo : 0;
  }

  remover(item: any): void {

    // Remove apenas o item clicado (mesmo destino pode ter partidas diferentes)
    this.produtos = this.produtos.filter(
      produto => produto !== item
    );

    localStorage.setItem(
      'cesta',
      JSON.stringify(this.produtos)
    );

  }

  total(): number {

    let total = 0;

    for (let produto of this.produtos) {
      total = total + produto.valorTotal;
    }

    return total;
  }

  // Envia a cesta para o backend como um pedido
  gravarPedido(): void {

    let json = localStorage.getItem('cliente');

    // Precisa estar logado
    if (json == null) {
      alert('Faça o login para finalizar a compra!');
      this.router.navigate(['/login']);
      return;
    }

    let cliente: Cliente = JSON.parse(json);

    let pedido = new Pedido();
    pedido.codigoPedido = 0;
    pedido.codigoCliente = cliente.codigo;
    pedido.obs = cliente.email;
    pedido.valorTotal = this.total();

    // Cada item da cesta vira um ItemPedido
    for (let produto of this.produtos) {
      let itmPedido = new ItemPedido(0, produto.codigo, produto.qtdCesta, produto.precoUnitario);
      itmPedido.nomeProduto = produto.nome;
      itmPedido.partida = produto.partida;
      pedido.itens.push(itmPedido);
    }

    this.service.gravar(pedido).subscribe({
      next: (dados) => {
        this.mensagem = dados;
        this.sucesso = dados.includes('sucesso');
        if (this.sucesso) {
          // Esvazia a cesta
          this.produtos = [];
          localStorage.removeItem('cesta');
          // Atualiza o histórico para a compra nova aparecer
          this.carregarHistorico();
        }
        this.cdr.detectChanges(); // atualiza a tela (Angular 21 sem zone.js)
      },
      error: (err) => {
        this.sucesso = false;
        this.mensagem = 'Ocorreu um erro, verifique!';
        this.cdr.detectChanges();
      }
    });
  }

}
