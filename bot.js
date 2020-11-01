const Discord = require('discord.js'); 
const bot = new Discord.Client();

//получаем токен, префикс, id канала
let token = process.env.BOT_TOKEN; 
let prefix = process.env.PREFIX;
let idChMsg = process.env.ID_CHANNEL_SEND;

/* Вывод сообщения о работе и готовности бота */
bot.on('ready', () => { 
    // Если всё хорошо, то выводим статус ему + в консоль информаию
    bot.user.setPresence({ activity: { name: 'Warface RU' }, status: 'online'})
    console.log(`Запустился бот ${bot.user.username} ${ Date.now()}`);
});

/* Обработка сообщений */
bot.on("message", function(message) {
//Если это это сам же бот, то игнорировать
if (message.author.bot) return;

//Проверка на личное сообщение
function privateMsg(){
    //Если личное сообщение
    if (message.channel.type === 'dm'){
        return true;
    }
    //Если публичное сообщение
    if (message.channel.type === 'text'){
        return false;
    }
}

//Проверка ролей пользователя
function hasRole(mem, r){
    if (mem.roles.cache.some(role => role.name === r)){
        return true;
    }
    else {
        return false;
    }
}

//Удаление из текстого канала ссылок-приглашений
if (message.content.includes('discord.gg/') ||  message.content.includes('discordapp.com/invite/')){
    //Если сообщение публичное
    if (privateMsg() == false){
        //Если сообщение от Администратора или Модератора, то разрешаем
        if(!hasRole(message.member, "Администратор") && !hasRole(message.member, "Модераторы")){
            //Удаляем сообщение
            message.delete();
            //Отправляем в личку сообщение пользователю
            message.author.send("Ссылки-приглашения (Invite) **запрещены** на данном сервере!\nЧтобы кого-то пригласить на другой Discord-сервер, отправьте приглашение или ссылку в личку определённому человеку.");
        }
    }
}

//Проверка на наличие префикса в начале сообщения
if (!message.content.startsWith(prefix)) return;
//Получение команды из полученного сообщения
const commandBody = message.content.slice(prefix.length);
const args = commandBody.split(' ');
const numArgs = args.map(x => parseFloat(x));
const numArg = numArgs.length;
const command = args.shift().toLowerCase();


//Если отправлена команда ping
if (command === "ping") {
    const timeTaken = Date.now() - message.createdTimestamp;
    //Если сообщение публичное
    if (privateMsg() == false){
        //Если публичное сообщение
        message.reply(`Публичное сообщение`);
        if (hasRole(message.member, "Администратор") || hasRole(message.member, "Модераторы")){
            //И есть права необходимые
            message.reply(`У тебя есть права`);
        } else {
            //Если нет таких прав
            message.reply(`У тебя нет прав`);
        }
    } else {
        //Если личное сообщение
        message.reply(`Личное сообщение`);
    }    
    //message.reply(`Pong! Время генерации сообщения ${timeTaken}ms.`);
}

else if (command === "sum") {
    message.reply(`Количество аргуметов: ${numArg}!`);
    //const channel = bot.channels.cache.get('353436958724456448');
    //sysCh.send('Проверка');
}

else if (command === "lol") {
    const nArg = numArg-2;
    message.reply("Всего аргрументов: " + nArg + " Последний аргумент: " + args[nArg] + "!");
    message.reply("Нулевой агрумент: " + args[0]);
    message.reply("Первый агрумент: " + args[1]);
    //message.reply(`Последний аргумент: ${lastArg} и ${args}!`);
}

});

