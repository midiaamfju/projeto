// Leitor/gravador mínimo de PNG RGBA/RGB 8 bits (sem dependências). Uso: node png.js <arquivo.png>
const fs = require("fs"), zlib = require("zlib");

function ler(arq) {
  const b = fs.readFileSync(arq);
  let p = 8, w, h, bits, tipo, idat = [];
  while (p < b.length) {
    const len = b.readUInt32BE(p), t = b.toString("ascii", p + 4, p + 8), d = b.subarray(p + 8, p + 8 + len);
    if (t === "IHDR") { w = d.readUInt32BE(0); h = d.readUInt32BE(4); bits = d[8]; tipo = d[9]; if (d[12]) throw new Error("PNG entrelaçado não suportado"); }
    if (t === "IDAT") idat.push(d);
    p += 12 + len;
  }
  if (bits !== 8 || (tipo !== 6 && tipo !== 2)) throw new Error(`formato não suportado: bits=${bits} tipo=${tipo}`);
  const bpp = tipo === 6 ? 4 : 3, raw = zlib.inflateSync(Buffer.concat(idat)), linha = w * bpp;
  const out = Buffer.alloc(w * h * 4); let prev = Buffer.alloc(linha);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (linha + 1)], cur = Buffer.from(raw.subarray(y * (linha + 1) + 1, (y + 1) * (linha + 1)));
    for (let i = 0; i < linha; i++) {
      const a = i >= bpp ? cur[i - bpp] : 0, c = i >= bpp ? prev[i - bpp] : 0, up = prev[i];
      let v = 0;
      if (f === 1) v = a; else if (f === 2) v = up; else if (f === 3) v = (a + up) >> 1;
      else if (f === 4) { const pp = a + up - c, pa = Math.abs(pp - a), pb = Math.abs(pp - up), pc = Math.abs(pp - c); v = pa <= pb && pa <= pc ? a : pb <= pc ? up : c; }
      cur[i] = (cur[i] + v) & 255;
    }
    for (let x = 0; x < w; x++) { const o = (y * w + x) * 4; out[o] = cur[x * bpp]; out[o + 1] = cur[x * bpp + 1]; out[o + 2] = cur[x * bpp + 2]; out[o + 3] = bpp === 4 ? cur[x * bpp + 3] : 255; }
    prev = cur;
  }
  return { w, h, px: out, tipo };
}

function gravar(arq, { w, h, px }) {
  const crc = buf => zlib.crc32(buf) >>> 0;
  const chunk = (t, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  const raw = Buffer.alloc(h * (w * 4 + 1));
  for (let y = 0; y < h; y++) px.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  fs.writeFileSync(arq, Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]));
}

module.exports = { ler, gravar };

if (require.main === module) {
  const img = ler(process.argv[2]), { w, h, px } = img;
  let visiveis = 0, opacos = 0, sombra = 0, transp = 0;
  for (let i = 0; i < w * h; i++) {
    const r = px[i * 4], g = px[i * 4 + 1], b = px[i * 4 + 2], a = px[i * 4 + 3];
    if (a === 0) { transp++; continue; }
    visiveis++; if (a === 255) opacos++;
    if (a < 250 && r + g + b < 120) sombra++;
  }
  console.log(`tamanho ${w}x${h} tipo ${img.tipo} | transparentes ${transp} | visíveis ${visiveis} (opacos ${opacos}) | escuros semitransparentes (sombra) ${sombra}`);
}
