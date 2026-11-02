const ARQUIVO = "medalhas.js";
const $ = (id) => document.getElementById(id);
const linhas = new Map();   // chave -> { li, vals }
let timer = null;
let primeira = true;
let modalidadeSelecionada = "todos";
let dadosAtuais = null;

/* ---------- utilidades ---------- */
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
/* Carrega medalhas.js por <script> (não usa fetch, então funciona em file://).
   A cada chamada injeta o arquivo de novo com ?v=timestamp para pegar a versão nova. */
function lerDados() {
  return new Promise((resolve, reject) => {
    delete window.MEDALHAS;
    const sc = document.createElement("script");
    sc.src = `${ARQUIVO}?v=${Date.now()}`;
    sc.onload = () => { sc.remove(); window.MEDALHAS ? resolve(window.MEDALHAS) : reject(new Error(`${ARQUIVO} não define window.MEDALHAS`)); };
    sc.onerror = () => { sc.remove(); reject(new Error(`não foi possível ler ${ARQUIVO}`)); };
    document.head.appendChild(sc);
  });
}

function urlImagem(p) {
  if (p.imagem) return p.imagem;
  if (p.bandeira) return p.bandeira;
  if (p.codigo) return `https://flagcdn.com/w80/${String(p.codigo).toLowerCase()}.png`;
  return "";
}
function iniciais(nome = "") {
  const w = nome.trim().split(/\s+/).filter(Boolean);
  if (!w.length) return "?";
  return (w.length === 1 ? w[0].slice(0, 2) : w[0][0] + w[w.length - 1][0]).toUpperCase();
}
function contar(el, de, para) {
  const dur = 1050, ini = performance.now();
  (function passo(t) {
    const k = Math.min((t - ini) / dur, 1);
    el.textContent = Math.round(de + (para - de) * (1 - Math.pow(1 - k, 3)));
    if (k < 1) requestAnimationFrame(passo);
  })(ini);
}

/* ---------- partículas (faíscas laranja subindo) ---------- */
let particulasOn = null;
function particulas(on) {
  if (particulasOn === on) return;
  particulasOn = on;
  const box = $("particulas");
  box.innerHTML = "";
  if (!on) return;
  for (let i = 0; i < 22; i++) {
    const s = document.createElement("span");
    const t = 2 + Math.random() * 4;
    s.style.cssText =
      `left:${Math.random() * 100}%;width:${t}px;height:${t}px;` +
      `animation-duration:${9 + Math.random() * 14}s;animation-delay:${-Math.random() * 20}s;` +
      `--dx:${(Math.random() - .5) * 140}px;opacity:${.25 + Math.random() * .5}`;
    box.appendChild(s);
  }
}

/* ---------- configuração visual ---------- */
function aplicarConfig(c = {}) {
  $("titulo").textContent = c.titulo || "";
  $("subtitulo").textContent = c.subtitulo || "";
  $("tituloQuadro").textContent = c.tituloQuadro || "Quadro de Medalhas";
  $("info").textContent = [c.data, c.local].filter(Boolean).join("  ·  ");
  document.title = `${c.titulo || "Quadro de Medalhas"} – ${c.tituloQuadro || "Medalhas"}`;
  if (c.corDestaque) document.documentElement.style.setProperty("--laranja", c.corDestaque);

  if (c.logo) {
    const abs = new URL(c.logo, document.baseURI).href;
    document.documentElement.style.setProperty("--logo", `url("${abs}")`);
  }
  for (const [id, src] of [["logo", c.logo], ["logoSec", c.logoSecundaria]]) {
    const img = $(id);
    if (!src) { img.hidden = true; continue; }
    img.onload = () => (img.hidden = false);
    img.onerror = () => (img.hidden = true);
    img.src = src;
  }

  const f = $("fundo");
  if (c.fundo) { f.style.backgroundImage = `url("${c.fundo}")`; f.classList.add("img"); }
  else { f.style.backgroundImage = ""; f.classList.remove("img"); }

  particulas(c.particulas !== false);
}

