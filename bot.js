const Discord = require('discord.js'); 
const bot = new Discord.Client();
//const logs = require('discord-logs');
//logs(bot);
//подключаем файл конфигурации
//let config = require('./botconfig.json'); 
//"достаём" токен и префикс
let token = process.env.BOT_TOKEN; 
let prefix = process.env.PREFIX;

/* Вывод сообщения о работе и готовности бота */
bot.on('ready', () => { 
    // Если всё хорошо, то выводим статус ему + в консоль информаию
    bot.user.setPresence({ activity: { name: 'Warface RU' }, status: 'online'})
    console.log(`Запустился бот ${bot.user.username} ${ Date.now()}`);
});

//const sysCh = bot.channels.cache.get('353436958724456448');

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

bot.on("voiceStateUpdate", (oldState, newState) => {
    //let oldServer = oldState.guild;
    let oldChannel = oldState.channel;
    let oldMember = oldState.member;
    //let newMember = newState.member;
    let newChannel = newState.channel;
    let sysCh = bot.channels.cache.get('353436958724456448');

    if(!oldState.channel && newState.channel) { //если пользователь подключился к голосовому каналу
        let embed = new Discord.MessageEmbed()
        .setColor(0x005F31)
        .setDescription(`Пользователь <@${oldMember.id}> \nНик: \`${oldMember.nickname}\`\n\nподключился к каналу: ${newChannel.name}`)
        .setFooter("Бот клана", "")
        .setTimestamp()
        sysCh.send(embed);

        //sysCh.send(`Пользователь <@${oldMember.id}> подключился к голосовому каналу \`${newChannel.name}\``);
        //sysCh.send("Пользователь " + oldMember.voiceChannel.user + " подключился к голосовому каналу " + newChannel.name);
    }
    if(oldState.channel && !newState.channel) { //если пользователь вышел из голосового канала
        let embed = new Discord.MessageEmbed()
        .setColor(0x5F0000)
        .setDescription(`Пользователь <@${oldMember.id}> \nНик: \`${oldMember.nickname}\`\n\nпокинул канал: ${oldChannel.name}`)
        .setFooter("Бот клана", "")
        .setTimestamp()
        sysCh.send(embed);
        //sysCh.send(`Пользователь <@${oldMember.id}> покинул голосовой канал \`${oldChannel.name}\``);
        //sysCh.send("Пользователь " + oldMember.voiceChannel.user + " покинул голосовой канал " + oldChannel.name);
    }

    if(oldState.channel && newState.channel) { //если пользователь перешёл из голосового канала в другой
        let embed = new Discord.MessageEmbed()
        .setColor(0x002D5F)
        .setDescription(`Пользователь <@${oldMember.id}> \nНик: \`${oldMember.nickname}\`\n\nперешёл из голосового канала: ${oldChannel.name}\nв канал: ${newChannel.name}`)
        //.setDescription('Пользователь: '+ newMember.user + '\nНик: `' + newMember.displayName + '`\n\nперешёл из голосового канала:  '+ oldUserChannel.name + '\nв канал:  ' + newUserChannel.name)
        .setFooter("Бот клана", "")
        .setTimestamp()
        sysCh.send(embed);
        //sysCh.send(`Пользователь <@${oldMember.id}> покинул голосовой канал \`${oldChannel.name}\``);
        //sysCh.send("Пользователь " + oldMember.voiceChannel.user + " покинул голосовой канал " + oldChannel.name);
    }


});

/*
bot.on("voiceStateUpdate", (oldMember, newMember)=> { 
let oldVoice = oldMember.voiceChannelID; 
let newVoice = newMember.voiceChannelID; 
if (oldVoice != newVoice) {
    if (oldVoice == null) {
    console.log("User joined!");
    } else if (newVoice == null) {
    console.log("User left!");
    } else {
    console.log("User switched channels!");
    }
}
});
*/

/*
bot.on('voiceChannelJoin', (member,newChannel) => {
    console.log("Join in voice channel", member.username, newChannel.name);
    let sysCh = bot.channels.cache.get('353436958724456448');
    sysCh.send(member.username + " подключился к голосовому каналу [" + newChannel.name + "]");
});

bot.on('voiceChannelLeave', (member,oldChannel) => {
    console.log("Leave voice channel", member.username, oldChannel.name);
    let sysCh = bot.channels.cache.get('353436958724456448');
    sysCh.send(member.username + "отключился от голосового канала [" + oldChannel.name + "]");
});

bot.on('voiceChannelSwitch', (member, newChannel, oldChannel) => {
    console.log("Switch voice channel", member.username, oldChannel.name, newChannel.name);
    let sysCh = bot.channels.cache.get('353436958724456448');
    sysCh.send(member.username + " сменил голосовой канал с [" + oldChannel.name + "] на [" + newChannel.name + "]");
});

bot.on('voiceStateUpdate', (oldState,newState) => {
    if(oldState.selfMute === true && newState.selfMute === false)
        console.log("unmuted")
    if(oldState.selfMute === false && newState.selfMute === true)
        console.log("muted")
    if(oldState.selfDeaf === true && newState.selfDeaf === false)
        console.log("undeaf")
    if(oldState.selfDeaf === false && newState.selfDeaf === true)
        console.log("deaf")
    if(oldState.selfStream === true && newState.selfStream === false)
        console.log("UnStream")
    if(oldState.selfStream === false && newState.selfStream === true)
        console.log("Stream")
});
*/
//Токен
bot.login(token);
