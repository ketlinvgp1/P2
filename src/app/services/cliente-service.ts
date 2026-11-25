import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../model/cliente';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
    constructor(private http: HttpClient){}

    public carregar(codigo:number): Observable<any> {
        return this.http.get("http://localhost:8081/api/cliente/" + codigo);
    }

    public gravar(obj:Cliente): Observable<any> {
        return this.http.post("http://localhost:8081/api/cliente", obj, { responseType: 'text' });
    }

    public alterar(obj:Cliente): Observable<any> {
        return this.http.put("http://localhost:8081/api/cliente", obj, { responseType: 'text' });
    }

    public remover(obj:Cliente): Observable<any> {
        return this.http.delete("http://localhost:8081/api/cliente/" + obj.codigo, { responseType: 'text' });
    }

    // O campo "email" pode levar o e-mail ou o CPF
    public login(obj:Cliente): Observable<any> {
        return this.http.post("http://localhost:8081/api/cliente/login", obj);
    }

    public resetarSenha(obj:Cliente): Observable<any> {
        return this.http.patch("http://localhost:8081/api/cliente/resetarSenha", obj,
    { responseType: 'text' });
    }

    public alterarSenha(obj:Cliente): Observable<any> {
        return this.http.patch("http://localhost:8081/api/cliente/alterarSenha", obj,
    { responseType: 'text' });
    }

}