/* ---------- INTRO (sem som, só código) ---------- */
function intro(cfg = {}) {
  const el = $("intro");
  const params = new URLSearchParams(location.search);
  if (location.protocol === "file:") document.documentElement.classList.add("arquivo");
  const pular =
    cfg.intro === false || params.get("intro") === "0" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!el || pular) {
    el && el.remove();
    document.body.classList.remove("aguarda");
    return Promise.resolve();
  }

  return new Promise(async (resolve) => {
    $("introTexto").textContent = cfg.introTexto || cfg.subtitulo || "";

    // faíscas que explodem a partir do centro
    const sparks = $("sparks");
    sparks.innerHTML = "";
    for (let i = 0; i < 28; i++) {
      const s = document.createElement("i");
      s.className = "spark";
      const ang = (Math.PI * 2 * i) / 28 + Math.random() * .4;
      const dist = 140 + Math.random() * 260;
      s.style.setProperty("--tx", `${Math.cos(ang) * dist}px`);
      s.style.setProperty("--ty", `${Math.sin(ang) * dist}px`);
      s.style.setProperty("--d", `${Math.random() * .25}s`);
      sparks.appendChild(s);
    }

    // garante que a logo carregou antes de animar
    const img = new Image();
    img.src = cfg.logo || "img/logo.png";
    await Promise.race([img.decode().catch(() => {}), espera(2500)]);

    let fim = false;
    const terminar = () => {
      if (fim) return;
      fim = true;
      clearTimeout(t);
      el.classList.add("saindo");
      document.body.classList.remove("aguarda");
      el.addEventListener("animationend", () => el.remove(), { once: true });
      setTimeout(() => el.remove(), 1500);
      resolve();
    };
    const t = setTimeout(terminar, Math.max(4, Number(cfg.introSegundos) || 5.6) * 1000);
    el.addEventListener("click", terminar);
    $("pular").addEventListener("click", terminar);

    el.classList.add("play");
  });
}

/* ---------- linha ---------- */
function criarLinha(i) {
  const li = document.createElement("li");
  li.className = "linha nova";
  li.style.setProperty("--i", i);
  li.innerHTML = `
    <span class="pos"></span>
    <div class="pais"><span class="escudo"></span><span class="nome"></span></div>
    <div class="nums"><span class="o">0</span><span class="p">0</span><span class="b">0</span><span class="t">0</span></div>`;
  li.addEventListener("animationend", () => li.classList.remove("nova"), { once: true });
  return li;
}

function colocarEscudo(li, p) {
  const box = li.querySelector(".escudo");
  const url = urlImagem(p);
  if (box.dataset.src === url && box.firstChild) return;
  box.dataset.src = url;
  box.innerHTML = "";
  const selo = () => {
    const d = document.createElement("span");
    d.className = "selo";
    d.textContent = iniciais(p.nome);
    return d;
  };
  if (!url) { box.appendChild(selo()); return; }
  const img = document.createElement("img");
  img.alt = `Imagem – ${p.nome}`;
  img.onerror = () => { box.innerHTML = ""; box.appendChild(selo()); };
  img.src = url;
  box.appendChild(img);
}

function atualizarLinha(reg, p, posicao, destaque) {
  const { li } = reg;
  li.querySelector(".pos").textContent = posicao;
  li.querySelector(".nome").textContent = p.nome;
  colocarEscudo(li, p);
  li.classList.toggle("destaque", destaque);

  const novos = {
    o: p.ouro ?? 0, p: p.prata ?? 0, b: p.bronze ?? 0,
    t: p.total ?? (p.ouro ?? 0) + (p.prata ?? 0) + (p.bronze ?? 0),
  };
  for (const k of Object.keys(novos)) {
    const el = li.querySelector("." + k);
    const antes = reg.vals ? reg.vals[k] : 0;
    if (antes !== novos[k]) {
      contar(el, antes, novos[k]);
      if (reg.vals) { el.classList.remove("sobe"); void el.offsetWidth; el.classList.add("sobe"); }
    }
  }
  reg.vals = novos;
}

