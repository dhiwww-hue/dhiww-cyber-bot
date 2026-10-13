require('dotenv').config()
const { Telegraf, Markup } = require('telegraf')
const crypto = require('crypto')
const QRCode = require('qrcode')
const http = require('http')
const https = require('https')
const dns = require('dns').promises
const { URL } = require('url')

const bot = new Telegraf(process.env.TELEGRAM_TOKEN)
const OWNER_ID = parseInt(process.env.OWNER_ID)

// ==================== MENU UTAMA ====================
const mainMenu = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: '🔐 Hash Generator', callback_data: 'hash' },
        { text: '🔍 Hash Identifier', callback_data: 'hashid' }
      ],
      [
        { text: '🔑 Password Tools', callback_data: 'password' },
        { text: '🔢 Base64', callback_data: 'base64' }
      ],
      [
        { text: '🎨 QR Generator', callback_data: 'qr' },
        { text: '🔢 Base Converter', callback_data: 'baseconv' }
      ],
      [
        { text: '🌐 IP Intelligence', callback_data: 'ipinfo' },
        { text: '🧮 Subnet Calculator', callback_data: 'subnet' }
      ],
      [
        { text: '🔍 DNS Lookup', callback_data: 'dns' },
        { text: '📧 Email Validator', callback_data: 'email' }
      ],
      [
        { text: '🔗 URL Parser', callback_data: 'urlparser' },
        { text: '🛡️ Header Checker', callback_data: 'headers' }
      ],
      [
        { text: '🎫 JWT Decoder', callback_data: 'jwt' },
        { text: '🎨 Color Converter', callback_data: 'color' }
      ],
      [
        { text: '📸 EXIF Viewer', callback_data: 'exif' },
        { text: '📱 Phone Info', callback_data: 'phone' }
      ],
      [
        { text: '🕵️ Username Checker', callback_data: 'username' },
        { text: '🔑 SSH Fingerprint', callback_data: 'ssh' }
      ],
      [
        { text: 'ℹ️ Bantuan', callback_data: 'help' }
      ]
    ]
  }
}

function isOwner(ctx) {
  return ctx.from.id === OWNER_ID
}

// ==================== START ====================
bot.start((ctx) => {
  ctx.replyWithMarkdown(
    `🔐 *DHIWW CYBER TOOLKIT*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n\n` +
    `Selamat datang, *${ctx.from.first_name}*!\n\n` +
    `Bot ini berisi tools cyber terlengkap buat\n` +
    `belajar, riset, dan kerjaan sehari-hari.\n\n` +
    `Pilih tool di bawah:`,
    mainMenu
  )
})

// ==================== MENU ====================
bot.command('menu', (ctx) => {
  ctx.replyWithMarkdown('🔐 *DHIWW CYBER TOOLKIT*\n\nPilih tool:', mainMenu)
})

// ==================== CALLBACK HANDLER ====================
bot.on('callback_query', async (ctx, next) => {
  try {
    await ctx.answerCbQuery()
  } catch (e) {}
  return next()
})

// ==================== HELP ====================
bot.action('help', (ctx) => {
  ctx.replyWithMarkdown(
    `📖 *BANTUAN*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n\n` +
    `*🔐 Hash Generator:* \`/hash <teks>\`\n` +
    `*🔍 Hash Identifier:* \`/hashid <hash>\`\n` +
    `*🔑 Password:* \`/pass <panjang>\` \\| \`/cekpass <pass>\`\n` +
    `*🔢 Base64:* \`/b64e <teks>\` \\| \`/b64d <teks>\`\n` +
    `*🎨 QR Generator:* \`/qr <teks>\`\n` +
    `*🔢 Base Converter:* \`/base <angka> <dari> <ke>\`\n` +
    `*🌐 IP Intelligence:* \`/ip <ip>\`\n` +
    `*🧮 Subnet Calculator:* \`/subnet <ip/cidr>\`\n` +
    `*🔍 DNS Lookup:* \`/dns <domain>\`\n` +
    `*📧 Email Validator:* \`/email <email>\`\n` +
    `*🔗 URL Parser:* \`/url <url>\`\n` +
    `*🛡️ Header Checker:* \`/headers <url>\`\n` +
    `*🎫 JWT Decoder:* \`/jwt <token>\`\n` +
    `*🎨 Color Converter:* \`/color <hex/rgb>\`\n` +
    `*📸 EXIF Viewer:* kirim gambar\n` +
    `*📱 Phone Info:* \`/phone <nomor>\`\n` +
    `*🕵️ Username Checker:* \`/uname <username>\`\n` +
    `*🔑 SSH Fingerprint:* \`/ssh <public-key>\``,
    Markup.inlineKeyboard([[Markup.button.callback('⬅️ Kembali', 'menu')]])
  )
})

bot.action('menu', (ctx) => {
  ctx.editMessageText('🔐 *DHIWW CYBER TOOLKIT*\n\nPilih tool:', {
    parse_mode: 'Markdown',
    ...mainMenu.reply_markup
  })
})

// ==================== 1. HASH GENERATOR ====================
bot.action('hash', (ctx) => {
  ctx.replyWithMarkdown(
    `🔐 *HASH GENERATOR*\n\n` +
    `Ketik: \`/hash <teks>\`\n` +
    `Contoh: \`/hash rahasia123\``,
    Markup.inlineKeyboard([[Markup.button.callback('⬅️ Kembali', 'menu')]])
  )
})

bot.command('hash', (ctx) => {
  const text = ctx.message.text.split(' ').slice(1).join(' ')
  if (!text) return ctx.reply('❌ Contoh: /hash rahasia123')

  const md5 = crypto.createHash('md5').update(text).digest('hex')
  const sha1 = crypto.createHash('sha1').update(text).digest('hex')
  const sha256 = crypto.createHash('sha256').update(text).digest('hex')
  const sha512 = crypto.createHash('sha512').update(text).digest('hex')

  ctx.replyWithMarkdown(
    `🔐 *HASH RESULT*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `*Input:* \`${text}\`\n\n` +
    `*MD5:*\n\`${md5}\`\n\n` +
    `*SHA1:*\n\`${sha1}\`\n\n` +
    `*SHA256:*\n\`${sha256}\`\n\n` +
    `*SHA512:*\n\`${sha512}\``,
    Markup.inlineKeyboard([[Markup.button.callback('⬅️ Menu', 'menu')]])
  )
})

