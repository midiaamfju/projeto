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
      "Atletismo 100m - Feminino":       { "ouro": "", "prata": ""},
      "Atletismo 100m - Masculino":      { "ouro": "", "prata": ""},
      "Atletismo 200m - Feminino":       { "ouro": "", "prata": ""},
      "Atletismo 200m - Masculino":      { "ouro": "", "prata": ""},
      "Atletismo 400m - Feminino":       { "ouro": "", "prata": ""},
      "Atletismo 400m - Masculino":      { "ouro": "", "prata": ""},
      "Basquete 3x3 - Feminino":         { "ouro": "", "prata": ""},
      "Basquete 3x3 - Masculino":        { "ouro": "", "prata": ""},
      "Futevôlei - Feminino":            { "ouro": "", "prata": ""},
      "Futevôlei - Masculino":           { "ouro": "", "prata": ""},
      "Futsal - Feminino":               { "ouro": "", "prata": ""},
      "Futsal - Masculino":              { "ouro": "", "prata": ""},
      "Jiu-Jitsu - Feminino":            { "ouro": "", "prata": ""},
      "Jiu-Jitsu - Masculino":           { "ouro": "", "prata": ""},
      "Natação - Feminino":              { "ouro": "CATEDRAL", "prata": "SUL"},
      "Natação - Masculino":             { "ouro": "SUL", "prata":"CATEDRAL"},
      "Queimada":                        { "ouro": "", "prata": ""},
      "Revezamento - Feminino":          { "ouro": "", "prata": ""},
      "Revezamento - Masculino":         { "ouro": "", "prata": ""},
      "Tênis de Mesa - Feminino":        { "ouro": "", "prata": ""},
      "Tênis de Mesa - Masculino":       { "ouro": "", "prata": ""},
      "Vôlei de Areia - Feminino":       { "ouro": "", "prata": ""},
      "Vôlei de Areia - Masculino":      { "ouro": "", "prata": ""},
      "Vôlei de Quadra - Feminino":      { "ouro": "", "prata": ""},
      "Vôlei de Quadra - Masculino":     { "ouro": "", "prata": ""},
      "Xadrez - Feminino":               { "ouro": "", "prata": ""},
      "Xadrez - Masculino":              { "ouro": "", "prata": ""}
  }
};
