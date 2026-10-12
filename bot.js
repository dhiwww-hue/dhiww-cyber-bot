require('dotenv').config()
const { Telegraf, Markup } = require('telegraf')
const crypto = require('crypto')
const QRCode = require('qrcode')
const http = require('http')
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
        { text: '🔑 Password Tools', callback_data: 'password' }
      ],
      [
        { text: '🔢 Base64', callback_data: 'base64' },
        { text: '🎨 QR Generator', callback_data: 'qr' }
      ],
      [
        { text: '🌐 IP Intelligence', callback_data: 'ipinfo' },
        { text: '🔍 DNS Lookup', callback_data: 'dns' }
      ],
      [
        { text: '🔗 URL Parser', callback_data: 'urlparser' }
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
    `Bot ini berisi tools cyber yang berguna buat\n` +
    `belajar, riset, dan kerjaan sehari-hari.\n\n` +
    `Pilih tool di bawah:`,
    mainMenu
  )
})

// ==================== MENU ====================
bot.command('menu', (ctx) => {
  ctx.replyWithMarkdown('🔐 *DHIWW CYBER TOOLKIT*\n\nPilih tool:', mainMenu)
})

// ==================== CALLBACK QUERY HANDLER ====================
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
    `*🔐 Hash Generator*\n` +
    `Format: \`/hash <teks>\`\n\n` +
    `*🔑 Password Generator*\n` +
    `Format: \`/pass <panjang>\`\n\n` +
    `*🔑 Cek Password*\n` +
    `Format: \`/cekpass <password>\`\n\n` +
    `*🔢 Base64*\n` +
    `Encode: \`/b64e <teks>\`\n` +
    `Decode: \`/b64d <teks>\`\n\n` +
    `*🎨 QR Generator*\n` +
    `Format: \`/qr <teks/link>\`\n\n` +
    `*🌐 IP Intelligence*\n` +
    `Format: \`/ip <alamat-ip>\`\n\n` +
    `*🔍 DNS Lookup*\n` +
    `Format: \`/dns <domain>\`\n\n` +
    `*🔗 URL Parser*\n` +
    `Format: \`/url <url>\`\n` +
    `Contoh: \`/url https://google.com/search?q=test\``,
    Markup.inlineKeyboard([[Markup.button.callback('⬅️ Kembali', 'menu')]])
  )
})

bot.action('menu', (ctx) => {
  ctx.editMessageText('🔐 *DHIWW CYBER TOOLKIT*\n\nPilih tool:', {
    parse_mode: 'Markdown',
    ...mainMenu.reply_markup
  })
})

// ==================== HASH GENERATOR ====================
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

// ==================== PASSWORD TOOLS ====================
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

// ==================== BASE64 ====================
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

// ==================== QR GENERATOR ====================
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

// ==================== IP INTELLIGENCE ====================
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

// ==================== DNS LOOKUP ====================
bot.action('dns', (ctx) => {
  ctx.replyWithMarkdown(
    `🔍 *DNS LOOKUP*\n\n` +
    `Cek semua record DNS dari domain:\n` +
    `• A (IPv4)\n` +
    `• AAAA (IPv6)\n` +
    `• MX (Mail Server)\n` +
    `• NS (Name Server)\n` +
    `• TXT (Text Record)\n` +
    `• CNAME (Alias)\n\n` +
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

// ==================== URL PARSER ====================
bot.action('urlparser', (ctx) => {
  ctx.replyWithMarkdown(
    `🔗 *URL PARSER*\n\n` +
    `Pecah URL jadi komponen-komponennya:\n` +
    `• Protocol (http/https)\n` +
    `• Hostname & Port\n` +
    `• Path\n` +
    `• Query params\n` +
    `• Hash/Fragment\n\n` +
    `Ketik: \`/url <url>\`\n` +
    `Contoh: \`/url https://google.com/search?q=test&lang=id\``,
    Markup.inlineKeyboard([[Markup.button.callback('⬅️ Kembali', 'menu')]])
  )
})

bot.command('url', (ctx) => {
  let input = ctx.message.text.split(' ').slice(1).join(' ')
  if (!input) return ctx.reply('❌ Contoh: /url https://google.com/search?q=test')

  // Auto-tambahin https:// kalau gak ada protocol
  if (!/^https?:\/\//i.test(input)) {
    input = 'https://' + input
  }

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
      `🌐 PROTOCOL\n` +
      `  • ${parsed.protocol.replace(':', '')}\n\n` +
      `🏠 HOST\n` +
      `  • Hostname: ${parsed.hostname}\n` +
      `  • Port: ${parsed.port || '(default)'}\n` +
      `  • Host: ${parsed.host}\n\n` +
      `📁 PATH\n` +
      `  • ${parsed.pathname || '/'}\n\n` +
      `🔍 QUERY PARAMS\n` +
      (queryParams.length ? queryParams.join('\n') : '  (tidak ada)') +
      `\n\n` +
      `#️⃣ HASH/FRAGMENT\n` +
      `  • ${parsed.hash || '(tidak ada)'}\n\n` +
      `👤 AUTH\n` +
      `  • Username: ${parsed.username || '(tidak ada)'}\n` +
      `  • Password: ${parsed.password ? '****' : '(tidak ada)'}`

    ctx.replyWithMarkdown(
      '```\n' + msg + '\n```',
      Markup.inlineKeyboard([
        [Markup.button.callback('🔄 Parse URL Lain', 'urlparser')],
        [Markup.button.callback('⬅️ Menu', 'menu')]
      ])
    )
  } catch (e) {
    ctx.reply('❌ URL tidak valid: ' + e.message)
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

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