// ==================== 2. HASH IDENTIFIER ====================
bot.action('hashid', (ctx) => {
  ctx.replyWithMarkdown(
    `🔍 *HASH IDENTIFIER*\n\n` +
    `Tebak jenis hash dari string.\n\n` +
    `Ketik: \`/hashid <hash>\`\n` +
    `Contoh: \`/hashid 5d41402abc4b2a76b9719d911017c592\``,
    Markup.inlineKeyboard([[Markup.button.callback('⬅️ Kembali', 'menu')]])
  )
})

bot.command('hashid', (ctx) => {
  const hash = ctx.message.text.split(' ').slice(1).join(' ').trim()
  if (!hash) return ctx.reply('❌ Contoh: /hashid 5d41402abc4b2a76b9719d911017c592')

  const len = hash.length
  const isHex = /^[a-f0-9]+$/i.test(hash)
  const candidates = []

  if (isHex) {
    if (len === 32) candidates.push('MD5', 'MD4', 'NTLM', 'MD2')
    if (len === 40) candidates.push('SHA1', 'MySQL5', 'RIPEMD-160')
    if (len === 56) candidates.push('SHA224', 'SHA3-224')
    if (len === 64) candidates.push('SHA256', 'SHA3-256', 'BLAKE2s', 'Keccak-256')
    if (len === 96) candidates.push('SHA384', 'SHA3-384')
    if (len === 128) candidates.push('SHA512', 'SHA3-512', 'BLAKE2b', 'Whirlpool')
  }
  if (hash.startsWith('$2a$') || hash.startsWith('$2b$') || hash.startsWith('$2y$')) candidates.push('bcrypt (Blowfish)')
  if (hash.startsWith('$argon2')) candidates.push('Argon2')
  if (hash.startsWith('$6$')) candidates.push('SHA-512 Crypt')
  if (hash.startsWith('$5$')) candidates.push('SHA-256 Crypt')
  if (hash.startsWith('$1$')) candidates.push('MD5 Crypt')
  if (hash.startsWith('$P$') || hash.startsWith('$H$')) candidates.push('PHPass (WordPress)')
  if (hash.startsWith('{SSHA}')) candidates.push('SSHA (LDAP)')
  if (hash.startsWith('{SHA}')) candidates.push('SHA1 (LDAP)')

  if (candidates.length === 0) {
    return ctx.reply(
      `🔍 HASH IDENTIFIER\n` +
      `━━━━━━━━━━━━━━━━━━━━\n\n` +
      `Hash: ${hash}\n` +
      `Panjang: ${len} karakter\n\n` +
      `❌ Jenis hash tidak dikenali.`
    )
  }

  ctx.replyWithMarkdown(
    '```\n' +
    `🔍 HASH IDENTIFIER\n` +
    `━━━━━━━━━━━━━━━━━━━━\n\n` +
    `Hash: ${hash}\n` +
    `Panjang: ${len}\n` +
    `Hex: ${isHex ? 'Ya' : 'Tidak'}\n\n` +
    `🎯 Kemungkinan jenis:\n` +
    candidates.map(c => `  • ${c}`).join('\n') +
    '\n```',
    Markup.inlineKeyboard([
      [Markup.button.callback('🔄 Cek Hash Lain', 'hashid')],
      [Markup.button.callback('⬅️ Menu', 'menu')]
    ])
  )
})

// ==================== 3. PASSWORD TOOLS ====================
bot.action('password', (ctx) => {
  ctx.replyWithMarkdown(
    `🔑 *PASSWORD TOOLS*\n\n` +
    `Generate: \`/pass <panjang>\`\n` +
    `Cek: \`/cekpass <password>\``,
    Markup.inlineKeyboard([[Markup.button.callback('⬅️ Kembali', 'menu')]])
  )
})

bot.command('pass', (ctx) => {
  const len = parseInt(ctx.message.text.split(' ')[1]) || 16
  if (len < 4 || len > 128) return ctx.reply('❌ Panjang harus 4-128')

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-='
  let pass = ''
  const bytes = crypto.randomBytes(len)
  for (let i = 0; i < len; i++) pass += chars[bytes[i] % chars.length]

  ctx.replyWithMarkdown(
    `🔑 *PASSWORD GENERATED*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `\`${pass}\`\n\n` +
    `Panjang: ${len} karakter`,
    Markup.inlineKeyboard([[Markup.button.callback('⬅️ Menu', 'menu')]])
  )
})

bot.command('cekpass', (ctx) => {
  const pass = ctx.message.text.split(' ').slice(1).join(' ')
  if (!pass) return ctx.reply('❌ Contoh: /cekpass rahasia123')

  let score = 0
  if (pass.length >= 8) score++
  if (pass.length >= 12) score++
  if (/[a-z]/.test(pass)) score++
  if (/[A-Z]/.test(pass)) score++
  if (/[0-9]/.test(pass)) score++
  if (/[^a-zA-Z0-9]/.test(pass)) score++

  const levels = ['❌ Sangat Lemah', '⚠️ Lemah', '🟡 Sedang', '🟢 Kuat', '💪 Sangat Kuat', '🔥 Luar Biasa']
  const level = levels[Math.min(score, 5)]

  ctx.replyWithMarkdown(
    `🔑 *PASSWORD STRENGTH*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `Kekuatan: *${level}*\n` +
    `Skor: ${score}/6\n` +
    `Panjang: ${pass.length} karakter`,
    Markup.inlineKeyboard([[Markup.button.callback('⬅️ Menu', 'menu')]])
  )
})

// ==================== 4. BASE64 ====================
bot.action('base64', (ctx) => {
  ctx.replyWithMarkdown(
    `🔢 *BASE64 TOOLS*\n\n` +
    `Encode: \`/b64e <teks>\`\n` +
    `Decode: \`/b64d <teks>\``,
    Markup.inlineKeyboard([[Markup.button.callback('⬅️ Kembali', 'menu')]])
  )
})

