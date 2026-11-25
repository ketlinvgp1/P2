package com.ads.caminhos;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

// Local de partida da viagem (select da página de detalhes)
@Entity
public class Partida {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int codigo;
    private String nome;
    // Percentual somado ao preço do pacote (ex.: 10 = +10%)
    private double acrescimo;
    private int ativo;

    public int getCodigo() {
        return codigo;
    }
    public void setCodigo(int codigo) {
        this.codigo = codigo;
    }
    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public double getAcrescimo() {
        return acrescimo;
    }
    public void setAcrescimo(double acrescimo) {
        this.acrescimo = acrescimo;
    }
    public int getAtivo() {
        return ativo;
    }
    public void setAtivo(int ativo) {
        this.ativo = ativo;
    }
}
