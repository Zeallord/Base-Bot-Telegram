/*
===========================================
| Fungsi                     | Kegunaan                                             |
| -------------------------- | ------------------------------------------           |
| `ctx.reply()`              | Kirim pesan teks                                     |
| `ctx.replyWithPhoto()`     | Kirim gambar/foto                                    |

| `ctx.replyWithVideo()`     | Kirim video                                          |
| `ctx.answerCbQuery()`      | Mengirim Informasi ke bot bahwa pesan diterima       |
| `ctx.deleteMessage()`      | Hapus pesan button sebelumnya                        |
| `ctx.editMessageText()`    | Edit isi pesan tombol sebelumnya jadi baru           |
| `Markup.inlineKeyboard()`  | Membuat tombol inline                                |
| `Markup.button.callback()` | Membuat tombol dengan callback_data                  |
| `Markup.button.url()`      | Membuat tombol yang berisi link URL                  |
===========================================

⚠️ Penting!
File ini **khusus** digunakan untuk:
- Menangani aksi dari **Inline Button (callback_query)**.
- Mengelola alur API, media, edit pesan, hapus pesan, dsb.
- Gunakan selalu "await ctx.answerCbQuery();" Jika pesan yang diproses memerlukan waktu dari yang ditentukan oleh developer pack telegraf, supaya tida timeout. Rekomendasi selalu pakai sih supaya tidak kena timeout dari bot.
contoh:
case 'blala': {
await ctx.answerCbQuery(); <== gunakan paling awal supaya bot menandai pesan bisa dialnjutkan tanpa timeout
}
- ❗ **Bukan untuk command biasa (/start, /menu, dll → gunakan di `handler.js`)**

break;

❗ Catatan:
- Semua data 'callback_data' dari tombol → diproses di sini.
- Untuk alur multi-step & pengiriman media → gunakan `try...catch` untuk keamanan.
- Untuk navigasi → kombinasikan `ctx.deleteMessage()`, `ctx.editMessageText()` sesuai kebutuhan.
- Dalam callback ini tidak dapat dipanggil dari ketikan biasa tapi dari respon handler yang kita tentukan dari belakang itu

===========================================
            Rumus Callback dan Handler
                                callback
                                    \/
[Markup.button.callback('📶 Ping', 'ping')]
                            /\
                        handler
===========================================
*/
const { Markup } = require('telegraf');

module.exports = (bot) => {
    bot.on('callback_query', async (ctx) => {
        const data = ctx.callbackQuery.data;

        try {
            switch (data) {   
                case 'ping':
                    await ctx.answerCbQuery('✅ Pong!');
                break;

                // Contoh dari case yang tidak sempat kepanggil karena kita butuh button bukan pola panggil '/' (mengikuti tes1 dan tes2)
                case 'tes1':
                    await ctx.deleteMessage();
                    await ctx.telegram.sendMessage(ctx.chat.id, `📦 Pilih Kotak (1 per baris):`, Markup.inlineKeyboard([
                        [Markup.button.callback('Kotak 1', 'kotak1')],
                        [Markup.button.callback('Kotak 2', 'kotak2')],
                        [Markup.button.callback('Kotak 3', 'kotak3')],
                        [Markup.button.callback('Kotak 4', 'kotak4')]
                    ]));
                break;

                case 'tes2':
                    await ctx.deleteMessage();
                    await ctx.telegram.sendMessage(ctx.chat.id, `📦 Pilih Kotak (2 per baris):`, Markup.inlineKeyboard([
                        [Markup.button.callback('Kotak 1', 'kotak1'), Markup.button.callback('Kotak 2', 'kotak2')],
                        [Markup.button.callback('Kotak 3', 'kotak3'), Markup.button.callback('Kotak 4', 'kotak4')]
                    ]));
                break;

                case 'kotak1':
                    await ctx.reply('Ini respon Kotak 1');
                break;

                case 'kotak2':
                    await ctx.reply('Ini respon Kotak 2');
                break;

                case 'kotak3':
                    await ctx.reply('Ini respon Kotak 3');
                break;

                case 'kotak4':
                    await ctx.reply('Ini respon Kotak 4');
                break;

                // Contoh Pengiriman Dengan Gambar
                case 'image':
                    await ctx.replyWithPhoto('https://example.com/alpahum.jpg', { caption: 'xxxxxxxxxx' })
                    // ATAU KALAU MENGGUNAKAN PENYIMPANAN LOKAL
                    // await ctx.replyWithPhoto({ source: 'path/to/alpahum.jpg' }, { caption: 'xxxxxxxxxx' })
                break;

                case 'video':
                    await ctx.replyWithVideo('https://example.com/alpahum.mp4', { caption: 'xxxxxxxxxx' })
                    // ATAU KALAU MENGGUNAKAN PENYIMPANAN LOKAL
                    // await ctx.replyWithVideo({ source: 'path/to/alpahum.mp4' }, { caption: 'xxxxxxxxxx' })
                break;

                default:
                    await ctx.answerCbQuery('❗ Menu tidak dikenali.', { show_alert: true });
            }
        } catch (err) {
            console.error(err);
        }
    });
};
