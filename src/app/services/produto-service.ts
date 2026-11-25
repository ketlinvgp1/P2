import { Injectable } from '@angular/core';
import { Produto } from '../model/produto';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {

    constructor(private http: HttpClient){}

    // Vitrine (página inicial): todos os pacotes
    public carregarVitrine(): Observable<any> {
        return this.http.get("http://localhost:8081/api/produtos");
    }

    // Página Destaques
    public carregarDestaques(): Observable<any> {
        return this.http.get("http://localhost:8081/api/produto/destaque");
    }

    public carregar(codigo:number): Observable<any> {
        return this.http.get("http://localhost:8081/api/produto/" + codigo);
    }

    public gravar(obj:Produto): Observable<any> {
        return this.http.post("http://localhost:8081/api/produto", obj, { responseType: 'text' });
    }

    public pesquisar(termo:String): Observable<any> {
        return this.http.get("http://localhost:8081/api/produto/busca/" + termo);
    }

}
