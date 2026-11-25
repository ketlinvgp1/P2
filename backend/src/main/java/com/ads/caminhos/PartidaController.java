package com.ads.caminhos;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
public class PartidaController {
    @Autowired
    PartidaRepository bd;

    // Locais que aparecem no select da página de detalhes
    @GetMapping("/api/partidas")
    public List<Partida> listar(){
        return bd.listarAtivas();
    }

    @GetMapping("/api/partida/{codigo}")
    public Partida retorna(@PathVariable("codigo") int id){
        if(bd.existsById(id)){
            return bd.findById(id).get();
        } else {
            return new Partida();
        }
    }

    @PostMapping("/api/partida")
    public String gravar(@RequestBody Partida obj){
        bd.save(obj);
        return "Local de partida gravado com sucesso! " + obj.getCodigo();
    }

    @PutMapping("/api/partida")
    public String alterar(@RequestBody Partida obj){
        if(bd.existsById(obj.getCodigo())){
            bd.save(obj);
            return "Local de partida alterado com sucesso! " + obj.getCodigo();
        } else {
            return "Local de partida não encontrado!";
        }
    }

    @DeleteMapping("/api/partida/{codigo}")
    public String apagar(@PathVariable("codigo") int id){
        bd.deleteById(id);
        return "Local de partida removido com sucesso!";
    }
}