bot.command('b64e', (ctx) => {
  const text = ctx.message.text.split(' ').slice(1).join(' ')
  if (!text) return ctx.reply('❌ Contoh: /b64e halo')
  const encoded = Buffer.from(text).toString('base64')
  ctx.replyWithMarkdown(
    `🔢 *BASE64 ENCODE*\n\n` +
    `Input: \`${text}\`\n` +
    `Output: \`${encoded}\``,
    Markup.inlineKeyboard([[Markup.button.callback('⬅️ Menu', 'menu')]])
  )
})

bot.command('b64d', (ctx) => {
  const text = ctx.message.text.split(' ').slice(1).join(' ')
  if (!text) return ctx.reply('❌ Contoh: /b64d aGFsbw==')
  try {
    const decoded = Buffer.from(text, 'base64').toString('utf-8')
    ctx.replyWithMarkdown(
      `🔢 *BASE64 DECODE*\n\n` +
      `Input: \`${text}\`\n` +
      `Output: \`${decoded}\``,
      Markup.inlineKeyboard([[Markup.button.callback('⬅️ Menu', 'menu')]])
    )
  } catch (e) {
    ctx.reply('❌ Format Base64 tidak valid')
  }
})

// ==================== 5. QR GENERATOR ====================
bot.action('qr', (ctx) => {
  ctx.replyWithMarkdown(
    `🎨 *QR GENERATOR*\n\n` +
    `Ketik: \`/qr <teks/link>\``,
    Markup.inlineKeyboard([[Markup.button.callback('⬅️ Kembali', 'menu')]])
  )
})

bot.command('qr', async (ctx) => {
  const text = ctx.message.text.split(' ').slice(1).join(' ')
  if (!text) return ctx.reply('❌ Contoh: /qr https://google.com')

  try {
    const buffer = await QRCode.toBuffer(text, { width: 500, margin: 2 })
    await ctx.replyWithPhoto({ source: buffer }, {
      caption: `🎨 QR CODE\n\nIsi: ${text}`,
      ...Markup.inlineKeyboard([[Markup.button.callback('⬅️ Menu', 'menu')]])
    })
  } catch (e) {
    ctx.reply('❌ Gagal bikin QR: ' + e.message)
  }
})

// ==================== 6. BASE CONVERTER ====================
bot.action('baseconv', (ctx) => {
  ctx.replyWithMarkdown(
    `🔢 *BASE CONVERTER*\n\n` +
    `Ketik: \`/base <angka> <dari> <ke>\`\n\n` +
    `Basis: 2, 8, 10, 16\n\n` +
    `Contoh: \`/base 255 10 16\``,
    Markup.inlineKeyboard([[Markup.button.callback('⬅️ Kembali', 'menu')]])
  )
})

bot.command('base', (ctx) => {
  const args = ctx.message.text.split(' ').slice(1)
  if (args.length < 3) return ctx.reply(`❌ Format: /base <angka> <dari> <ke>`)

  const [numStr, fromStr, toStr] = args
  const from = parseInt(fromStr)
  const to = parseInt(toStr)

  if (![2, 8, 10, 16].includes(from) || ![2, 8, 10, 16].includes(to)) {
    return ctx.reply('❌ Basis harus 2, 8, 10, atau 16')
  }

  const decimal = parseInt(numStr, from)
  if (isNaN(decimal)) return ctx.reply(`❌ Angka "${numStr}" tidak valid untuk basis ${from}`)

  const result = decimal.toString(to).toUpperCase()

  ctx.replyWithMarkdown(
    '```\n' +
    `🔢 BASE CONVERTER\n` +
    `━━━━━━━━━━━━━━━━━━━━\n\n` +
    `Input: ${numStr} (basis ${from})\n` +
    `Output: ${result} (basis ${to})\n\n` +
    `Detail:\n` +
    `  • Binary:  ${decimal.toString(2)}\n` +
    `  • Octal:   ${decimal.toString(8)}\n` +
    `  • Decimal: ${decimal.toString(10)}\n` +
    `  • Hex:     ${decimal.toString(16).toUpperCase()}` +
    '\n```',
    Markup.inlineKeyboard([
      [Markup.button.callback('🔄 Convert Lagi', 'baseconv')],
      [Markup.button.callback('⬅️ Menu', 'menu')]
    ])
  )
})

// ==================== 7. IP INTELLIGENCE ====================
bot.action('ipinfo', (ctx) => {
  ctx.replyWithMarkdown(
    `🌐 *IP INTELLIGENCE*\n\n` +
    `Ketik: \`/ip <alamat-ip>\`\n` +
    `Contoh: \`/ip 8.8.8.8\``,
    Markup.inlineKeyboard([[Markup.button.callback('⬅️ Kembali', 'menu')]])
  )
})

function fetchIPInfo(ip) {
  return new Promise((resolve, reject) => {
    const url = `http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,regionName,city,zip,lat,lon,timezone,isp,org,as,asname,proxy,hosting,query`
    http.get(url, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try { resolve(JSON.parse(data)) }
        catch (e) { reject(e) }
      })
    }).on('error', reject)
  })
}

bot.command('ip', async (ctx) => {
  const ip = ctx.message.text.split(' ')[1]
  if (!ip) return ctx.reply('❌ Contoh: /ip 8.8.8.8')

  const loading = await ctx.reply('🔍 Sedang menganalisis IP...')

  try {
    const data = await fetchIPInfo(ip)

    if (data.status === 'fail') {
      return ctx.telegram.editMessageText(ctx.chat.id, loading.message_id, null,
        `❌ Gagal: ${data.message || 'IP tidak valid'}`)
    }

    const flag = data.countryCode ? String.fromCodePoint(...[...data.countryCode].map(c => 127397 + c.charCodeAt(0))) : '🌐'
    const proxyStatus = data.proxy ? '⚠️ Terdeteksi' : '✅ Bersih'
    const hostingStatus = data.hosting ? '🏢 Ya (Datacenter)' : '🏠 Tidak (Residential)'

    const msg =
      `🌐 IP INTELLIGENCE\n` +
      `━━━━━━━━━━━━━━━━━━━━\n\n` +
      `IP: ${data.query}\n\n` +
      `📍 LOKASI\n` +
      `• Negara: ${flag} ${data.country} (${data.countryCode})\n` +
      `• Region: ${data.regionName}\n` +
      `• Kota: ${data.city}\n` +
      `• Kode Pos: ${data.zip || '-'}\n` +
      `• Koordinat: ${data.lat}, ${data.lon}\n` +
      `• Timezone: ${data.timezone}\n\n` +
      `🏢 JARINGAN\n` +
      `• ISP: ${data.isp}\n` +
      `• Organisasi: ${data.org || '-'}\n` +
      `• ASN: ${data.as}\n` +
      `• Nama AS: ${data.asname || '-'}\n\n` +
      `🛡️ KEAMANAN\n` +
      `• Proxy/VPN: ${proxyStatus}\n` +
      `• Hosting: ${hostingStatus}`

    await ctx.telegram.editMessageText(ctx.chat.id, loading.message_id, null, msg, {
      ...Markup.inlineKeyboard([
        [Markup.button.callback('🔄 Cek IP Lain', 'ipinfo')],
        [Markup.button.callback('⬅️ Menu', 'menu')]
      ])
    })
  } catch (e) {
    await ctx.telegram.editMessageText(ctx.chat.id, loading.message_id, null,
      `❌ Error: ${e.message}`)
  }
})