/* Проверяем изменения голосовых каналов */
bot.on("voiceStateUpdate", (oldState, newState) => {
    //Проверяем наличие канала, куда будем отправлять сообщение
    let logChannel = bot.channels.cache.find(ch => ch.id === idChMsg);
    //Если нет такого, то не судьба
    if(!logChannel) return;

    //Канал для отправки сообщения
    let sysCh = bot.channels.cache.get(idChMsg);
    //информация о каналах и пользователе
    let oldChannel = oldState.channel;
    let oldMember = oldState.member;
    let newChannel = newState.channel;

    //Заготовка для Embed сообщения
    function EmbedMsg(color, Descr){
        let embed = new Discord.MessageEmbed()
        .setColor(color)
        .setDescription(Descr)
        .setFooter("Бот клана", "")
        .setTimestamp()
        return embed;
    }
    //Пользователь подключился к голосовому каналу
    if(!oldState.channel && newState.channel) {
        let info = `Пользователь <@${oldMember.id}> \nНик: \`${oldMember.nickname}\`\n\nподключился к каналу:  ${newChannel.name}`;
        sysCh.send(EmbedMsg(0x005F31, info));
    }
    //Пользователь вышел из голосового канала
    if(oldState.channel && !newState.channel) {
        let info = `Пользователь <@${oldMember.id}> \nНик: \`${oldMember.nickname}\`\n\nпокинул канал:  ${oldChannel.name}`;
        sysCh.send(EmbedMsg(0x5F0000, info));
    }
    //Пользователь перешёл из голосового канала в другой
    if(oldState.channel && newState.channel && newChannel !== oldChannel) {
        let info = `Пользователь <@${oldMember.id}> \nНик: \`${oldMember.nickname}\`\n\nперешёл из канала:  ${oldChannel.name}\nв канал:  ${newChannel.name}`;
        sysCh.send(EmbedMsg(0x002D5F, info));
    }
    //Пользователь выключил микрофон
    if(oldState.selfMute === false && newState.selfMute === true) {
        let info = `:microphone: Пользователь <@${oldMember.id}>\nНик: \`${oldMember.nickname}\`\nотключил микрофон.`;
        sysCh.send(EmbedMsg(0x8B572A, info));
    }
    //Пользователь включил микрофон
    if(oldState.selfMute === true && newState.selfMute === false) {
        let info = `:microphone: Пользователь <@${oldMember.id}>\nНик: \`${oldMember.nickname}\`\nвключил микрофон.`;
        sysCh.send(EmbedMsg(0x8B572A, info));
    }
    //Пользователь отключил звук
    if(oldState.selfDeaf === false && newState.selfDeaf === true){
        let info = `:mute: Пользователь <@${oldMember.id}>\nНик: \`${oldMember.nickname}\`\nотключил звук.`;
        sysCh.send(EmbedMsg(0x8B572A, info));
    }
    //Пользователь включил звук
    if(oldState.selfDeaf === true && newState.selfDeaf === false){
        let info = `:loud_sound: Пользователь <@${oldMember.id}>\nНик: \`${oldMember.nickname}\`\nвключил звук.`;
        sysCh.send(EmbedMsg(0x8B572A, info));
    }
    //Пользователь включил камеру
    if(oldState.selfVideo === false && newState.selfVideo === true){
        let info = `:film_frames: Пользователь <@${oldMember.id}>\nНик: \`${oldMember.nickname}\`\nвключил камеру.`;
        sysCh.send(EmbedMsg(0x8B572A, info));
    }
    //Пользователь выключил камеру
    if(oldState.selfVideo === true && newState.selfVideo === false){
        let info = `:film_frames: Пользователь <@${oldMember.id}>\nНик: \`${oldMember.nickname}\`\nвыключил камеру.`;
        sysCh.send(EmbedMsg(0x8B572A, info));
    }
    //Пользователь включил стрим
    if(oldState.streaming === false && newState.streaming === true){
        let info = `:red_circle: Пользователь <@${oldMember.id}>\nНик: \`${oldMember.nickname}\`\nвключил стрим.`;
        sysCh.send(EmbedMsg(0x8B572A, info));
    }
    //Пользователь выключил стрим
    if(oldState.streaming === true && newState.streaming === false){
        let info = `:red_circle: Пользователь <@${oldMember.id}>\nНик: \`${oldMember.nickname}\`\nвыключил стрим.`;
        sysCh.send(EmbedMsg(0x8B572A, info));
    }

});

//Токен
bot.login(token);