/* ---------- resumo e pódio ---------- */
function atualizarDestaques(ordenados) {
  const totalMedalhas = ordenados.reduce((acc, p) => acc + Number(p.total ?? ((p.ouro || 0) + (p.prata || 0) + (p.bronze || 0))), 0);
  for (const [id, valor] of [["statEquipes", ordenados.length], ["statMedalhas", totalMedalhas]]) {
    const el = $(id);
    const anterior = Number(el.dataset.value || 0);
    if (anterior !== valor) contar(el, anterior, valor);
    el.dataset.value = valor;
  }
  // Somente equipes com medalhas podem ocupar o pódio.
  // A seleção de modalidades continua visível mesmo sem resultados.
  const comMedalhas = ordenados.filter(p =>
    Number(p.total ?? (Number(p.ouro || 0) + Number(p.prata || 0) + Number(p.bronze || 0))) > 0
  );
  $("statLider").textContent = comMedalhas[0]?.nome || "—";
  const podio = $("podio");
  podio.hidden = comMedalhas.length === 0;
  const destacados = [comMedalhas[1], comMedalhas[0], comMedalhas[2]];
  const nomes = ["PRATA", "OURO", "BRONZE"];
  const posicoes = [2, 1, 3];
  const chaves = destacados.map(p => p ? String(p.id || p.codigo || p.nome) : "").join("|");
  if (podio.dataset.equipes !== chaves) {
    podio.dataset.equipes = chaves;
    podio.replaceChildren();
    destacados.forEach((p, index) => {
      if (!p) return;
      const item = document.createElement("article");
      item.className = `podio-item podio-${posicoes[index]}`;
      item.style.setProperty("--ordem", index);
      const rotulo = document.createElement("div");
      rotulo.className = "podio-coroa";
      rotulo.textContent = posicoes[index] === 1 ? "★ LÍDER DA COMPETIÇÃO" : `${posicoes[index]}º LUGAR`;
      const imagem = document.createElement("div"); imagem.className = "podio-escudo";
      const src = urlImagem(p);
      if (src) {
        const img = document.createElement("img"); img.alt = ""; img.src = src;
        img.onerror = () => { imagem.textContent = iniciais(p.nome); };
        imagem.appendChild(img);
      } else imagem.textContent = iniciais(p.nome);
      const nome = document.createElement("div"); nome.className = "podio-nome"; nome.textContent = p.nome;
      const badge = document.createElement("div"); badge.className = "podio-medalha";
      const imgMedalha = document.createElement("img");
      imgMedalha.className="podio-medalha-img";
      imgMedalha.src=`img/medalhas/${["prata","ouro","bronze"][index]}.webp`;
      imgMedalha.alt=nomes[index];
      badge.append(imgMedalha,document.createTextNode(` ${posicoes[index]}º LUGAR`));
      const pontos = document.createElement("div"); pontos.className = "podio-total";
      pontos.textContent = `${p.total ?? ((p.ouro || 0) + (p.prata || 0) + (p.bronze || 0))} MEDALHAS`;
      item.append(rotulo, imagem, nome, badge, pontos);
      podio.appendChild(item);
    });
  } else {
    [...podio.children].forEach((item, i) => {
      const p = destacados[i];
      if (p) item.querySelector(".podio-total").textContent = `${p.total ?? ((p.ouro || 0) + (p.prata || 0) + (p.bronze || 0))} MEDALHAS`;
    });
  }
  $("ultimaAtualizacao").textContent = `Atualizado às ${new Date().toLocaleTimeString("pt-BR", { hour:"2-digit", minute:"2-digit" })}`;
}

