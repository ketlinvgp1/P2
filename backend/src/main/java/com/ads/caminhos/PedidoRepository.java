package com.ads.caminhos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Integer> {

    // Histórico de pedidos de um cliente
    @Query(value = "select * from pedido where codigo_cliente=:codigoCliente order by data_pedido desc", nativeQuery = true)
    public List<Pedido> listarPorCliente(int codigoCliente);
}