// ==================== 8. SUBNET CALCULATOR ====================
bot.action('subnet', (ctx) => {
  ctx.replyWithMarkdown(
    `🧮 *SUBNET CALCULATOR*\n\n` +
    `Ketik: \`/subnet <ip/cidr>\`\n` +
    `Contoh: \`/subnet 192.168.1.0/24\``,
    Markup.inlineKeyboard([[Markup.button.callback('⬅️ Kembali', 'menu')]])
  )
})

function ipToInt(ip) {
  return ip.split('.').reduce((acc, oct) => (acc << 8) + parseInt(oct), 0) >>> 0
}

function intToIp(int) {
  return [
    (int >>> 24) & 255,
    (int >>> 16) & 255,
    (int >>> 8) & 255,
    int & 255
  ].join('.')
}

bot.command('subnet', (ctx) => {
  const input = ctx.message.text.split(' ')[1]
  if (!input) return ctx.reply('❌ Contoh: /subnet 192.168.1.0/24')

  const parts = input.split('/')
  if (parts.length !== 2) return ctx.reply('❌ Format harus <ip>/<cidr>')

  const [ipStr, cidrStr] = parts
  const cidr = parseInt(cidrStr)

  if (isNaN(cidr) || cidr < 0 || cidr > 32) return ctx.reply('❌ CIDR harus 0-32')
  if (!/^\d+\.\d+\.\d+\.\d+$/.test(ipStr)) return ctx.reply('❌ Format IP tidak valid')

  const ip = ipToInt(ipStr)
  const mask = cidr === 0 ? 0 : (0xFFFFFFFF << (32 - cidr)) >>> 0
  const network = (ip & mask) >>> 0
  const broadcast = (network | (~mask >>> 0)) >>> 0
  const firstHost = cidr < 31 ? network + 1 : network
  const lastHost = cidr < 31 ? broadcast - 1 : broadcast
  const totalHosts = cidr >= 31 ? 1 : Math.pow(2, 32 - cidr) - 2

  ctx.replyWithMarkdown(
    '```\n' +
    `🧮 SUBNET CALCULATOR\n` +
    `━━━━━━━━━━━━━━━━━━━━\n\n` +
    `Input: ${input}\n\n` +
    `Network:   ${intToIp(network)}\n` +
    `Broadcast: ${intToIp(broadcast)}\n` +
    `Netmask:   ${intToIp(mask)}\n` +
    `CIDR:      /${cidr}\n\n` +
    `First Host: ${intToIp(firstHost)}\n` +
    `Last Host:  ${intToIp(lastHost)}\n` +
    `Total Host: ${totalHosts}\n\n` +
    `Wildcard:  ${intToIp(~mask >>> 0)}` +
    '\n```',
    Markup.inlineKeyboard([
      [Markup.button.callback('🔄 Hitung Lagi', 'subnet')],
      [Markup.button.callback('⬅️ Menu', 'menu')]
    ])
  )
})

// ==================== 9. DNS LOOKUP ====================
bot.action('dns', (ctx) => {
  ctx.replyWithMarkdown(
    `🔍 *DNS LOOKUP*\n\n` +
    `Ketik: \`/dns <domain>\`\n` +
    `Contoh: \`/dns google.com\``,
    Markup.inlineKeyboard([[Markup.button.callback('⬅️ Kembali', 'menu')]])
  )
})

bot.command('dns', async (ctx) => {
  const domain = ctx.message.text.split(' ')[1]
  if (!domain) return ctx.reply('❌ Contoh: /dns google.com')

  const loading = await ctx.reply(`🔍 Sedang lookup DNS ${domain}...`)

  try {
    const results = {}
    try { results.A = await dns.resolve4(domain) } catch (e) { results.A = [] }
    try { results.AAAA = await dns.resolve6(domain) } catch (e) { results.AAAA = [] }
    try { results.MX = (await dns.resolveMx(domain)).map(m => `${m.priority} ${m.exchange}`) } catch (e) { results.MX = [] }
    try { results.NS = await dns.resolveNs(domain) } catch (e) { results.NS = [] }
    try { results.TXT = (await dns.resolveTxt(domain)).map(t => t.join('')) } catch (e) { results.TXT = [] }
    try { results.CNAME = await dns.resolveCname(domain) } catch (e) { results.CNAME = [] }

    const formatList = (arr, max = 5) => {
      if (!arr || arr.length === 0) return '  (tidak ada)'
      const shown = arr.slice(0, max).map(x => `  • ${x}`).join('\n')
      const more = arr.length > max ? `\n  ... dan ${arr.length - max} lainnya` : ''
      return shown + more
    }

    const msg =
      `🔍 DNS LOOKUP\n` +
      `━━━━━━━━━━━━━━━━━━━━\n\n` +
      `Domain: ${domain}\n\n` +
      `📍 A (IPv4):\n${formatList(results.A)}\n\n` +
      `📍 AAAA (IPv6):\n${formatList(results.AAAA)}\n\n` +
      `📧 MX (Mail):\n${formatList(results.MX)}\n\n` +
      `🌐 NS (Name Server):\n${formatList(results.NS)}\n\n` +
      `📝 TXT:\n${formatList(results.TXT, 3)}\n\n` +
      `🔗 CNAME:\n${formatList(results.CNAME)}`

    await ctx.telegram.editMessageText(ctx.chat.id, loading.message_id, null, msg, {
      ...Markup.inlineKeyboard([
        [Markup.button.callback('🔄 Lookup Lain', 'dns')],
        [Markup.button.callback('⬅️ Menu', 'menu')]
      ])
    })
  } catch (e) {
    await ctx.telegram.editMessageText(ctx.chat.id, loading.message_id, null,
      `❌ Error: ${e.message}`)
  }
})

