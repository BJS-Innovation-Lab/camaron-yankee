const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const reservation = JSON.parse(process.argv[2]);

// Load mascot image as base64
const mascotPath = path.join(__dirname, 'camaron_mascot.png');
const mascotB64 = 'data:image/png;base64,' + fs.readFileSync(mascotPath).toString('base64');

const zonaNombre = reservation.area === 'playa' ? 'Zona Playa — Frente al Mar' : 'Zona Comedor — Interior con A/C';
const fechaObj = new Date(reservation.date + 'T12:00:00');
const fechaFormateada = fechaObj.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Pacifico&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:450px;height:780px;font-family:'Inter',sans-serif;position:relative;overflow:hidden;
  background:linear-gradient(180deg, #1e6b8a 0%, #2a8fa8 15%, #f5a623 45%, #f28c38 55%, #e8735a 70%, #d4567a 85%, #8b3a8a 100%);
}

/* Palm tree silhouettes */
.palms{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0}
.palm-left{position:absolute;top:-20px;left:-30px;font-size:120px;transform:rotate(-15deg);opacity:0.15;color:#000}
.palm-right{position:absolute;top:-10px;right:-20px;font-size:100px;transform:rotate(20deg) scaleX(-1);opacity:0.12;color:#000}
.palm-bottom{position:absolute;bottom:30px;left:10px;font-size:80px;transform:rotate(-25deg);opacity:0.08;color:#000}

/* Sun circle */
.sun{position:absolute;top:80px;right:40px;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle,rgba(255,220,100,0.6) 0%,rgba(245,166,35,0.3) 50%,transparent 70%);z-index:0}

/* Waves at bottom */
.waves{position:absolute;bottom:0;left:0;width:100%;height:60px;z-index:0}
.wave{position:absolute;bottom:0;width:200%;height:40px;border-radius:50% 50% 0 0;animation:none}
.wave1{background:rgba(30,107,138,0.3);bottom:20px;left:-50%}
.wave2{background:rgba(42,143,168,0.2);bottom:10px;left:-30%}
.wave3{background:rgba(30,107,138,0.15);bottom:0;left:-40%}

.content{position:relative;z-index:1;padding:25px}

/* Restaurant header */
.header{text-align:center;margin-bottom:15px}
.restaurant-label{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.7);margin-bottom:2px}
.restaurant-name{font-family:'Fredoka One',cursive;font-size:38px;color:#fff;text-shadow:2px 3px 6px rgba(0,0,0,0.3);line-height:1}
.restaurant-sub{font-family:'Pacifico',cursive;font-size:16px;color:#ffe082;margin-top:2px;text-shadow:1px 1px 3px rgba(0,0,0,0.2)}
.restaurant-loc{font-size:9px;color:rgba(255,255,255,0.6);margin-top:6px;letter-spacing:1px}

/* Confirmation badge */
.confirm-badge{text-align:center;margin:18px 0 12px}
.confirm-icon{text-align:center}
.confirm-text{font-family:'Fredoka One',cursive;font-size:22px;color:#fff;text-shadow:1px 2px 4px rgba(0,0,0,0.3);margin-top:4px}
.confirm-sub{font-size:11px;color:#ffe082;font-weight:600}

/* Details card */
.card{background:rgba(255,255,255,0.92);border-radius:20px;padding:22px 20px;margin:0 5px;box-shadow:0 8px 30px rgba(0,0,0,0.2)}
.row{display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid rgba(0,0,0,0.06)}
.row:last-child{border-bottom:none}
.row-label{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#888;font-weight:700}
.row-value{font-size:13px;font-weight:700;color:#1a1a1a;text-align:right;max-width:55%}
.row-value.gold{color:#e8735a;font-size:14px}

.zone-pill{display:inline-block;background:linear-gradient(135deg,#2a8fa8,#40B5AD);color:#fff;border-radius:15px;padding:4px 14px;font-size:11px;font-weight:700}
.mesa-pill{display:inline-block;background:linear-gradient(135deg,#f5a623,#e8735a);color:#fff;border-radius:10px;padding:5px 20px;font-size:18px;font-weight:700;letter-spacing:3px}

.divider{height:1px;background:linear-gradient(90deg,transparent,rgba(232,115,90,0.3),transparent);margin:4px 0}

/* Instructions */
.instructions{text-align:center;margin:15px 10px 0;background:rgba(255,255,255,0.15);border-radius:14px;padding:14px}
.instructions .main{font-size:12px;color:#fff;font-weight:700;margin-bottom:4px}
.instructions .sub{font-size:9px;color:rgba(255,255,255,0.7);line-height:1.5}

/* Footer */
.footer{text-align:center;margin-top:12px}
.footer-id{font-family:'Fredoka One',cursive;font-size:13px;color:rgba(255,255,255,0.5);letter-spacing:3px}
.footer-brand{font-size:7px;color:rgba(255,255,255,0.3);margin-top:4px;letter-spacing:1px}
</style>
</head>
<body>

<div class="palms">
  <div class="palm-left">&#127796;</div>
  <div class="palm-right">&#127796;</div>
  <div class="palm-bottom">&#127796;</div>
</div>
<div class="sun"></div>
<div class="waves">
  <div class="wave wave1"></div>
  <div class="wave wave2"></div>
  <div class="wave wave3"></div>
</div>

<div class="content">

<div class="header">
  <div class="restaurant-label">RESTAURANT</div>
  <div class="restaurant-name">CAMARON YANKEE</div>
  <div class="restaurant-sub">Beach Club</div>
  <div class="restaurant-loc">Acapulco, Guerrero</div>
</div>

<div class="confirm-badge">
  <div class="confirm-icon"><img src="${mascotB64}" style="width:130px;height:auto;filter:drop-shadow(2px 4px 8px rgba(0,0,0,0.3))"></div>
  <div class="confirm-text">Reservacion Confirmada</div>
  <div class="confirm-sub">Tu mesa te espera</div>
</div>

<div class="card">
  <div class="row">
    <span class="row-label">Cliente</span>
    <span class="row-value gold">${reservation.name}</span>
  </div>
  <div class="row">
    <span class="row-label">Fecha</span>
    <span class="row-value">${fechaFormateada}</span>
  </div>
  <div class="row">
    <span class="row-label">Hora</span>
    <span class="row-value gold">${reservation.time}</span>
  </div>
  <div class="row">
    <span class="row-label">Personas</span>
    <span class="row-value">${reservation.guests} personas</span>
  </div>
  <div class="divider"></div>
  <div class="row">
    <span class="row-label">Zona</span>
    <span class="zone-pill">${zonaNombre}</span>
  </div>
  <div class="row">
    <span class="row-label">Mesa</span>
    <span class="mesa-pill">${reservation.table_id || 'AL LLEGAR'}</span>
  </div>
  ${reservation.notes ? `<div class="divider"></div><div class="row"><span class="row-label">Notas</span><span class="row-value">${reservation.notes}</span></div>` : ''}
</div>

<div class="instructions">
  <div class="main">Muestra este comprobante al llegar</div>
  <div class="sub">Para cancelar o modificar tu reservacion, contactanos por WhatsApp.</div>
</div>

<div class="footer">
  <div class="footer-id">#CY-${String(reservation.id).padStart(4, '0')}</div>
  <div class="footer-brand">CAMARON YANKEE &middot; camaron-yankee.vercel.app</div>
</div>

</div>
</body>
</html>`;

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/data/workspace/node_modules/.remotion/chrome-headless-shell/linux64/chrome-headless-shell-linux64/chrome-headless-shell',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 450, height: 780, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: 'networkidle0' });
  
  const filename = `reservacion_CY-${String(reservation.id).padStart(4,'0')}_${reservation.name.replace(/\s+/g,'_')}.png`;
  await page.screenshot({ path: filename, fullPage: true, type: 'png' });
  await browser.close();
  console.log(filename);
})();
