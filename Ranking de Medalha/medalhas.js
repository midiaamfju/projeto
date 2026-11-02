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
    "Basquete": { ouro:"", prata:"", bronze:"" },
    "Vôlei":    { ouro:"", prata:"", bronze:"" },
    "Futsal":   { ouro:"", prata:"", bronze:"" },
    "Futebol":  { ouro:"", prata:"", bronze:"" },
    "Atletismo":{ ouro:"", prata:"", bronze:"" }
  }
};
