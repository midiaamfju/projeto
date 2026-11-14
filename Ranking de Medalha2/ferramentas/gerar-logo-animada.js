// Gera as camadas da logo animada da intro a partir de img/logo.svg (exportado do Illustrator).
// Uso: node ferramentas/gerar-logo-animada.js   (precisa do Google Chrome ou Edge instalado)
//
// Por que camadas PNG e não o SVG animado: o SVG tem ~7 mil formas com máscaras e filtros;
// animar dentro dele obriga o navegador a redesenhar tudo a cada quadro e a intro trava.
// Aqui cada parte (escudo, bolas, quimono, troféu, letras) vira um PNG recortado, e a intro
// só move imagens prontas com transform/opacity, que a placa de vídeo faz sem esforço.
//
// Saída: img/logo-camadas/*.png e o bloco de <img> entre os marcadores CAMADAS no index.html.
// Os índices abaixo são os filhos dos grupos do arquivo atual: se a logo for re-exportada,
// confira as camadas de novo (o script falha se a contagem mudar).
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");
const { ler, gravar } = require("./png");

const raiz = path.join(__dirname, "..");
const svg = fs.readFileSync(path.join(raiz, "img/logo.svg"), "utf8");
const LADO = 1200; // px do quadrado renderizado (cobre a logo de 560px em tela retina)
const VIEWBOX = 'viewBox="530 124 860 860"'; // quadrado em volta da arte

// --- localiza elementos: posição de abertura/fechamento e pai ---
const els = [];
const pilha = [];
const re = /<(\/?)([A-Za-z][\w:-]*)\b[^>]*?(\/?)>/g;
let m;
while ((m = re.exec(svg))) {
  if (m[1]) { pilha.pop().fim = re.lastIndex; continue; }
  const e = { tag: m[2], ini: m.index, pai: pilha[pilha.length - 1], filhos: [] };
  if (e.pai) e.pai.filhos.push(e);
  els.push(e);
  if (m[3]) e.fim = re.lastIndex; else pilha.push(e);
}
if (pilha.length) throw new Error("SVG malformado: tags sem fechamento");

const camada = els.find(e => /^<g id="Camada_1"/.test(svg.slice(e.ini, e.ini + 20)));
const grupos = camada.filhos[0].filhos; // 25 grupos de topo
const g0 = grupos[0].filhos, g24 = grupos[24].filhos;
if (grupos.length !== 25 || g0.length !== 70 || g24.length !== 63)
  throw new Error(`camadas mudaram (${grupos.length}/${g0.length}/${g24.length}); revise os índices`);

const faixa = (lista, a, b) => lista.slice(a, b + 1);
// ordem = ordem de pintura (de trás para frente)
const partes = [
  ["escudo", faixa(g0, 0, 4)],
  ["volei", faixa(g0, 5, 24)],
  ["futebol", faixa(g0, 25, 30)],
  ["basquete", faixa(g0, 31, 36)],
  ["quimono", faixa(g0, 37, 67)],
  ["trofeu", [...faixa(g0, 68, 69), ...grupos.slice(1, 24), ...faixa(g24, 0, 9)]],
];
// ESPORTE: todos os contornos (2 paths por letra) antes de todos os preenchimentos, como no
// original; se ficassem juntos por letra, o contorno de uma letra cobriria a vizinha.
for (let k = 0; k < 7; k++) partes.push([`contorno${k}`, [g24[10 + 2 * k], g24[11 + 2 * k]]]);
for (let k = 0; k < 7; k++) partes.push([`letra${k}`, [g24[24 + k]]]);
partes.push(["projeto", faixa(g24, 31, 51)], ["jovem", faixa(g24, 52, 57)], ["fju", faixa(g24, 58, 62)]);

const total = partes.reduce((n, [, l]) => n + l.length, 0);
if (total !== 70 + 23 + 63) throw new Error(`nem todo elemento caiu numa camada (${total})`);

