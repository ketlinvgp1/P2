package com.ads.caminhos;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer> {

    // O login do site aceita "E-mail ou CPF"
    @Query(value = "select * from cliente where ativo=1 and (email=:login or documento=:login) and senha=:senha", nativeQuery = true)
    public Optional<Cliente> fazerLogin(String login, String senha);

    // Cadastro: não deixa repetir e-mail nem CPF
    @Query(value = "select count(*) from cliente where email=:email", nativeQuery = true)
    public int contarEmail(String email);

    @Query(value = "select count(*) from cliente where documento=:documento", nativeQuery = true)
    public int contarDocumento(String documento);

    // Alteração: procura e-mail / CPF usados por OUTRO cliente (codigo diferente)
    @Query(value = "select count(*) from cliente where email=:email and codigo<>:codigo", nativeQuery = true)
    public int contarEmailOutroCliente(String email, int codigo);

    @Query(value = "select count(*) from cliente where documento=:documento and codigo<>:codigo", nativeQuery = true)
    public int contarDocumentoOutroCliente(String documento, int codigo);

    @Modifying
    @Transactional
    @Query(value = "update cliente set senha=:senhaTemp, ativo=0 where " +
    " email=:email", nativeQuery = true)
    int resetarSenha(String senhaTemp, String email);

    @Modifying
    @Transactional
    @Query(value = "update cliente set senha=:novaSenha, ativo=1 where " +
    " email=:email and senha=:antigaSenha", nativeQuery = true)
    int alterarSenha(String novaSenha, String antigaSenha, String email);
}
