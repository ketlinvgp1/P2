import { ItemPedido } from "./item-pedido";

export class Pedido {
    codigoPedido:number=0;
    valorTotal:number=0;
    obs:string="";
    dataPedido:string="";
    codigoCliente:number=0;
    itens: ItemPedido[] = [];
}
