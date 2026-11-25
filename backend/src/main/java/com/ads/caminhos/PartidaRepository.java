package com.ads.caminhos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PartidaRepository extends JpaRepository<Partida, Integer> {

    @Query(value = "select * from partida where ativo=1 order by acrescimo, nome", nativeQuery = true)
    public List<Partida> listarAtivas();
}
