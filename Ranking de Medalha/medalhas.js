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

  // ===== RESULTADOS POR MODALIDADE =====
  // Substitua estes EXEMPLOS pelos vencedores reais.
  // Cada modalidade distribui 1 ouro, 1 prata e 1 bronze.
  // Para indicar medalhas ainda não definidas, deixe o valor vazio: "".
  // Para adicionar esporte, copie uma linha e altere o nome e os vencedores.
  modalidades: {
    "Vôlei de Quadra - Masculino": { "ouro": "", "prata": "", "bronze": "" },
    "Vôlei de Quadra - Feminino": { "ouro": "", "prata": "", "bronze": "" },
    "Vôlei de Areia - Masculino": { "ouro": "", "prata": "", "bronze": "" },
    "Vôlei de Areia - Feminino": { "ouro": "", "prata": "", "bronze": "" },
    "Xadrez - Masculino": { "ouro": "", "prata": "", "bronze": "" },
    "Xadrez - Feminino": { "ouro": "", "prata": "", "bronze": "" },
    "Futsal - Masculino": { "ouro": "", "prata": "", "bronze": "" },
    "Futsal - Feminino": { "ouro": "", "prata": "", "bronze": "" },
    "Futevôlei - Masculino": { "ouro": "", "prata": "", "bronze": "" },
    "Futevôlei - Feminino": { "ouro": "", "prata": "", "bronze": "" },
    "Queimada": { "ouro": "", "prata": "", "bronze": "" },
    "Tênis de Mesa - Masculino": { "ouro": "", "prata": "", "bronze": "" },
    "Tênis de Mesa - Feminino": { "ouro": "", "prata": "", "bronze": "" },
    "Natação - Masculino": { "ouro": "", "prata": "", "bronze": "" },
    "Natação - Feminino": { "ouro": "", "prata": "", "bronze": "" },
    "Atletismo - Masculino": { "ouro": "", "prata": "", "bronze": "" },
    "Atletismo - Feminino": { "ouro": "", "prata": "", "bronze": "" },
    "Revezamento - Masculino": { "ouro": "", "prata": "", "bronze": "" },
    "Revezamento - Feminino": { "ouro": "", "prata": "", "bronze": "" },
    "Jiu-Jitsu - Masculino": { "ouro": "", "prata": "", "bronze": "" },
    "Jiu-Jitsu - Feminino": { "ouro": "", "prata": "", "bronze": "" },
    "Basquete 3x3 - Masculino": { "ouro": "", "prata": "", "bronze": "" },
    "Basquete 3x3 - Feminino": { "ouro": "", "prata": "", "bronze": "" }
  }
};
