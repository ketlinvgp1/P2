import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido } from '../model/pedido';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
    constructor(private http: HttpClient){}

    public gravar(obj: Pedido): Observable<any> {
        return this.http.post("http://localhost:8081/api/pedido", obj, {responseType: 'text'});
    }

    public pesquisar(codigo: number): Observable<any> {
        return this.http.get("http://localhost:8081/api/pedido/" + codigo);
    }

    public listarCliente(codigo:number): Observable<any> {
        return this.http.get("http://localhost:8081/api/pedido/cliente/" + codigo);
    }
}
