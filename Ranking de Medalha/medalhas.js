// ============================================================
//  DADOS DO QUADRO — edite só este arquivo (sintaxe JSON5).
//  Mantenha a primeira linha "window.MEDALHAS = {" e o "};" final.
//  Funciona abrindo o index.html direto (file://) e no GitHub Pages.
// ============================================================
window.MEDALHAS = {
  // ===== CONFIGURAÇÃO DO SITE =====
  config: {
    titulo: "Esporte Jovem 2026",
    subtitulo: "Projeto Esporte Jovem",
    tituloQuadro: "Quadro de Medalhas",
    //data: "2 de Novembro às 7H",
    //local: "Vila Olímpica · Av. Pedro Teixeira - Dom Pedro",

    logo: "img/logo.png",          // logo principal (intro + topo)
    logoSecundaria: "",            // opcional (ex.: "img/fju.png")
    fundo: "",                     // imagem de fundo (vazio = degradê roxo)
    corDestaque: "#ff9a1a",        // laranja

    intro: true,                   // false = pula a animação de abertura
    introSegundos: 5.6,            // duração da intro antes de abrir o quadro
    //introTexto: "Vila Olímpica · 2 de Novembro",

    atualizarSegundos: 30,         // recarrega este arquivo sozinho (0 = desligado)
    destaque: "",                  // id do time para destacar (opcional)
    particulas: true
  },

  // ===== CADASTRO OPCIONAL DE EQUIPES E ESCUDOS =====
  // Você pode cadastrar novos nomes diretamente nas modalidades abaixo.
  // Se quiser mostrar um escudo, cadastre o mesmo nome e informe a imagem aqui.
  times: [
    { id:"TIME 1", nome:"CATEDRAL", imagem:"" },
    { id:"TIME 2", nome:"NORTE", imagem:"" },
    { id:"TIME 3", nome:"SUL", imagem:"" },
    { id:"TIME 4", nome:"NOROESTE", imagem:"" },
    { id:"TIME 5", nome:"OESTE", imagem:"" },
    { id:"TIME 6", nome:"LESTE", imagem:"" },
    { id:"TIME 7", nome:"INTERIOR", imagem:"" }
  ],

  // Informe o nome da equipe ou seu ID (ex.: "CATEDRAL" ou "TIME 1").
  // Ambos são reconhecidos como a mesma equipe.
  // Preencha bronze quando o terceiro lugar for definido; a pontuação e o pódio atualizam automaticamente.
  // Exemplo: { ouro: "CATEDRAL", prata: "SUL", bronze: "NORTE" }.
  modalidades: {
    "Atletismo 100m - Feminino": { ouro: "CATEDRAL", prata: "NOROESTE" },
    "Atletismo 100m - Masculino": { ouro: "OESTE", prata: "NOROESTE" },
    "Atletismo 200m - Feminino": { ouro: "CATEDRAL", prata: "NOROESTE" },
    "Atletismo 200m - Masculino": { ouro: "SUL", prata: "OESTE" },
    "Atletismo 400m - Feminino": { ouro: "", prata: "" },
    "Atletismo 400m - Masculino": { ouro: "NOROESTE", prata: "NORTE" },
    "Basquete 3x3 - Feminino": { ouro: "", prata: "" },
    "Basquete 3x3 - Masculino": { ouro: "", prata: "" },
    "Futevôlei - Feminino": { ouro: "CATEDRAL", prata: "NORTE" },
    "Futevôlei - Masculino": { ouro: "CATEDRAL", prata: "NORTE" },
    "Futsal - Feminino": { ouro: "", prata: "" },
    "Futsal - Masculino": { ouro: "", prata: "" },
    "Jiu-Jitsu - Feminino": { ouro: "", prata: "" },
    "Jiu-Jitsu - Masculino": { ouro: "", prata: "" },
    "Natação - Feminino": { ouro: "CATEDRAL", prata: "SUL" },
    "Natação - Masculino": { ouro: "SUL", prata: "CATEDRAL" },
    "Queimada": { ouro: "NORTE", prata: "LESTE" },
    "Revezamento": { ouro: "/*CATEDRAL*/", prata: "NORTE" },
    "Tênis de Mesa - Feminino": { ouro: "LESTE", prata: "LESTE" },
    "Tênis de Mesa - Masculino": { ouro: "", prata: "" },
    "Vôlei de Areia - Feminino": { ouro: "", prata: "" },
    "Vôlei de Areia - Masculino": { ouro: "", prata: "" },
    "Vôlei de Quadra - Feminino": { ouro: "SUL", prata: "CATEDRAL" },
    "Vôlei de Quadra - Masculino": { ouro: "", prata: "" },
    "Xadrez": { ouro: "LESTE", prata: "SUL" },
  }
};
