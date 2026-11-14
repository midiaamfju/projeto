/* Salas de reunião por modalidade, usando VDO.Ninja e cena automática.
   As URLs são determinísticas por modalidade, de modo que o mesmo link funciona
   com qualquer organizador que utilize esta mesma edição do site. */
(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const home = $("secaoHome"), live = $("secaoTransmissao"), select = $("transModalidade");
  const roomFrame = $("salaGrade");
  let modalidades = [];
  let salaCarregada = "";
  // Prefixo de 3 caracteres antes de cada sala ("abc_futsalfeminino"), para não cair na
  // mesma sala de outro site que use o VDO.Ninja. Vem de config.salaPrefixo (editável no
  // admin); vazio = calculado do endereço do site. Mesma função existe no admin.html.
  function prefixoPadrao(loc = location) {
    const repo = loc.pathname.split("/").filter(Boolean).find(s => !/\.html?$/i.test(s)) || "";
    let h = 0x811c9dc5;
    for (const c of (loc.host + "/" + decodeURIComponent(repo)).toLowerCase()) { h ^= c.charCodeAt(0); h = Math.imul(h, 0x01000193) >>> 0; }
    return (h % 46656).toString(36).padStart(3, "0");
  }
  const limparPrefixo = p => String(p || "").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 3);
  let prefixoConfig = limparPrefixo(window.MEDALHAS?.config?.salaPrefixo);
  const prefixo = () => (prefixoConfig.length === 3 ? prefixoConfig : prefixoPadrao()) + "_";
  const base = "https://vdo.ninja/";
  // Nome legível e previsível, uma sala por modalidade.
  function salaId(nome) {
    const normal = String(nome || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    // O gênero faz parte da sala: Feminino e Masculino nunca compartilham câmeras.
    const ns = prefixo();
    const slug = normal.replace(/[^a-z0-9]+/g, "").slice(0, 49 - ns.length);
    return ns + (slug || "geral");
  }
  function url(params) {
    const u = new URL(base);
    Object.entries(params).forEach(([k,v])=>u.searchParams.set(k,String(v)));
    return u.toString();
  }
  function links(nome) {
    const room = salaId(nome);
    return {
      convidado: url({room}),
      obs: url({scene:0,room}),
      diretor: url({director:room})
    };
  }
  function copiar(text,button) {
    if (!text) return;
    const original = button.textContent;
    const fallback = () => { const input=document.createElement("textarea");input.value=text;input.style.position="fixed";input.style.opacity="0";document.body.append(input);input.select();const ok=document.execCommand("copy");input.remove();if(!ok) window.prompt("Copie o link:",text); };
    Promise.resolve(navigator.clipboard?.writeText ? navigator.clipboard.writeText(text).catch(fallback) : fallback()).then(()=>{button.textContent="Copiado ✓";setTimeout(()=>button.textContent=original,1800);});
  }
  /* QR codes: gerados no navegador (qrcode-generator, sem enviar o link a terceiros).
     Sem a biblioteca (CDN fora do ar), os botões continuam escondidos e o resto funciona. */
  function svgQr(texto, celula) {
    const q = qrcode(0, "M");
    q.addData(texto);
    q.make();
    return q.createSvgTag({ cellSize: celula, margin: 0, scalable: true });
  }
  function atualizarQrs() {
    const temLib = typeof window.qrcode === "function";
    document.querySelectorAll(".qr-mini").forEach(b => {
      const link = $(b.dataset.qr).value;
      b.hidden = !temLib || !link;
      if (b.hidden || b.dataset.link === link) return;
      b.dataset.link = link;
      b.innerHTML = svgQr(link, 2);
    });
  }
  function abrirQr(botao) {
    const d = $("qrDialogo"), link = $(botao.dataset.qr).value;
    $("qrTitulo").textContent = `${botao.dataset.titulo} · ${select.value}`;
    $("qrGrande").innerHTML = svgQr(link, 8);
    $("qrLink").textContent = link;
    d.showModal();
  }
  document.querySelectorAll(".qr-mini").forEach(b => b.addEventListener("click", () => abrirQr(b)));
  $("qrFechar").addEventListener("click", () => $("qrDialogo").close());
  // Clique fora do cartão (no fundo escurecido) fecha.
  $("qrDialogo").addEventListener("click", e => {
    const r = e.currentTarget.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) e.currentTarget.close();
  });

  function desenhar() {
    const nome = select.value;
    if(!nome) return;
    const l=links(nome);
    $("salaNome").textContent=nome;
    $("linkConvidado").value=l.convidado;
    $("linkObs").value=l.obs;
    $("linkDiretor").value=l.diretor;
    $("abrirConvite").href=l.convidado;
    $("abrirDiretor").href=l.diretor;
    $("abrirCena").href=l.obs;
    atualizarQrs();
    if (salaCarregada === salaId(nome) && roomFrame.querySelector("iframe")) return;
    salaCarregada = salaId(nome);
    roomFrame.replaceChildren();
    const frame=document.createElement("iframe");
    frame.src=l.obs;
    frame.title=`Câmeras conectadas — ${nome}`;
    frame.allow="autoplay; fullscreen; microphone; camera; display-capture";
    frame.referrerPolicy="strict-origin-when-cross-origin";
    frame.loading="eager";
    roomFrame.append(frame);
  }
  function atualizarModalidades(novas) {
    if(!Array.isArray(novas)||!novas.length)return;
    if(JSON.stringify(novas)===JSON.stringify(modalidades))return;
    const atual=select.value;
    modalidades=novas.slice();select.replaceChildren();
    modalidades.forEach(nome=>select.add(new Option(nome,nome)));
    select.value=modalidades.includes(atual)?atual:modalidades[0];
    // A lista pode mudar sem regenerar URLs nem reiniciar a câmera já ativa.
    // Só mudar de sala quando a seleção anterior deixou de existir.
    if(!live.hidden && select.value !== atual) desenhar();
  }
  function abrirAba(nome,atualizarHash=true) {
    const isLive=nome==="transmissoes";
    home.hidden=isLive;live.hidden=!isLive;
    $("abaHome").classList.toggle("ativa",!isLive);
    $("abaTransmissao").classList.toggle("ativa",isLive);
    $("abaHome").setAttribute("aria-selected",String(!isLive));
    $("abaTransmissao").setAttribute("aria-selected",String(isLive));
    window.esporteJovemTransmissaoAtiva = isLive;
    if (isLive) {
      desenhar();
    } else {
      roomFrame.replaceChildren();
      salaCarregada = "";
      if (typeof render === "function" && typeof dadosAtuais !== "undefined" && dadosAtuais) render(dadosAtuais);
    }
    if(atualizarHash)history.replaceState(null,"",location.pathname+location.search+"#"+(isLive?"transmissoes":"home"));
  }
  $("abaHome").addEventListener("click",()=>abrirAba("home"));
  $("abaTransmissao").addEventListener("click",()=>abrirAba("transmissoes"));
  select.addEventListener("change",desenhar);
  $("recarregarSala").addEventListener("click",()=>{salaCarregada="";desenhar();});
  [["copiarConvidado","linkConvidado"],["copiarObs","linkObs"],["copiarDiretor","linkDiretor"]].forEach(([button,input])=>$(button).addEventListener("click",()=>copiar($(input).value,$(button))));
  window.addEventListener("esportejovem:dados",e=>{
    const novo = limparPrefixo(e.detail.salaPrefixo);
    // Prefixo trocado no admin: refaz links e sala; mantém a câmera se nada mudou.
    if (novo !== prefixoConfig) { prefixoConfig = novo; if (!live.hidden) { salaCarregada = ""; desenhar(); } }
    atualizarModalidades(e.detail.modalidades);
  });
  if(window.MEDALHAS?.modalidades) atualizarModalidades(Object.keys(window.MEDALHAS.modalidades));
  abrirAba(location.hash==="#transmissoes"?"transmissoes":"home",false);
})();