// ==================== 10. EMAIL VALIDATOR ====================
bot.action('email', (ctx) => {
  ctx.replyWithMarkdown(
    `📧 *EMAIL VALIDATOR*\n\n` +
    `Ketik: \`/email <email>\`\n` +
    `Contoh: \`/email test@gmail.com\``,
    Markup.inlineKeyboard([[Markup.button.callback('⬅️ Kembali', 'menu')]])
  )
})

bot.command('email', async (ctx) => {
  const email = ctx.message.text.split(' ')[1]
  if (!email) return ctx.reply('❌ Contoh: /email test@gmail.com')

  const loading = await ctx.reply(`📧 Sedang validasi ${email}...`)

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!regex.test(email)) {
    return ctx.telegram.editMessageText(ctx.chat.id, loading.message_id, null,
      `❌ Format email tidak valid`)
  }

  const domain = email.split('@')[1]
  let mxRecords = []
  let mxStatus = '❌ Tidak ada MX record'
  let canReceive = false

  try {
    mxRecords = await dns.resolveMx(domain)
    if (mxRecords.length > 0) {
      mxStatus = '✅ Ada MX record'
      canReceive = true
    }
  } catch (e) {
    mxStatus = '❌ Domain tidak punya MX record'
  }

  const msg =
    `📧 EMAIL VALIDATOR\n` +
    `━━━━━━━━━━━━━━━━━━━━\n\n` +
    `Email: ${email}\n` +
    `Domain: ${domain}\n\n` +
    `✅ Format: Valid\n` +
    `${mxStatus}\n` +
    `📬 Bisa terima email: ${canReceive ? '✅ Ya' : '❌ Tidak'}\n\n` +
    (mxRecords.length > 0
      ? `MX Records:\n${mxRecords.map(m => `  • ${m.priority} ${m.exchange}`).join('\n')}`
      : '')

  await ctx.telegram.editMessageText(ctx.chat.id, loading.message_id, null, msg, {
    ...Markup.inlineKeyboard([
      [Markup.button.callback('🔄 Validasi Lain', 'email')],
      [Markup.button.callback('⬅️ Menu', 'menu')]
    ])
  })
})

// ==================== 11. URL PARSER ====================
bot.action('urlparser', (ctx) => {
  ctx.replyWithMarkdown(
    `🔗 *URL PARSER*\n\n` +
    `Ketik: \`/url <url>\`\n` +
    `Contoh: \`/url https://google.com/search?q=test\``,
    Markup.inlineKeyboard([[Markup.button.callback('⬅️ Kembali', 'menu')]])
  )
})

