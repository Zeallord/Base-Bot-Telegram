/*
===========================================
📖 PANDUAN handler.js — COMMAND HANDLER BOT
===========================================

| Fungsi                     | Kegunaan                                   |
| -------------------------- | ------------------------------------------ |
| `ctx.reply()`              | Kirim pesan teks                           |
| `ctx.replyWithPhoto()`     | Kirim gambar/foto                          |
| `ctx.replyWithVideo()`     | Kirim video                                |
| `ctx.replyWithDocument()`  | Kirim dokumen/file                         |
| `ctx.answerCbQuery()`      | Untuk membuat bot tau kalau tombol telah di klik
| `ctx.deleteMessage()`      | Hapus pesan button sebelumnya              |
| `ctx.editMessageText()`    | Edit isi pesan tombol sebelumnya jadi baru |
| `Markup.inlineKeyboard()`  | Membuat tombol inline                      |
| `Markup.button.callback()` | Membuat tombol dengan callback_data        |
| `Markup.button.url()`      | Membuat tombol yang berisi link URL        |

⚠️ Penting!
File ini **khusus digunakan untuk:**
- Menangani perintah berbasis teks → `/start`, `/menu`, `/topup`, dll.
- Menampilkan tombol Inline Keyboard → **callback-nya diproses di `callback.js`**
- Jangan memproses `callback_query` di sini → **wajib di file `callback.js`**

❗ Catatan:
- Untuk navigasi tombol kompleks → gunakan kombinasi `ctx.deleteMessage()`, `ctx.editMessageText()` → semua dilakukan di `callback.js`.
- Tombol URL boleh langsung ditangani di sini **jika tidak butuh callback**.

✅ Tips Praktis:
- Gunakan `ctx.replyWithMarkdown()` untuk teks dengan format tebal/italic.
- Gunakan tombol URL untuk link keluar (mis. website, Telegram group).
- Untuk tombol yang membutuhkan kombinasi callback bisa disesuaikan di callback.js disini hanya command utamanya seperti penggunaan /start, /menu, dll.
jangan terkecoh di handler js, contoh kamu membutuhkan tes1 untuk button ketika start, tapi tes1 itu sendiri harus dipanggil menggunakan /tes1, jadi tipsnya
kamu buat callbacknya mirip seperti di handler, apakah terpanggil tentu saja terpanggil

===========================================
            Rumus Callback dan handler
                                callback
                                    \/
[Markup.button.callback('📶 Ping', 'ping')]
                            /\
                        handler
===========================================
*/

