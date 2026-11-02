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
    // data: "2 de Novembro às 7H",
    // local: "Vila Olímpica · Av. Pedro Teixeira - Dom Pedro",

    logo: "img/logo.png",          // logo principal (intro + topo)
    logoSecundaria: "",            // opcional (ex.: "img/fju.png")
    fundo: "",                     // imagem de fundo (vazio = degradê roxo)
    corDestaque: "#ff9a1a",        // laranja

    intro: true,                   // false = pula a animação de abertura
    introSegundos: 5.6,            // duração da intro antes de abrir o quadro
    // introTexto: "Vila Olímpica · 2 de Novembro",

    atualizarSegundos: 30,         // recarrega este arquivo sozinho (0 = desligado)
    destaque: "",                  // id do time para destacar (opcional)
    particulas: true
  },

  // ===== TIMES =====
  // id: identificador único | nome: nome exibido | imagem: escudo/logo do time (opcional)
  // Sem imagem (ou se o arquivo não existir) aparece um selo com as iniciais.
  // Também aceita: codigo (ISO de 2 letras → bandeira automática) | posicao | total
  times: [
    { id: "time-01", imagem: "img/times/time-01.png", ouro: 0, prata: 0, bronze: 0 , nome: "CATEDRAL"},
    { id: "time-02", nome: "BLOCO NORTE", imagem: "img/times/time-02.png", ouro: 0, prata: 0, bronze: 0 },
    { id: "time-03", nome: "BLOCO SUL", imagem: "img/times/time-03.png", ouro: 0, prata: 0, bronze: 0 },
    { id: "time-04", nome: "BLOCO NOROESTE", imagem: "img/times/time-04.png", ouro: 0, prata: 0, bronze: 0 },
    { id: "time-05", nome: "Time 05", imagem: "img/times/time-05.png", ouro: 0, prata: 0, bronze: 0 },
    { id: "time-06", nome: "Time 06", imagem: "img/times/time-06.png", ouro: 0, prata: 0, bronze: 0 }
  ]
};
