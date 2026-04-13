require('./config/setting');

const { Telegraf } = require('telegraf');
const https = require('https');
const chalk = require('chalk');
const spinnies = require('spinnies');
const moment = require('moment-timezone');
const os = require('os');
const pkg = require("./package.json");
const spinner = new spinnies();
spinner.add('start', { text: 'Memulai ZL Store Bot...' });

const ipv4Agent = new https.Agent({ family: 4 });
const bot = new Telegraf(TELE_BOT_TOKEN, { telegram: { agent: ipv4Agent } });

// Info Startup + Log
bot.telegram.getMe().then((getme) => {
    console.clear();

    const garis = chalk.gray('═════════════════════════════════════════════════');

    console.log(garis);
    console.log(`${chalk.cyan.bold('📦 ZL STORE BOT STARTED')}`);
    console.log(garis);
    console.log(`${chalk.green('🤖 Bot Name  :')} ${chalk.white(getme.first_name)}`);
    console.log(`${chalk.green('👑 Owner     :')} ${chalk.white(OWNER_BOT || '-')}`);
    console.log(`${chalk.green('📌 Version   :')} ${chalk.white(pkg.version)}`);
    console.log(`${chalk.green('💻 Host      :')} ${chalk.white(os.hostname())}`);
    console.log(`${chalk.green('🖥 Platform  :')} ${chalk.white(os.platform())}`);
    console.log(`${chalk.green('🗓 Started   :')} ${chalk.white(moment().format('YYYY-MM-DD HH:mm:ss'))}`);
    console.log(`${chalk.green('🔑 Token     :')} ${chalk.white(TELE_BOT_TOKEN ? '✅ Available' : '❌ Missing')}`);
    console.log(garis);
    console.log(chalk.cyan('📂 Menunggu pesan masuk...\n'));

    spinner.succeed('start', { text: 'ZL Store Bot aktif' });
});

// Middleware Global (misalnya logging semua chat)
bot.use((ctx, next) => {
    const waktu = moment().tz('Asia/Jakarta').format('HH:mm:ss');
    const nama = ctx.from?.first_name || 'NoName';
    const user = ctx.from?.username ? `@${ctx.from.username}` : `(${ctx.from.id})`;
    const pesan = ctx.message?.text || ctx.callbackQuery?.data || ctx.updateType;

    console.log(`[${waktu}] ${user} : ${pesan}`);
    
    return next();
});

// Command handler modular
const commandHandler = require('./commands/handler');
commandHandler(bot);

// Callback handler modular
const callbackHandler = require('./commands/callback');
callbackHandler(bot);

// Start polling
bot.launch({
    dropPendingUpdates: true
}).then(() => {
    console.log(chalk.green('✅ BOT TELEGRAM BERHASIL AKTIF'));
}).catch(err => {
    console.error(chalk.red('❗ ERROR START BOT:'), err);
});