const { Markup } = require('telegraf');
const stateManager = require('../lib/stateManager');
const checkRole = require('../lib/checkRole')
module.exports = (bot) => {

    // 🏁 START atau MENU (BASIC)
    bot.command(['start', 'menu'], async (ctx) => {
        try {
            await ctx.replyWithMarkdown(`👋 Halo *${ctx.from.first_name || 'Pengguna'}*!
Selamat datang di *ZL Store Bot*.

Silakan pilih menu berikut:`, 
            Markup.inlineKeyboard([
                [Markup.button.callback('📶 Ping', 'ping')],
                [Markup.button.callback('📦 Tes 1 (1 per baris)', 'tes1')],
                [Markup.button.callback('📦 Tes 2 (2 per baris)', 'tes2')],
            ]));
        } catch (err) {
            console.error(err);
        }
    });

    bot.command('version', async (ctx) => {
       await ctx.reply('This Bot Version 1.0.0')
    })

    bot.command('cekid', async (ctx) => {
        try {
            const user = ctx.from;
            const username = user.username ? `@${user.username}` : '-';
            const language = user.language_code || '-';

        await ctx.reply(`Informasi Akun Telegram Anda
• ID: ${user.id}
• Nama: ${user.first_name || '-'} ${user.last_name || ''}
• Username: ${username}
• Bahasa: ${language}
            `);
        } catch (err) {
            console.error(err);
        }
    });

    // Contoh pembuatan button di keyboard
    /* 🎮 Mode Game */
    bot.command('game', async (ctx) => {
        /* Simpan state user: step = game_mode */
        stateManager.setState(ctx.from.id, { step: 'game_mode' });

        /* Tampilkan pilihan game dalam keyboard */
        await ctx.reply('🎮 Pilih Game:', Markup.keyboard([
            ['1', '2', '3'],
            ['4', '5'],
            ['🔙 Kembali']
        ]).resize());
    });

    /* 📱 Mode Pulsa */
    bot.command('pulsa', async (ctx) => {
        /* Simpan state user: step = pulsa_mode */
        stateManager.setState(ctx.from.id, { step: 'pulsa_mode' });

        /* Tampilkan pilihan operator */
        await ctx.reply('📱 Pilih Operator:', Markup.keyboard([
            ['1', '2', '3'],
            ['🔙 Kembali']
        ]).resize());
    });

    /* 🔙 Tombol Kembali ke menu utama */
    bot.hears('🔙 Kembali', async (ctx) => {
        /* Hapus state user (kembali ke awal) */
        stateManager.deleteState(ctx.from.id);

        /* Tampilkan pesan + hapus keyboard */
        await ctx.reply('Kembali ke menu utama.', Markup.removeKeyboard());
    });

    /* Tangani tombol angka 1–5 */
    bot.hears(['1','2','3','4','5'], async (ctx) => {
        /* Ambil state user saat ini */
        const state = stateManager.getState(ctx.from.id);
        const input = ctx.message.text;

        /* Jika user belum dalam mode (state kosong), suruh ketik /game atau /pulsa */
        if (!state) {
            return ctx.reply('Silakan ketik /game atau /pulsa dulu.');
        }

        /* Jika user sedang dalam mode game */
        if (state.step === 'game_mode') {
            const games = {
                '1': 'Free Fire',
                '2': 'Mobile Legends',
                '3': 'PUBG',
                '4': 'Valorant',
                '5': 'CODM'
            };

            /* Kirim respon sesuai game yg dipilih */
            await ctx.reply(`🎮 Kamu pilih game: ${games[input] || 'Tidak dikenali'}`);
        }

        /* Jika user sedang dalam mode pulsa */
        if (state.step === 'pulsa_mode') {
            const operators = {
                '1': 'Telkomsel',
                '2': 'XL',
                '3': 'Indosat'
            };

            /* Kirim respon sesuai operator yg dipilih */
            await ctx.reply(`📱 Kamu pilih operator: ${operators[input] || 'Tidak dikenali'}`);
        }

        /* Setelah user pilih → hapus state supaya tidak nyangkut */
        stateManager.deleteState(ctx.from.id);
    });

    // 📦 Contoh: Tombol 1 per baris (ke bawah)
    bot.command('tes1', async (ctx) => {
        try {
            await ctx.reply('Pilih Menu:', Markup.inlineKeyboard([
                [Markup.button.callback('Kotak 1', 'kotak1')],
                [Markup.button.callback('Kotak 2', 'kotak2')],
                [Markup.button.callback('Kotak 3', 'kotak3')],
                [Markup.button.callback('Kotak 4', 'kotak4')]
            ]));
        } catch (err) {
            console.error(err);
        }
    });

    // 📦 Contoh: Tombol 2 per baris (kanan-kiri)
    bot.command('tes2', async (ctx) => {
        try {
            await ctx.reply('Pilih Menu:', Markup.inlineKeyboard([
                [Markup.button.callback('Kotak 1', 'kotak1'), Markup.button.callback('Kotak 2', 'kotak2')],
                [Markup.button.callback('Kotak 3', 'kotak3'), Markup.button.callback('Kotak 4', 'kotak4')]
            ]));
        } catch (err) {
            console.error(err);
        }
    });

    // Contoh Tombol Di Keyboard
    bot.command('tes3', async (ctx) => {
        try {
            await ctx.reply('Pilih Menu:', Markup.keyboard([
            ['📦 List Produk', '⚡ Isi saldo'],
            ['1', '2', '3', '4', '5', '6'],
            ['7', '8', '9', '10', '11', '12'],
            ['13'],
            ['📦 Stok Produk']
        ]).resize());
        } catch (err) {
            console.error(err);
        }
    });

    // Contoh Tombol URL
    bot.command('link', async (ctx) => {
        try {
            await ctx.reply('🔗 Berikut link penting:', Markup.inlineKeyboard([
                [Markup.button.url('🌐 Website ZL Store', 'https://zlstore.com')],
                [Markup.button.url('💬 Join Grup Telegram', 'https://t.me/zlstorecommunity')]
            ]));
        } catch (err) {
            console.error(err);
        }
    });

    // Contoh Tombol URL + Callback
    bot.command('about', async (ctx) => {
    try {
        await ctx.reply('ℹ️ Tentang Kami:', Markup.inlineKeyboard([
            [Markup.button.url('🌐 Website Resmi', 'https://zlstore.com')],
            [Markup.button.callback('📞 Hubungi Admin', 'hubungi_admin')]
        ]));
    } catch (err) {
        console.error(err);
    }
    });

    /*
    ⚠️ Penting: `hubungi_admin` harus diproses di callback.js:
    case 'hubungi_admin':
        await ctx.answerCbQuery();
        await ctx.reply(`👨‍💻 Hubungi Admin: @username_admin`);
        break;
    */

    bot.command('tesowner', async (ctx) => {
    if (!(await checkRole.isOwner(ctx))) {
        return ctx.reply('❌ Command ini hanya untuk OWNER bot.');
    }

    await ctx.reply('✅ Kamu adalah OWNER bot.');
    });

    bot.command('tesadmin', async (ctx) => {
    if (!(await checkRole.isAdmin(ctx))) {
        return ctx.reply('❌ Command ini hanya untuk ADMIN bot.');
    }

    await ctx.reply('✅ Kamu adalah ADMIN bot.');
    });

};
