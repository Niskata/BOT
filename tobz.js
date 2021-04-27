const { decryptMedia } = require('@open-wa/wa-automate')
const fs = require('fs-extra')
const axios = require('axios')
const moment = require('moment-timezone')
const getYouTubeID = require('get-youtube-id')
const os = require('os')
const get = require('got')
const speed = require('performance-now')
const color = require('./lib/color')
const fetch = require('node-fetch')
const { spawn, exec } = require('child_process')
const urlShortener = require('./lib/shortener')
const nhentai = require('nhentai-js')
const { API } = require('nhentai-api')
const google = require('google-it')
//const genshin = require('genshin')
const translatte = require('translatte')
const { stdout } = require('process')
const quotedd = require('./lib/quote')
const translate = require('translatte')
const { getStickerMaker } = require('./lib/ttp')
const Math_js = require('mathjs');
const imageToBase64 = require('image-to-base64')
const bent = require('bent')
const request = require('request')
const { RemoveBgResult, removeBackgroundFromImageBase64, removeBackgroundFromImageFile } = require('remove.bg')


const { 
    liriklagu,
    quotemaker,
    randomNimek,
    sleep,
    jadwalTv, 
    } = require('./lib/functions')

const { 
    help,
    admincmd,
    ownercmd,
    nsfwcmd,
    kerangcmd,
    mediacmd,
    animecmd,
    othercmd,
    downloadcmd,
    groupcmd,
    bahasalist,
    sewa,
    snk, 
    info, 
    sumbang, 
    readme, 
    makercmd,
    commandArray
    } = require('./lib/help')

const { 
    custom,
	fetchJson,
    fetchBase64,
    getBase64,
    } = require('./lib/fetcher')

// LOAD FILE
const banned = JSON.parse(fs.readFileSync('./lib/banned.json'))
const nsfw_ = JSON.parse(fs.readFileSync('./lib/nsfwz.json'))
const simi_ = JSON.parse(fs.readFileSync('./lib/Simsimi.json'))
const limit = JSON.parse(fs.readFileSync('./lib/limit.json'))
const welkom = JSON.parse(fs.readFileSync('./lib/welcome.json'))
const left = JSON.parse(fs.readFileSync('./lib/left.json'))
const muted = JSON.parse(fs.readFileSync('./lib/muted.json'))
const setting = JSON.parse(fs.readFileSync('./lib/setting.json'))
const msgLimit = JSON.parse(fs.readFileSync('./lib/msgLimit.json'))
const adminNumber = JSON.parse(fs.readFileSync('./lib/admin.json'))
const _afk = JSON.parse(fs.readFileSync('./lib/database/afk.json'))


// PROTECT
let antilink = JSON.parse(fs.readFileSync('./lib/database/antilink.json'))
let antibadword = JSON.parse(fs.readFileSync('./lib/database/antibadword.json'))
let antisticker = JSON.parse(fs.readFileSync('./lib/database/antisticker.json'))
let msgBadword = JSON.parse(fs.readFileSync('./lib/database/msgBadword.json'))
let dbbadword = JSON.parse(fs.readFileSync('./lib/database/katakasar.json'))
let badword = JSON.parse(fs.readFileSync('./lib/database/badword.json'))
let pendaftar = JSON.parse(fs.readFileSync('./lib/database/user.json'))
let stickerspam = JSON.parse(fs.readFileSync('./lib/database/stickerspam.json'))


tobzkey = 'qNUJDjN82wbieEciNby6'
prefix = '#'
var timeStart = Date.now() / 1000
let { 
    limitCount,
    memberLimit, 
    groupLimit,
    banChats,
    melodickey,
    vhtearkey,
    restartState: isRestart,
    mtc: mtcState
    } = setting

let state = {
    status: () => {
        if(banChats){
            return 'Nonaktif'
        }else if(mtcState){
            return 'Nonaktif'
        }else if(!mtcState){
            return 'Aktif'
        }else{
            return 'Aktif'
        }
    }
}

moment.tz.setDefault('Asia/Jakarta').locale('id')

