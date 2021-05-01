function help(cts) {
    return `\n\n
╔════════════════════════
║╭───────────────────
║│~ _*RENGE MENU*_ 
║╰───────────────────
╠════════════════════════
║╭──❉ *STICKER MAKER* ❉──
║│1. *#sticker*
║│2. *#stickergif*
║│3. *#stickertoimg*
║│4. *#nobg*
║╰───────────
╠════════════════════════
║╭──❉ *Menu* ❉──
║│1. *#groupmenu* 
║│2. *#animemenu*
║│3. *#kerangmenu*
║│4. *#othermenu*
║│5. *#adminmenu*
║│6. *#ownermenu*
║│7. *#nsfwmenu*
║│8. *#makermenu*
║│9. *#downloadmenu*
║╰───────────
║╭──❉ *RUNTIME* ❉──
║│${cts}
║╰───────────
╚════════════════════════
`
}
exports.help = help
function makercmd() {
    return `
╔══════════════════
║╭──❉ *MAKER MENU* ❉──
║│1. *#hartatahta*
║│2. *#snow*
║│3. *#wood*
║│4. *#hologram*
║│5. *#minion*
║│6. *#neon*
║│7. *#luxury*
║│8. *#noel*
║│9. *#box*
║│10. *#firework*
║│11. *#ninja*
║│12. *#wolf*
║│13. *#phlogo*
║│14. *#thunder*
║│15. *#blood*
║│16. *#summer*
║│17. *#naruto*
║╰───────────
╚══════════════════
`
}
exports.makercmd = makercmd()
function ownercmd() {
    return `
╔══✪〘 OWNER 〙✪══
║
╠➥ *#block 62858xxxxx*
╠➥ *#unblock 62858xxxxx*
╠➥ *#addadmin @tagmember*
╠➥ *#deladmin @tagmember*
╠➥ *#restart*
╠➥ *#ekickall*
╠➥ *#banchat*
╠➥ *#unbanchat*
╠➥ *#setstatus*
╠➥ *#setname*
║
╚═〘 RENGE BOT 〙`
}
exports.ownercmd = ownercmd()
function admincmd() {
    return `
╔══✪〘 ADMIN 〙✪══
║
╠➥ *#mute*
╠➥ *#unmute*
╠➥ *#ban @tagmember*
╠➥ *#unban @tagmember*
╠➥ *#kickall*
╠➥ *#oleave*
╠➥ *#opromote*
╠➥ *#odemote*
╠➥ *#odelete*
╠➥ *#oadd 62813xxxxx*
╠➥ *#okickall*
╠➥ *#otagall*
║
╚═〘 RENGE BOT 〙`
}
exports.admincmd = admincmd()
function nsfwcmd() {
    return `
╔════════════════════════
║╭──❉ *INFO* ❉──
║│[✘] > Sedang Maintenance
║╰───────────
╠════════════════════════
║╭──❉ *NSFW MENU* ❉──
║│1. *#nhentai [kode]* [✘]
║│2. *#nhder [kode]* 
║│3. *#xnxx [linkXnxx]* [✘]
║│4. *#randomtrapnime*
║│5. *#randomnsfwneko*
║│6. *#randomhentai*
║│7. *#hentaiass*
║╰───────────
╚════════════════════════`
}
exports.nsfwcmd = nsfwcmd()
function kerangcmd() {
    return `
╔════════════════════════
║╭──❉ *KERANG MENU* ❉──
║│1. *#apakah [optional]*
║│2. *#bisakah [optional]*
║│3. *#rate [optional]*
║│4. *#kapankah [optional]*
║╰───────────
╚════════════════════════`
}
exports.kerangcmd = kerangcmd()
function mediacmd() {
    return `
╔════════════════════════
║╭──❉ *MEDIA MENU* ❉──
║│1. *#ramalpasangan [kamu|pasangan]*
║│2. *#covid [negara]*
║│3. *#nulis [teks]*
║│4. *#quotenime*
║│5. *#cuaca [tempat]* 
║│6. *#tts [kode bhs] [teks]*
║│9. *#kbbi [query]*
║│10. *#wiki [query]*
║│11. *#pinterest [query]*
║│12. *#translate [bahasa] [teks]*
║│14. *#qrcode [optional]*
║│15. *#maps [optional]*
║│16. *#shorturl* [link]
║│17. *#quote*
║╰───────────
╚════════════════════════`
}
exports.mediacmd = mediacmd()
function animecmd() {
    return `
╔════════════════════════
║╭──❉ *ANIME MENU* ❉──
║│1. *#loli*
║│2. *#shota*
║│3. *#waifu* 
║│4. *#husbu*
║│5. *#wait*
║│6. *#koin*
║│7. *#malanime [optional]*
║│8. *#malcharacter [optional]*
║│9. *#randomkiss*
║│10. *#milf*
║│11. *#yuri*
║│12. *#yaoi*
║│13. *#lewd*
║│14. *#hentaiass*
║╰───────────
╚════════════════════════`
}
exports.animecmd = animecmd()
function othercmd() {
    return `
╔════════════════════════
║╭──❉ *OTHER MENU* ❉──
║│1. *#bahasa*
║│2. *#ttp*
║│3. *#inu*
║│4. *#neko*
║│5. *#tts [JP/ID/EN] [Teks]*
║│6. *#inu*
║│7. *#ptl*
║│8. *#dadu*
║│9. *#koin*
║│10. *#math*
║│11. *#meme*
║│12. *#darkjoke*
║│13. *#ahego*
║│14. *#build* (GENSHIN IMPACT)
║╰───────────
╚════════════════════════`
}
exports.othercmd = othercmd()
function downloadcmd() {
    return `
╔════════════════════════
║╭──❉ *DOWNLOADER MENU* ❉──
║│1. *#igdl*
║│2. *#play*
║│4. *#ytmp4*
║╰───────────
╚════════════════════════
`
}
exports.downloadcmd = downloadcmd()
function groupcmd() {
    return `
╔════════════════════════
║╭──❉ *GROUP MENU* ❉──
║│1. *#groupinfo*
║│2. *#add 62858xxxxx*
║│3. *#kick @tagmember*
║│4. *#promote @tagmember*
║│5. *#demote @tagadmin*
║│6. *#tagall*
║│7. *#adminList*
║│8. *#ownerGroup*
║│9. *#leave*
║│10. *#delete [replyChatBot]*
║│11. *#kickAll*
║│12. *#group [open|close]*
║│13. *#left [enable|disable]*
║│14. *#welcome [enable|disable]*
║│15. *#sider*
║│16. *#tebakgambar*
║│17. *#caklontong*
║│18. *#truth*
║│19. *#dare*
║│20. *#asupan*
║│21. *#tebakkata*
║╰───────────
╚════════════════════════`
}
exports.groupcmd = groupcmd()
function readme() {
    return `
            *「 STALK 」*

*[@username]* Diisi dengan Username yang valid tanpa tanda “[” dan “]”
Contoh : *#tiktokstalk @tobz2k19*

*[@username]* Diisi dengan Username yang valid tanpa tanda “[” dan “]”
Contoh : *#igstalk @tobz2k19*

*[@username]* Diisi dengan Username yang valid tanpa tanda “[” dan “]”
Contoh : *#smulestalk @tobz2k19*

            *「 YT SEARCH 」*

*[video]* Diisi dengan Judul Video yang valid tanpa tanda “[” dan “]”
Contoh : *#video Erpan1140*
Jika ingin mendownload video harap ketik #getvideo [IdDownload] atau #getvideo [urutan]

*[lagu]* Diisi dengan Judul Lagu yang valid tanpa tanda “[” dan “]”
Contoh : *#music Alan Walker Alone*
Jika ingin mendownload lagu harap ketik #getmusic [IdDownload] atau #getmusic [urutan]

*[IdDownload] atau [urutan]* Diisi dengan IdDownload yang valid tanpa tanda “[” dan “]”
Contoh : *Jika tidak reply pesan : #getmusic Iv32bS1*
Contoh : *Jika reply pesan : #getmusic 1*
Contoh : *Jika tidak reply pesan : #getvideo Iv32bS1*
Contoh : *Jika reply pesan : #getvideo 1*

            *「 DOWNLOADER 」*

*[linkStarmaker]* Diisi dengan link Starmaker yang valid tanpa tanda “[” dan “]”
Contoh : *#starmaker https://m.starmakerstudios.com/d/playrecording?app=sm&from_user_id=3096224747920316&is_convert=true&recordingId=10696049124506354&share_type=copyLink*

*[linkTwitter]* Diisi dengan link YouTube yang valid tanpa tanda “[” dan “]”
Contoh : *#twitter https://twitter.com/PassengersMovie/status/821025484150423557*

*[linkXnxx]* Diisi dengan link Xnxx yang valid tanpa tanda “[” dan “]”
Contoh : *#xnxx http://www.xnxx.com/loli/stev-gay*

*[linkNekopoi]* Diisi dengan link Nekopoi yang valid tanpa tanda “[” dan “]”
Contoh : *#nekopoi https://nekopoi.care/tsunpuri-episode-1-subtitle-indonesia/*

*[linkYt]* Diisi dengan link YouTube yang valid tanpa tanda “[” dan “]”
Contoh : *#ytmp3 https://youtu.be/Bskehapzke8*

*[linkYt]* Diisi dengan link YouTube yang valid tanpa tanda “[” dan “]”
Contoh : *#ytmp4 https://youtu.be/Bskehapzke8*

*[linkTiktok]* Diisi dengan link Tiktok yang valid tanpa tanda “[” dan “]”
Contoh : *#tiktok https://vt.tiktok.com/yqyjPX/*

*[linkSmule]* Diisi dengan link Smule yang valid tanpa tanda “[” dan “]”
Contoh : *#smule https://www.smule.com/p/767512225_3062360163*

*[linkIg]* Diisi dengan link Instagram yang valid tanpa tanda “[” dan “]”
Contoh : *#ig https://www.instagram.com/p/CFqRZTlluAi/?igshid=1gtxkbdqhnbbe*

*[linkFb]* Diisi dengan link Facebook yang valid tanpa tanda “[” dan “]”
Contoh : *#fb https://www.facebook.com/EpochTimesTrending/videos/310155606660409*

*[linkTiktok]* Diisi dengan link facebookt Tiktok yang valid tanpa tanda “[” dan “]”
Contoh : *#tiktok https://vt.tiktok.com/yqyjPX/*

            *「 OTHER 」*

*[daerah]* Diisi dengan daerah yang valid, tanpa tanda “[” dan “]”
Contoh : *#jadwalShalat Tangerang*

*[channel]* Diisi dengan channel televisi yang valid, tanpa tanda “[” dan “]”
Contoh : *#jadwalTv Indosiar*

*[query]* Diisi dengan query/pencarian yang valid, tanpa tanda “[” dan “]“
Contoh : *#googlesearch siapa itu Renge*

*[tempat]* Diisi dengan tempat/lokasi yang valid, tanpa tanda “[” dan “]“
Contoh : *#cuaca tangerang*

*[kode bhs]* Diisi dengan kode bahasa, contoh *id*, *en*, dll. Dan *[teks]* Diisi dengan teks yang ingin di jadikan voice, Masih sama seperti di atas tanpa tanda “[” dan “]”
Contoh : *#tts id Test*
Note : Max 250 huruf

*[|teks|author|theme]* Diisi dengan teks, author, dan theme, tanpa tanda “[” dan “]”
Contoh : *#quotemaker |Odading|Mang Oleh|Shark*

*[optional]* Diisi dengan teks|title lirik lagu, tanpa tanda “[” dan “]”.
Contoh : *#lirik aku bukan boneka*

*[ipaddress]* Diisi dengan Ip Address yang valid, tanpa tanda “[” dan “]”.
Contoh : *#checkip 182.0.144.145*`
}
exports.readme = readme()
function info() {
    return `
╔══✪〘 INFORMATION 〙✪══
║
╠➥ *BOT TYPE : NODEJS V15*
╠➥ *NAME : RENGE BOT*
╠➥ *VERSION : 2.0*
║
╚═〘 RENGE BOT 〙
`
}