bot.command('url', (ctx) => {
  let input = ctx.message.text.split(' ').slice(1).join(' ')
  if (!input) return ctx.reply('❌ Contoh: /url https://google.com/search?q=test')

  if (!/^https?:\/\//i.test(input)) input = 'https://' + input

  try {
    const parsed = new URL(input)
    const queryParams = []
    parsed.searchParams.forEach((value, key) => {
      queryParams.push(`  • ${key} = ${value}`)
    })

    const msg =
      `🔗 URL PARSER\n` +
      `━━━━━━━━━━━━━━━━━━━━\n\n` +
      `Original: ${input}\n\n` +
      `🌐 PROTOCOL: ${parsed.protocol.replace(':', '')}\n\n` +
      `🏠 HOST\n` +
      `  • Hostname: ${parsed.hostname}\n` +
      `  • Port: ${parsed.port || '(default)'}\n\n` +
      `📁 PATH: ${parsed.pathname || '/'}\n\n` +
      `🔍 QUERY PARAMS\n` +
      (queryParams.length ? queryParams.join('\n') : '  (tidak ada)') +
      `\n\n#️⃣ HASH: ${parsed.hash || '(tidak ada)'}\n` +
      `👤 USER: ${parsed.username || '(tidak ada)'}`

    ctx.replyWithMarkdown('```\n' + msg + '\n```',
      Markup.inlineKeyboard([
        [Markup.button.callback('🔄 Parse URL Lain', 'urlparser')],
        [Markup.button.callback('⬅️ Menu', 'menu')]
      ]))
  } catch (e) {
    ctx.reply('❌ URL tidak valid: ' + e.message)
  }
})

// ==================== 12. HTTP HEADER CHECKER ====================
bot.action('headers', (ctx) => {
  ctx.replyWithMarkdown(
    `🛡️ *HTTP HEADER CHECKER*\n\n` +
    `Ketik: \`/headers <url>\`\n` +
    `Contoh: \`/headers https://google.com\``,
    Markup.inlineKeyboard([[Markup.button.callback('⬅️ Kembali', 'menu')]])
  )
})

bot.command('headers', (ctx) => {
  let url = ctx.message.text.split(' ').slice(1).join(' ')
  if (!url) return ctx.reply('❌ Contoh: /headers https://google.com')
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url

  ctx.reply('🛡️ Sedang cek headers...').then(async (loading) => {
    try {
      const parsed = new URL(url)
      const client = parsed.protocol === 'https:' ? https : http

      const options = {
        method: 'HEAD',
        hostname: parsed.hostname,
        port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
        path: parsed.pathname + parsed.search,
        timeout: 10000,
        headers: { 'User-Agent': 'Mozilla/5.0 (DhiwwBot/1.0)' }
      }

      const req = client.request(options, (res) => {
        const headers = res.headers
        const secHeaders = [
          { name: 'Strict-Transport-Security', val: headers['strict-transport-security'] },
          { name: 'X-Frame-Options', val: headers['x-frame-options'] },
          { name: 'X-Content-Type-Options', val: headers['x-content-type-options'] },
          { name: 'Content-Security-Policy', val: headers['content-security-policy'] },
          { name: 'X-XSS-Protection', val: headers['x-xss-protection'] },
          { name: 'Referrer-Policy', val: headers['referrer-policy'] },
          { name: 'Permissions-Policy', val: headers['permissions-policy'] }
        ]

        const found = secHeaders.filter(h => h.val)
        const missing = secHeaders.filter(h => !h.val)

        let msg = `🛡️ HTTP HEADER CHECKER\n`
        msg += `━━━━━━━━━━━━━━━━━━━━\n\n`
        msg += `URL: ${url}\n`
        msg += `Status: ${res.statusCode}\n`
        msg += `Server: ${headers.server || '-'}\n\n`
        msg += `✅ ADA (${found.length}/${secHeaders.length}):\n`
        msg += found.length ? found.map(h => `  • ${h.name}`).join('\n') : '  (tidak ada)'
        msg += `\n\n❌ TIDAK ADA (${missing.length}):\n`
        msg += missing.length ? missing.map(h => `  • ${h.name}`).join('\n') : '  (semua ada)'
        msg += `\n\nScore: ${found.length}/${secHeaders.length}`

        ctx.telegram.editMessageText(ctx.chat.id, loading.message_id, null, '```\n' + msg + '\n```', {
          ...Markup.inlineKeyboard([
            [Markup.button.callback('🔄 Cek URL Lain', 'headers')],
            [Markup.button.callback('⬅️ Menu', 'menu')]
          ])
        })
      })

      req.on('error', (e) => {
        ctx.telegram.editMessageText(ctx.chat.id, loading.message_id, null, `❌ Error: ${e.message}`)
      })

      req.on('timeout', () => {
        req.destroy()
        ctx.telegram.editMessageText(ctx.chat.id, loading.message_id, null, `❌ Timeout`)
      })

      req.end()
    } catch (e) {
      ctx.telegram.editMessageText(ctx.chat.id, loading.message_id, null, `❌ Error: ${e.message}`)
    }
  })
})

// ==================== 13. JWT DECODER ====================
bot.action('jwt', (ctx) => {
  ctx.replyWithMarkdown(
    `🎫 *JWT DECODER*\n\n` +
    `Ketik: \`/jwt <token>\`\n` +
    `Contoh: \`/jwt eyJhbGci...\``,
    Markup.inlineKeyboard([[Markup.button.callback('⬅️ Kembali', 'menu')]])
  )
})

bot.command('jwt', (ctx) => {
  const token = ctx.message.text.split(' ').slice(1).join(' ').trim()
  if (!token) return ctx.reply('❌ Contoh: /jwt eyJhbGci...')

  const parts = token.split('.')
  if (parts.length !== 3) return ctx.reply('❌ JWT harus punya 3 bagian dipisah titik')

  try {
    const header = JSON.parse(Buffer.from(parts[0], 'base64').toString())
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString())

    const formatDate = (d) => {
      if (!d) return '-'
      try { return new Date(d * 1000).toLocaleString('id-ID') }
      catch { return d }
    }

    const msg =
      `🎫 JWT DECODER\n` +
      `━━━━━━━━━━━━━━━━━━━━\n\n` +
      `📋 HEADER\n` +
      `${JSON.stringify(header, null, 2)}\n\n` +
      `📦 PAYLOAD\n` +
      `${JSON.stringify(payload, null, 2)}\n\n` +
      `📅 WAKTU\n` +
      `• Issued: ${formatDate(payload.iat)}\n` +
      `• Expires: ${formatDate(payload.exp)}\n\n` +
      `🔐 SIGNATURE\n` +
      `${parts[2].substring(0, 40)}...\n` +
      `(tidak diverifikasi)`

    ctx.replyWithMarkdown('```\n' + msg + '\n```',
      Markup.inlineKeyboard([
        [Markup.button.callback('🔄 Decode JWT Lain', 'jwt')],
        [Markup.button.callback('⬅️ Menu', 'menu')]
      ]))
  } catch (e) {
    ctx.reply('❌ JWT tidak valid: ' + e.message)
  }
})

// ==================== 14. COLOR CONVERTER ====================
bot.action('color', (ctx) => {
  ctx.replyWithMarkdown(
    `🎨 *COLOR CONVERTER*\n\n` +
    `Ketik: \`/color <hex-atau-rgb>\`\n` +
    `Contoh: \`/color #ff0000\`\n` +
    `Contoh: \`/color rgb(255,0,0)\``,
    Markup.inlineKeyboard([[Markup.button.callback('⬅️ Kembali', 'menu')]])
  )
})

bot.command('color', (ctx) => {
  const input = ctx.message.text.split(' ').slice(1).join(' ').trim()
  if (!input) return ctx.reply('❌ Contoh: /color #ff0000')

  let r, g, b

  const hexMatch = input.match(/^#?([a-f0-9]{6}|[a-f0-9]{3})$/i)
  if (hexMatch) {
    let hex = hexMatch[1]
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('')
    r = parseInt(hex.substring(0, 2), 16)
    g = parseInt(hex.substring(2, 4), 16)
    b = parseInt(hex.substring(4, 6), 16)
  } else {
    const rgbMatch = input.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i)
    if (rgbMatch) {
      r = parseInt(rgbMatch[1])
      g = parseInt(rgbMatch[2])
      b = parseInt(rgbMatch[3])
    } else {
      return ctx.reply('❌ Format tidak dikenali')
    }
  }

  if (r > 255 || g > 255 || b > 255 || r < 0 || g < 0 || b < 0) {
    return ctx.reply('❌ Nilai RGB harus 0-255')
  }

  const toHex = (n) => n.toString(16).padStart(2, '0')
  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()

  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  let h, s, l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case rn: h = (gn - bn) / d + (gn < bn ? 6 : 0); break
      case gn: h = (bn - rn) / d + 2; break
      case bn: h = (rn - gn) / d + 4; break
    }
    h /= 6
  }

  const hsl = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`

  ctx.replyWithMarkdown(
    '```\n' +
    `🎨 COLOR CONVERTER\n` +
    `━━━━━━━━━━━━━━━━━━━━\n\n` +
    `HEX: ${hex}\n` +
    `RGB: rgb(${r}, ${g}, ${b})\n` +
    `HSL: ${hsl}\n\n` +
    `Red:   ${r}\n` +
    `Green: ${g}\n` +
    `Blue:  ${b}` +
    '\n```',
    Markup.inlineKeyboard([
      [Markup.button.callback('🔄 Convert Lagi', 'color')],
      [Markup.button.callback('⬅️ Menu', 'menu')]
    ])
  )
})

