package com.ads.caminhos;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
public class PedidoController {
    @Autowired
    PedidoRepository bd;

    @Autowired
    ClienteRepository bdCliente;

    @Transactional(readOnly = true)
    @GetMapping("/api/pedido/{codigo}")
    public Pedido retorna(@PathVariable("codigo") int id){
        if(bd.existsById(id)){
            Pedido p = bd.findById(id).get();
            p.getItens().size(); // carrega os itens antes de devolver
            return p;
        } else {
            return new Pedido();
        }
    }

    // Finalizar compra: recebe o pedido com os itens da cesta
    @PostMapping("/api/pedido")
    public String gravar(@RequestBody Pedido obj){
        if(!bdCliente.existsById(obj.getCodigoCliente())){
            return "Faça o login para finalizar a compra!";
        }
        if(obj.getItens() == null || obj.getItens().isEmpty()){
            return "A cesta está vazia!";
        }

        double total = 0;
        for(ItemPedido item : obj.getItens()){
            item.setPedido(obj); // liga o item ao pedido
            total = total + item.getValor() * item.getQuantidade();
        }
        obj.setValorTotal(Math.round(total * 100) / 100.0);
        obj.setDataPedido(Date.valueOf(LocalDate.now()));

        bd.save(obj);
        return "Pedido gravado com sucesso! " + obj.getCodigoPedido();
    }

    @Transactional(readOnly = true)
    @GetMapping("/api/pedido/cliente/{codigo}")
    public List<Pedido> listarPorCliente(@PathVariable("codigo") int id){
        List<Pedido> lista = bd.listarPorCliente(id);
        for(Pedido p : lista){
            p.getItens().size();
        }
        return lista;
    }

    @DeleteMapping("/api/pedido/{codigo}")
    public String apagar(@PathVariable("codigo") int id){
        bd.deleteById(id);
        return "Pedido removido com sucesso!";
    }
}
