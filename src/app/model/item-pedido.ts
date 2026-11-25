export class ItemPedido {
    codigoItemPedido:number = 0;
    codigoProduto:number=0;
    nomeProduto:string="";
    partida:string="";
    quantidade:number=0;
    valor:number=0;

    constructor(codigoItemPedido:number,
    codigoProduto:number,
    quantidade:number,
    valor:number){
        this.codigoItemPedido=codigoItemPedido;
        this.codigoProduto=codigoProduto;
        this.quantidade=quantidade;
        this.valor=valor;
    }
}