// ==================== 15. EXIF VIEWER ====================
bot.action('exif', (ctx) => {
  ctx.replyWithMarkdown(
    `📸 *EXIF VIEWER*\n\n` +
    `Kirim gambar, bot bakal baca metadata EXIF-nya.`,
    Markup.inlineKeyboard([[Markup.button.callback('⬅️ Kembali', 'menu')]])
  )
})

// ==================== 16. PHONE NUMBER INFO ====================
bot.action('phone', (ctx) => {
  ctx.replyWithMarkdown(
    `📱 *PHONE NUMBER INFO*\n\n` +
    `Cek operator & wilayah dari nomor HP Indonesia.\n\n` +
    `Ketik: \`/phone <nomor>\`\n` +
    `Contoh: \`/phone 081234567890\`\n` +
    `Contoh: \`/phone 6281234567890\``,
    Markup.inlineKeyboard([[Markup.button.callback('⬅️ Kembali', 'menu')]])
  )
})

// Database prefix operator Indonesia
const operatorPrefixes = [
  // Telkomsel
  { prefix: ['0811', '0812', '0813', '0821', '0822', '0823', '0851', '0852', '0853'], operator: 'Telkomsel', type: 'Halo / Simpati / As' },
  // Indosat
  { prefix: ['0814', '0815', '0816', '0855', '0856', '0857', '0858'], operator: 'Indosat Ooredoo', type: 'Matrix / Mentari / IM3' },
  // XL Axiata
  { prefix: ['0817', '0818', '0819', '0859', '0877', '0878'], operator: 'XL Axiata', type: 'XL / Axis' },
  // Axis
  { prefix: ['0831', '0832', '0833', '0838'], operator: 'AXIS', type: 'Axis' },
  // Tri
  { prefix: ['0895', '0896', '0897', '0898', '0899'], operator: 'Tri (3)', type: '3 (Tri)' },
  // Smartfren
  { prefix: ['0881', '0882', '0883', '0884', '0885', '0886', '0887', '0888', '0889'], operator: 'Smartfren', type: 'Smartfren' },
  // Byru
  { prefix: ['0868'], operator: 'Byru', type: 'Byru' },
  // Sampoerna
  { prefix: ['0889'], operator: 'Smartfren', type: 'Smartfren' }
]

bot.command('phone', (ctx) => {
  let input = ctx.message.text.split(' ').slice(1).join('').trim()
  if (!input) return ctx.reply('❌ Contoh: /phone 081234567890')

  // Normalisasi
  input = input.replace(/[\s\-\(\)\+]/g, '')

  // Convert 62 ke 0
  if (input.startsWith('62')) {
    input = '0' + input.substring(2)
  }

  if (!/^08\d{8,11}$/.test(input)) {
    return ctx.reply('❌ Format nomor tidak valid.\n\nContoh: 081234567890')
  }

  const prefix = input.substring(0, 4)
  const matched = operatorPrefixes.find(op => op.prefix.includes(prefix))

  let operator = '❓ Tidak diketahui'
  let type = '-'

  if (matched) {
    operator = matched.operator
    type = matched.type
  }

  // Format internasional
  const intl = '+62' + input.substring(1)

  // Format cantik
  const formatted = input.replace(/(\d{4})(\d{4})(\d+)/, '$1-$2-$3')

  const msg =
    `📱 PHONE NUMBER INFO\n` +
    `━━━━━━━━━━━━━━━━━━━━\n\n` +
    `📞 Nomor: ${input}\n` +
    `🌐 Intl: ${intl}\n` +
    `✨ Format: ${formatted}\n\n` +
    `📡 OPERATOR\n` +
    `• ${operator}\n` +
    `• ${type}\n\n` +
    `🔢 Prefix: ${prefix}\n` +
    `📏 Panjang: ${input.length} digit\n` +
    `🇮🇩 Negara: Indonesia`

  ctx.replyWithMarkdown('```\n' + msg + '\n```',
    Markup.inlineKeyboard([
      [Markup.button.callback('🔄 Cek Nomor Lain', 'phone')],
      [Markup.button.callback('⬅️ Menu', 'menu')]
    ]))
})

// ==================== 17. USERNAME CHECKER ====================
bot.action('username', (ctx) => {
  ctx.replyWithMarkdown(
    `🕵️ *USERNAME CHECKER*\n\n` +
    `Cek username di GitHub, Instagram, TikTok, X, Reddit.\n\n` +
    `Ketik: \`/uname <username>\`\n` +
    `Contoh: \`/uname dhiwww\`\n\n` +
    `⏱️ Butuh waktu ~10 detik`,
    Markup.inlineKeyboard([[Markup.button.callback('⬅️ Kembali', 'menu')]])
  )
})

function checkUrl(url) {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(url)
      const client = parsed.protocol === 'https:' ? https : http

      const req = client.request({
        method: 'GET',
        hostname: parsed.hostname,
        path: parsed.pathname + parsed.search,
        timeout: 8000,
        headers: { 'User-Agent': 'Mozilla/5.0 (DhiwwBot/1.0)' }
      }, (res) => {
        resolve({ status: res.statusCode })
      })

      req.on('error', () => resolve({ status: 0 }))
      req.on('timeout', () => { req.destroy(); resolve({ status: 0 }) })
      req.end()
    } catch (e) {
      resolve({ status: 0 })
    }
  })
}

bot.command('uname', async (ctx) => {
  const username = ctx.message.text.split(' ')[1]
  if (!username) return ctx.reply('❌ Contoh: /uname dhiwww')

  const loading = await ctx.reply(`🕵️ Sedang cek "${username}"... (butuh ~10 detik)`)

  const platforms = [
    { name: 'GitHub', url: `https://github.com/${username}` },
    { name: 'Instagram', url: `https://www.instagram.com/${username}/` },
    { name: 'TikTok', url: `https://www.tiktok.com/@${username}` },
    { name: 'Twitter/X', url: `https://x.com/${username}` },
    { name: 'Reddit', url: `https://www.reddit.com/user/${username}` }
  ]

  const results = await Promise.all(platforms.map(async (p) => {
    const r = await checkUrl(p.url)
    return { name: p.name, status: r.status, taken: r.status === 200 }
  }))

  let msg = `🕵️ USERNAME CHECKER\n`
  msg += `━━━━━━━━━━━━━━━━━━━━\n\n`
  msg += `Username: ${username}\n\n`
  results.forEach(r => {
    msg += `${r.taken ? '✅ TERPAKAI' : '❌ KOSONG'} — ${r.name}\n`
  })

  await ctx.telegram.editMessageText(ctx.chat.id, loading.message_id, null, '```\n' + msg + '\n```', {
    ...Markup.inlineKeyboard([
      [Markup.button.callback('🔄 Cek Username Lain', 'username')],
      [Markup.button.callback('⬅️ Menu', 'menu')]
    ])
  })
})

