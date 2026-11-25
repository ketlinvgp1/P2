package com.ads.caminhos;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

// Roda quando o backend inicia: se o banco estiver vazio,
// cadastra os pacotes e os locais de partida do site.
@Component
public class CargaInicial implements CommandLineRunner {

    @Autowired
    ProdutoRepository bdProduto;

    @Autowired
    PartidaRepository bdPartida;

    @Override
    public void run(String... args) {

        if (bdProduto.count() == 0) {
            produto("São Luís – MA", "Travessia dos Lençóis Maranhenses",
                "Explore os Lençóis Maranhenses em uma experiência cercada por dunas, lagoas naturais e belas paisagens. Um destino ideal para quem busca aventura, natureza e cenários inesquecíveis.",
                1899.90, 1699.90, 1);
            produto("Manaus – AM", "Encontro das Águas",
                "Conheça Manaus e o famoso Encontro das Águas, onde os rios Negro e Solimões correm lado a lado. Aproveite também o contato com a natureza e as paisagens da região amazônica.",
                1599.90, 1399.90, 1);
            produto("Recife – PE", "Praia de Boa Viagem",
                "Descubra Recife e aproveite a famosa Praia de Boa Viagem, além das atrações históricas e culturais da cidade. Uma viagem que combina praias, cultura e belas paisagens.",
                1299.90, 1199.90, 0);
            produto("Rio de Janeiro – RJ", "Cidade histórica de Paraty e praias",
                "Conheça alguns dos principais cartões-postais do Rio de Janeiro, incluindo a cidade histórica de Paraty e suas famosas praias. Aproveite as belas paisagens e os principais pontos turísticos da cidade.",
                1499.90, 1299.90, 1);
            produto("Foz do Iguaçu – PR", "Visita às Cataratas do Iguaçu",
                "Visite as impressionantes Cataratas do Iguaçu e aproveite trilhas e mirantes cercados pela natureza. Uma experiência para conhecer uma das paisagens naturais mais famosas do Brasil.",
                1399.90, 1199.90, 1);
            produto("Jalapão – TO", "Fervedouros, dunas e paisagens do Jalapão",
                "Explore as belezas naturais do Jalapão, conhecendo seus famosos fervedouros, dunas, cachoeiras e paisagens. Uma viagem perfeita para quem gosta de aventura e contato com a natureza.",
                1799.90, 1599.90, 0);
            produto("Bonito – MS", "Flutuação em rios de águas cristalinas",
                "Conheça as águas cristalinas de Bonito e aproveite atividades de flutuação em meio à natureza. O destino também oferece cachoeiras, rios e belas paisagens para quem busca aventura e tranquilidade.",
                1699.90, 1499.90, 1);
            produto("Ouro Preto – MG", "Centro histórico e arquitetura colonial",
                "Explore as ruas e construções históricas de Ouro Preto, conhecendo igrejas, museus e a tradicional arquitetura colonial. Um destino rico em história, cultura e patrimônio brasileiro.",
                999.90, 899.90, 0);
            produto("Natal – RN", "Praias, dunas e passeio de buggy",
                "Aproveite as belas praias de Natal, conheça suas famosas dunas e desfrute do tradicional passeio de buggy. Uma viagem com belas paisagens, diversão e contato com o litoral potiguar.",
                1399.90, 1199.90, 1);
            produto("Ilhabela – SP", "Mergulho e praias paradisíacas",
                "Conheça as praias paradisíacas de Ilhabela, com águas cristalinas, opções de mergulho e belas trilhas. Um destino perfeito para aproveitar a natureza, descansar e viver novas aventuras.",
                1199.90, 999.90, 0);
        }

        if (bdPartida.count() == 0) {
            partida("São Paulo – SP", 0);
            partida("Rio de Janeiro – RJ", 10);
            partida("Belo Horizonte – MG", 8);
            partida("Brasília – DF", 12);
            partida("Curitiba – PR", 10);
            partida("Porto Alegre – RS", 15);
            partida("Salvador – BA", 12);
            partida("Fortaleza – CE", 15);
            partida("Recife – PE", 12);
            partida("Goiânia – GO", 10);
        }
    }

    private void produto(String nome, String descritivo, String detalhes,
                         double valor, double promo, int destaque) {
        Produto p = new Produto();
        p.setNome(nome);
        p.setDescritivo(descritivo);
        p.setDetalhes(detalhes);
        p.setValor(valor);
        p.setPromo(promo);
        p.setQuantidade(10);
        p.setDestaque(destaque);
        bdProduto.save(p);
    }

    private void partida(String nome, double acrescimo) {
        Partida p = new Partida();
        p.setNome(nome);
        p.setAcrescimo(acrescimo);
        p.setAtivo(1);
        bdPartida.save(p);
    }
}