/* ---------- modalidades: resultados -> medalhas -> ranking ---------- */
function chaveTime(v) { return String(v || "").trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR"); }
function medalhasPorModalidade(dados) {
  const modalidades = dados.modalidades || {};
  const cadastro = new Map();
  for (const t of (dados.times || [])) cadastro.set(chaveTime(t.id || t.nome), {...t, ouro:0, prata:0, bronze:0, total:0});
  const vencedores = {};
  for (const [esporte, resultado] of Object.entries(modalidades)) {
    vencedores[esporte] = new Set();
    for (const cor of ["ouro", "prata", "bronze"]) {
      const ganhador = String(resultado?.[cor] || "").trim();
      if (!ganhador) continue;
      const id = chaveTime(ganhador);
      if (vencedores[esporte].has(id)) throw new Error(`Em ${esporte}, o time ${ganhador} aparece em mais de uma medalha.`);
      vencedores[esporte].add(id);
      if (!cadastro.has(id)) cadastro.set(id, {id:ganhador,nome:ganhador,ouro:0,prata:0,bronze:0,total:0});
    }
  }
  const times = [...cadastro.values()].map(t => ({...t, ouro:0,prata:0,bronze:0,total:0}));
  const porChave = new Map(times.map(t => [chaveTime(t.id || t.nome),t]));
  for (const [esporte, resultado] of Object.entries(modalidades)) {
    if (modalidadeSelecionada !== "todos" && esporte !== modalidadeSelecionada) continue;
    for (const cor of ["ouro","prata","bronze"]) {
      const id = chaveTime(resultado?.[cor]);
      if (!id) continue;
      const time = porChave.get(id);
      if (time) {time[cor]++;time.total++;}
    }
  }
  return times.filter(t => modalidadeSelecionada === "todos" || t.total > 0);
}
function atualizarSeletor(dados) {
  const seletor = $("modalidadeSelect");
  const nomes = Object.keys(dados.modalidades || {});
  if (modalidadeSelecionada !== "todos" && !nomes.includes(modalidadeSelecionada)) modalidadeSelecionada = "todos";
  const assinatura = JSON.stringify(nomes);
  if (seletor.dataset.modalidades !== assinatura) {
    seletor.dataset.modalidades = assinatura;
    seletor.replaceChildren();
    for (const [value,label] of [["todos","Todas as modalidades"],...nomes.map(n => [n,n])]) {
      const opt = document.createElement("option"); opt.value=value; opt.textContent=label; seletor.appendChild(opt);
    }
  }
  seletor.value = modalidadeSelecionada;
  $("tituloQuadro").textContent = modalidadeSelecionada === "todos" ? "Ranking geral por medalhas" : `Ranking · ${modalidadeSelecionada}`;
  $("lista").setAttribute("aria-label",modalidadeSelecionada === "todos" ? "Ranking geral" : `Ranking de ${modalidadeSelecionada}`);
  document.querySelector(".stat-lider .stat-foot").textContent = modalidadeSelecionada === "todos" ? "1º lugar geral" : `1º lugar em ${modalidadeSelecionada}`;
}
$("modalidadeSelect").addEventListener("change", event => {
  modalidadeSelecionada = event.target.value;
  if (dadosAtuais) render(dadosAtuais);
});

/* ---------- render com troca de posição animada (FLIP) ---------- */
function render(dados) {
  const cfg = dados.config || {};
  aplicarConfig(cfg);

  dadosAtuais = dados;
  atualizarSeletor(dados);
  const lista_ = dados.modalidades ? medalhasPorModalidade(dados) : (dados.times || dados.paises || []);
  const ordenados = [...lista_].sort((a, b) =>
    ((b.ouro ?? 0) - (a.ouro ?? 0)) || ((b.prata ?? 0) - (a.prata ?? 0)) || ((b.bronze ?? 0) - (a.bronze ?? 0)) ||
    String(a.nome).localeCompare(String(b.nome),"pt-BR"));

  atualizarDestaques(ordenados);
  const lista = $("lista");
  const antes = new Map();
  linhas.forEach((r, k) => antes.set(k, r.li.getBoundingClientRect().top));

  const usadas = new Set();
  ordenados.forEach((p, i) => {
    const chave = String(p.id || p.codigo || p.nome).toLowerCase();
    usadas.add(chave);
    let reg = linhas.get(chave);
    if (!reg) { reg = { li: criarLinha(i), vals: null }; linhas.set(chave, reg); }
    atualizarLinha(reg, p, p.posicao ?? i + 1, String(cfg.destaque || "").toLowerCase() === chave);
    lista.appendChild(reg.li);
  });

  linhas.forEach((r, k) => { if (!usadas.has(k)) { r.li.remove(); linhas.delete(k); } });

  linhas.forEach((r, k) => {
    if (!antes.has(k)) return;
    const dy = antes.get(k) - r.li.getBoundingClientRect().top;
    if (!dy) return;
    r.li.style.transition = "none";
    r.li.style.transform = `translateY(${dy}px)`;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      r.li.style.transition = "transform .8s cubic-bezier(.2,.8,.2,1)";
      r.li.style.transform = "";
    }));
  });
}

/* ---------- carregar JSON ---------- */
async function carregar() {
  try {
    const dados = await lerDados();
    $("erro").hidden = true;

    if (primeira) {                       // 1ª carga: toca a intro e só então mostra o quadro
      primeira = false;
      aplicarConfig(dados.config);
      await intro(dados.config);
    }
    render(dados);

    clearTimeout(timer);
    const s = Number(dados.config?.atualizarSegundos) || 0;
    if (s > 0) timer = setTimeout(carregar, s * 1000);
  } catch (e) {
    if (primeira) { primeira = false; await intro({}); }
    const erro = $("erro");
    erro.hidden = false;
    erro.textContent = `Erro ao carregar ${ARQUIVO}: ${e.message}`;
    console.error(e);
    clearTimeout(timer);
    timer = setTimeout(carregar, 15000);
  }
}
carregar();