// ==================== 18. SSH FINGERPRINT ====================
bot.action('ssh', (ctx) => {
  ctx.replyWithMarkdown(
    `🔑 *SSH FINGERPRINT*\n\n` +
    `Ketik: \`/ssh <public-key>\`\n` +
    `Contoh: \`/ssh ssh-rsa AAAAB3Nza...\``,
    Markup.inlineKeyboard([[Markup.button.callback('⬅️ Kembali', 'menu')]])
  )
})

bot.command('ssh', (ctx) => {
  const key = ctx.message.text.split(' ').slice(1).join(' ').trim()
  if (!key) return ctx.reply('❌ Contoh: /ssh ssh-rsa AAAAB3Nza...')

  try {
    const parts = key.split(/\s+/)
    const keyType = parts[0]
    const keyData = parts[1]

    if (!keyData) return ctx.reply('❌ Format SSH key tidak valid')

    const buffer = Buffer.from(keyData, 'base64')
    const md5 = crypto.createHash('md5').update(buffer).digest('hex').match(/.{2}/g).join(':')
    const sha256 = crypto.createHash('sha256').update(buffer).digest('base64').replace(/=+$/, '')

    ctx.replyWithMarkdown(
      '```\n' +
      `🔑 SSH FINGERPRINT\n` +
      `━━━━━━━━━━━━━━━━━━━━\n\n` +
      `Key Type: ${keyType}\n\n` +
      `MD5:\n${md5}\n\n` +
      `SHA256:\nSHA256:${sha256}\n\n` +
      `Bits: ${buffer.length * 8}` +
      '\n```',
      Markup.inlineKeyboard([
        [Markup.button.callback('🔄 Cek Key Lain', 'ssh')],
        [Markup.button.callback('⬅️ Menu', 'menu')]
      ])
    )
  } catch (e) {
    ctx.reply('❌ SSH key tidak valid: ' + e.message)
  }
})

// ==================== HANDLER GAMBAR (EXIF) ====================
bot.on('photo', async (ctx) => {
  try {
    const photo = ctx.message.photo[ctx.message.photo.length - 1]
    const fileLink = await ctx.telegram.getFileLink(photo.file_id)

    const loading = await ctx.reply('📸 Sedang baca EXIF...')

    https.get(fileLink.href, (res) => {
      const chunks = []
      res.on('data', chunk => chunks.push(chunk))
      res.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks)
          const exifParser = require('exif-parser')
          const parser = exifParser.create(buffer)
          const result = parser.parse()

          const tags = result.tags || {}
          const formatDate = (d) => {
            if (!d) return '-'
            try { return new Date(d * 1000).toLocaleString('id-ID') }
            catch { return d }
          }

          let msg = `📸 EXIF VIEWER\n`
          msg += `━━━━━━━━━━━━━━━━━━━━\n\n`

          if (Object.keys(tags).length === 0) {
            msg += `❌ Gambar ini gak punya metadata EXIF.\n`
          } else {
            if (tags.Make) msg += `📷 Kamera: ${tags.Make} ${tags.Model || ''}\n`
            if (tags.LensModel) msg += `🔭 Lensa: ${tags.LensModel}\n`
            if (tags.DateTimeOriginal) msg += `📅 Tanggal: ${formatDate(tags.DateTimeOriginal)}\n`
            if (tags.ExposureTime) msg += `⏱️ Exposure: ${tags.ExposureTime}s\n`
            if (tags.FNumber) msg += `🔆 Aperture: f/${tags.FNumber}\n`
            if (tags.ISO) msg += `📊 ISO: ${tags.ISO}\n`
            if (tags.FocalLength) msg += `🔍 Focal Length: ${tags.FocalLength}mm\n`
            if (tags.ImageWidth) msg += `📐 Ukuran: ${tags.ImageWidth}x${tags.ImageHeight}\n`
            if (tags.GPSLatitude && tags.GPSLongitude) {
              msg += `\n📍 GPS:\n`
              msg += `  • Latitude: ${tags.GPSLatitude}\n`
              msg += `  • Longitude: ${tags.GPSLongitude}\n`
              msg += `  • Maps: https://maps.google.com/?q=${tags.GPSLatitude},${tags.GPSLongitude}\n`
            }
          }

          await ctx.telegram.editMessageText(ctx.chat.id, loading.message_id, null,
            '```\n' + msg + '\n```', {
              ...Markup.inlineKeyboard([
                [Markup.button.callback('⬅️ Menu', 'menu')]
              ])
            })
        } catch (e) {
          await ctx.telegram.editMessageText(ctx.chat.id, loading.message_id, null,
            `❌ Gagal baca EXIF: ${e.message}`)
        }
      })
    }).on('error', async (e) => {
      await ctx.telegram.editMessageText(ctx.chat.id, loading.message_id, null,
        `❌ Gagal download gambar: ${e.message}`)
    })
  } catch (e) {
    ctx.reply('❌ Error: ' + e.message)
  }
})

// ==================== OWNER COMMANDS ====================
bot.command('stats', (ctx) => {
  if (!isOwner(ctx)) return ctx.reply('❌ Lo bukan owner!')
  ctx.replyWithMarkdown(
    `📊 *BOT STATS*\n\n` +
    `• Uptime: ${Math.floor(process.uptime() / 60)} menit\n` +
    `• Memory: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB\n` +
    `• Node: ${process.version}`
  )
})

// ==================== LAUNCH ====================
bot.launch()
console.log('🤖 Dhiww Cyber Toolkit Bot jalan...')
console.log('📦 Total tools: 18')

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