module.exports = tobz = async (tobz, message) => {
    try {
        const { 
            type, 
            id, 
            from, 
            t, 
            sender, 
            isGroupMsg, 
            chat, 
            chatId, 
            caption, 
            isMedia, 
            mimetype,
            quotedMsg, 
            quotedMsgObj, 
            author, 
            mentionedJidList 
            } = message

        let { body } = message
        const { name, formattedTitle } = chat
        let { pushname, verifiedName } = sender
        pushname = pushname || verifiedName
        const commands = caption || body || ''
        const command = commands.toLowerCase().split(' ')[0] || ''
        const args =  commands.split(' ')

        const msgs = (message) => {
            if (command.startsWith('#')) {
                if (message.length >= 10){
                    return `${message.substr(0, 15)}`
                }else{
                    return `${message}`
                }
            }
        }

        const uploadImages = (buffData, type) => {
            // eslint-disable-next-line no-async-promise-executor
            return new Promise(async (resolve, reject) => {
                const { ext } = await fromBuffer(buffData)
                const filePath = 'media/tmp.' + ext
                const _buffData = type ? await resizeImage(buffData, false) : buffData
                fs.writeFile(filePath, _buffData, { encoding: 'base64' }, (err) => {
                    if (err) return reject(err)
                    console.log('Uploading image to telegra.ph server...')
                    const fileData = fs.readFileSync(filePath)
                    const form = new FormData()
                    form.append('file', fileData, 'tmp.' + ext)
                    fetch('https://telegra.ph/upload', {
                        method: 'POST',
                        body: form
                    })
                        .then(res => res.json())
                        .then(res => {
                            if (res.error) return reject(res.error)
                            resolve('https://telegra.ph' + res[0].src)
                        })
                        .then(() => fs.unlinkSync(filePath))
                        .catch(err => reject(err))
                })
            })
        }

        function restartAwal(client){
            setting.restartState = false
            isRestart = false
            tobz.sendText(setting.restartId, 'Restart Succesfull!')
            setting.restartId = 'undefined'
            fs.writeFileSync('./lib/setting.json', JSON.stringify(setting, null,2));
        }
 
        const sleep = async (ms) => {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        const isMuted = (chatId) => {
          if(muted.includes(chatId)){
            return false
        }else{
            return true
            }
        }

        function banChat () {
            if(banChats == true) {
            return false
        }else{
            return true
            }
        }

        if (typeof Array.prototype.splice === 'undefined') {
            Array.prototype.splice = function (index, howmany, elemes) {
                howmany = typeof howmany === 'undefined' || this.length;
                var elems = Array.prototype.slice.call(arguments, 2), newArr = this.slice(0, index), last = this.slice(index + howmany);
                newArr = newArr.concat.apply(newArr, elems);
                newArr = newArr.concat.apply(newArr, last);
                return newArr;
            }
        }
		 function isReg(obj){
            if (obj === true){
                return false
            } else {     
                return tobz.reply(from, `Kamu belum terdaftar sebagai Teman Renge\nuntuk mendaftar kirim #daftar |nama|umur\n\ncontoh format: #daftar |Renge|17\n\ncukup gunakan nama depan/panggilan saja`, id) //if user is not registered
            }
        }
		 
		 function GenerateSerialNumber(mask){
            var serialNumber = "";
            if(mask != null){
                for(var i=0; i < mask.length; i++){
                    var maskChar = mask[i];
                    serialNumber += maskChar == "0" ? GenerateRandomChar() : maskChar;
                }
            }
            return serialNumber;
        }
        
        var nmr = sender.id
        var obj = pendaftar.some((val) => {
            return val.id === nmr
        })
        var cekage = pendaftar.some((val) => {
            return val.id === nmr && val.umur >= 15
        })


        const apakah = [
            'Ya',
            'Tidak',
            'Coba Ulangi'
            ]

        const bisakah = [
            'Bisa',
            'Tidak Bisa',
            'Coba Ulangi'
            ]

        const kapankah = [
            '1 Minggu lagi',
            '1 Bulan lagi',
            '1 Tahun lagi'
            ]

        const rate = [
            '100%',
            '95%',
            '90%',
            '85%',
            '80%',
            '75%',
            '70%',
            '65%',
            '60%',
            '55%',
            '50%',
            '45%',
            '40%',
            '35%',
            '30%',
            '25%',
            '20%',
            '15%',
            '10%',
            '5%'
            ]

        const mess = {
            wait: '[ WAIT ] Sedang di proses⏳ silahkan tunggu sebentar',
            error: {
                St: '[❗] Kirim gambar dengan caption *#sticker* atau tag gambar yang sudah dikirim',
                Ti: '[❗] Replay sticker dengan caption *#stickertoimg* atau tag sticker yang sudah dikirim',
                Qm: '[❗] Terjadi kesalahan, mungkin themenya tidak tersedia!',
                Yt3: '[❗] Terjadi kesalahan, tidak dapat meng konversi ke mp3!',
                Yt4: '[❗] Terjadi kesalahan, mungkin error di sebabkan oleh sistem.',
                Ig: '[❗] Terjadi kesalahan, mungkin karena akunnya private',
                Ki: '[❗] Bot tidak bisa mengeluarkan Admin group!',
                Sp: '[❗] Bot tidak bisa mengeluarkan Admin',
                Ow: '[❗] Bot tidak bisa mengeluarkan Owner',
                Bk: '[❗] Bot tidak bisa memblockir Owner',
                Ad: '[❗] Tidak dapat menambahkan target, mungkin karena di private',
                Iv: '[❗] Link yang anda kirim tidak valid!'
            }
        }

        const time = moment(t * 1000).format('DD/MM HH:mm:ss')
        const botNumber = await tobz.getHostNumber()
        const blockNumber = await tobz.getBlockedIds()
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await tobz.getGroupAdmins(groupId) : ''
        const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false
        const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false
        const serial = sender.id

        const isAdmin = adminNumber.includes(sender.id)
        const ownerNumber = '6282327759039@c.us'
        const isOwner = ownerNumber.includes(sender.id)
        
        const isWhite = (chatId) => adminNumber.includes(chatId) ? true : false
        const isWhiteList = (chatId) => {
            if(adminNumber.includes(sender.id)){
                if(muted.includes(chatId)) return false
                return true
            }else{
                return false
            }
        }
        
        const isBanned = banned.includes(sender.id)
        const isBlocked = blockNumber.includes(sender.id)
        const isNsfw = isGroupMsg ? nsfw_.includes(chat.id) : false
        const isSimi = isGroupMsg ? simi_.includes(chat.id) : false
        const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
        const isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi)
        const url = args.length !== 0 ? args[0] : ''
        const q = args.join(' ')
        const isQuotedImage = quotedMsg && quotedMsg.type === 'image'
        const StickerMetadata = { author : 'Owner? @Niskata', pack: 'Renge ~Bot' , keepScale: true }
        const reason = q ? q : 'Gada'
	const gifxyz = { crop: false, square: 240, fps: 30, loop: 0, startTime: `00:00:00.0`, endTime: `00:00:10.0` }
	
	const tms = (Date.now() / 1000) - (timeStart);
        const cts = waktu(tms)


        const vhtearkey = 'YOUR_APIKEY' // https://api.vhtear.com
        const barbarkey = 'lGjYt4zA5SQlTDx9z9Ca' // https://mhankbarbar.herokuapp.com/api
        const melodickey = 'administrator'

        const tutor = 'https://i.ibb.co/Hp1XGbL/a4dec92b8922.jpg'
        const errorurl = 'https://steamuserimages-a.akamaihd.net/ugc/954087817129084207/5B7E46EE484181A676C02DFCAD48ECB1C74BC423/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'
        const errorurl2 = 'https://steamuserimages-a.akamaihd.net/ugc/954087817129084207/5B7E46EE484181A676C02DFCAD48ECB1C74BC423/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'
        // FUNCTION
	    function waktu(seconds) {
            seconds = Number(seconds);
            var d = Math.floor(seconds / (3600 * 24));
            var h = Math.floor(seconds % (3600 * 24) / 3600);
            var m = Math.floor(seconds % 3600 / 60);
            var s = Math.floor(seconds % 60);
            var dDisplay = d > 0 ? d + (d == 1 ? " Hari,":" Hari,") : "";
            var hDisplay = h > 0 ? h + (h == 1 ? " Jam,":" Jam,") : "";
            var mDisplay = m > 0 ? m + (m == 1 ? " Menit,":" Menit,") : "";
            var sDisplay = s > 0 ? s + (s == 1 ? " Detik,":" Detik") : "";
            return dDisplay + hDisplay + mDisplay + sDisplay;
        }
        const liriklagu = async (lagu) => {
            const response = await fetch(`http://scrap.terhambar.com/lirik?word=${lagu}`)
            if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
            const json = await response.json()
            if (json.status === true) return `Lirik Lagu ${lagu}\n\n${json.result.lirik}`
            return `[ Error ] Lirik Lagu ${lagu} tidak di temukan!`
        }

        const processTime = (timestamp, now) => {
            // timestamp => timestamp when message was received
            return moment.duration(now - moment(timestamp * 1000)).asSeconds()
        }
                
                    function isMsgLimit(id){
                    if (isAdmin) {return false;}
                    let found = false;
                    for (let i of msgLimit){
                        if(i.id === id){
                            if (i.msg >= 12) {
                                found === true 
                                tobz.reply(from, '*[ANTI-SPAM]*\nMaaf, akun anda kami blok karena SPAM, dan tidak bisa di UNBLOK!', id)
                                tobz.contactBlock(id)
                                banned.push(id)
                                fs.writeFileSync('./lib/banned.json', JSON.stringify(banned))
                                return true;
                            }else if(i.msg >= 7){
                                found === true
                                tobz.reply(from, '*[ANTI-SPAM]*\nNomor anda terdeteksi spam!\nMohon tidak spam 5 pesan lagi atau nomor anda AUTO BLOK!', id)
                                return true
                            }else{
                                found === true
                                return false;
                            }   
                        }
                    }
                    if (found === false){
                        let obj = {id: `${id}`, msg:1};
                        msgLimit.push(obj);
                        fs.writeFileSync('./lib/msgLimit.json',JSON.stringify(msgLimit));
                        return false;
                    }  
                }
                function addMsgLimit(id){
                    if (isAdmin) {return;}
                    var found = false
                    Object.keys(msgLimit).forEach((i) => {
                        if(msgLimit[i].id == id){
                            found = i
                        }
                    })
                    if (found !== false) {
                        msgLimit[found].msg += 1;
                        fs.writeFileSync('./lib/msgLimit.json',JSON.stringify(msgLimit));
                    }
                }
                function isLimit(id){
                    if (isAdmin) {return false;}
                    let found = false;
                    for (let i of limit){
                        if(i.id === id){
                            let limits = i.limit;
                            if (limits >= limitCount) {
                                found = true;
                                tobz.reply(from, 'Perintah BOT anda sudah mencapai batas, coba esok hari :)', id)
                                return true;
                            }else{
                                limit
                                found = true;
                                return false;
                            }
                        }
                    }
                    if (found === false){
                        let obj = {id: `${id}`, limit:1};
                        limit.push(obj);
                        fs.writeFileSync('./lib/limit.json',JSON.stringify(limit));
                        return false;
                    }  
                }
                function limitAdd (id) {
                    if (isAdmin) {return;}
                    var found = false;
                    Object.keys(limit).forEach((i) => {
                        if(limit[i].id == id){
                            found = i
                        }
                    })
                    if (found !== false) {
                        limit[found].limit += 1;
                        fs.writeFileSync('./lib/limit.json',JSON.stringify(limit));
                    }
                }
                // AFK FUNCTION
                const addAfk = (userId, time) => {
                    let obj = {id: `${userId}`, time: `${time}`, reason: `${reason}`}
                    _afk.push(obj)
                    fs.writeFileSync('./lib/database/afk.json', JSON.stringify(_afk))
                    }
            
                    const getAfk = (userId) => {
                        let isAfk = false
                        Object.keys(_afk).forEach((i) => {
                            if (_afk[i].id === userId) {
                            isAfk = true
                            
                        }
                        })
                        return isAfk
                        }
            
                    const getAfkReason = (userId) => {
                            let position = false
                            Object.keys(_afk).forEach((i) => {
                            if (_afk[i].id === userId) {
                                position = i
                            }
                        })
                        if (position !== false) {
                            return _afk[position].reason
                        }
                    }
            
                    const getAfkTime = (userId) => {
                        let position = false
                        Object.keys(_afk).forEach((i) => {
                        if (_afk[i].id === userId) {
                            position = i
                        }
                    })
                    if (position !== false) {
                        return _afk[position].time
                    }
                    }
            
                    const getAfkId = (userId) => {
                        let position = false
                        Object.keys(_afk).forEach((i) => {
                            if (_afk[i].id === userId) {
                                position = i
                            }
                        })
                        if (position !== false) {
                            return _afk[position].id
                        }
                        }
            
            
                const isAfkOn = getAfk(sender.id)
                    if (isGroupMsg) {
                        const checking = getAfk(sender.id)
                        for (let ment of mentionedJidList) {
                            if(getAfk(ment)) {
                                const getId = getAfkId(ment)
                                const getReason = getAfkReason(getId)
                                const getTime = getAfkTime(getId)
                                await tobz.reply(from, `*「 AFK MODE 」*\n\nSssttt! Orangnya lagi afk, jangan diganggu!\n➸ *Alasan*: ${getReason}\n➸ *Sejak*: ${getTime}`, id)
                                tobz.sendText(userId, `Seseorang telah tag anda bernama @{pushname}`)
                                }
                            }
                            if (checking) {
                                _afk.splice(sender.id, 1)
                                fs.writeFileSync('./lib/database/afk.json', JSON.stringify(_afk))
                                tobz.sendTextWithMentions(from, `*@${sender.id.replace(/@c.us/g, '')} SEKARANG TIDAK AFK*`)
                            }
                            }
                // END HELPER FUNCTION
                
                if(body === '#mute' && isMuted(chatId) == true){
                    if(isGroupMsg) {
                        if (!isOwner, !isGroupAdmins) return tobz.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh admin!', id)
                        if(isMsgLimit(serial)){
                            return
                        }else{
                            addMsgLimit(serial)
                        }
                        muted.push(chatId)
                        fs.writeFileSync('./lib/muted.json', JSON.stringify(muted, null, 2))
                        tobz.reply(from, 'Bot telah di mute pada chat ini! #unmute untuk unmute!', id)
                    }else{
                        if(isMsgLimit(serial)){
                            return
                        }else{
                            addMsgLimit(serial)
                        }
                        muted.push(chatId)
                        fs.writeFileSync('./lib/muted.json', JSON.stringify(muted, null, 2))
                        reply(from, 'Bot telah di mute pada chat ini! #unmute untuk unmute!', id)
                    }
                }
                if(body === '#unmute' && isMuted(chatId) == false){
                    if(isGroupMsg) {
                        if (!isAdmin) return tobz.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh admin Renge!', id)
                        if(isMsgLimit(serial)){
                            return
                        }else{
                            addMsgLimit(serial)
                        }
                        let index = muted.indexOf(chatId);
                        muted.splice(index,1)
                        fs.writeFileSync('./lib/muted.json', JSON.stringify(muted, null, 2))
                        tobz.reply(from, 'Bot telah di unmute!', id)         
                    }else{
                        if(isMsgLimit(serial)){
                            return
                        }else{
                            addMsgLimit(serial)
                        }
                        let index = muted.indexOf(chatId);
                        muted.splice(index,1)
                        fs.writeFileSync('./lib/muted.json', JSON.stringify(muted, null, 2))
                        tobz.reply(from, 'Bot telah di unmute!', id)                   
                    }
                }
                if (body === '#unbanchat') {
                    if (!isOwner) return tobz.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh Owner Renge!', id)
                    if(setting.banChats === false) return
                    setting.banChats = false
                    banChats = false
                    fs.writeFileSync('./lib/setting.json', JSON.stringify(setting, null, 2))
                    tobz.reply('Global chat has been disable!')
                }

        if (!isGroupMsg && command.startsWith('#')) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(msgs(command)), 'from', color(pushname))
        if (isGroupMsg && command.startsWith('#')) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(msgs(command)), 'from', color(pushname), 'in', color(formattedTitle))
        if (isBanned) return
        if (mtcState) return
        if (!banChat()) return
        if (!isMuted(chatId)) return
        if (isBlocked) return
        switch(command) {

        case '#banchat':
            if (setting.banChats === true) return
            if (!isOwner) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan oleh Owner Renge', id)
            setting.banChats = true
            banChats = true
            fs.writeFileSync('./lib/database/setting.json', JSON.stringify(setting, null, 2))
            tobz.reply('Global chat has been enable!')
            break
        case '#unmute':
            console.log(`Unmuted ${name}!`)
            await tobz.sendSeen(from)
            break
        case '#unbanchat':
            console.log(`Banchat ${name}!`)
            await tobz.sendSeen(from)
            break
        case '#sticker':
        case '#stiker':
	case '#s':
            tobz.reply(from, '_Tunggu ±1 Menit ..._', id)    
            if (isMedia && type === 'image') {
                const mediaData = await decryptMedia(message, uaOverride)
                const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                await tobz.sendImageAsSticker(from, imageBase64, StickerMetadata)
				console.log(color(`Sticker processed for ${processTime(t, moment())} seconds`, 'aqua'))
            } else if (quotedMsg && quotedMsg.type == 'image') {
                const mediaData = await decryptMedia(quotedMsg, uaOverride)
                const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                await tobz.sendImageAsSticker(from, imageBase64, StickerMetadata)
				console.log(color(`Sticker processed for ${processTime(t, moment())} seconds`, 'aqua'))
			} else {
				tobz.reply(from, mess.error.St, id)
			}			
            break
        case '#stikernobg': 
        case '#snobg':
  	case '#nobg':
        if (isMedia || isQuotedImage) {
            try {
            var mediaData = await decryptMedia(message, uaOverride)
            var imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
            var base64img = imageBase64
            var outFile = './media/noBg.png'
            // kamu dapat mengambil api key dari website remove.bg dan ubahnya difolder settings/api.json
            var result = await removeBackgroundFromImageBase64({ base64img, apiKey: 'A41x9PH58NuMaDdN5YqMUdFh', size: 'auto', type: 'auto', outFile })
            await fs.writeFile(outFile, result.base64img)
            await tobz.sendImageAsSticker(from, `data:${mimetype};base64,${result.base64img}`, StickerMetadata)
            } catch(err) {
            console.log(err)
               await tobz.reply(from, 'Maaf batas penggunaan hari ini sudah mencapai maksimal', id)
            }
        }
	break
	        case '#build':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa digunakan dalam grup', id)
            if (args.length === 1) return tobz.reply(from, 'Masukkan nama characternya contoh #genshin keqing', id)
            if (args[1] === 'ningguang') {
               await tobz.sendFileFromUrl(from, `https://pbs.twimg.com/media/Em-fPLbXIAMeGHs.jpg`, 'ningguang.jpg', 'NINGGUANG')
            }
            else if (args[1] === 'qiqi') {
                await tobz.sendFileFromUrl(from, `https://i.pinimg.com/originals/a6/30/72/a630722d0b892f3726a8d6f5305a8d51.jpg`, 'qiqi.jpg', 'QIQI')
            }
            else if (args[1] === 'bennett') {
                await tobz.sendFileFromUrl(from, `https://i.pinimg.com/originals/6f/45/f0/6f45f0c3a9fb25279dc8d27d91e68e04.jpg`, 'bennett.jpg', 'BENNETT')
            }
            else if (args[1] === 'ganyu') {
                await tobz.sendFileFromUrl(from, `https://pbs.twimg.com/media/Erj5aqWXUAQWZoK.jpg`, 'ganyu.jpg', 'GANYU')
            }
            else if (args[1] === 'diluc') {
                await tobz.sendFileFromUrl(from, `https://pbs.twimg.com/media/EnSynS8W4AQH58E.jpg`, 'Diluc.jpg', 'DILUC')
            }
            else if (args[1] === 'hutao') {
                await tobz.sendFileFromUrl(from, `https://i.ytimg.com/vi/1-0DYUFXKUk/sddefault.jpg`, 'hutao.jpg', 'HUTAO')
            }
            else if (args[1] === 'klee') {
                await tobz.sendFileFromUrl(from, `https://pbs.twimg.com/media/EnGJHUAXMAIuzKD.jpg`, 'klee.jpg', 'KLEE')
            }
            else if (args[1] === 'mona') {
                await tobz.sendFileFromUrl(from, `https://i.pinimg.com/originals/b1/0b/4f/b10b4f74c40df78d86ffad813bf19b11.jpg`, 'mona.jpg', 'MONA')
            }
            else if (args[1] === 'childe') {
                await tobz.sendFileFromUrl(from, `https://pbs.twimg.com/media/Emtc2HBXYAMA58S.jpg`, 'childe.jpg', 'CHILDE')
            }
            else if (args[1] === 'venti') {
                await tobz.sendFileFromUrl(from, `https://pbs.twimg.com/media/EnojhCpXcAAAgeW.jpg`, 'venti.jpg', 'VENTI')
            }
            else if (args[1] === 'xiao') {
                await tobz.sendFileFromUrl(from, `https://pbs.twimg.com/media/EtUpocpWgAov3gN.jpg`, 'xiao.jpg', 'XIAO')
            }
            else if (args[1] === 'xingqiu') {
                await tobz.sendFileFromUrl(from, `https://pbs.twimg.com/media/EveqXA5XEAgJW5Y.jpg`, 'xingqiu.jpg', 'XINGQIU')
            }
            else if (args[1] === 'zhongli') {
                await tobz.sendFileFromUrl(from, `https://pbs.twimg.com/media/EoREoPFW4AA1xlA.jpg`, 'zhongli.jpg', 'ZHONGLI')
            }
            else if (args[1] === 'albedo') {
                await tobz.sendFileFromUrl(from, `https://upload-os-bbs.mihoyo.com/upload/2020/12/28/63355475/47bc7b1162a21453f1220a374bf15da1_2193150447268650678.png`, 'albedo.png', 'ALBEDO')
            }
            else if (args[1] === 'diona') {
                await tobz.sendFileFromUrl(from, `https://pbs.twimg.com/media/EnJI-SiW8AEWACM.jpg`, 'diona.jpg', 'DIONA')
            }
            else if (args[1] === 'fischl') {
                await tobz.sendFileFromUrl(from, `https://staticg.sportskeeda.com/editor/2021/03/04b93-16153802018217-800.jpg`, 'fischl.jpg', 'FISCHL')
            }
            else if (args[1] === 'jean') {
                await tobz.sendFileFromUrl(from, `https://pbs.twimg.com/media/EmTrchHXEAA6IZa.jpg`, 'jean.jpg', 'JEAN')
            }
            else if (args[1] === 'keqing') {
                await tobz.sendFileFromUrl(from, `https://i.pinimg.com/originals/7d/90/b9/7d90b94f5194b74c104686287216ccee.png`, 'keqing.jpg', 'KEQING')
            }
            else if (args[1] === 'razor') {
                await tobz.sendFileFromUrl(from, `https://upload-os-bbs.mihoyo.com/upload/2020/12/11/63355475/26034e7eb14a93af1e466cb9914afa89_5399551990996542927.png`, 'razor.jpg', 'RAZOR')
            }
            else if (args[1] === 'rosaria') {
                await tobz.sendFileFromUrl(from, `https://pbs.twimg.com/media/EyjQ3V5WQAQ6rYk.jpg`, 'rosaria.jpg', 'ROSARIA')
            }
            else if (args[1] === 'sucrose') {
                await tobz.sendFileFromUrl(from, `https://pbs.twimg.com/media/EoBu7oQXUAMJjWL.jpg`, 'sucrose.jpg', 'SUCROSE')
            }
            else if (args[1] === 'xinagling') {
                await tobz.sendFileFromUrl(from, `https://upload-os-bbs.hoyolab.com/upload/2020/11/21/63355475/5dd077533466cbbdc4087e72713bf5b6_4149424357349932943.png`, 'xiangling.png', 'XIANGLING')
            }
            else if (args[1] === 'barbara') {
                await tobz.sendFileFromUrl(from, `https://pbs.twimg.com/media/Es_G80eXMAgHFq3.jpg`, 'barbara.jpg', 'BARBARA')
            }
            else if (args[1] === 'beidou') {
                await tobz.sendFileFromUrl(from, `https://pbs.twimg.com/media/EmZTPl_WMAEmikq.jpg`, 'beidou.jpg', 'BEIDOU')
            }
            else if (args[1] === 'chongyun') {
                await tobz.sendFileFromUrl(from, `https://i.pinimg.com/originals/b3/b1/cc/b3b1cce69b592c9fbb590dbe8cbc6ba3.jpg`, 'chongyun.jpg', 'CHONGYUN')
            }
            else if (args[1] === 'kaeya') {
                await tobz.sendFileFromUrl(from, `https://pbs.twimg.com/media/ErVRuSrXUAYx3It.jpg`, 'kaeya.jpg', 'KAEYA')
            }
            else if (args[1] === 'xinyan') {
                await tobz.sendFileFromUrl(from, `https://upload-os-bbs.hoyolab.com/upload/2021/01/27/63355475/8d10c6784b158bc95e0aa60918217a34_1082325582054032291.png`, 'xinyan.png', 'XINYAN')
            }
            else if (args[1] === 'lisa') {
                await tobz.sendFileFromUrl(from, `https://upload-os-bbs.hoyolab.com/upload/2021/02/13/63355475/6718b2955f0f126e717121ef971c382a_8520390941442621949.png`, 'lisa.png', 'LISA')
            }
            else if (args[1] === 'noelle') {
                await tobz.sendFileFromUrl(from, `https://pbs.twimg.com/media/Es8LXamXYAMZOVk.jpg`, 'noelle.jpg', 'NOELLE')
            }
            else if (args[1] === 'amber') {
                await tobz.sendFileFromUrl(from, `https://upload-os-bbs.hoyolab.com/upload/2021/02/21/63355475/c24676965b33c9729e55d574317f4e4b_6012764714877069971.png`, 'amber.png', 'AMBER')
            } else {
                tobz.reply(from, 'Character yang kamu cari tidak tersedia!', id)
            }
            break
/*	 case prefix+'genshininfo': // chika chantexxzz
         case prefix+'genshin':
                if (!q) return await tobz.reply(from, 'Format salah !', id)
                await tobz.reply(from, 'tunggu sebentar!', id)
                try {
                    console.log('Searching for character...')
                    const character = await genshin.characters(q)
                    await tobz.sendFileFromUrl(from, character.image, `${character.name}.jpg`, `*「 GENSHIN IMPACT 」*\n\n*${character.name}*\n${character.description}\n\n"_${character.quote}_" - ${character.name}\n\n➸ *Name*: ${character.name}\n➸ *Seiyuu*: ${character.cv}\n➸ *Region*: ${character.city}\n➸ *Rating*: ${character.rating}\n➸ *Vision*: ${character.element}\n➸ *Weapon*: ${character.weapon}\n\n${character.url}`)
                    console.log('Success sending Genshin Impact character!')
                } catch (err) {
                    console.error(err)
                    await tobz.reply(from, 'Error or character not found!', id)
                }
            break */
        case '#ttp':
            if (args.length === 1) return tobz.reply(from, 'Kirim perintah *#ttp [optional]*, Contoh : *#maps Jakarta*')        
            try
                {
                    const string = body.toLowerCase().includes('#ttp') ? body.slice(5) : body.slice(5)
                    if(args)
                    {
                        if(quotedMsgObj == null)
                        {
                            const gasMake = await getStickerMaker(string)
                            if(gasMake.status == true)
                            {
                                try{
                                    await tobz.sendImageAsSticker(from, gasMake.base64)
                                }catch(err) {
                                    await tobz.reply(from, 'Gagal membuat.', id)
                                } 
                            }else{
                                await tobz.reply(from, gasMake.reason, id)
                            }
                        }else if(quotedMsgObj != null){
                            const gasMake = await getStickerMaker(quotedMsgObj.body)
                            if(gasMake.status == true)
                            {
                                try{
                                    await tobz.sendImageAsSticker(from, gasMake.base64)
                                }catch(err) {
                                    await tobz.reply(from, 'Gagal membuat.', id)
                                } 
                            }else{
                                await tobz.reply(from, gasMake.reason, id)
                            }
                        }
                       
                    }else{
                        await tobz.reply(from, 'Tidak boleh kosong.', id)
                    }
                }catch(error)
                {
                    console.log(error)
                }
            break
        case '#stickergif':
        case '#stikergif':
        case '#sgif':
            if (isMedia && type === 'video' || mimetype == 'sticker/gif') {
                tobz.reply(from, mess.wait, id)
                try {
                    const mediaData = await decryptMedia(message, uaOverride)
                    const vidbase = `data:${mimetype};base64,${mediaData.toString('base64')}`
                    await tobz.sendMp4AsSticker(from, vidbase, gifxyz, StickerMetadata)
                    .then(async () => {
                        console.log(color(`Sticker Gif processed for ${processTime(t, moment())} seconds`, 'aqua'))
                    })
                } catch (err) {
                    console.log(err)
                    tobz.reply(from, 'Durasi video terlalu panjang, mohon kecilkan sedikit\nmax 9 detik', id)
                }
            } else if(quotedMsg && quotedMsg.type === 'sticker' || quotedMsg && quotedMsg.type === 'video') {
                        tobz.reply(from, mess.wait, id)
                        try {
                            const mediaData = await decryptMedia(quotedMsg, uaOverride)
                            const videoBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                            await tobz.sendMp4AsSticker(from, videoBase64, gifxyz, StickerMetadata)
                                .then(async () => {
                                    console.log(color(`Sticker Gif processed for ${processTime(t, moment())} seconds`, 'aqua'))       
                                })
                        } catch (err) {
                            console.error(err)
                            await tobz.reply(from, `Ukuran video terlalu besar\nMaksimal size adalah 1MB!`, id)
                        }
                    } else {
                        await tobz.reply(from, `Ukuran video terlalu besar`, id)
                    }
            break
        case '#stickertoimg':
        case '#stimg':
        case '#toimg':                                
            if (quotedMsg && quotedMsg.type == 'sticker') {
                const mediaData = await decryptMedia(quotedMsg)
                tobz.reply(from, `Sedang di proses! Silahkan tunggu sebentar...`, id)
                const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                await tobz.sendFile(from, imageBase64, 'imgsticker.jpg', 'Berhasil convert Sticker to Image!', id)
                .then(() => {
                    console.log(`Sticker to Image Processed for ${processTime(t, moment())} Seconds`)
                })
        } else if (!quotedMsg) return tobz.reply(from, `Format salah, silahkan tag sticker yang ingin dijadikan gambar!`, id)
        break
        case '#groupinfo' :
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', message.id)
            isMuted(chatId) == false
            var totalMem = chat.groupMetadata.participants.length
            var desc = chat.groupMetadata.desc
            var groupname = name
            var welgrp = welkom.includes(chat.id)
            var leftgrp = left.includes(chat.id)
            var ngrp = nsfw_.includes(chat.id)
            var simu = simi_.includes(chat.id)
            var grouppic = await tobz.getProfilePicFromServer(chat.id)
            if (grouppic == undefined) {
                 var pfp = errorurl
            } else {
                 var pfp = grouppic 
            }
            await tobz.sendFileFromUrl(from, pfp, 'group.png', `➸ *Name : ${groupname}* 
*➸ Members : ${totalMem}*
*➸ Welcome : ${welgrp}*
*➸ Left : ${leftgrp}*
*➸ NSFW : ${ngrp}*
*➸ Group Description* 
${desc}`)
            break
        case '#quoterandom' :
        case '#quote' :
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (isLimit(serial)) return tobz.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            tobz.sendText(from, quotedd())
            break
		 case '#gempa':
            const bmkg = await axios.get('http://docs-jojo.herokuapp.com/api/infogempa')
            const { potensi, koordinat, lokasi, kedalaman, magnitude, waktu, map } = bmkg.data
            const hasil = `*${waktu}*\n📍 *Lokasi* : *${lokasi}*\n〽️ *Kedalaman* : *${kedalaman}*\n💢 *Magnitude* : *${magnitude}*\n🔘 *Potensi* : *${potensi}*\n📍 *Koordinat* : *${koordinat}*`
            tobz.sendFileFromUrl(from, map, 'shakemap.jpg', hasil, id)
            await limitAdd(serial)
            break
        case '#tts':
            if (args.length === 1) return tobz.reply(from, 'Kirim perintah *!tts [id, en, jp, ar] [teks]*, contoh *!tts id halo semua*')
            const ttsId = require('node-gtts')('id')
            const ttsEn = require('node-gtts')('en')
	    const ttsJp = require('node-gtts')('ja')
            const ttsAr = require('node-gtts')('ar')
            const dataText = body.slice(8)
            if (dataText === '') return tobz.reply(from, 'Baka?', id)
            if (dataText.length > 500) return tobz.reply(from, 'Teks terlalu panjang!', id)
            var dataBhs = body.slice(5, 7)
	        if (dataBhs == 'id') {
                ttsId.save('./media/tts/resId.mp3', dataText, function () {
                    tobz.sendPtt(from, './media/tts/resId.mp3', id)
                })
            } else if (dataBhs == 'en') {
                ttsEn.save('./media/tts/resEn.mp3', dataText, function () {
                    tobz.sendPtt(from, './media/tts/resEn.mp3', id)
                })
            } else if (dataBhs == 'jp') {
                ttsJp.save('./media/tts/resJp.mp3', dataText, function () {
                    tobz.sendPtt(from, './media/tts/resJp.mp3', id)
                })
	    } else if (dataBhs == 'ar') {
                ttsAr.save('./media/tts/resAr.mp3', dataText, function () {
                    tobz.sendPtt(from, './media/tts/resAr.mp3', id)
                })
            } else {
                tobz.reply(from, 'Masukkan data bahasa : [id] untuk indonesia, [en] untuk inggris, [jp] untuk jepang, dan [ar] untuk arab', id)
            }
            break
        case '#koin':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const side = Math.floor(Math.random() * 2) + 1
            if (side == 1) {
              tobz.sendStickerfromUrl(from, 'https://i.ibb.co/YTWZrZV/2003-indonesia-500-rupiah-copy.png', { method: 'get' })
            } else {
              tobz.sendStickerfromUrl(from, 'https://i.ibb.co/bLsRM2P/2003-indonesia-500-rupiah-copy-1.png', { method: 'get' })
            }
            break
        case '#dadu':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const dice = Math.floor(Math.random() * 6) + 1
            await tobz.sendStickerfromUrl(from, 'https://www.random.org/dice/dice' + dice + '.png', { method: 'get' })
            break
        case '#kapankah':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const when = args.join(' ')
            const ans = kapankah[Math.floor(Math.random() * (kapankah.length))]
            if (!when) tobz.reply(from, '⚠️ Format salah! Ketik *#menu* untuk penggunaan.')
            await tobz.sendText(from, `Pertanyaan: *${when}* \n\nJawaban: ${ans}`)
            break
        case '#nilai':
        case '#rate':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const rating = args.join(' ')
            const awr = rate[Math.floor(Math.random() * (rate.length))]
            if (!rating) tobz.reply(from, '⚠️ Format salah! Ketik *#menu* untuk penggunaan.')
            await tobz.sendText(from, `Pertanyaan: *${rating}* \n\nJawaban: ${awr}`)
            break
        case '#apakah':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const nanya = args.join(' ')
            const jawab = apakah[Math.floor(Math.random() * (apakah.length))]
            if (!nanya) tobz.reply(from, '⚠️ Format salah! Ketik *#menu* untuk penggunaan.')
            await tobz.sendText(from, `Pertanyaan: *${nanya}* \n\nJawaban: ${jawab}`)
            break
         case '#bisakah':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const bsk = args.join(' ')
            const jbsk = bisakah[Math.floor(Math.random() * (bisakah.length))]
            if (!bsk) tobz.reply(from, '⚠️ Format salah! Ketik *#menu* untuk penggunaan.')
            await tobz.sendText(from, `Pertanyaan: *${bsk}* \n\nJawaban: ${jbsk}`)
            break
        case '#owner':
        case '#owner':
            tobz.sendContact(chatId, `6282327759039@c.us`)
            tobz.reply(from, 'Itu nomor Pacar ku, eh maksudnya Owner ku', id)
            break
	// maker menu
        case '#firework':
            if (args.length === 1) return tobz.reply(from, `Kirim perintah *${prefix}firework [ Teks ]*, contoh *${prefix}firework renge*`, id)
            const fire = body.slice(10)
            const firew = `https://akirainfo.site/firework?apikey=e7d6410e4c5c&text=${fire}`
            await tobz.sendFileFromUrl(from, firew, `firework.jpeg`, 'Udah Jadi Kak')
            break
        case '#ninja':
            if (args.length == 1) return tobz.reply(from, `Ketik command ${prefix}ninja [text]|[nama]\nContoh ${prefix}ninja ini contohnya|tolll`, id)
            var nin = body.slice(7).trim().split('|')
            const ninja = `https://akirainfo.site/ninjalogo?apikey=e7d6410e4c5c&text1=${nin[0]}&text2=${nin[1]}`
            await tobz.sendFileFromUrl(from, ninja, `NINJAH.jpeg`, 'Udah Jadi Kak')
            break
        case '#wolf':
            if (args.length == 1) return tobz.reply(from, `Ketik command ${prefix}wolf [text]|[nama]\nContoh ${prefix}wolf ini contohnya|tolll`, id)
            var wolf1 = body.slice(6).trim().split('|')
            const wolf = `https://akirainfo.site/wolflogo?apikey=e7d6410e4c5c&text1=${wolf1[0]}&text2=${wolf1[1]}`
            await tobz.sendFileFromUrl(from, wolf, `Wolf.jpeg`, 'Udah Jadi Kak')
            break
        case '#phlogo':
            if (args.length == 1) return tobz.reply(from, `Ketik command ${prefix}pornhub [text]|[nama]\nContoh ${prefix}pornhub ini contohnya|tolll`, id)
            var bdtrm = body.slice(9).trim().split('|')
            const phlogo = `https://akirainfo.site/pornhub?apikey=e7d6410e4c5c&text1=${bdtrm[0]}&text2=${bdtrm[1]}`
            await tobz.sendFileFromUrl(from, phlogo, `PHLOGO.jpeg`, 'Udah Jadi Kak')
            break
        case '#thunder':
            if (args.length == 1) return tobz.reply(from, `Ketik command ${prefix}thunder [text]`, id)
            const thund = body.slice(9)
            const thun = `https://akirainfo.site/thunder?apikey=e7d6410e4c5c&text=${thund}`
            await tobz.sendFileFromUrl(from, thun, `THUNDER.jpeg`, 'Udah Jadi Kak')
            break
        case '#blood':
            if (args.length == 1) return tobz.reply(from, `Ketik command ${prefix}blood [text]`, id)
            const bloo = body.slice(7)
            const blood = `https://akirainfo.site/blood?apikey=e7d6410e4c5c&text=${bloo}`
            await tobz.sendFileFromUrl(from, blood, `Blood.jpeg`, 'Udah Jadi Kak')
            break
        case '#hartatahta':
            const harta1 = body.slice(12)
            const harta = `https://api.zeks.xyz/api/hartatahta?text=${harta1}&apikey=apivinz`
            await tobz.sendFileFromUrl(from, harta, 'HartaTahta.jepg', 'udah jadi kak')
            break
        case '#snow':
            const nartu = body.slice(6)
            const naruto = `https://akirainfo.site/snow3d?apikey=e7d6410e4c5c&text=${nartu}`
            await tobz.sendFileFromUrl(from, naruto, `naruto.jpeg`, 'Udah Jadi Kak!')
            break
        case '#wood':
            const woo = body.slice(6)
            const woode = `https://akirainfo.site/wooden3d?apikey=e7d6410e4c5c&text=${woo}`
            await tobz.sendFileFromUrl(from, woode, `wooden.jpeg`, 'Udah Jadi Kak')
            break
        case '#hologram':
            const holo = body.slice(10)
            const holog = `https://akirainfo.site/hologram3d?apikey=e7d6410e4c5c&text=${holo}`
            await tobz.sendFileFromUrl(from, holog, `hologram.jpeg`, 'Udah Jadi Kak')
            break
        case '#minion':
            const mini = body.slice(8)
            const minion = `https://akirainfo.site/minion3d?apikey=e7d6410e4c5c&text=${mini}`
            await tobz.sendFileFromUrl(from, minion, `Minion.jpeg`, 'Udah Jadi Kak')
            break
        case '#neon':
            const neo = body.slice(6)
            const neon = `https://akirainfo.site/neon3d?apikey=e7d6410e4c5c&text=${neo}`
            await tobz.sendFileFromUrl(from, neon, `Neon.jpeg`, 'Udah Jadi Kak')
            break
        case '#luxury':
            const lux = body.slice(8)
            const luxu = `https://akirainfo.site/luxury3d?apikey=e7d6410e4c5c&text=${lux}`
            await tobz.sendFileFromUrl(from, luxu, `Luxury.jpeg`, 'Udah Jadi Kak')
            break
        case '#noel':
            const noe = body.slice(6)
            const noel = `https://akirainfo.site/noel3d?apikey=e7d6410e4c5c&text=${noe}`
            await tobz.sendFileFromUrl(from, noel, `noel.jpeg`, 'Udah Jadi Kak')
            break
        case '#box':
            const boo = body.slice(5)
            const box = `https://akirainfo.site/box3d?apikey=e7d6410e4c5c&text=${boo}`
            await tobz.sendFileFromUrl(from, box, `BOX.jpeg`, 'Udah Jadi Kak')
            break
	case '#summer':
            if (args.length == 1) return tobz.reply(from, `Ketik command ${prefix}blood [text]`, id)
            const sum = body.slice(8)
            const summer = await axios.get(`https://xinzbot-api.herokuapp.com/api/textmaker/alam?text=${sum}&theme=summer&apikey=XinzBot`)
            const summ = summer.data.result
            await tobz.sendFileFromUrl(from, summ.url, `Summer.jpg`, 'Udah Jadi Kak')
            break
	case '#naruto':
            if (args.length == 1) return tobz.reply(from, `Ketik command ${prefix}naruto [text]`, id)
            const nar = body.slice(8)
            const naru = `https://videfikri.com/api/textmaker/narutobanner/?text=${nar}`
            await tobz.sendFileFromUrl(from, naru, `NarutO.jpeg`, 'Udah Jadi Kak')
            break
        // ON OFF
        case '#nsfw':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (!isGroupAdmins) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan oleh Admin group!', id)
            if (args.length === 1) return tobz.reply(from, 'Pilih enable atau disable!', id)
            if (args[1].toLowerCase() === 'enable') {
                nsfw_.push(chat.id)
                fs.writeFileSync('./lib/nsfwz.json', JSON.stringify(nsfw_))
                tobz.reply(from, 'NSFW berhasil di aktifkan di group ini! kirim perintah *#nsfwMenu* untuk mengetahui menu', id)
            } else if (args[1].toLowerCase() === 'disable') {
                nsfw_.splice(chat.id, 1)
                fs.writeFileSync('./lib/nsfwz.json', JSON.stringify(nsfw_))
                tobz.reply(from, 'NSFW berhasil di nonaktifkan di group ini!', id)
            } else {
                tobz.reply(from, 'Pilih enable atau disable udin!', id)
            }
            break
        case '#simi':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (!isAdmin) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan oleh Admin Renge!', id) // Hanya Admin yang bisa mengaktifkan
            if (args.length === 1) return tobz.reply(from, 'Pilih enable atau disable!', id)
            if (args[1].toLowerCase() === 'enable') {
                simi_.push(chat.id)
                fs.writeFileSync('./lib/Simsimi.json', JSON.stringify(simi_))
                tobz.reply(from, 'Simsimi berhasil di aktifkan di group ini! Kirim perintah *# [teks]*\nContoh : *# halo*', id)
            } else if (args[1].toLowerCase() === 'disable') {
                simi_.splice(chat.id, 1)
                fs.writeFileSync('./lib/Simsimi.json', JSON.stringify(simi_))
                tobz.reply(from, 'Simsimi berhasil di nonaktifkan di group ini!', id)
            } else {
                tobz.reply(from, 'Pilih enable atau disable udin!', id)
            }
            break
        case '#group':
            if (!isGroupMsg) return tobz.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
            if (!isGroupAdmins) return tobz.reply(from, 'Fitur ini hanya bisa di gunakan oleh admin group', id)
            if (!isBotGroupAdmins) return tobz.reply(from, 'Fitur ini hanya bisa di gunakan ketika bot menjadi admin', id)
            if (args.length === 1) return tobz.reply(from, 'Pilih open atau close!', id)
            if (args[1].toLowerCase() === 'open') {
                tobz.setGroupToAdminsOnly(groupId, false)
                tobz.sendTextWithMentions(from, `Group telah dibuka oleh admin @${sender.id.replace('@c.us','')}\nSekarang *semua member* dapat mengirim pesan`)
            } else if (args[1].toLowerCase() === 'close') {
                tobz.setGroupToAdminsOnly(groupId, true)
                tobz.sendTextWithMentions(from, `Group telah ditutup oleh admin @${sender.id.replace('@c.us','')}\nSekarang *hanya admin* yang dapat mengirim pesan`)
            } else {
                tobz.reply(from, 'Pilih open atau disable close!', id)
            }
            break
        case '#afk':
            if (!isGroupMsg) return await tobz.reply(from, 'Maaf, fitur ini hanya bisa digunakan didalam Grup!', id)
            if (isAfkOn) return await tobz.reply(from, `${pushname} sekarang sedang *AFK (AWAY FROM KEYBOARD)*\n\nReason: ${reason}`, id)
            addAfk(sender.id, time, reason)
		tobz.sendTextWithMentions(from, `*@${sender.id.replace(/@c.us/g, '')} SEKARANG SEDANG AFK! (AWAY FROM KEYBOARD)*\n\n*Alasan: ${reason}*`)
		break
        case '#left':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (!isGroupAdmins) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan oleh Admin group!', id)
            if (args.length === 1) return tobz.reply(from, 'Pilih enable atau disable!', id)
            if (args[1].toLowerCase() === 'enable') {
                left.push(chat.id)
                fs.writeFileSync('./lib/left.json', JSON.stringify(left))
                tobz.reply(from, 'Fitur left berhasil di aktifkan di group ini!', id)
            } else if (args[1].toLowerCase() === 'disable') {
                left.splice(chat.id, 1)
                fs.writeFileSync('./lib/left.json', JSON.stringify(left))
                tobz.reply(from, 'Fitur left berhasil di nonaktifkan di group ini!', id)
            } else {
                tobz.reply(from, 'Pilih enable atau disable udin!', id)
            }
            break
        case '#welcome':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (!isGroupAdmins) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan oleh Admin group!', id)
            if (args.length === 1) return tobz.reply(from, 'Pilih enable atau disable!', id)
            if (args[1].toLowerCase() === 'enable') {
                welkom.push(chat.id)
                fs.writeFileSync('./lib/welcome.json', JSON.stringify(welkom))
                tobz.reply(from, 'Fitur welcome berhasil di aktifkan di group ini!', id)
            } else if (args[1].toLowerCase() === 'disable') {
                welkom.splice(chat.id, 1)
                fs.writeFileSync('./lib/welcome.json', JSON.stringify(welkom))
                tobz.reply(from, 'Fitur welcome berhasil di nonaktifkan di group ini!', id)
            } else {
                tobz.reply(from, 'Pilih enable atau disable udin!', id)
            }
            break
        // ANIME //
        case '#rhentai' :
        case '#randomhentai':
            if (!isGroupAdmins) return tobz.reply(from, 'Fitur ini hanya bisa di gunakan oleh admin group', id)
            if (!isGroupMsg) return tobz.reply(from, 'Pakenya digrub bambang!', id)
            if (!isNsfw) return tobz.reply(from, 'command/Perintah NSFW belum di aktifkan di group ini!', id)
            const hentai = await axios.get('http://api-melodicxt-2.herokuapp.com/api/random/hentai?&apiKey=administrator')
            const henta = hentai.data.result
            if (henta.result.endsWith('.png')) {
                var ext = '.png'
            } else {
                var ext = '.jpg'
            }
            tobz.sendImage(from, henta.result, `RandomHentai${ext}`, 'Random Hentai!', id)
            break
        case '#pinterest':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (isLimit(serial)) return tobz.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (args.length === 1) return tobz.reply(from, 'Kirim perintah *#pinterest [query]*\nContoh : *#pinterest Renge*', id)
            const ptrsq = body.slice(11)
            const ptrs = await axios.get('https://api.fdci.se/rep.php?gambar='+ptrsq)
            const b = JSON.parse(JSON.stringify(ptrs.data))
            const ptrs2 =  b[Math.floor(Math.random() * b.length)]
            const image = await bent("buffer")(ptrs2)
            const base64 = `data:image/jpg;base64,${image.toString("base64")}`
            tobz.sendImage(from, base64, 'ptrs.jpg', `*Pinterest*\n\n*Hasil Pencarian : ${ptrsq}*`)
            break
	case '#ahego':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            tobz.sendFileFromUrl(from, `https://https://zenzapi.xyz/api/random/ahegao?apikey=zenz`, 'LEWD.jpeg', '[ H3H3H3 BOII ]')
            break
        case '#lewd':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            tobz.sendFileFromUrl(from, `https://zenzapi.xyz/api/random/lewd?apikey=zenz`, 'LEWD.jpeg', '[ LEWD ]')
            break
        case '#hentaiass':
            if (!isNsfw) return tobz.reply(from, 'command/Perintah NSFW belum di aktifkan di group ini!', id)
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            tobz.sendFileFromUrl(from, `https://zenzapi.xyz/api/random/hentaiass?apikey=zenz`, 'HENTAIass.jpeg', '[ HENTAI ASS ]')
            break
        case '#yaoi':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            tobz.sendFileFromUrl(from, `https://zenzapi.xyz/api/random/yaoi2?apikey=zenz`, 'YaoI.jpeg', '[ YAOINYA NUMPANG LEWAT OM ]')
            break
        case '#loli':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            tobz.sendFileFromUrl(from, `https://zenzapi.xyz/api/random/loli?apikey=zenz`, 'loli.jpeg', '[ LOLINYA NUMPANG LEWAT OM ]')
            break
        case '#milf':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            tobz.sendFileFromUrl(from, `https://zenzapi.xyz/api/random/milf?apikey=zenz`, 'milf.jpeg', '[ MILFNYA NUMPANG LEWAT OM ]')
            break
        case '#yuri':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            tobz.sendFileFromUrl(from, `https://zenzapi.xyz/api/random/yuri?apikey=zenz`, 'YURi.jpeg', '[ YURINYA NUMPANG LEWAT OM ]')
            break
        case '#shota':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (isLimit(serial)) return tobz.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            const imageToBase64 = require('image-to-base64')
            var shouta = ['shota anime','anime shota'];
            var shotaa = shouta[Math.floor(Math.random() * shouta.length)];
            var urlshot = "https://api.fdci.se/rep.php?gambar=" + shotaa;
            
            axios.get(urlshot)
            .then((result) => {
            var sht = JSON.parse(JSON.stringify(result.data));
            var shotaak =  sht[Math.floor(Math.random() * sht.length)];
            imageToBase64(shotaak)
            .then(
                (response) => {
            let img = 'data:image/jpeg;base64,'+response
            tobz.sendFile(from, img, "shota.jpg", `*SHOTA*`, id)
                    }) 
                .catch(
                    (error) => {
                        console.log(error);
                    })
            })
            break
        case '#waifu':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (isLimit(serial)) return tobz.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            const waifu = await axios.get('http://api-melodicxt-2.herokuapp.com/api/waifu?&apiKey=administrator')
            const waif = waifu.data.result
            tobz.sendFileFromUrl(from, waif.image, 'Waifu.jpg', `➸ Name : ${waif.name}\n➸ Description : ${waif.description}\n\n➸ Source : ${waif.source}`, id)
            await limitAdd(serial)
            break
		case '#rkiss' :
        case '#randomkiss':
		    if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (isLimit(serial)) return tobz.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            const skiss = await axios.get('https://nekos.life/api/v2/img/kiss')
            const rkiss = skiss.data
            tobz.sendFileFromUrl(from, rkiss.url, `RandomKiss.gif`, 'Random Kiss!', id)
            await limitAdd(serial)
            break
        case '#husbu':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (isLimit(serial)) return tobz.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            const diti = fs.readFileSync('./lib/husbu.json')
            const ditiJsin = JSON.parse(diti)
            const rindIndix = Math.floor(Math.random() * ditiJsin.length)
            const rindKiy = ditiJsin[rindIndix]
            tobz.sendFileFromUrl(from, rindKiy.image, 'Husbu.jpg', rindKiy.teks, id)
            break
        case '#randomnekonime':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (isLimit(serial)) return tobz.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            const nekonime = await axios.get('http://api-melodicxt-2.herokuapp.com/api/random/neko?&apiKey=administrator')
            const nekon = nekonime.data.result
            if (nekon.result.endsWith('.png')) {
                var ext = '.png'
            } else {
                var ext = '.jpg'
            }
            tobz.sendFileFromUrl(from, nekon.result, `Nekonime${ext}`, 'Nekonime!', id)
            await limitAdd(serial)
            break
        case '#randomtrapnime':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (!isGroupAdmins) return tobz.reply(from, 'Fitur ini hanya bisa di gunakan oleh admin group', id)
            if (!isNsfw) return tobz.reply(from, 'command/Perintah NSFW belum di aktifkan di group ini!', id)
            if (isLimit(serial)) return tobz.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            const trapnime = await axios.get('http://api-melodicxt-2.herokuapp.com/api/random/trap?&apiKey=administrator')
            const trapn = trapnime.data.result
            if (trapn.result.endsWith('.png')) {
                var ext = '.png'
            } else {
                var ext = '.jpg'
            }
            tobz.sendImage(from, trapn.result, `trapnime${ext}`, 'Trapnime!', id)
            await limitAdd(serial)
            break
        case '#bj':
           try { 
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (!isGroupAdmins) return tobz.reply(from, 'Fitur ini hanya bisa di gunakan oleh admin group', id)
            if (!isNsfw) return tobz.reply(from, 'command/Perintah NSFW belum di aktifkan di group ini!', id)
            const res = await axios.get('https://nekos.life/api/v2/img/blowjob')
			const buffer = res.data.url
			tobz.sendImage(from, buffer, `Blowjob.png`, 'BJ !', id)
					} catch (e) {
						console.log(`Error :`, color(e,'red'))
						reply('𝗘𝗥𝗥𝗢𝗥')
					}
			break
        case '#randomnsfwneko':
        case '#rnsfwneko':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (!isGroupAdmins) return tobz.reply(from, 'Fitur ini hanya bisa di gunakan oleh admin group', id)
            if (!isNsfw) return tobz.reply(from, 'command/Perintah NSFW belum di aktifkan di group ini!', id)
            if (isLimit(serial)) return tobz.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            const nsfwneko = await axios.get('http://api-melodicxt-2.herokuapp.com/api/random/nsfwneko?&apiKey=' + melodickey)
            const nsfwn = nsfwneko.data.result
            if (nsfwn.result.endsWith('.png')) {
                var ext = '.png'
            } else {
                var ext = '.jpg'
            }
            tobz.sendImage(from, nsfwn.result, `NsfwNeko${ext}`, 'NsfwNeko!', id)
            await limitAdd(serial)
            break
        case '#randomanime':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const ranime = await axios.get('https://api.computerfreaker.cf/v1/anime')
            const ranimen = ranime.data
            if (ranimen.url.endsWith('.png')) {
                var ext = '.png'
            } else {
                var ext = '.jpg'
            }
            tobz.sendFileFromUrl(from, ranime.url, `RandomAnime${ext}`, 'Random Anime!', id)
            break
        case '#nhder':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (!isOwner) return tobz.reply(from, 'Sedang maintenance!', id)
            if (!isNsfw) return tobz.reply(from, 'command/Perintah NSFW belum di aktifkan di group ini!', id)
            if (isLimit(serial)) return tobz.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (args.length >=2){
                const code = args[1]
                const url = 'https://nhder.herokuapp.com/download/nhentai/'+code+'/zip'
                const short = []
                const shortener = await urlShortener(url)
                url['short'] = shortener
                short.push(url)
                const caption = `*NEKOPOI DOWNLOADER*\n\nLink: ${shortener}`
                tobz.sendText(from, caption)
            } else {
                tobz.sendText(from, 'Maaf tolong masukan code nuclear')
            }
            break
        case '#wallanime' :
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const walnime = ['https://wallpaperaccess.com/full/395986.jpg','https://wallpaperaccess.com/full/21628.jpg','https://wallpaperaccess.com/full/21622.jpg','https://wallpaperaccess.com/full/21612.jpg','https://wallpaperaccess.com/full/21611.png','https://wallpaperaccess.com/full/21597.jpg','https://cdn.nekos.life/wallpaper/QwGLg4oFkfY.png','https://wallpaperaccess.com/full/21591.jpg','https://cdn.nekos.life/wallpaper/bUzSjcYxZxQ.jpg','https://cdn.nekos.life/wallpaper/j49zxzaUcjQ.jpg','https://cdn.nekos.life/wallpaper/YLTH5KuvGX8.png','https://cdn.nekos.life/wallpaper/Xi6Edg133m8.jpg','https://cdn.nekos.life/wallpaper/qvahUaFIgUY.png','https://cdn.nekos.life/wallpaper/leC8q3u8BSk.jpg','https://cdn.nekos.life/wallpaper/tSUw8s04Zy0.jpg','https://cdn.nekos.life/wallpaper/sqsj3sS6EJE.png','https://cdn.nekos.life/wallpaper/HmjdX_s4PU4.png','https://cdn.nekos.life/wallpaper/Oe2lKgLqEXY.jpg','https://cdn.nekos.life/wallpaper/GTwbUYI-xTc.jpg','https://cdn.nekos.life/wallpaper/nn_nA8wTeP0.png','https://cdn.nekos.life/wallpaper/Q63o6v-UUa8.png','https://cdn.nekos.life/wallpaper/ZXLFm05K16Q.jpg','https://cdn.nekos.life/wallpaper/cwl_1tuUPuQ.png','https://cdn.nekos.life/wallpaper/wWhtfdbfAgM.jpg','https://cdn.nekos.life/wallpaper/3pj0Xy84cPg.jpg','https://cdn.nekos.life/wallpaper/sBoo8_j3fkI.jpg','https://cdn.nekos.life/wallpaper/gCUl_TVizsY.png','https://cdn.nekos.life/wallpaper/LmTi1k9REW8.jpg','https://cdn.nekos.life/wallpaper/sbq_4WW2PUM.jpg','https://cdn.nekos.life/wallpaper/QOSUXEbzDQA.png','https://cdn.nekos.life/wallpaper/khaqGIHsiqk.jpg','https://cdn.nekos.life/wallpaper/iFtEXugqQgA.png','https://cdn.nekos.life/wallpaper/deFKIDdRe1I.jpg','https://cdn.nekos.life/wallpaper/OHZVtvDm0gk.jpg','https://cdn.nekos.life/wallpaper/YZYa00Hp2mk.jpg','https://cdn.nekos.life/wallpaper/R8nPIKQKo9g.png','https://cdn.nekos.life/wallpaper/_brn3qpRBEE.jpg','https://cdn.nekos.life/wallpaper/ADTEQdaHhFI.png','https://cdn.nekos.life/wallpaper/MGvWl6om-Fw.jpg','https://cdn.nekos.life/wallpaper/YGmpjZW3AoQ.jpg','https://cdn.nekos.life/wallpaper/hNCgoY-mQPI.jpg','https://cdn.nekos.life/wallpaper/3db40hylKs8.png','https://cdn.nekos.life/wallpaper/iQ2FSo5nCF8.jpg','https://cdn.nekos.life/wallpaper/meaSEfeq9QM.png','https://cdn.nekos.life/wallpaper/CmEmn79xnZU.jpg','https://cdn.nekos.life/wallpaper/MAL18nB-yBI.jpg','https://cdn.nekos.life/wallpaper/FUuBi2xODuI.jpg','https://cdn.nekos.life/wallpaper/ez-vNNuk6Ck.jpg','https://cdn.nekos.life/wallpaper/K4-z0Bc0Vpc.jpg','https://cdn.nekos.life/wallpaper/Y4JMbswrNg8.jpg','https://cdn.nekos.life/wallpaper/ffbPXIxt4-0.png','https://cdn.nekos.life/wallpaper/x63h_W8KFL8.jpg','https://cdn.nekos.life/wallpaper/lktzjDRhWyg.jpg','https://cdn.nekos.life/wallpaper/j7oQtvRZBOI.jpg','https://cdn.nekos.life/wallpaper/MQQEAD7TUpQ.png','https://cdn.nekos.life/wallpaper/lEG1-Eeva6Y.png','https://cdn.nekos.life/wallpaper/Loh5wf0O5Aw.png','https://cdn.nekos.life/wallpaper/yO6ioREenLA.png','https://cdn.nekos.life/wallpaper/4vKWTVgMNDc.jpg','https://cdn.nekos.life/wallpaper/Yk22OErU8eg.png','https://cdn.nekos.life/wallpaper/Y5uf1hsnufE.png','https://cdn.nekos.life/wallpaper/xAmBpMUd2Zw.jpg','https://cdn.nekos.life/wallpaper/f_RWFoWciRE.jpg','https://cdn.nekos.life/wallpaper/Y9qjP2Y__PA.jpg','https://cdn.nekos.life/wallpaper/eqEzgohpPwc.jpg','https://cdn.nekos.life/wallpaper/s1MBos_ZGWo.jpg','https://cdn.nekos.life/wallpaper/PtW0or_Pa9c.png','https://cdn.nekos.life/wallpaper/32EAswpy3M8.png','https://cdn.nekos.life/wallpaper/Z6eJZf5xhcE.png','https://cdn.nekos.life/wallpaper/xdiSF731IFY.jpg','https://cdn.nekos.life/wallpaper/Y9r9trNYadY.png','https://cdn.nekos.life/wallpaper/8bH8CXn-sOg.jpg','https://cdn.nekos.life/wallpaper/a02DmIFzRBE.png','https://cdn.nekos.life/wallpaper/MnrbXcPa7Oo.png','https://cdn.nekos.life/wallpaper/s1Tc9xnugDk.jpg','https://cdn.nekos.life/wallpaper/zRqEx2gnfmg.jpg','https://cdn.nekos.life/wallpaper/PtW0or_Pa9c.png','https://cdn.nekos.life/wallpaper/0ECCRW9soHM.jpg','https://cdn.nekos.life/wallpaper/kAw8QHl_wbM.jpg','https://cdn.nekos.life/wallpaper/ZXcaFmpOlLk.jpg','https://cdn.nekos.life/wallpaper/WVEdi9Ng8UE.png','https://cdn.nekos.life/wallpaper/IRu29rNgcYU.png','https://cdn.nekos.life/wallpaper/LgIJ_1AL3rM.jpg','https://cdn.nekos.life/wallpaper/DVD5_fLJEZA.jpg','https://cdn.nekos.life/wallpaper/siqOQ7k8qqk.jpg','https://cdn.nekos.life/wallpaper/CXNX_15eGEQ.png','https://cdn.nekos.life/wallpaper/s62tGjOTHnk.jpg','https://cdn.nekos.life/wallpaper/tmQ5ce6EfJE.png','https://cdn.nekos.life/wallpaper/Zju7qlBMcQ4.jpg','https://cdn.nekos.life/wallpaper/CPOc_bMAh2Q.png','https://cdn.nekos.life/wallpaper/Ew57S1KtqsY.jpg','https://cdn.nekos.life/wallpaper/hVpFbYJmZZc.jpg','https://cdn.nekos.life/wallpaper/sb9_J28pftY.jpg','https://cdn.nekos.life/wallpaper/JDoIi_IOB04.jpg','https://cdn.nekos.life/wallpaper/rG76AaUZXzk.jpg','https://cdn.nekos.life/wallpaper/9ru2luBo360.png','https://cdn.nekos.life/wallpaper/ghCgiWFxGwY.png','https://cdn.nekos.life/wallpaper/OSR-i-Rh7ZY.png','https://cdn.nekos.life/wallpaper/65VgtPyweCc.jpg','https://cdn.nekos.life/wallpaper/3vn-0FkNSbM.jpg','https://cdn.nekos.life/wallpaper/u02Y0-AJPL0.jpg','https://cdn.nekos.life/wallpaper/_-Z-0fGflRc.jpg','https://cdn.nekos.life/wallpaper/3VjNKqEPp58.jpg','https://cdn.nekos.life/wallpaper/NoG4lKnk6Sc.jpg','https://cdn.nekos.life/wallpaper/xiTxgRMA_IA.jpg','https://cdn.nekos.life/wallpaper/yq1ZswdOGpg.png','https://cdn.nekos.life/wallpaper/4SUxw4M3UMA.png','https://cdn.nekos.life/wallpaper/cUPnQOHNLg0.jpg','https://cdn.nekos.life/wallpaper/zczjuLWRisA.jpg','https://cdn.nekos.life/wallpaper/TcxvU_diaC0.png','https://cdn.nekos.life/wallpaper/7qqWhEF_uoY.jpg','https://cdn.nekos.life/wallpaper/J4t_7DvoUZw.jpg','https://cdn.nekos.life/wallpaper/xQ1Pg5D6J4U.jpg','https://cdn.nekos.life/wallpaper/aIMK5Ir4xho.jpg','https://cdn.nekos.life/wallpaper/6gneEXrNAWU.jpg','https://cdn.nekos.life/wallpaper/PSvNdoISWF8.jpg','https://cdn.nekos.life/wallpaper/SjgF2-iOmV8.jpg','https://cdn.nekos.life/wallpaper/vU54ikOVY98.jpg','https://cdn.nekos.life/wallpaper/QjnfRwkRU-Q.jpg','https://cdn.nekos.life/wallpaper/uSKqzz6ZdXc.png','https://cdn.nekos.life/wallpaper/AMrcxZOnVBE.jpg','https://cdn.nekos.life/wallpaper/N1l8SCMxamE.jpg','https://cdn.nekos.life/wallpaper/n2cBaTo-J50.png','https://cdn.nekos.life/wallpaper/ZXcaFmpOlLk.jpg','https://cdn.nekos.life/wallpaper/7bwxy3elI7o.png','https://cdn.nekos.life/wallpaper/7VW4HwF6LcM.jpg','https://cdn.nekos.life/wallpaper/YtrPAWul1Ug.png','https://cdn.nekos.life/wallpaper/1p4_Mmq95Ro.jpg','https://cdn.nekos.life/wallpaper/EY5qz5iebJw.png','https://cdn.nekos.life/wallpaper/aVDS6iEAIfw.jpg','https://cdn.nekos.life/wallpaper/veg_xpHQfjE.jpg','https://cdn.nekos.life/wallpaper/meaSEfeq9QM.png','https://cdn.nekos.life/wallpaper/Xa_GtsKsy-s.png','https://cdn.nekos.life/wallpaper/6Bx8R6D75eM.png','https://cdn.nekos.life/wallpaper/zXOGXH_b8VY.png','https://cdn.nekos.life/wallpaper/VQcviMxoQ00.png','https://cdn.nekos.life/wallpaper/CJnRl-PKWe8.png','https://cdn.nekos.life/wallpaper/zEWYfFL_Ero.png','https://cdn.nekos.life/wallpaper/_C9Uc5MPaz4.png','https://cdn.nekos.life/wallpaper/zskxNqNXyG0.jpg','https://cdn.nekos.life/wallpaper/g7w14PjzzcQ.jpg','https://cdn.nekos.life/wallpaper/KavYXR_GRB4.jpg','https://cdn.nekos.life/wallpaper/Z_r9WItzJBc.jpg','https://cdn.nekos.life/wallpaper/Qps-0JD6834.jpg','https://cdn.nekos.life/wallpaper/Ri3CiJIJ6M8.png','https://cdn.nekos.life/wallpaper/ArGYIpJwehY.jpg','https://cdn.nekos.life/wallpaper/uqYKeYM5h8w.jpg','https://cdn.nekos.life/wallpaper/h9cahfuKsRg.jpg','https://cdn.nekos.life/wallpaper/iNPWKO8d2a4.jpg','https://cdn.nekos.life/wallpaper/j2KoFVhsNig.jpg','https://cdn.nekos.life/wallpaper/z5Nc-aS6QJ4.jpg','https://cdn.nekos.life/wallpaper/VUFoK8l1qs0.png','https://cdn.nekos.life/wallpaper/rQ8eYh5mXN8.png','https://cdn.nekos.life/wallpaper/D3NxNISDavQ.png','https://cdn.nekos.life/wallpaper/Z_CiozIenrU.jpg','https://cdn.nekos.life/wallpaper/np8rpfZflWE.jpg','https://cdn.nekos.life/wallpaper/ED-fgS09gik.jpg','https://cdn.nekos.life/wallpaper/AB0Cwfs1X2w.jpg','https://cdn.nekos.life/wallpaper/DZBcYfHouiI.jpg','https://cdn.nekos.life/wallpaper/lC7pB-GRAcQ.png','https://cdn.nekos.life/wallpaper/zrI-sBSt2zE.png','https://cdn.nekos.life/wallpaper/_RJhylwaCLk.jpg','https://cdn.nekos.life/wallpaper/6km5m_GGIuw.png','https://cdn.nekos.life/wallpaper/3db40hylKs8.png','https://cdn.nekos.life/wallpaper/oggceF06ONQ.jpg','https://cdn.nekos.life/wallpaper/ELdH2W5pQGo.jpg','https://cdn.nekos.life/wallpaper/Zun_n5pTMRE.png','https://cdn.nekos.life/wallpaper/VqhFKG5U15c.png','https://cdn.nekos.life/wallpaper/NsMoiW8JZ60.jpg','https://cdn.nekos.life/wallpaper/XE4iXbw__Us.png','https://cdn.nekos.life/wallpaper/a9yXhS2zbhU.jpg','https://cdn.nekos.life/wallpaper/jjnd31_3Ic8.jpg','https://cdn.nekos.life/wallpaper/Nxanxa-xO3s.png','https://cdn.nekos.life/wallpaper/dBHlPcbuDc4.jpg','https://cdn.nekos.life/wallpaper/6wUZIavGVQU.jpg','https://cdn.nekos.life/wallpaper/_-Z-0fGflRc.jpg','https://cdn.nekos.life/wallpaper/H9OUpIrF4gU.jpg','https://cdn.nekos.life/wallpaper/xlRdH3fBMz4.jpg','https://cdn.nekos.life/wallpaper/7IzUIeaae9o.jpg','https://cdn.nekos.life/wallpaper/FZCVL6PyWq0.jpg','https://cdn.nekos.life/wallpaper/5dG-HH6d0yw.png','https://cdn.nekos.life/wallpaper/ddxyA37HiwE.png','https://cdn.nekos.life/wallpaper/I0oj_jdCD4k.jpg','https://cdn.nekos.life/wallpaper/ABchTV97_Ts.png','https://cdn.nekos.life/wallpaper/58C37kkq39Y.png','https://cdn.nekos.life/wallpaper/HMS5mK7WSGA.jpg','https://cdn.nekos.life/wallpaper/1O3Yul9ojS8.jpg','https://cdn.nekos.life/wallpaper/hdZI1XsYWYY.jpg','https://cdn.nekos.life/wallpaper/h8pAJJnBXZo.png','https://cdn.nekos.life/wallpaper/apO9K9JIUp8.jpg','https://cdn.nekos.life/wallpaper/p8f8IY_2mwg.jpg','https://cdn.nekos.life/wallpaper/HY1WIB2r_cE.jpg','https://cdn.nekos.life/wallpaper/u02Y0-AJPL0.jpg','https://cdn.nekos.life/wallpaper/jzN74LcnwE8.png','https://cdn.nekos.life/wallpaper/IeAXo5nJhjw.jpg','https://cdn.nekos.life/wallpaper/7lgPyU5fuLY.jpg','https://cdn.nekos.life/wallpaper/f8SkRWzXVxk.png','https://cdn.nekos.life/wallpaper/ZmDTpGGeMR8.jpg','https://cdn.nekos.life/wallpaper/AMrcxZOnVBE.jpg','https://cdn.nekos.life/wallpaper/ZhP-f8Icmjs.jpg','https://cdn.nekos.life/wallpaper/7FyUHX3fE2o.jpg','https://cdn.nekos.life/wallpaper/CZoSLK-5ng8.png','https://cdn.nekos.life/wallpaper/pSNDyxP8l3c.png','https://cdn.nekos.life/wallpaper/AhYGHF6Fpck.jpg','https://cdn.nekos.life/wallpaper/ic6xRRptRes.jpg','https://cdn.nekos.life/wallpaper/89MQq6KaggI.png','https://cdn.nekos.life/wallpaper/y1DlFeHHTEE.png']
            let walnimek = walnime[Math.floor(Math.random() * walnime.length)]
            tobz.sendFileFromUrl(from, walnimek, 'Nimek.jpg', '', id)
            break
        case '#darkjoke':
			if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const dmeme = await axios.get('https://h4ck3rs404-api.herokuapp.com/api/darkjoke?apikey=404Api')
            const darkj = dmeme.data.result
            tobz.sendFileFromUrl(from, darkj, 'Darkjoke.png', '',  id)
            break
        case '#meme':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            await limitAdd(serial)
            const response = await axios.get('https://meme-api.herokuapp.com/gimme/wholesomeanimemes')
            const { postlink, title, subreddit, url, nsfw, spoiler } = response.data
            tobz.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`)
            break
        case '#quoteanime':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (isLimit(serial)) return tobz.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
                        if(args[1]){
                            if(args[1] === 'anime'){
                                const anime = body.slice(13)
                                axios.get('https://animechanapi.xyz/api/quotes?anime='+anime).then(({ data }) => {
                                    let quote = data.data[0].quote 
                                    let char = data.data[0].character
                                    let anime = data.data[0].anime
                                    tobz.sendText(from, `"${quote}"\n\nCharacter : ${char}\nAnime : ${anime}`)
                                }).catch(err => {
                                    tobz.sendText('Quote Char/Anime tidak ditemukan!')
                                })
                            }else{
                                const char = body.slice(12)
                                axios.get('https://animechanapi.xyz/api/quotes?char='+char).then(({ data }) => {
                                    let quote = data.data[0].quote 
                                    let char = data.data[0].character
                                    let anime = data.data[0].anime
                                    tobz.sendText(from, `"${quote}"\n\nCharacter : ${char}\nAnime : ${anime}`)
                                }).catch(err => {
                                    tobz.sendText('Quote Char/Anime tidak ditemukan!')
                                })
                            }
                        }else{
                            axios.get('https://animechanapi.xyz/api/quotes/random').then(({ data }) => {
                                let penyanyi = data.result[0].penyanyi 
                                let judul = data.result[0].judul
                                let linkimg = data.result[0].linkImg
                                let lagu = data.result[0].linkMp3 
                                let size = data.result[0].filesize
                                let durasi = data.result[0].duration
                                tobz.sendText(from, `"${quote}"\n\nCharacter : ${char}\nAnime : ${anime}`)                               
                            }).catch(err => {
                                console.log(err)
                            })
                        }
            break
        case '#malanime':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (isLimit(serial)) return tobz.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            const keyword = message.body.replace('#malanime', '')
            try {
            const data = await fetch(
           `https://api.jikan.moe/v3/search/anime?q=${keyword}`
            )
            const parsed = await data.json()
            if (!parsed) {
              await tobz.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, Anime tidak ditemukan', id)
              return null
              }
            const { title, synopsis, episodes, url, rated, score, image_url } = parsed.results[0]
            const content = `*Anime Ditemukan!*
✨️ *Title:* ${title}
🎆️ *Episodes:* ${episodes}
💌️ *Rating:* ${rated}
❤️ *Score:* ${score}
💚️ *Synopsis:* ${synopsis}
🌐️ *URL*: ${url}`

            const image = await bent("buffer")(image_url)
            const base64 = `data:image/jpg;base64,${image.toString("base64")}`
            tobz.sendImage(from, base64, title, content)
           } catch (err) {
             console.error(err.message)
             await tobz.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, Anime tidak ditemukan')
           }
          break
        case '#malcharacter':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (isLimit(serial)) return tobz.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            const keywords = message.body.replace('#malcharacter', '')
            try {
            const data = await fetch(
           `https://api.jikan.moe/v3/search/character?q=${keywords}`
            )
            const parsed = await data.json()
            if (!parsed) {
              await tobz.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, Anime tidak ditemukan', id)
              return null
              }
            const { name, alternative_names, url, image_url } = parsed.results[0]
            const contentt = `*Anime Ditemukan!*

✨️ *Name:* ${name}
💌️ *Alternative Names:* ${alternative_names}
🌐️ *URL*: ${url}`

            const image = await bent("buffer")(image_url)
            const base64 = `data:image/jpg;base64,${image.toString("base64")}`
            tobz.sendImage(from, base64, name, contentt)
           } catch (err) {
             console.error(err.message)
             await tobz.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, Anime tidak ditemukan')
           }
          break
        // MEDIA //
	case '#asupan':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa dijalankan didalam grup!', id)
            await tobz.reply(from, 'Matte nee onii-sama', id)
            const asuu = await axios.get(`https://leyscoders-api.herokuapp.com/api/asupan?apikey=OneDayOneCharity`)
            const asu1 = asuu.data.result
            await tobz.sendFileFromUrl(from, asu1, `Asupan.mp4`, 'CAKEP YA KAK :3')
            break
        case '#nulis':
            if (args.length === 1) return tobz.reply(from, 'Kirim perintah *#nulis [teks]*', id)
            const nulis = encodeURIComponent(body.slice(7))
            tobz.reply(from, mess.wait, id)
            const urlnulis = `https://api.zeks.xyz/api/nulis?text=${nulis}&apikey=apivinz`
            await tobz.sendFileFromUrl(from, urlnulis, 'Nulis.jpeg', 'Nih anjim')
            break
        case '#shorturl':
        case '#shortlink':
            if (args.length === 1) return tobz.reply(from, 'Kirim perintah *#shortlink [linkWeb]*\nContoh : *#bitly https://neonime.vip*', id)
            const shorturl1 = body.slice(10)
            const bitly1 = await axios.get('https://zahirr-web.herokuapp.com/api/short/tiny?url='+ shorturl1 +'&apikey=zahirgans')
            const bitly2 = bitly1.data.result
            const surl2 = `Link : ${shorturl1}\nShort URL : ${bitly2.link}`
            tobz.sendText(from, surl2, id)
            await limitAdd(serial)
            break
        case '#cuaca':
            if (args.length === 1) return tobz.reply(from, 'Kirim perintah *#cuaca [tempat]*\nContoh : *#cuaca tangerang', id)
            const tempat = body.slice(7)
            const weather = await axios.get('http://docs-jojo.herokuapp.com/api/cuaca?q='+ tempat)
            const weatherr = weather.data.result
            if (weatherr.error) {
                tobz.reply(from, weatherr.error, id)
            } else {
                tobz.reply(from, `➸ Tempat : ${weatherr.tempat}\n\n➸ Angin : ${weatherr.angin}\n➸ Cuaca : ${weatherr.cuaca}\n➸ Deskripsi : ${weatherr.desk}\n➸ Kelembapan : ${weatherr.kelembapan}\n➸ Suhu : ${weatherr.suhu}\n➸ Udara : ${weatherr.udara}`, id)
                limitAdd(serial)
            }
            break
        case '#covid':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group', id)
            if (isLimit(serial)) return tobz.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            arg = body.trim().split(' ')
            console.log(...arg[1])
            var slicedArgs = Array.prototype.slice.call(arg, 1);
            console.log(slicedArgs)
            const country = await slicedArgs.join(' ')
            console.log(country)
            const response2 = await axios.get('https://coronavirus-19-api.herokuapp.com/countries/' + country + '/')
            const { cases, todayCases, deaths, todayDeaths, active } = response2.data
                await tobz.sendText(from, '🌎️ Covid Info - ' + country + ' 🌍️\n\n✨️ Total Cases: ' + `${cases}` + '\n📆️ Today\'s Cases: ' + `${todayCases}` + '\n☣️ Total Deaths: ' + `${deaths}` + '\n☢️ Today\'s Deaths: ' + `${todayDeaths}` + '\n⛩️ Active Cases: ' + `${active}` + '.')
            break
        case '#spamcall':
            if (!isOwner, !isAdmin) return tobz.reply(from, 'Perintah ini hanya untuk Owner & Admin bot', id)
            const spam = body.slice(10)
            const call2 = await axios.get('https://h4ck3rs404-api.herokuapp.com/api/spamcall?number='+spam+'&apikey=404Api')
            const logs  = call2.data.result
                await tobz.sendText(from, logs, id)
            break
	case '#play':
            if (!isGroupMsg) return tobz.reply(from, `Maaf command ini hanya bisa digunakan di dalam grup!`, id)
            if (args.length == 1) return tobz.reply(from, `Untuk mencari lagu dari youtube\n\nPenggunaan: #play judul lagu`, id)
            try {
                const serplay = body.slice(6)
                const webplay = await fetch(`https://leyscoders-api.herokuapp.com/api/playmp3?q=${serplay}&apikey=OneDayOneCharity`)
                if (!webplay.ok) throw new Error(`Error Play : ${webplay.statusText}`)
                const webplay2 = await webplay.json()
                 if (webplay2.status == false) {
                    tobz.reply(from, `*Maaf Terdapat kesalahan saat mengambil data, mohon pilih media lain...*`, id)
                } else {
                    const { thumb, audio, title, duration } = await webplay2.result
                    const captplay = `*「 PLAY 」*\n\n• *Judul* : ${title}\n• *Durasi* : ${duration}\n\n_*Music Sedang Dikirim*_`
                    tobz.sendFileFromUrl(from, thumb, `thumbnail.jpeg`, captplay, id)
                    await tobz.sendFileFromUrl(from, audio, `${title}.mp3`, '').catch(() => tobz.reply(from, mess.error.Yt4, id))
                }
            } catch (err) {
                tobz.sendText(ownerNumber, 'Error Play : '+ err)
                tobz.reply(from, 'Jangan meminta lagu yang sama dengan sebelumnya!', id)
            }
            break   		
        case '#ytmp3':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (isLimit(serial)) return tobz.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (args.length === 1) return tobz.reply(from, 'Kirim perintah *#ytmp3 [linkYt]*, untuk contoh silahkan kirim perintah *#readme*')
            let isLinks = args[1].match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/)
            if (!isLinks) return tobz.reply(from, mess.error.Iv, id)
            try {
                tobz.reply(from, mess.wait, id)
                const resp = await axios.get('https://tobz-api.herokuapp.com/api/yta?url=${args[1]}&apikey=' + tobzkey)
                if (resp.data.error) {
                    tobz.reply(from, resp.data.error, id)
                } else {
                    if (Number(resp.data.filesize.split(' MB')[0]) >= 10.00) return tobz.reply(from, 'Maaf durasi video sudah melebihi batas maksimal 10 MB!', id)
                    const { title, thumb, result, filesize } = await resp.data
                    tobz.sendFileFromUrl(from, thumb, 'thumb.jpg', `➸ *Judul* : ${title}\n➸ *Filesize* : ${filesize}\n\nSilahkan tunggu sebentar proses pengiriman file membutuhkan waktu beberapa menit.`, id)
                    await tobz.sendFileFromUrl(from, result, `${title}.mp3`, id).catch(() => tobz.reply(from, mess.error.Yt3, id))
                }
            } catch (err) {
                tobz.sendText(ownerNumber, 'Error ytmp3 : '+ err)
                tobz.reply(from, mess.error.Yt3, id)
            }
            break			        
        case '#translate':
                if(args[1] == undefined || args[2] == undefined) return
                if(args.length >= 2){
                    var codelang = args[1]
                    var textai = body.slice(11+codelang.length);
                    translatte(textai, {to: codelang}).then(res => {
                        tobz.sendText(from,res.text);
                        limitAdd(serial)
                    }).catch(err => {
                         tobz.sendText(from,`[ERROR] Teks tidak ada, atau kode bahasa ${codelang} tidak support\n~> *#bahasa* untuk melihat list kode bahasa`);
                    });
                }
                break
        case '#ytmp4':
            if (args.length === 1) return tobz.reply(from, `Kirim perintah #ytmp4 [ Link Yt ]*, untuk contoh silahkan kirim perintah *#readme*`)
            let isLin = args[1].match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/)
            if (!isLin) return tobz.reply(from, mess.error.Iv, id)
            try {
                tobz.reply(from, mess.wait, id)
                const ytvh = await fetch(`https://tobz-api.herokuapp.com/api/ytv?url=${args[1]}&apikey=` + tobzkey)
                if (!ytvh.ok) throw new Error(`Error YTMP4 : ${ytvh.statusText}`)
                const ytvh2 = await ytvh.json()
                 if (ytvh2.status == false) {
                    tobz.reply(from, `*Maaf Terdapat kesalahan saat mengambil data, mohon pilih media lain...*`, id)
                } else {
                    const { title, UrlVideo, thumb, size, status, ext } = await ytvh.data.result
                    console.log(`VHTEAR : ${ext}\n${size}\n${status}`)
                    tobz.sendFileFromUrl(from, thumb, 'thumb.jpg', `*「 YOUTUBE MP4 」*\n\n• *Judul* : ${title}\n• *Filesize* : ${size}\n\n*Link* : ${UrlVideo}`, id)
                    await tobz.sendFileFromUrl(from, '', id).catch(() => tobz.reply(from, mess.error.Yt4, id))
                    await limitAdd(serial)
                }
            } catch (err) {
                tobz.sendText(ownerNumber, 'Error ytmp4 : '+ err)
                tobz.reply(from, 'Jangan download video yang sama dengan sebelumnya!', id)
            }
            break
        case '#ramalpasangan':
            if (isLimit(serial)) return tobz.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if (args.length === 1) return tobz.reply(from, 'Kirim perintah *#ramalpasangan [kamu|pasangan]*\nContoh : *#ramalpasangan Lucky|Renge*', id)
            arg = body.trim().split('|')
            if (arg.length >= 2) {
            tobz.reply(from, mess.wait, id)
            const kamu = arg[0]
            const pacar = arg[1]
            const rpmn = rate[Math.floor(Math.random() * (rate.length))]
            const rpmn2 = rate[Math.floor(Math.random() * (rate.length))]
            const rpmn3 = rate[Math.floor(Math.random() * (rate.length))]
            const rpmn4 = rate[Math.floor(Math.random() * (rate.length))]
            const rpmn5 = rate[Math.floor(Math.random() * (rate.length))]
            const rpmn6 = rate[Math.floor(Math.random() * (rate.length))]
            const rjh2 = `*Hasil Pengamatan!*\nPasangan dengan nama ${kamu} dan ${pacar}\n\n➸ Cinta : ${rpmn}\n➸ Jodoh : ${rpmn2}\n➸ Kemiripan : ${rpmn3}\n➸ Kesukaan : ${rpmn4}\n➸ Kesamaan : ${rpmn5}\n➸ Kebucinan ${rpmn6}`
            tobz.reply(from, rjh2, id)
            } else {
            await tobz.reply(from, 'Wrong Format!', id)
            }
            break
        case '#artinama':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (args.length === 1) return tobz.reply(from, 'Kirim perintah *#artinama [query]*\nContoh : *#artinama Tobz*', id)
            try {
            const resp = await axios.get('http://docs-jojo.herokuapp.com/api/artinama?nama='+ body.slice(9))
            if (resp.data.error) return tobz.reply(from, resp.data.error, id)
            const anm2 = `➸ Artinama : ${resp.data.result}`
            tobz.reply(from, anm2, id)
            } catch (err) {
                console.error(err.message)
                await tobz.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, User tidak ditemukan')
                tobz.sendText(ownerNumber, 'Artinama Error : ' + err)
           }
            break
        case '#fb':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (args.length === 1) return tobz.reply(from, 'Kirim perintah *#fb [linkFb]*\nContoh : *#fb https://www.facebook.com/24609282673/posts/10158628585367674/*', id)
            try {
            tobz.reply(from, mess.wait, id)
            const resp = await axios.get('https://mhankbarbar.herokuapp.com/api/epbe?url=' + body.slice(4) + '&apiKey=' + barbarkey)
            const epbe2 = `*Video Ditemukan!*\n➸ Judul : ${resp.data.title}\n➸ Filesize : ${resp.data.filesize}`
            tobz.sendFileFromUrl(from, resp.data.result, `${resp.data.titparsed}.mp4`, epbe2, id)
            } catch (err) {
             console.error(err.message)
             await tobz.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, Video tidak ditemukan')
             tobz.sendText(ownerNumber, 'Facebook Error : ' + err)
           }
            break
        case '#tiktok':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (args.length === 1) return tobz.reply(from, 'Kirim perintah *#tiktok [linkTiktok]*\nContoh : *#tiktok https://vt.tiktok.com/yqyjPX/*', id)
            try {
            tobz.reply(from, mess.wait, id)
            const resp = await axios.get('https://api.vhtear.com/tiktokdl?link=' + body.slice(8) + '&apikey=' + vhtearkey)
            const { dibuat, duration, title, desk, video, image  } = resp.data.result
            const tpk = `*Video Ditemukan!*

➸ Judul : ${title}
➸ Deskripsi : ${desk}
➸ Durasi : ${duration}
➸ Dibuat : ${dibuat}

Menunggu video...`
            
            const pictk = await bent("buffer")(image)
            const base64 = `data:image/jpg;base64,${pictk.toString("base64")}`
            tobz.sendImage(from, base64, title, tpk)
            tobz.sendFIle(from, video, `${title}.mp4`, '', id)
            } catch (err) {
             console.error(err.message)
             await tobz.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, Video tidak ditemukan')
             tobz.sendText(ownerNumber, 'Tiktok Error : ' + err)
           }
            break
        case '#wiki':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (args.length === 1) return tobz.reply(from, 'Kirim perintah *#wiki [query]*\nContoh : *#wiki asu*', id)
            const queryz_ = body.slice(6)
            const wiki = await axios.get(`http://docs-jojo.herokuapp.com/api/wiki?q=${queryz_}`)
            if (wiki.data.error) {
                tobz.reply(from, wiki.data.error, id)
            } else {
                tobz.sendText(from, `➸ *Query* : ${queryz_}\n\n➸ *Result* : ${wiki.data.result}`, id)
            }
            break
        case '#kbbi':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (args.length === 1) return tobz.reply(from, 'Kirim perintah *#wiki [query]*\nContoh : *#wiki asu*', id)
            const kbbl = body.slice(6)
            const kbbl2 = await axios.get(`https://mnazria.herokuapp.com/api/kbbi?search=${kbbl}`)

            if (kbbl2.data.error) {
                tobz.reply(from, kbbl2.data.error, id)
            } else {
                tobz.sendText(from, `➸ *Query* : ${kbbl}\n\n➸ *Result* : ${kbbl2.data.result}`, id)
            }
            break
        case '#googleimage':
            if (args.length === 1) return tobz.reply(from, 'Kirim perintah *#googleimage [query]*\nContoh : *#googleimage Renge*', id)
            try{
                tobz.reply(from, mess.wait, id)
                const gimgg = body.slice(13)
                const gamb = `http://lolhuman.herokuapp.com/api/gimage?apikey=1fa88fe753de43a8973d7240&query=${gimgg}`
                const gimg = await axios.get(gamb)
                var gimg2 = Math.floor(Math.random() * gimg.data.result.result_search.length)
                console.log(gimg2)
                await tobz.sendFileFromUrl(from, gimg.data.result.result_search[gimg2], `gam.${gimg.data.result.result_search[gimg2]}`, `*Google Image*\n\n*Hasil Pencarian : ${gimgg}*`, id)
            } catch (err) {
                console.log(err); 
                tobz.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, Gambar tidak ditemukan')
                tobz.sendText(ownerNumber, 'Google Image Error : ' + err)
            }
          break

        case '#tiktokstalk': []
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (args.length === 1)  return tobz.reply(from, 'Kirim perintah *#tiktokstalk @username*\nContoh *#tiktokstalk @duar_amjay*', id)
            arg = body.trim().split(' ')
            console.log(...arg[1])
            var slicedArgs = Array.prototype.slice.call(arg, 1);
            console.log(slicedArgs)
            const tstalk = await slicedArgs.join(' ')
            console.log(tstalk)
            try {
            const tstalk2 = await axios.get('https://api.vhtear.com/tiktokprofile?query=' + tstalk + '&apikey=' + vhtearkey)
            const { username, bio, follow, follower, title, like_count, video_post, description, picture, url_account } = tstalk2.data.result
            const tiktod = `*User Ditemukan!*
➸ *Username:* ${username}
➸ *Judul:* ${title}
➸ *Bio:* ${bio}
➸ *Mengikuti:* ${follow}
➸ *Pengikut:* ${follower}
➸ *Jumlah Like*: ${like_count}
➸ *Jumlah Postingan:* ${video_post}
➸ *Deskripsi:* ${description}
➸ *Link:* ${url_account}`

            const pictk = await bent("buffer")(picture)
            const base64 = `data:image/jpg;base64,${pictk.toString("base64")}`
            tobz.sendImage(from, base64, title, tiktod)
            } catch (err) {
             console.error(err.message)
             await tobz.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, User tidak ditemukan')
             tobz.sendText(ownerNumber, 'Error Tiktokstalk : '+ err)
           }
          break
        case '#':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (!isSimi) return tobz.reply(from, 'command/Perintah Simi belum di aktifkan di group ini!', id)
            if (args.length === 1) return tobz.reply(from, 'Kirim perintah *# [teks]*\nContoh : *# halo*')
            const que = body.slice(2)
            const sigo = await axios.get(`https://videfikri.com/api/simsimi/?teks=hai${que}`)
            const sigot = sigo.data.result
            tobz.reply(from, sigot.jawaban, id)
            console.log(sigot)
            break
        case '#igdl': 
                if (args.length == 0) return tobz.reply(from, `Kirim perintah #ig linkig`, id)
                tobz.reply(from, '_Scrapping Metadataa..._', id)
                axios.get(`https://api.zeks.xyz/api/ig?url=${body.slice(5)}&apikey=apivinz`)
			    .then(async(res) => {
                    if (res.data.result.includes('.mp4')) {
                        var ext = '.mp4'
                    } else {
                        var ext = '.jpg'
                    }
			        tobz.sendFileFromUrl(from, `${res.data.result[0].url}`, `ig${ext}`, '', id)
			        .catch(() => {
			    tobz.reply(from, 'Error njing', id)
	            })
	            })
	        break
        case '#starmaker': //gabisa
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (args.length === 1) return tobz.reply(from, 'Kirim perintah *#starmaker [linkStarmaker]* untuk contoh silahkan kirim perintah *#readme*')
            arg = body.trim().split(' ')
            console.log(...arg[1])
            var slicedArgs = Array.prototype.slice.call(arg, 1);
            console.log(slicedArgs)
            const smkr = await slicedArgs.join(' ')
            console.log(smkr)
            try {
            const smkr2 = await axios.get('https://api.vhtear.com/starmakerdl?link=' + smkr + '&apikey=' + vhtearkey)
            const { image, desc, url, title } = smkr2.data.result
            const smkr3 = `*User Ditemukan!*

➸ *Judul:* ${title}
➸ *Deskripsi:* ${desc}`

            const pictk = await bent("buffer")(image)
            const base64 = `data:image/jpg;base64,${pictk.toString("base64")}`
            tobz.sendImage(from, base64, 'image.jpg', 'nihh mhank')
            tobz.sendFileFromUrl(from, url, `${title}.mp4`, '', id)
            } catch (err) {
             console.error(err.message)
             await tobz.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, User tidak ditemukan')
             tobz.sendText(ownerNumber, 'Error Starmaker : '+ err)
           }
          break
        case '#tebakgambar':
        case '#tg':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            try {
            const resp = await axios.get('https://videfikri.com/api/tebakgambar/')
            if (resp.data.error) return tobz.reply(from, resp.data.error, id)
            const jwban = `➸ Jawaban : ${resp.data.result.jawaban}`
            tobz.sendFileFromUrl(from, resp.data.result.soal_gbr, 'tebakgambar.jpg', '_Silahkan Jawab Maksud Dari Gambar Ini_', id)
            tobz.sendText(from, `_Batas Waktu 40 Detik !_`, id)
            await sleep(20000)
            tobz.sendText(from, `20 Detik Lagi...`, id)
            await sleep(10000)
            tobz.sendText(from, `10 Detik Lagi...`, id)
            await sleep(10000)
            tobz.reply(from, jwban, id)
            limitAdd(serial)
            } catch (err) {
                console.error(err.message)
                await tobz.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, Soal Quiz tidak ditemukan')
                tobz.sendText(ownerNumber, 'Tebak Gambar Error : ' + err)
           }
           break
        case '#truth':
           if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
           try {
           const tru = await axios.get('https://h4ck3rs404-api.herokuapp.com/api/kuis/truthid?apikey=404Api')
           if (tru.data.error) return tobz.reply(from, tru.data.error, id)
           const tr = `➸ Truth : ${tru.data.result}`
           tobz.reply(from, tr, id)
           } catch (err) {
               console.error(err.message)
               await tobz.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, Soal Quiz tidak ditemukan')
               tobz.sendText(ownerNumber, 'Cak LonT Error : ' + err)
          }
          break
        case '#dare':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            try {
            const tru = await axios.get('https://h4ck3rs404-api.herokuapp.com/api/kuis/dareid?apikey=404Api')
            if (tru.data.error) return tobz.reply(from, tru.data.error, id)
            const tr = `➸ Dare : ${tru.data.result}`
            tobz.reply(from, tr, id)
            } catch (err) {
                console.error(err.message)
                await tobz.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, Soal Quiz tidak ditemukan')
                tobz.sendText(ownerNumber, 'Cak LonT Error : ' + err)
           }
           break
	case '#tebakkata':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            try {
            const tebk = await axios.get('https://leyscoders-api.herokuapp.com/api/tebak-kata?apikey=OneDayOneCharity')
            if (tebk.data.error) return tobz.reply(from, tebk.data.error, id)
            const tebk2 = `➸ Soal : ${tebk.data.result.soal}`
            const jwan = `➸ Jawaban : ${tebk.data.result.jawaban}`
            tobz.reply(from, tebk2, id)
            tobz.sendText(from, `_Batas Waktu 40 Detik !_`, id)
            await sleep(20000)
            tobz.sendText(from, `20 Detik Lagi...`, id)
            await sleep(10000)
            tobz.sendText(from, `10 Detik Lagi...`, id)
            await sleep(10000)
            tobz.reply(from, jwan, id)
            } catch (err) {
                console.error(err.message)
                await tobz.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, Soal Quiz tidak ditemukan')
                tobz.sendText(ownerNumber, 'Tebak Kata Error : ' + err)
           }
           break
        case '#caklontong':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            try {
            const resp = await axios.get('https://zahirr-web.herokuapp.com/api/kuis/caklontong?apikey=zahirgans')
            if (resp.data.error) return tobz.reply(from, resp.data.error, id)
            const anm2 = `➸ Soal : ${resp.data.result.soal}`
            const jwban = `➸ Jawaban : ${resp.data.result.jawaban}\n➸ Deskripsi : ${resp.data.result.deskripsi}`
            tobz.reply(from, anm2, id)
            tobz.sendText(from, `_Batas Waktu 40 Detik !_`, id)
            await sleep(20000)
            tobz.sendText(from, `20 Detik Lagi...`, id)
            await sleep(10000)
            tobz.sendText(from, `10 Detik Lagi...`, id)
            await sleep(10000)
            tobz.reply(from, jwban, id)
            } catch (err) {
                console.error(err.message)
                await tobz.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, Soal Quiz tidak ditemukan')
                tobz.sendText(ownerNumber, 'Cak LonT Error : ' + err)
           }
           break
        case '#maps':
            if (args.length === 1) return tobz.reply(from, 'Kirim perintah *#maps [optional]*, Contoh : *#maps Jakarta*')
            arg = body.trim().split(' ')
            console.log(...arg[1])
            var slicedArgs = Array.prototype.slice.call(arg, 1);
            console.log(slicedArgs)
            const mapz = await slicedArgs.join(' ')
            console.log(mapz)
            try {
            const mapz2 = await axios.get('https://mnazria.herokuapp.com/api/maps?search=' + mapz)
            const { gambar } = mapz2.data
            const pictk = await bent("buffer")(gambar)
            const base64 = `data:image/jpg;base64,${pictk.toString("base64")}`
            tobz.sendImage(from, base64, 'maps.jpg', `*Hasil Maps : ${mapz}*`)
            } catch (err) {
             console.error(err.message)
             await tobz.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, User tidak ditemukan')
             tobz.sendText(ownerNumber, 'Error Maps : '+ err)
           }
          break
        case '#twitter':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (args.length === 1) return tobz.reply(from, 'Kirim perintah *#twitter [linkTwitter]* untuk contoh silahkan kirim perintah *#readme*')
            arg = body.trim().split(' ')
            console.log(...arg[1])
            var slicedArgs = Array.prototype.slice.call(arg, 1);
            console.log(slicedArgs)
            const twtdl = await slicedArgs.join(' ')
            console.log(twtdl)
            try {
            const twtdl2 = await axios.get('https://mhankbarbar.herokuapp.com/api/twit?url=' + twtdl + '&apiKey=' + barbarkey)
            const { filesize, quote, result, title } = twtdl2.data
            const twtdl3 = `*User Ditemukan!*

➸ *Judul:* ${title}
➸ *Deskripsi:* ${quote}
➸ *Filesize:* ${filesize}`

            tobz.sendFileFromUrl(from, result, `${title}.mp4`, twtdl3, id)
            } catch (err) {
             console.error(err.message)
             await tobz.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, User tidak ditemukan')
           }
          break
        case '#math':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (args.length === 1) return tobz.reply(from, '[❗] Kirim perintah *#math [ Angka ]*\nContoh : #math 12*12\n*NOTE* :\n- Untuk Perkalian Menggunakan *\n- Untuk Pertambahan Menggunakan +\n- Untuk Pengurangan Mennggunakan -\n- Untuk Pembagian Menggunakan /')
            const mtk = body.slice(6)
            if (typeof Math_js.evaluate(mtk) !== "number") {
            tobz.reply(from, `"${mtk}", bukan angka!\n[❗] Kirim perintah *#math [ Angka ]*\nContoh : #math 12*12\n*NOTE* :\n- Untuk Perkalian Menggunakan *\n- Untuk Pertambahan Menggunakan +\n- Untuk Pengurangan Mennggunakan -\n- Untuk Pembagian Menggunakan /`, id)
        } else {
            tobz.reply(from, `*「 MATH 」*\n\n*Kalkulator*\n${mtk} = ${Math_js.evaluate(mtk)}`, id)
        }
        break
        case '#wait':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (isMedia && type === 'image' || quotedMsg && quotedMsg.type === 'image') {
                if (isMedia) {
                    var mediaData = await decryptMedia(message, uaOverride)
                } else {
                    var mediaData = await decryptMedia(quotedMsg, uaOverride)
                }
                const fetch = require('node-fetch')
                const imgBS4 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                tobz.reply(from, 'Searching....', id)
                fetch('https://trace.moe/api/search', {
                    method: 'POST',
                    body: JSON.stringify({ image: imgBS4 }),
                    headers: { "Content-Type": "application/json" }
                })
                .then(respon => respon.json())
                .then(resolt => {
                    if (resolt.docs && resolt.docs.length <= 0) {
                        tobz.reply(from, 'Maaf, saya tidak tau ini anime apa', id)
                    }
                    const { is_adult, title, title_chinese, title_romaji, title_english, episode, similarity, filename, at, tokenthumb, anilist_id } = resolt.docs[0]
                    teks = ''
                    if (similarity < 0.92) {
                        teks = '*Saya memiliki keyakinan rendah dalam hal ini* :\n\n'
                    }
                    teks += `➸ *Title Japanese* : ${title}\n➸ *Title chinese* : ${title_chinese}\n➸ *Title Romaji* : ${title_romaji}\n➸ *Title English* : ${title_english}\n`
                    teks += `➸ *Ecchi* : ${is_adult}\n`
                    teks += `➸ *Eps* : ${episode.toString()}\n`
                    teks += `➸ *Kesamaan* : ${(similarity * 100).toFixed(1)}%\n`
                    var video = `https://media.trace.moe/video/${anilist_id}/${encodeURIComponent(filename)}?t=${at}&token=${tokenthumb}`;
                    tobz.sendFileFromUrl(from, video, 'nimek.mp4', teks, id).catch(() => {
                        tobz.reply(from, teks, id)
                    })
                })
                .catch(() => {
                    tobz.reply(from, 'Error !', id)
                })
            } else {
                tobz.sendFileFromUrl(from, tutor, 'Tutor.jpg', 'Neh contoh mhank!', id)
            }
            break
        case '#qrcode':
           if(!args.lenght >= 2) return
           let qrcodes = body.slice(8)
           await tobz.sendFileFromUrl(from, `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${qrcodes}`, 'gambar.png', 'Process sukses!')
           break
        case '#ptl':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (isLimit(serial)) return tobz.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            const pptl = ["https://i.pinimg.com/564x/b2/84/55/b2845599d303a4f8fc4f7d2a576799fa.jpg","https://i.pinimg.com/236x/98/08/1c/98081c4dffde1c89c444db4dc1912d2d.jpg","https://i.pinimg.com/236x/a7/e2/fe/a7e2fee8b0abef9d9ecc8885557a4e91.jpg","https://i.pinimg.com/236x/ee/ae/76/eeae769648dfaa18cac66f1d0be8c160.jpg","https://i.pinimg.com/236x/b2/84/55/b2845599d303a4f8fc4f7d2a576799fa.jpg","https://i.pinimg.com/564x/78/7c/49/787c4924083a9424a900e8f1f4fdf05f.jpg","https://i.pinimg.com/236x/eb/05/dc/eb05dc1c306f69dd43b7cae7cbe03d27.jpg","https://i.pinimg.com/236x/d0/1b/40/d01b40691c68b84489f938b939a13871.jpg","https://i.pinimg.com/236x/31/f3/06/31f3065fa218856d7650e84b000d98ab.jpg","https://i.pinimg.com/236x/4a/e5/06/4ae5061a5c594d3fdf193544697ba081.jpg","https://i.pinimg.com/236x/56/45/dc/5645dc4a4a60ac5b2320ce63c8233d6a.jpg","https://i.pinimg.com/236x/7f/ad/82/7fad82eec0fa64a41728c9868a608e73.jpg","https://i.pinimg.com/236x/ce/f8/aa/cef8aa0c963170540a96406b6e54991c.jpg","https://i.pinimg.com/236x/77/02/34/77023447b040aef001b971e0defc73e3.jpg","https://i.pinimg.com/236x/4a/5c/38/4a5c38d39687f76004a097011ae44c7d.jpg","https://i.pinimg.com/236x/41/72/af/4172af2053e54ec6de5e221e884ab91b.jpg","https://i.pinimg.com/236x/26/63/ef/2663ef4d4ecfc935a6a2b51364f80c2b.jpg","https://i.pinimg.com/236x/2b/cb/48/2bcb487b6d398e8030814c7a6c5a641d.jpg","https://i.pinimg.com/236x/62/da/23/62da234d941080696428e6d4deec6d73.jpg","https://i.pinimg.com/236x/d4/f3/40/d4f340e614cc4f69bf9a31036e3d03c5.jpg","https://i.pinimg.com/236x/d4/97/dd/d497dd29ca202be46111f1d9e62ffa65.jpg","https://i.pinimg.com/564x/52/35/66/523566d43058e26bf23150ac064cfdaa.jpg","https://i.pinimg.com/236x/36/e5/27/36e52782f8d10e4f97ec4dbbc97b7e67.jpg","https://i.pinimg.com/236x/02/a0/33/02a033625cb51e0c878e6df2d8d00643.jpg","https://i.pinimg.com/236x/30/9b/04/309b04d4a498addc6e4dd9d9cdfa57a9.jpg","https://i.pinimg.com/236x/9e/1d/ef/9e1def3b7ce4084b7c64693f15b8bea9.jpg","https://i.pinimg.com/236x/e1/8f/a2/e18fa21af74c28e439f1eb4c60e5858a.jpg","https://i.pinimg.com/236x/22/d9/22/22d9220de8619001fe1b27a2211d477e.jpg","https://i.pinimg.com/236x/af/ac/4d/afac4d11679184f557d9294c2270552d.jpg","https://i.pinimg.com/564x/52/be/c9/52bec924b5bdc0d761cfb1160865b5a1.jpg","https://i.pinimg.com/236x/1a/5a/3c/1a5a3cffd0d936cd4969028668530a15.jpg"]
            let pep = pptl[Math.floor(Math.random() * pptl.length)]
            tobz.sendFileFromUrl(from, pep, 'pptl.jpg', 'Follow ig : https://www.instagram.com/ptl_repost untuk mendapatkan penyegar timeline lebih banyak', message.id)
            break
        case '#inu':
            const list = ["https://cdn.shibe.online/shibes/247d0ac978c9de9d9b66d72dbdc65f2dac64781d.jpg","https://cdn.shibe.online/shibes/1cf322acb7d74308995b04ea5eae7b520e0eae76.jpg","https://cdn.shibe.online/shibes/1ce955c3e49ae437dab68c09cf45297d68773adf.jpg","https://cdn.shibe.online/shibes/ec02bee661a797518d37098ab9ad0c02da0b05c3.jpg","https://cdn.shibe.online/shibes/1e6102253b51fbc116b887e3d3cde7b5c5083542.jpg","https://cdn.shibe.online/shibes/f0c07a7205d95577861eee382b4c8899ac620351.jpg","https://cdn.shibe.online/shibes/3eaf3b7427e2d375f09fc883f94fa8a6d4178a0a.jpg","https://cdn.shibe.online/shibes/c8b9fcfde23aee8d179c4c6f34d34fa41dfaffbf.jpg","https://cdn.shibe.online/shibes/55f298bc16017ed0aeae952031f0972b31c959cb.jpg","https://cdn.shibe.online/shibes/2d5dfe2b0170d5de6c8bc8a24b8ad72449fbf6f6.jpg","https://cdn.shibe.online/shibes/e9437de45e7cddd7d6c13299255e06f0f1d40918.jpg","https://cdn.shibe.online/shibes/6c32141a0d5d089971d99e51fd74207ff10751e7.jpg","https://cdn.shibe.online/shibes/028056c9f23ff40bc749a95cc7da7a4bb734e908.jpg","https://cdn.shibe.online/shibes/4fb0c8b74dbc7653e75ec1da597f0e7ac95fe788.jpg","https://cdn.shibe.online/shibes/125563d2ab4e520aaf27214483e765db9147dcb3.jpg","https://cdn.shibe.online/shibes/ea5258fad62cebe1fedcd8ec95776d6a9447698c.jpg","https://cdn.shibe.online/shibes/5ef2c83c2917e2f944910cb4a9a9b441d135f875.jpg","https://cdn.shibe.online/shibes/6d124364f02944300ae4f927b181733390edf64e.jpg","https://cdn.shibe.online/shibes/92213f0c406787acd4be252edb5e27c7e4f7a430.jpg","https://cdn.shibe.online/shibes/40fda0fd3d329be0d92dd7e436faa80db13c5017.jpg","https://cdn.shibe.online/shibes/e5c085fc427528fee7d4c3935ff4cd79af834a82.jpg","https://cdn.shibe.online/shibes/f83fa32c0da893163321b5cccab024172ddbade1.jpg","https://cdn.shibe.online/shibes/4aa2459b7f411919bf8df1991fa114e47b802957.jpg","https://cdn.shibe.online/shibes/2ef54e174f13e6aa21bb8be3c7aec2fdac6a442f.jpg","https://cdn.shibe.online/shibes/fa97547e670f23440608f333f8ec382a75ba5d94.jpg","https://cdn.shibe.online/shibes/fb1b7150ed8eb4ffa3b0e61ba47546dd6ee7d0dc.jpg","https://cdn.shibe.online/shibes/abf9fb41d914140a75d8bf8e05e4049e0a966c68.jpg","https://cdn.shibe.online/shibes/f63e3abe54c71cc0d0c567ebe8bce198589ae145.jpg","https://cdn.shibe.online/shibes/4c27b7b2395a5d051b00691cc4195ef286abf9e1.jpg","https://cdn.shibe.online/shibes/00df02e302eac0676bb03f41f4adf2b32418bac8.jpg","https://cdn.shibe.online/shibes/4deaac9baec39e8a93889a84257338ebb89eca50.jpg","https://cdn.shibe.online/shibes/199f8513d34901b0b20a33758e6ee2d768634ebb.jpg","https://cdn.shibe.online/shibes/f3efbf7a77e5797a72997869e8e2eaa9efcdceb5.jpg","https://cdn.shibe.online/shibes/39a20ccc9cdc17ea27f08643b019734453016e68.jpg","https://cdn.shibe.online/shibes/e67dea458b62cf3daa4b1e2b53a25405760af478.jpg","https://cdn.shibe.online/shibes/0a892f6554c18c8bcdab4ef7adec1387c76c6812.jpg","https://cdn.shibe.online/shibes/1b479987674c9b503f32e96e3a6aeca350a07ade.jpg","https://cdn.shibe.online/shibes/0c80fc00d82e09d593669d7cce9e273024ba7db9.jpg","https://cdn.shibe.online/shibes/bbc066183e87457b3143f71121fc9eebc40bf054.jpg","https://cdn.shibe.online/shibes/0932bf77f115057c7308ef70c3de1de7f8e7c646.jpg","https://cdn.shibe.online/shibes/9c87e6bb0f3dc938ce4c453eee176f24636440e0.jpg","https://cdn.shibe.online/shibes/0af1bcb0b13edf5e9b773e34e54dfceec8fa5849.jpg","https://cdn.shibe.online/shibes/32cf3f6eac4673d2e00f7360753c3f48ed53c650.jpg","https://cdn.shibe.online/shibes/af94d8eeb0f06a0fa06f090f404e3bbe86967949.jpg","https://cdn.shibe.online/shibes/4b55e826553b173c04c6f17aca8b0d2042d309fb.jpg","https://cdn.shibe.online/shibes/a0e53593393b6c724956f9abe0abb112f7506b7b.jpg","https://cdn.shibe.online/shibes/7eba25846f69b01ec04de1cae9fed4b45c203e87.jpg","https://cdn.shibe.online/shibes/fec6620d74bcb17b210e2cedca72547a332030d0.jpg","https://cdn.shibe.online/shibes/26cf6be03456a2609963d8fcf52cc3746fcb222c.jpg","https://cdn.shibe.online/shibes/c41b5da03ad74b08b7919afc6caf2dd345b3e591.jpg","https://cdn.shibe.online/shibes/7a9997f817ccdabac11d1f51fac563242658d654.jpg","https://cdn.shibe.online/shibes/7221241bad7da783c3c4d84cfedbeb21b9e4deea.jpg","https://cdn.shibe.online/shibes/283829584e6425421059c57d001c91b9dc86f33b.jpg","https://cdn.shibe.online/shibes/5145c9d3c3603c9e626585cce8cffdfcac081b31.jpg","https://cdn.shibe.online/shibes/b359c891e39994af83cf45738b28e499cb8ffe74.jpg","https://cdn.shibe.online/shibes/0b77f74a5d9afaa4b5094b28a6f3ee60efcb3874.jpg","https://cdn.shibe.online/shibes/adccfdf7d4d3332186c62ed8eb254a49b889c6f9.jpg","https://cdn.shibe.online/shibes/3aac69180f777512d5dabd33b09f531b7a845331.jpg","https://cdn.shibe.online/shibes/1d25e4f592db83039585fa480676687861498db8.jpg","https://cdn.shibe.online/shibes/d8349a2436420cf5a89a0010e91bf8dfbdd9d1cc.jpg","https://cdn.shibe.online/shibes/eb465ef1906dccd215e7a243b146c19e1af66c67.jpg","https://cdn.shibe.online/shibes/3d14e3c32863195869e7a8ba22229f457780008b.jpg","https://cdn.shibe.online/shibes/79cedc1a08302056f9819f39dcdf8eb4209551a3.jpg","https://cdn.shibe.online/shibes/4440aa827f88c04baa9c946f72fc688a34173581.jpg","https://cdn.shibe.online/shibes/94ea4a2d4b9cb852e9c1ff599f6a4acfa41a0c55.jpg","https://cdn.shibe.online/shibes/f4478196e441aef0ada61bbebe96ac9a573b2e5d.jpg","https://cdn.shibe.online/shibes/96d4db7c073526a35c626fc7518800586fd4ce67.jpg","https://cdn.shibe.online/shibes/196f3ed10ee98557328c7b5db98ac4a539224927.jpg","https://cdn.shibe.online/shibes/d12b07349029ca015d555849bcbd564d8b69fdbf.jpg","https://cdn.shibe.online/shibes/80fba84353000476400a9849da045611a590c79f.jpg","https://cdn.shibe.online/shibes/94cb90933e179375608c5c58b3d8658ef136ad3c.jpg","https://cdn.shibe.online/shibes/8447e67b5d622ef0593485316b0c87940a0ef435.jpg","https://cdn.shibe.online/shibes/c39a1d83ad44d2427fc8090298c1062d1d849f7e.jpg","https://cdn.shibe.online/shibes/6f38b9b5b8dbf187f6e3313d6e7583ec3b942472.jpg","https://cdn.shibe.online/shibes/81a2cbb9a91c6b1d55dcc702cd3f9cfd9a111cae.jpg","https://cdn.shibe.online/shibes/f1f6ed56c814bd939645138b8e195ff392dfd799.jpg","https://cdn.shibe.online/shibes/204a4c43cfad1cdc1b76cccb4b9a6dcb4a5246d8.jpg","https://cdn.shibe.online/shibes/9f34919b6154a88afc7d001c9d5f79b2e465806f.jpg","https://cdn.shibe.online/shibes/6f556a64a4885186331747c432c4ef4820620d14.jpg","https://cdn.shibe.online/shibes/bbd18ae7aaf976f745bc3dff46b49641313c26a9.jpg","https://cdn.shibe.online/shibes/6a2b286a28183267fca2200d7c677eba73b1217d.jpg","https://cdn.shibe.online/shibes/06767701966ed64fa7eff2d8d9e018e9f10487ee.jpg","https://cdn.shibe.online/shibes/7aafa4880b15b8f75d916b31485458b4a8d96815.jpg","https://cdn.shibe.online/shibes/b501169755bcf5c1eca874ab116a2802b6e51a2e.jpg","https://cdn.shibe.online/shibes/a8989bad101f35cf94213f17968c33c3031c16fc.jpg","https://cdn.shibe.online/shibes/f5d78feb3baa0835056f15ff9ced8e3c32bb07e8.jpg","https://cdn.shibe.online/shibes/75db0c76e86fbcf81d3946104c619a7950e62783.jpg","https://cdn.shibe.online/shibes/8ac387d1b252595bbd0723a1995f17405386b794.jpg","https://cdn.shibe.online/shibes/4379491ef4662faa178f791cc592b52653fb24b3.jpg","https://cdn.shibe.online/shibes/4caeee5f80add8c3db9990663a356e4eec12fc0a.jpg","https://cdn.shibe.online/shibes/99ef30ea8bb6064129da36e5673649e957cc76c0.jpg","https://cdn.shibe.online/shibes/aeac6a5b0a07a00fba0ba953af27734d2361fc10.jpg","https://cdn.shibe.online/shibes/9a217cfa377cc50dd8465d251731be05559b2142.jpg","https://cdn.shibe.online/shibes/65f6047d8e1d247af353532db018b08a928fd62a.jpg","https://cdn.shibe.online/shibes/fcead395cbf330b02978f9463ac125074ac87ab4.jpg","https://cdn.shibe.online/shibes/79451dc808a3a73f99c339f485c2bde833380af0.jpg","https://cdn.shibe.online/shibes/bedf90869797983017f764165a5d97a630b7054b.jpg","https://cdn.shibe.online/shibes/dd20e5801badd797513729a3645c502ae4629247.jpg","https://cdn.shibe.online/shibes/88361ee50b544cb1623cb259bcf07b9850183e65.jpg","https://cdn.shibe.online/shibes/0ebcfd98e8aa61c048968cb37f66a2b5d9d54d4b.jpg"]
            let kya = list[Math.floor(Math.random() * list.length)]
            tobz.sendFileFromUrl(from, kya, 'Dog.jpeg', ' *Kyōdai no inu*')
            break
        case '#neko':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (isLimit(serial)) return tobz.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            q2 = Math.floor(Math.random() * 900) + 300;
            q3 = Math.floor(Math.random() * 900) + 300;
            tobz.sendFileFromUrl(from, 'http://placekitten.com/'+q3+'/'+q2, 'neko.png','Neko ')
            break
        case '#quote':
        case '#quotes':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (isLimit(serial)) return tobz.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            const skya = await axios.get('http://api-melodicxt-2.herokuapp.com/api/get/quotes?&apiKey=administrator=')
            const skya_ = skya.data.result
            tobz.reply(from, `➸ *Quotes* : ${skya_.quotes}\n➸ *Author* : ${skya_.author}`, id)
            break
        case '#quotenime':
        case '#quotesnime':
                if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
                if (isLimit(serial)) return tobz.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
                const qnime = await axios.get('http://api-melodicxt-2.herokuapp.com/api/get/anime-quotes?&apiKey=administrator')
                const qnim = qnime.data.result
                tobz.reply(from, `➸ *Character* : ${qnim.chara}\n➸ *Anime* : ${qnim.anime}\n\n➸ *Quote* : ${qnim.quote}`, id)
            break
        case '#lirik':
            if (args.length == 1) return tobz.reply(from, 'Kirim perintah *#lirik [optional]*, contoh *#lirik aku bukan boneka*', id)
            const lagu = body.slice(7)
            const lirik = await liriklagu(lagu)
            tobz.reply(from, lirik, id)
            break
        case '#igstalk':
        if (!isOwner) return tobz.reply(from, 'Perintah ini sedang dalam perbaikan!', id)    
        if (args.length === 1)  return tobz.reply(from, 'Kirim perintah *#igstalk @username*\nContoh *#igstalk duar_amjay*', id)
        argz = body.trim().split(' ')
        console.log(...argz[1])
        var slicedArgs = Array.prototype.slice.call(argz, 1);
        console.log(slicedArgs)
        const istalk = await slicedArgs.join(' ')
        console.log(istalk)
        try {
        const istalk2 = await axios.get('http://api-melodicxt-2.herokuapp.com/api/igprofile?user=' + istalk + '&apikey=' + melodickey)
        const { username, biography, following_count, follower_count, full_name, profile_pic_url, media_count, is_private } = istalk2.data.result
    const istalk3 = `*「 INSTAGRAM PROFILE 」*
• *Username:* @${username}
• *Nama:* ${full_name}
• *Deskripsi:* ${biography}
• *Pengikut:* ${follower_count}
• *Mengikuti*: ${following_count}
• *Jumlah Postingan:* ${media_count}
• *Private:* ${is_private}
• *Link:* https://instagram.com/${username}`
        
        const pictk = await bent("buffer")(profile_pic_url)
        const base64 = `data:image/jpg;base64,${pictk.toString("base64")}`
        tobz.sendImage(from, base64, username, istalk3)
        } catch (err) {
         console.error(err.message)
         await tobz.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, User tidak ditemukan')
         tobz.sendText(ownerNumber, 'Igstalk Error : ' + err)
       }
      break
        // ADMIN & OWNER
        case '#bc':
            if (!isOwner) return tobz.reply(from, 'Perintah ini hanya untuk Owner Renge!', id)
            bctxt = body.slice(4)
                txtbc = `${bctxt}\n\n【RENGE BROADCAST】`
                const semuagrup = await tobz.getAllChatIds();
                if(quotedMsg && quotedMsg.type == 'image'){
                    const mediaData = await decryptMedia(quotedMsg)
                    const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                    for(let grupnya of semuagrup){
                        var cekgrup = await tobz.getChatById(grupnya)
                        if(!cekgrup.isReadOnly) tobz.sendImage(grupnya, imageBase64, 'gambar.jpeg', txtbc)
                    }
                    tobz.reply(from, 'Broadcast sukses!',  id)
                }else{
                    for(let grupnya of semuagrup){
                        var cekgrup = await tobz.getChatById(grupnya)
                        if(!cekgrup.isReadOnly && isMuted(grupnya)) tobz.sendText(grupnya, txtbc)
                    }
                            tobz.reply('Broadcast Success!')
                }
                break
        case '#adminlist':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            let mimin = ''
            for (let admon of groupAdmins) {
                mimin += `➸ @${admon.replace(/@c.us/g, '')}\n` 
            }
            await sleep(5000)
            await tobz.sendTextWithMentions(from, mimin)
            break
        case '#ownergroup':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const Owner_ = chat.groupMetadata.owner
            await tobz.sendTextWithMentions(from, `Owner Group : @${Owner_}`)
            break
        case '#tagadmin':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (!isOwner, !isAdmin) return tobz.reply(from, 'Perintah ini hanya untuk Owner Renge', id)
            const groupMek = await tobz.getGroupAdmins(groupId)
            let heho = '╔══✪〘 Mention Admin 〙✪══\n'
            for (let i = 0; i < groupMek.length; i++) {
                heho += '╠➥'
                heho += ` @${groupMek[i].id.replace(/@c.us/g, '')}\n`
            }
            heho += '╚═〘 Renge BOT 〙'
            await tobz.sendTextWithMentions(from, heho)
            break
        case '#tagall':
        case '#mentionall':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (!isGroupAdmins) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin group', id)
            const groupMem = await tobz.getGroupMembers(groupId)
            let hehe = '╔══✪〘 Mention All 〙✪══\n'
            for (let i = 0; i < groupMem.length; i++) {
                hehe += '╠➥'
                hehe += ` @${groupMem[i].id.replace(/@c.us/g, '')}\n`
            }
            hehe += '╚═〘 Renge BOT 〙'
            await tobz.sendTextWithMentions(from, hehe)
            break
        case '#ekickall':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (!isOwner) return tobz.reply(from, 'Perintah ini hanya untuk Owner Renge', id)
            if (!isBotGroupAdmins) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
            const allMem = await tobz.getGroupMembers(groupId)
            for (let i = 0; i < allMem.length; i++) {
                if (ownerNumber.includes(allMem[i].id)) {
                    console.log('Upss this is Admin group')
                } else {
                    await tobz.removeParticipant(groupId, allMem[i].id)
                }
            }
            tobz.reply(from, 'Success kick all member', id)
            break
        case '#okickall':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (!isOwner) return tobz.reply(from, 'Perintah ini hanya untuk Admin Renge', id)
            if (!isBotGroupAdmins) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
            const allMeq = await tobz.getGroupMembers(groupId)
            for (let i = 0; i < allMeq.length; i++) {
                if ((adminNumber, ownerNumber).includes(allMeq[i].id)) {
                    console.log('Upss this is Admin group')
                } else {
                    await tobz.removeParticipant(groupId, allMeq[i].id)
                }
            }
            tobz.reply(from, 'Succes kick all member', id)
            break
        case '#kickall':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const isGroupOwner = sender.id === chat.groupMetadata.owner
            if (!isGroupOwner) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan oleh Owner group', id)
            if (!isBotGroupAdmins) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
            const allMek = await tobz.getGroupMembers(groupId)
            for (let i = 0; i < allMek.length; i++) {
                if ((adminNumber, ownerNumber).includes(allMek[i].id)) {
                    console.log('Upss this is Admin group')
                } else {
                    await tobz.removeParticipant(groupId, allMek[i].id)
                }
            }
            tobz.reply(from, 'Success kick all member', id)
            break
        case '#leaveall':
            if (!isOwner) return tobz.reply(from, 'Perintah ini hanya untuk Owner Renge', id)
            const allChats = await tobz.getAllChatIds()
            const allGroups = await tobz.getAllGroups()
            for (let gclist of allGroups) {
                await tobz.sendText(gclist.contact.id, `Maaf bot sedang pembersihan, total chat aktif : ${allChats.length}`)
                await tobz.leaveGroup(gclist.contact.id)
            }
            tobz.reply(from, 'Succes leave all group!', id)
            break
        case '#clearall':
            if (!isOwner) return tobz.reply(from, 'Perintah ini hanya untuk Owner Renge', id)
            const allChatz = await tobz.getAllChats()
            for (let dchat of allChatz) {
                await tobz.deleteChat(dchat.id)
            }
            tobz.reply(from, 'Succes clear all chat!', id)
            break
        case '#oadd':
            const orang = args[1]
            if (!isGroupMsg) return tobz.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
            if (args.length === 1) return tobz.reply(from, 'Untuk menggunakan fitur ini, kirim perintah *#add* 628xxxxx', id)
            if (!isOwner, !isAdmin) return tobz.reply(from, 'Perintah ini hanya untuk Admin Renge', id)
            if (!isBotGroupAdmins) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
            try {
                await tobz.addParticipant(from,`${orang}@c.us`)
            } catch {
                tobz.reply(from, mess.error.Ad, id)
            }
            break
        case '#add':
            const orgh = body.slice(5)
            if (!isGroupMsg) return tobz.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
            if (args.length === 1) return tobz.reply(from, 'Untuk menggunakan fitur ini, kirim perintah *#add* 628xxxxx', id)
            if (!isGroupAdmins) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin group', id)
            if (!isBotGroupAdmins) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
            try {
                await tobz.addParticipant(from,`${orgh}@c.us`)
            } catch {
                tobz.reply(from, mess.error.Ad, id)
            }
            break
        case '#okick':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group', id)
            if (!isOwner) return tobz.reply(from, 'Perintah ini hanya untuk Owner Renge', id)
            if (!isBotGroupAdmins) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
            if (mentionedJidList.length === 0) return tobz.reply(from, 'Untuk menggunakan Perintah ini, kirim perintah *#okick* @tagmember', id)
            await tobz.sendText(from, `Perintah Owner diterima, mengeluarkan:\n${mentionedJidList.join('\n')}`)
            for (let i = 0; i < mentionedJidList.length; i++) {
                if ((adminNumber, ownerNumber).includes(mentionedJidList[i])) return tobz.reply(from, mess.error.Sp, id)
                await tobz.removeParticipant(groupId, mentionedJidList[i])
            }
            break
        case '#kick':
            if (!isGroupMsg) return tobz.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
            if (!isGroupAdmins) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin group', id)
            if (!isBotGroupAdmins) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
            if (mentionedJidList.length === 0) return tobz.reply(from, 'Untuk menggunakan Perintah ini, kirim perintah *#kick* @tagmember', id)
            await tobz.sendText(from, `Perintah diterima, mengeluarkan:\n${mentionedJidList.join('\n')}`)
            for (let i = 0; i < mentionedJidList.length; i++) {
                if ((adminNumber, groupAdmins).includes(mentionedJidList[i])) return tobz.reply(from, mess.error.Sp, id)
                await tobz.removeParticipant(groupId, mentionedJidList[i])
            }
            break
        case '#oleave':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group', id)
            if (!isOwner, !isAdmin) return tobz.reply(from, 'Perintah ini hanya untuk Admin Renge', id)
            await tobz.sendText(from,'RENGE DIPERINTAHKAN KELUAR OLEH OWNER!!').then(() => tobz.leaveGroup(groupId))
            break
        case '#leave':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group', id)
            if (!isGroupAdmins) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin group', id)
            await tobz.sendText(from,'Sayonara').then(() => tobz.leaveGroup(groupId))
            break
        case '#opromote':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group', id)
            if (!isOwner, !isAdmin) return tobz.reply(from, 'Perintah ini hanya untuk Admin Renge', id)
            if (!isBotGroupAdmins) return tobz.reply(from, 'Fitur ini hanya bisa di gunakan ketika bot menjadi admin', id)
            if (mentionedJidList.length === 0) return tobz.reply(from, 'Untuk menggunakan fitur ini, kirim perintah *#promote* @tagmember', id)
            if (mentionedJidList.length >= 2) return tobz.reply(from, 'Maaf, perintah ini hanya dapat digunakan kepada 1 user.', id)
            if (groupAdmins.includes(mentionedJidList[0])) return tobz.reply(from, 'Maaf, user tersebut sudah menjadi admin.', id)
            await tobz.promoteParticipant(groupId, mentionedJidList[0])
            await tobz.sendTextWithMentions(from, `Perintah Owner diterima, menambahkan @${mentionedJidList[0]} sebagai admin.`)
            break
        case '#promote':
            if (!isGroupMsg) return tobz.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
            if (!isGroupAdmins) return tobz.reply(from, 'Fitur ini hanya bisa di gunakan oleh admin group', id)
            if (!isBotGroupAdmins) return tobz.reply(from, 'Fitur ini hanya bisa di gunakan ketika bot menjadi admin', id)
            if (mentionedJidList.length === 0) return tobz.reply(from, 'Untuk menggunakan fitur ini, kirim perintah *#promote* @tagmember', id)
            if (mentionedJidList.length >= 2) return tobz.reply(from, 'Maaf, perintah ini hanya dapat digunakan kepada 1 user.', id)
            if (groupAdmins.includes(mentionedJidList[0])) return tobz.reply(from, 'Maaf, user tersebut sudah menjadi admin.', id)
            await tobz.promoteParticipant(groupId, mentionedJidList[0])
            await tobz.sendTextWithMentions(from, `Perintah diterima, menambahkan @${mentionedJidList[0]} sebagai admin.`)
            break
        case '#odemote':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group', id)
            if (!isOwner, !isAdmin) return tobz.reply(from, 'Perintah ini hanya untuk Admin Renge', id)
            if (!isBotGroupAdmins) return tobz.reply(from, 'Fitur ini hanya bisa di gunakan ketika bot menjadi admin', id)
            if (mentionedJidList.length === 0) return tobz.reply(from, 'Untuk menggunakan fitur ini, kirim perintah *#demote* @tagadmin', id)
            if (mentionedJidList.length >= 2) return tobz.reply(from, 'Maaf, perintah ini hanya dapat digunakan kepada 1 orang.', id)
            if (!groupAdmins.includes(mentionedJidList[0])) return tobz.reply(from, 'Maaf, user tersebut tidak menjadi admin.', id)
            await tobz.demoteParticipant(groupId, mentionedJidList[0])
            await tobz.sendTextWithMentions(from, `Perintah Owner diterima, menghapus jabatan @${mentionedJidList[0]}.`)
            break
        case '#demote':
            if (!isGroupMsg) return tobz.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
            if (!isGroupAdmins) return tobz.reply(from, 'Fitur ini hanya bisa di gunakan oleh admin group', id)
            if (!isBotGroupAdmins) return tobz.reply(from, 'Fitur ini hanya bisa di gunakan ketika bot menjadi admin', id)
            if (mentionedJidList.length === 0) return tobz.reply(from, 'Untuk menggunakan fitur ini, kirim perintah *#demote* @tagadmin', id)
            if (mentionedJidList.length >= 2) return tobz.reply(from, 'Maaf, perintah ini hanya dapat digunakan kepada 1 orang.', id)
            if (!groupAdmins.includes(mentionedJidList[0])) return tobz.reply(from, 'Maaf, user tersebut tidak menjadi admin.', id)
            await tobz.demoteParticipant(groupId, mentionedJidList[0])
            await tobz.sendTextWithMentions(from, `Perintah diterima, menghapus jabatan @${mentionedJidList[0]}.`)
            break
        case '#join':
            if (args.length === 1) return tobz.reply(from, 'Hanya Owner yang bisa memasukan Bot ke dalam Grup!', id)
            if (!isOwner) return tobz.reply(from, 'Perintah ini hanya untuk Owner Renge', id)
            const link = body.slice(6)
            const tGr = await tobz.getAllGroups()
            const minMem = 5
            const isLink = link.match(/(https:\/\/chat.whatsapp.com)/gi)
            const check = await tobz.inviteInfo(link)
            if (!isLink) return tobz.reply(from, 'Ini link? 👊🤬', id)
            if (tGr.length > 256) return tobz.reply(from, 'Maaf jumlah group sudah maksimal!', id)
            if (check.size < minMem) return tobz.reply(from, 'Member group tidak melebihi 5, bot tidak bisa masuk', id)
            if (check.status === 200) {
                await tobz.joinGroupViaLink(link).then(() => tobz.reply(from, 'Bot akan segera masuk!'))
            } else {
                tobz.reply(from, 'Link group tidak valid!', id)
            }
            break
        case '#sider':
            if (!isGroupMsg) return tobz.reply(from, `Perintah ini hanya bisa di gunakan dalam group!`, id)                
            if (!quotedMsg) return tobz.reply(from, `Tolong Reply Pesan Renge`, id)
            if (!quotedMsgObj.fromMe) return tobz.reply(from, `Tolong Reply Pesan Renge`, id)
            try {
                const reader = await tobz.getMessageReaders(quotedMsgObj.id)
                let list = ''
                for (let pembaca of reader) {
                list += `- @${pembaca.id.replace(/@c.us/g, '')}\n` 
            }
                tobz.sendTextWithMentions(from, `Ciee, Ngeread...\n${list}`)
            } catch(err) {
                console.log(err)
                tobz.reply(from, `Maaf, Belum Ada Yang Membaca Pesan Renge atau Mereka Menonaktifkan Read Receipts`, id)    
            }
            break
        case '#delete':
            if (!isGroupMsg) return tobz.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
            if (!isGroupAdmins) return tobz.reply(from, 'Fitur ini hanya bisa di gunakan oleh admin group', id)
            if (!quotedMsg) return tobz.reply(from, 'Salah!!, kirim perintah *#delete [tagpesanbot]*', id)
            if (!quotedMsgObj.fromMe) return tobz.reply(from, 'Salah!!, Bot tidak bisa mengahpus chat user lain!', id)
            tobz.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false)
            break
        case '#getses':
            if (!isOwner) return tobz.reply(from, 'Perintah ini hanya untuk Owner Renge', id)            
            const sesPic = await tobz.getSnapshot()
            tobz.sendFile(from, sesPic, 'session.png', 'Nih boss', id)
            break
        case '#adminlist':
            let admn = `This is list of Renge Admin\nTotal : ${adminNumber.length}\n`
            for (let i of adminNumber) {
                admn += `➸ ${i.replace(/@c.us/g,'')}\n`
            }
            await tobz.reply(from, admn, id)
            break
        case '#restart':
            if(isOwner){
                tobz.sendText(from, '*[WARN]* Restarting ...')
                setting.restartState = true
                setting.restartId = chatId
                var obj = []
                //fs.writeFileSync('./lib/setting.json', JSON.stringify(obj, null,2));
                fs.writeFileSync('./lib/limit.json', JSON.stringify(obj));
                fs.writeFileSync('./lib/muted.json', JSON.stringify(obj));
                fs.writeFileSync('./lib/msgLimit.json', JSON.stringify(obj));
                fs.writeFileSync('./lib/banned.json', JSON.stringify(obj));
                fs.writeFileSync('./lib/welcome.json', JSON.stringify(obj));
                fs.writeFileSync('./lib/left.json', JSON.stringify(obj));
                fs.writeFileSync('./lib/Simsimi.json', JSON.stringify(obj));
                fs.writeFileSync('./lib/nsfwz.json', JSON.stringify(obj));
                const spawn = require('child_process').exec;
                function os_func() {
                    this.execCommand = function (command) {
                        return new Promise((resolve, reject)=> {
                        spawn(command, (error, stdout, stderr) => {
                            if (error) {
                                reject(error);
                                return;
                            }
                            resolve(stdout)
                        });
                    })
                }}
                var oz = new os_func();
                oz.execCommand('pm2 restart index').then(res=> {
                }).catch(err=> {
                    console.log("os >>>", err);
                })
            }
			
            break
        case '#addadmin':
            if (!isOwner) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan oleh Owner Renge!', id)
                for (let i = 0; i < mentionedJidList.length; i++) {
                adminNumber.push(mentionedJidList[i])
                fs.writeFileSync('./lib/admin.json', JSON.stringify(adminNumber))
                tobz.reply(from, 'Success Menambahkan Admin Renge!', id)
                }
            break
        case '#deladmin':
            if (!isOwner) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan oleh Owner Renge!', id)
                let inq = adminNumber.indexOf(mentionedJidList[0])
                adminNumber.splice(inq, 1)
                fs.writeFileSync('./lib/admin.json', JSON.stringify(adminNumber))
                tobz.reply(from, 'Success Menghapus Admin Renge!', id)
            break
        case '#block':
            if (!isOwner) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan oleh Owner Renge!', id)
            for (let i = 0; i < mentionedJidList.length; i++) {
                let unblock = `${mentionedJidList[i]}`
                await tobz.contactBlock(unblock).then((a)=>{
                    console.log(a)
                    tobz.reply(from, `Success block ${args[1]}!`, id)
                })
            }
            break
        case '#unblock':
            if (!isOwner) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan oleh Owner Renge!', id)
            for (let i = 0; i < mentionedJidList.length; i++) {
                let unblock = `${mentionedJidList[i]}`
                await tobz.contactUnblock(unblock).then((a)=>{
                    console.log(a)
                    tobz.reply(from, `Success unblok ${args[1]}!`, id)
                })
            } 
            break
        case '#ban':
            if (!isAdmin) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin Renge!', id)
                for (let i = 0; i < mentionedJidList.length; i++) {
                banned.push(mentionedJidList[i])
                fs.writeFileSync('./lib/banned.json', JSON.stringify(banned))
                tobz.reply(from, 'Succes ban target!',id)
            }
            break
        case '#unban':
            if (!isAdmin) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin Renge!', id)
                let inz = banned.indexOf(mentionedJidList[0])
                banned.splice(inz, 1)
                fs.writeFileSync('./lib/banned.json', JSON.stringify(banned))
                tobz.reply(from, 'Unbanned User!', id)
            break
        case '#setname':
            if (!isOwner) return tobz.reply(from, `Perintah ini hanya bisa di gunakan oleh Owner Renge`, id)
                const setnem = body.slice(9)
                await tobz.setMyName(setnem)
                tobz.sendTextWithMentions(from, `Makasih Nama Barunya @${sender.id.replace('@c.us','')} 😘`)
            break
        case '#setstatus':
            if (!isOwner) return tobz.reply(from, `Perintah ini hanya bisa di gunakan oleh Owner Renge`, id)
                const setstat = body.slice(11)
                await tobz.setMyStatus(setstat)
                tobz.sendTextWithMentions(from, `Makasih Status Barunya @${sender.id.replace('@c.us','')} 😘`)
            break
	case '#tobz':
            if(!isOwner) return tobz.reply(from, `Perintah ini hanya bisa di gunakan oleh Owner Renge!`, id)
            await tobz.reply(from, 'Key yang digunakan saat ini : '+ tobzkey, id)
            break
        case '#settobz':
            if(!isOwner) return tobz.reply(from, `Perintah ini hanya bisa di gunakan oleh Owner Renge!`, id)
            if (args.length === 1) return tobz.reply(from, `Kirim perintah *${prefix}settobz [ TOBZ KEY ]*`, id)
            tobzkey = args[1]
            tobz.sendText(from, `Berhasil Mengganti key Ke *「* ${tobzkey} *」*`)
            break
        case '#listgroup':
                tobz.getAllGroups().then((res) => {
                let berhitung1 = 1
                let gc = `*This is list of group* :\n`
                for (let i = 0; i < res.length; i++) {
                    gc += `\n═════════════════\n\n*No : ${i+1}*\n*Nama* : ${res[i].name}\n*Pesan Belum Dibaca* : ${res[i].unreadCount} chat\n*Tidak Spam* : ${res[i].notSpam}\n`
                }
                tobz.reply(from, gc, id)
            })
            break
        case '#listbanned':
            let bened = `This is list of banned number\nTotal : ${banned.length}\n`
            for (let i of banned) {
                bened += `➸ ${i.replace(/@c.us/g,'')}\n`
            }
            await tobz.reply(from, bened, id)
            break
        case '#listblock':
            let hih = `This is list of blocked number\nTotal : ${blockNumber.length}\n`
            for (let i of blockNumber) {
                hih += `➸ ${i.replace(/@c.us/g,'')}\n`
            }
            await tobz.reply(from, hih, id)
            break
        case '#ping':
            const loadedMsg = await tobz.getAmountOfLoadedMessages()
            const botadmins = await tobz.iAmAdmin()
            const blockedd = await tobz.getBlockedIds()
            const chatIds = await tobz.getAllChatIds()
            const groups = await tobz.getAllGroups()
            const me = await tobz.getMe()
            const battery = await tobz.getBatteryLevel()
            const isCharging = await tobz.getIsPlugged()
            const timestamp = speed();
            const latensi = speed() - timestamp
            await tobz.reply(from, `*「 𝗦𝗧𝗔𝗧𝗨𝗦 𝗣𝗖 」*\nPenggunaan RAM: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB\nCPU: ${os.cpus()[0].model}\n\n*「 𝗦𝗧𝗔𝗧𝗨𝗦 𝗠𝗘𝗦𝗦𝗔𝗚𝗘 」* :\n- *${loadedMsg}* Loaded Messages\n- *${chatIds.length - groups.length}* Total Chats\n  ├ *${groups.length}* Group Chats\n  └ *${chatIds.length}* Personal Chats\n- *${groups.length}* Groups Joined\n\n*「 𝗦𝗧𝗔𝗧𝗨𝗦 𝗨𝗦𝗘𝗥 」*\n  ├ *${banned.length}* Banned User\n  ├ *${blockedd.length}* Blocked User\n  └ *${adminNumber.length}* Admin User\n\n*「 𝗦𝗧𝗔𝗧𝗨𝗦 𝗗𝗘𝗩𝗜𝗖𝗘 」*\n${(`\n*Battery* : ${battery}% ${isCharging ? 'Lagi Di Cas...' : 'Ga Di Cas!'}\n${Object.keys(me.phone).map(key => `${key} : ${me.phone[key]}`).join('\n')}`.slice(1, -1))}\n\n\n*Speed:* ${latensi.toFixed(4)} _Second_`, id)
            break
        case '#bugreport':
            if (args.length === 1) return tobz.reply(from, '[❗] Kirim perintah *#bugreport [teks]*\ncontoh : *#bugreport Permisi Owner, Ada bug pada command #otakudesu, Tolong diperbaiki*')
            const bug = body.slice(11)
            if(!bug) return
            if(isGroupMsg){
                tobz.sendText(ownerNumber, `*[BUG REPORT]*\n*WAKTU* : ${time}\nNO PENGIRIM : wa.me/${sender.id.match(/\d+/g)}\nGroup : ${formattedTitle}\n\n${bug}`)
                tobz.reply(from, 'Masalah telah di laporkan ke owner BOT, laporan palsu/main2 tidak akan ditanggapi.' ,id)
            }else{
                tobz.sendText(ownerNumber, `*[BUG REPORT]*\n*WAKTU* : ${time}\nNO PENGIRIM : wa.me/${sender.id.match(/\d+/g)}\n\n${bug}`)
                tobz.reply(from, 'Masalah telah di laporkan ke owner BOT, laporan palsu/main2 tidak akan ditanggapi.', id)
            }
            break
         case '#profile':
            if (isBanned, isBlocked) return false
            if (isGroupMsg) {
                if (!quotedMsg) {
                var block = blockNumber.includes(author)
                var bend = banned.includes(author)
                var pic = await tobz.getProfilePicFromServer(author)
                var namae = pushname
                var sts = await tobz.getStatus(author)
                var adm = isGroupAdmins
                var donate = isAdmin
                const { status } = sts
                if (pic == undefined) {
                    var pfp = errorurl 
                } else {
                    var pfp = pic
                } 
                await tobz.sendFileFromUrl(from, pfp, 'pfp.jpg', `*User Profile* ✨️ \n\n➸ *Username: ${namae}*\n\n➸ *User Info: ${status}*\n\n*➸ Block : ${block}*\n\n*➸ Banned : ${bend}*\n\n➸ *Admin Group: ${adm}*\n\n➸ *Admin Renge: ${donate}*`)
             } else if (quotedMsg) {
             var qmid = quotedMsgObj.sender.id
             var block = blockNumber.includes(qmid)
             var bend = banned.includes(author)
             var pic = await tobz.getProfilePicFromServer(qmid)
             var namae = quotedMsgObj.sender.name
             var sts = await tobz.getStatus(qmid)
             var adm = isGroupAdmins
             var donate = isAdmin
             const { status } = sts
              if (pic == undefined) {
              var pfp = errorurl 
              } else {
              var pfp = pic
              } 
              await tobz.sendFileFromUrl(from, pfp, 'pfp.jpg', `*User Profile* ✨️ \n\n➸ *Username: ${namae}*\n\n➸ *User Info: ${status}*\n\n*➸ Block : ${block}*\n\n*➸ Banned : ${bend}*\n\n➸ *Admin Group: ${adm}*\n\n➸ *Admin Renge: ${donate}*`)
             }
            }
            break
        // LIST MENU
	case '#runtime':
            tobz.reply(from, `Renge telah aktif selama :\n${cts}`, id)
            break
        case '#bot':
            tobz.sendMessage(from,`Iya kak ada yang bisa Renge Bantu !?`, id)
	    break
        case '#menu':
        case '#help':
            tobz.sendText(from, help(cts))
            break
        case '#rengegroup':
            tobz.reply(from, `_*Maaf kak Renge belum punya grub :D*_`, id)
            break
	case '#makermenu':
            tobz.sendText(from, makercmd)
            break
        case '#groupmenu':
            tobz.sendText(from, groupcmd)
            break
        case '#mediamenu':
            tobz.sendText(from, mediacmd)
            break
        case '#animemenu':
            tobz.sendText(from, animecmd)
            break
        case '#kerangmenu':
            tobz.sendText(from, kerangcmd)
            break
        case '#downloadmenu':
            tobz.sendText(from, downloadcmd)
            break
        case '#othermenu':
            tobz.sendText(from, othercmd)
            break
        case '#iklan':
            tobz.sendText(from, sewa)
            break
        case '#adminmenu':
            if (!isAdmin) return tobz.reply(from, 'Perintah ini hanya untuk Admin Renge', id)
            tobz.sendText(from, admincmd)
            break
        case '#ownermenu':
            if (!isOwner) return tobz.reply(from, 'Perintah ini hanya untuk Owner Renge', id)
            tobz.sendText(from, ownercmd)
            break
        case '#nsfwmenu':
            if (!isGroupMsg) return tobz.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (!isNsfw) return tobz.reply(from, 'command/Perintah NSFW belum di aktifkan di group ini!', id)
            tobz.sendText(from, nsfwcmd)
            break
        // INFORMATION
        case '#donate':
            tobz.sendText(from, sumbang)
            break
        case '#readme':
            tobz.reply(from, readme, id)
            break
        case '#info':
            tobz.sendText(from, info)
            break
        case '#bahasa':
            tobz.sendText(from, bahasalist)
            break
        case '#snk':
            tobz.reply(from, snk, id)
            break
        default:
            if (!isGroupMsg) return tobz.reply(from, 'Jika Ingin Menggunakan Bot Ketik *#Help*!!', id)
            if (command.startsWith('#')) {
                tobz.reply(from, `Maaf ${pushname}, Command *${args[0]}* Tidak Terdaftar Di Dalam *#menu*!`, id)
            }
            await tobz.sendSeen(from) 

		}

    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
        //tobz.kill().then(a => console.log(a))
    }
}

