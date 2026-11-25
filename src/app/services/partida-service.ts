import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PartidaService {

    constructor(private http: HttpClient){}

    // Locais de partida do select da página de detalhes
    public listar(): Observable<any> {
        return this.http.get("http://localhost:8081/api/partidas");
    }

}
