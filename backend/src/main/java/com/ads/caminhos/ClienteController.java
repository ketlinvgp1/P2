package com.ads.caminhos;

import java.security.SecureRandom;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
public class ClienteController {
    @Autowired
    ClienteRepository bd;

    @Autowired
    PedidoRepository bdPedido;

    @GetMapping("/api/cliente/{codigo}")
    public Cliente retorna(@PathVariable("codigo") int id){
        if(bd.existsById(id)){
            return bd.findById(id).get();
        } else {
            return new Cliente();
        }
    }

    // Página de cadastro
    @PostMapping("/api/cliente")
    public String gravar(@RequestBody Cliente obj){
        if(bd.contarEmail(obj.getEmail()) > 0){
            return "E-mail já cadastrado!";
        }
        if(bd.contarDocumento(obj.getDocumento()) > 0){
            return "CPF já cadastrado!";
        }
        obj.setCodigo(0); // POST sempre cria um cliente novo
        obj.setAtivo(1);
        bd.save(obj);
        return "Cliente gravado com sucesso! " + obj.getCodigo();
    }

    // Tela "Meus dados": altera o cadastro do cliente logado
    @PutMapping("/api/cliente")
    public String alterar(@RequestBody Cliente obj){
        if(!bd.existsById(obj.getCodigo())){
            return "Cliente não encontrado!";
        }
        if(bd.contarEmailOutroCliente(obj.getEmail(), obj.getCodigo()) > 0){
            return "E-mail já cadastrado para outro cliente!";
        }
        if(bd.contarDocumentoOutroCliente(obj.getDocumento(), obj.getCodigo()) > 0){
            return "CPF já cadastrado para outro cliente!";
        }

        // Altera só os dados do formulário; "ativo" continua como estava
        Cliente atual = bd.findById(obj.getCodigo()).get();
        atual.setNome(obj.getNome());
        atual.setEmail(obj.getEmail());
        atual.setTelefone(obj.getTelefone());
        atual.setDocumento(obj.getDocumento());
        atual.setLogradouro(obj.getLogradouro());
        // Senha em branco = mantém a senha atual
        if(obj.getSenha() != null && !obj.getSenha().isEmpty()){
            atual.setSenha(obj.getSenha());
        }
        bd.save(atual);
        return "Cadastro alterado com sucesso!";
    }

    // Tela "Meus dados": botão "Excluir conta"
    // Apaga o cliente e os pedidos dele (os itens vão junto, em cascata)
    @Transactional
    @DeleteMapping("/api/cliente/{codigo}")
    public String apagar(@PathVariable("codigo") int id){
        if(!bd.existsById(id)){
            return "Cliente não encontrado!";
        }
        bdPedido.deleteAll(bdPedido.listarPorCliente(id));
        bd.deleteById(id);
        return "Cliente removido com sucesso!";
    }

    // Página de login: o campo "email" pode receber o e-mail ou o CPF
    @PostMapping("/api/cliente/login")
    public Cliente fazerLogin(@RequestBody Cliente obj){
        Optional<Cliente> objCliente = bd.fazerLogin(obj.getEmail(), obj.getSenha());
        if(objCliente.isPresent()){
            return objCliente.get();
        } else {
            return new Cliente();
        }
    }

    // Página "Esqueci minha senha"
    // Gera uma senha temporária aleatória de 8 caracteres
    // (sem letras parecidas como O/0 e l/1, para facilitar a leitura)
    private String gerarSenhaTemporaria(){
        String letras = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
        SecureRandom sorteio = new SecureRandom();
        String senha = "";
        for(int i = 0; i < 8; i++){
            senha = senha + letras.charAt(sorteio.nextInt(letras.length()));
        }
        return senha;
    }

    // Página "Esqueci minha senha"
    // Devolve a senha temporária, ou um texto vazio se o e-mail não existir.
    @PatchMapping("/api/cliente/resetarSenha")
    public String resetarSenha(@RequestBody Cliente obj){
        String senhaTemp = gerarSenhaTemporaria();
        int linhas = bd.resetarSenha(senhaTemp, obj.getEmail());
        if(linhas == 0){
            return "";
        }
        //TODO ENVIAR EMAIL (por enquanto a senha é mostrada na tela)
        return senhaTemp;
    }

    // Mesmo padrão do professor: o campo "documento" leva a senha antiga
    @PatchMapping("/api/cliente/alterarSenha")
    public String alterarSenha(@RequestBody Cliente obj){
        int linhas = bd.alterarSenha(obj.getSenha(), obj.getDocumento(), obj.getEmail());
        if(linhas == 0){
            return "E-mail ou senha antiga inválidos!";
        }
        return "Sua senha foi alterada com sucesso!";
    }
}