// --- envolve cada elemento num <g class="c-PARTE"> sem mudar a ordem de pintura ---
const insercoes = [];
for (const [nome, lista] of partes)
  for (const e of lista) insercoes.push([e.ini, `<g class="c-${nome}">`], [e.fim, "</g>"]);
// de trás para frente; na mesma posição, o fechamento do anterior vem antes da abertura do próximo
insercoes.sort((a, b) => b[0] - a[0] || (a[1] === "</g>" ? 1 : -1));
let base = svg;
for (const [pos, txt] of insercoes) base = base.slice(0, pos) + txt + base.slice(pos);
base = base.replace('viewBox="0 0 1920 1080"', VIEWBOX);

// --- renderiza cada camada sozinha com fundo transparente ---
const chrome = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].find(p => fs.existsSync(p));
if (!chrome) throw new Error("Chrome/Edge não encontrado para renderizar as camadas");

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "logo-camadas-"));
const destino = path.join(raiz, "img/logo-camadas");
fs.mkdirSync(destino, { recursive: true });
const tags = [];

for (const [nome] of partes) {
  const so = base.replace("<style>", `<style>[class^="c-"]{visibility:hidden}.c-${nome}{visibility:visible}`);
  const arqSvg = path.join(tmp, `${nome}.svg`), arqPng = path.join(tmp, `${nome}.png`);
  fs.writeFileSync(arqSvg, so);
  execFileSync(chrome, [
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
    `--window-size=${LADO},${LADO}`, "--default-background-color=00000000",
    `--user-data-dir=${path.join(tmp, "perfil")}`, `--screenshot=${arqPng}`,
    "file:///" + arqSvg.replace(/\\/g, "/"),
  ], { stdio: "ignore", timeout: 60000 });

  // recorta a área visível (alfa > 0) com 2px de folga
  const { w, h, px } = ler(arqPng);
  let x0 = w, y0 = h, x1 = -1, y1 = -1;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++)
    if (px[(y * w + x) * 4 + 3]) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  if (x1 < 0) throw new Error(`camada ${nome} saiu vazia`);
  x0 = Math.max(0, x0 - 2); y0 = Math.max(0, y0 - 2); x1 = Math.min(w - 1, x1 + 2); y1 = Math.min(h - 1, y1 + 2);
  const cw = x1 - x0 + 1, ch = y1 - y0 + 1, corte = Buffer.alloc(cw * ch * 4);
  for (let y = 0; y < ch; y++) px.copy(corte, y * cw * 4, ((y + y0) * w + x0) * 4, ((y + y0) * w + x1 + 1) * 4);
  gravar(path.join(destino, `${nome}.png`), { w: cw, h: ch, px: corte });

  const pct = v => +(v / LADO * 100).toFixed(3) + "%";
  tags.push(`<img class="camada c-${nome}" src="img/logo-camadas/${nome}.png" alt="" style="left:${pct(x0)};top:${pct(y0)};width:${pct(cw)}">`);
  console.log(`${nome}: ${cw}x${ch} em (${x0},${y0})`);
}
fs.rmSync(tmp, { recursive: true, force: true });

// --- grava o bloco de camadas no index.html ---
const idx = path.join(raiz, "index.html");
const html = fs.readFileSync(idx, "utf8");
const ini = "<!-- CAMADAS:inicio (gerado por ferramentas/gerar-logo-animada.js) -->", fim = "<!-- CAMADAS:fim -->";
const a = html.indexOf(ini), b = html.indexOf(fim);
if (a < 0 || b < a) throw new Error("marcadores CAMADAS não encontrados no index.html");
const recuo = "\n          ";
fs.writeFileSync(idx, html.slice(0, a + ini.length) + recuo + tags.join(recuo) + recuo + html.slice(b));
console.log(`ok: ${partes.length} camadas em img/logo-camadas e index.html atualizado`);
