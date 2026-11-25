import { ChangeDetectorRef, Component } from '@angular/core';
import { ProdutoService } from '../services/produto-service';
import { Router, RouterLink } from '@angular/router';
import { Produto } from '../model/produto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [RouterLink, CommonModule, FormsModule],
  selector: 'app-vitrine',
  styleUrl: './vitrine.css',
  templateUrl: './vitrine.html',
})

export class Vitrine {

  // Pacotes carregados do backend
  lista: Produto[] = [];

  // Mensagem de carregamento / erro
  mensagem: string = '';

  adicionarCesta(produto: Produto): void {

  // Recupera a cesta do localStorage
  let dados = localStorage.getItem('cesta');

  let cesta: any[] = [];

  // Verifica se a cesta já existe
  if (dados != null) {

    // Desserializa a cesta
    cesta = JSON.parse(dados);

  }

  let encontrado = false;

  // Verifica se o produto já está na cesta
  for (let item of cesta) {

    if (item.codigo == produto.codigo) {

      item.qtdCesta = item.qtdCesta + 1;

      item.valorTotal = item.precoUnitario * item.qtdCesta;

      encontrado = true;
    }
  }

  // Se o produto ainda não estiver na cesta
  if (encontrado == false) {

    let preco = produto.promo > 0
      ? produto.promo
      : produto.valor;

    let item = {
      ...produto,
      qtdCesta: 1,
      precoUnitario: preco,
      valorTotal: preco
    };

    cesta.push(item);
  }

  // Serializa e grava a cesta
  localStorage.setItem(
    'cesta',
    JSON.stringify(cesta)
  );

  alert('Produto adicionado à cesta!');
}

  // Texto digitado na barra de pesquisa
  termoBusca: string = '';

  constructor(private router: Router, private service: ProdutoService, private cdr: ChangeDetectorRef) {}

  // Busca os pacotes no backend quando a página abre
  ngOnInit() {
    this.mensagem = 'Carregando destinos...';
    this.service.carregarVitrine().subscribe({
      next: (dados) => { // se der certo vamos realizar o próximo passo
        this.lista = dados;
        this.mensagem = '';
        this.cdr.detectChanges(); // atualiza a tela (Angular 21 sem zone.js)
      },
      error: (err) => {
        this.mensagem = 'Ocorreu um erro, tente mais tarde!';
        this.cdr.detectChanges();
      }
    });
  }

  // Remove acentos e deixa minúsculo (ex.: "São Luís" -> "sao luis")
  normalizar(texto: string): string {
    return (texto || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  // Verifica se o produto combina com o texto pesquisado
  filtrar(obj: Produto): boolean {
    let termo = this.normalizar(this.termoBusca);
    if (termo == '') {
      return true;
    }
    return this.normalizar(obj.nome).includes(termo)
        || this.normalizar(obj.descritivo).includes(termo);
  }

  // Lista apenas com os produtos encontrados
  listaFiltrada(): Produto[] {
    return this.lista.filter(obj => this.filtrar(obj));
  }

  // Limpa a barra de pesquisa
  limparBusca(): void {
    this.termoBusca = '';
  }

  verDetalhe(obj: Produto) {
    localStorage.setItem("produto", JSON.stringify(obj));
    // Limpa a pesquisa antes de sair da vitrine
    this.limparBusca();
    // Navega pelo Angular (sem recarregar a página)
    this.router.navigate(['/detalhe']);
  }

}