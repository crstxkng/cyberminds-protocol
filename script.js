/* --- CORE SYSTEM CONFIG --- */
const _0xSEC = {
    flags: {
    1: "SW5WMXNJYkwzX0VsM20zbnQ=",
    2: "QXR0cjFidXQzX0J5UDRzcw==",
    3: "UGw0aW5UM3h0X1MzY3IzdHM=",
    4: "T3YzckZsMHdfTTRzdDNy",
    5: "UHIxYzNfTTRuMXB1bDR0MHI=",
    6: "QzBvazEzX00wbnN0M3JfQWRtMW4=",
    7: "UDNyczFzdDNudF9INGNr",
    8: "R2wwYjRsX00zbTByeV9SMzRk",
    9: "UnVudDFtM19SM3dyMXQz",
    10: "SDFkZDNuX04wdDNzX0wzNGs=",
    11: "VDFtM19UcTR2M2wzcg==",
    12: "TjN0dzBya19TbjFmZjNyX1ByMA=="
    },
    targets: {
    4: "T3YzckZsMHc=",
    10: "SDFkZDNuX04wdDNzX0wzNGs=",
    12: "TjN0dzBya19TbjFmZjNyX1ByMA=="
    }
};

const TOTAL_FLAGS = 12;
let flagsCaptured = 0;
const gameState = new Array(13).fill(false);

// --- UTILS ---
const _d = (str) => atob(str);
const _e = (str) => btoa(str);

function log(id, msg, isError = false) {
    const el = document.getElementById(`out-${id}`);
    el.innerText = `> ${msg}`;
    el.className = isError ? 'console-output msg-error' : 'console-output msg-success';
}

// --- CAPTURE SYSTEM ---
function capture(id) {
    if (gameState[id]) return;
    gameState[id] = true;
    flagsCaptured++;
    
    document.getElementById('score').innerText = flagsCaptured;
    document.getElementById(`c${id}`).classList.add('solved');
    renderPager();
    log(id, 'ACCESO CONCEDIDO. SECRETO DESCIFRADO.');
    
    const display = document.getElementById(`secret-${id}`);
    display.style.display = 'block';
    display.innerText = _d(_0xSEC.flags[id]);

    if (flagsCaptured === TOTAL_FLAGS) {
    setTimeout(() => {
        document.getElementById('victory-overlay').style.display = 'flex';
    }, 1500);
    }
}

// --- GENERIC VALIDATOR (OBFUSCATED) ---
function validateInput(id) {
    const userVal = document.getElementById(`input-${id}`).value.trim();
    const targetHash = _0xSEC.targets[id] || _0xSEC.flags[id]; // Algunos usan el mismo flag como input

    // Comparamos el hash del input usuario vs hash guardado
    // Así el usuario no ve la respuesta plana en el 'if'
    if (_e(userVal) === targetHash) {
    capture(id);
    } else {
    log(id, 'Hash mismatch. Acceso denegado.', true);
    }
}

/* --- CHALLENGE LOGIC --- */
// 4. Length (Comparación contra Hash)
function checkLength(id) {
    const v = document.getElementById('input-4').value;
    if (_e(v) === _0xSEC.targets[4]) capture(id);
    else log(id, 'Integridad de datos fallida.', true);
}

// 5. Price (Lógica numérica no necesita ofuscación de string, pero ocultamos el objetivo)
function buyItem(id) {
    if (document.getElementById('price-5').value < 5000) capture(id);
    else log(id, 'Fondos insuficientes.', true);
}

// 6. Cookie
document.cookie = "session=guest";
function checkCookie(id) {
    if (document.cookie.indexOf("session=god_mode") !== -1) capture(id);
    else log(id, 'Cookie de sesión inválida.', true);
}

// 7. Storage
localStorage.setItem('config_access', 'denied');
function checkStorage(id) {
    if (localStorage.getItem('config_access') === 'granted') capture(id);
    else log(id, 'Permiso de almacenamiento denegado.', true);
}

// 8. Variable
var systemStatus = "LOCKED";
function checkVar(id) {
    if (systemStatus === "UNLOCKED") capture(id);
    else log(id, 'systemStatus != UNLOCKED', true);
}

// 9. Func Rewrite
function authCheck() { return false; }

