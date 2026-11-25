package com.ads.caminhos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Integer> {

    // Pacotes em destaque (página Destaques)
    @Query(value = "select * from produto where destaque>0 order by destaque", nativeQuery = true)
    public List<Produto> carregaDestaques();

    // Barra de pesquisa: procura no nome e no descritivo
    // ilike = like sem diferenciar maiúsculas/minúsculas (PostgreSQL)
    @Query(value = "select * from produto where nome ilike :termo or descritivo ilike :termo", nativeQuery = true)
    public List<Produto> fazerBusca(String termo);
}