exports.info = info()
function snk() {
    return `Syarat dan Ketentuan Bot *Renge*
1. Teks dan nama pengguna WhatsApp anda akan kami simpan di dalam server selama bot aktif
2. Data anda akan di hapus ketika bot Offline
3. Kami tidak menyimpan gambar, video, file, audio, dan dokumen yang anda kirim
4. Kami tidak akan pernah meminta anda untuk memberikan informasi pribadi
5. Jika menemukan Bug/Error silahkan langsung lapor ke Owner bot
6. Apapun yang anda perintah pada bot ini, KAMI TIDAK AKAN BERTANGGUNG JAWAB!

Thanks !`
}
exports.snk = snk()
function sewa() {
    return `
╔════════════════════════
║╭──────❉ *IKLAN* ❉──────
║│
║╰───────────────────────
╚════════════════════════`
}
exports.sewa = sewa()
function sumbang() {
    return `
╔════════════════════════
║╭──❉ *DONASI* ❉───
║│*DONASI BISA MELALUI :*
║│*DANA : 082327759039*
║│*OVO : 082327759039*
║│*TELKOMSEL : 082327759039*
║╰─────────────────
╚════════════════════════`
}
exports.sumbang = sumbang()
function listChannel() {
    return `Daftar channel: 
1. ANTV
2. GTV
3. Indosiar
4. iNewsTV
5. KompasTV
6. MNCTV
7. METROTV
8. NETTV
9. RCTI
10. SCTV
11. RTV
12. Trans7
13. TransTV`
}
exports.listChannel = listChannel()
function bahasalist() {
    return `*List kode Bahasa*\n
  *Code       Bahasa*
    sq        Albanian
    ar        Arabic
    hy        Armenian
    ca        Catalan
    zh        Chinese
    zh-cn     Chinese (China)
    zh-tw     Chinese (Taiwan)
    zh-yue    Chinese (Cantonese)
    hr        Croatian
    cs        Czech
    da        Danish
    nl        Dutch
    en        English
    en-au     English (Australia)
    en-uk     English (United Kingdom)
    en-us     English (United States)
    eo        Esperanto
    fi        Finnish
    fr        French
    de        German
    el        Greek
    ht        Haitian Creole
    hi        Hindi
    hu        Hungarian
    is        Icelandic
    id        Indonesian
    it        Italian
    ja        Japanese
    ko        Korean
    la        Latin
    lv        Latvian
    mk        Macedonian
    no        Norwegian
    pl        Polish
    pt        Portuguese
    pt-br     Portuguese (Brazil)
    ro        Romanian
    ru        Russian
    sr        Serbian
    sk        Slovak
    es        Spanish
    es-es     Spanish (Spain)
    es-us     Spanish (United States)
    sw        Swahili
    sv        Swedish
    ta        Tamil
    th        Thai
    tr        Turkish
    vi        Vietnamese
    cy        Welsh
      `
}
exports.bahasalist = bahasalist()