// 11. Timer
var countdownValue = 3600;
setInterval(() => {
    if (!gameState[11] && countdownValue > 0) {
    countdownValue--;
    document.getElementById('timer-val').innerText = countdownValue;
    if (countdownValue === 0) document.getElementById('btn-11').disabled = false;
    }
}, 1000);

// 12. Network
function doNetworkReq() {
    log(12, 'Iniciando handshake...');
    fetch('api/secret', { headers: { 'X-Secret-Header': 'N3tw0rk_Sn1ff3r_Pr0' } }).catch(e=>{});
    setTimeout(() => log(12, 'Handshake finalizado. Analiza el tráfico.'), 500);
}

// --- INTRO & PAGINATION ---
let page = 1;
const cards = [...document.querySelectorAll('.challenge-card')];

function startGame() {
    document.getElementById('intro').hidden = true;
    document.getElementById('game').hidden = false;
    showPage(1);
}

function showPage(n) {
    page = Math.min(Math.max(n, 1), cards.length);
    cards.forEach((c, i) => c.hidden = i !== page - 1);
    renderPager();
}

function renderPager() {
    document.getElementById('pages').innerHTML = cards.map((c, i) =>
        `<button class="${i === page - 1 ? 'current' : ''} ${gameState[i + 1] ? 'done' : ''}" onclick="showPage(${i + 1})">${String(i + 1).padStart(2, '0')}</button>`
    ).join('');
    document.getElementById('prev').disabled = page === 1;
    document.getElementById('next').disabled = page === cards.length;
}

// --- SHARE TEXT CONFIG ---
const SHARE_MESSAGE = `⚠️ CYBERMINDS REPORT: SYSTEM COMPROMISED ⚠️\n\nHe logrado vulnerar los 12 niveles de seguridad del protocolo CyberMinds.\nDesde manipulación del DOM hasta intercepción de tráfico.\n\n📊 STATUS: ROOT ACCESS\n🔓 EXPLOITS: 12/12\n\n¿Crees que puedes proteger tu cliente?\nInténtalo aquí: https://cyberminds-protocol.netlify.app/\n\n#CyberSecurity #Hacking #CTF #WebDev #CyberMinds`;

function copyShareText(btn) {
    navigator.clipboard.writeText(SHARE_MESSAGE).then(() => {
    const originalText = btn.innerHTML;
    btn.innerHTML = "<span>¡Copiado!</span>";
    btn.style.background = "#fff";
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = "";
    }, 3000);
    });
}

setTimeout(() => {
        console.clear();
        console.log(
            "%c 🛑 SECURITY BREACH ALERT %c",
            "background: #e10600; color: #fff; font-size: 24px; font-weight: 900; padding: 10px 20px; border-radius: 4px 0 0 4px;",
            "background: #000; color: #e10600; font-size: 24px; font-weight: 900; padding: 10px 20px; border-right: 4px solid #e10600; border-radius: 0 4px 4px 0;"
        );

        console.log(
            "%c⚠️ DETECTADO POSIBLE INTENTO DE SELF-XSS\n%cSi alguien te pidió pegar un script aquí prometiéndote acceso a cuentas de redes sociales o funciones ocultas, %cTÚ ERES LA VÍCTIMA.%c\nEstás a punto de entregar el control de tu sesión.",
            "color: #ffcc00; font-weight: bold; font-size: 14px; padding-top: 10px;",
            "color: #ccc; font-family: 'Consolas', monospace; font-size: 12px; line-height: 1.5;",
            "color: #e10600; font-weight: bold; font-size: 13px; text-decoration: underline;",
            "color: #ccc;"
        );

        console.log(
            "\n%c 🛡️ CyberMinds Protocol %c v1.0 ",
            "background: #000; color: #f2f0e9; border: 1px solid #f2f0e9; border-radius: 3px 0 0 3px; padding: 3px 6px; font-weight: bold;",
            "background: #f2f0e9; color: #000; border: 1px solid #f2f0e9; padding: 3px 6px; font-weight: bold;",
        );
        
        console.log("%c💡 TIP: Para el Reto #8, inspecciona la variable `systemStatus`.", "color: #f2f0e9; font-style: italic; margin-top: 5px;");

    }, 1000);
