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

/* Подключение / отключение / переходы голосовых каналов */
//bot.on('voiceStateUpdate', (oldState, newState) => console.log(oldState +" + " + newState));
/*
bot.on("voiceStateUpdate", (oldState, newState) => {
    const Channel = bot.channels.cache.get("353436958724456448"); // The channel you want the user to be moved in.

    if (!Channel) return console.error("Invalid channel."); // Making sure the channel exists.

    if (!newState.channel) return false; // The user was disconnected from a channel.

    if (newState.channelID !== Channel.id) { // Checking if the user is in the wanted channel.
        newState.member.voice.setChannel(Channel).catch(error => console.error(error)); // Moving the user to the desired channel.
    };
});
*/
/*
bot.on("voiceStateUpdate", (oldState, newState) => {
    if(oldState.channel && !newState.channel) { //если пользователь вышел из канала
        console.log(oldState + " + " + newState);
    } 
})
*/
/*
bot.on('voiceStateUpdate', (oldMember, newMember) => {
    const newUserChannel = newMember.voice.channelID
    const oldUserChannel = oldMember.voice.channelID
    const textChannel = message.guild.channels.cache.get('712677731023716452')

    if(newUserChannel === '712677767333937284') {
        textChannel.send(`${newMember.user.username} (${newMember.id}) has joined the channel`)
    } else if (oldUserChannel === '712677767333937284' && newUserChannel !== '712677767333937284') {
        textChannel.send(`${newMember.user.username} (${newMember.id}) has left the channel`)
    }
})
*/
/*
client.on("voiceStateUpdate", (oldState, newState) => {
    // Do anything here with the updated state.
    if(oldState.speaking !== newState.speaking) {
        const channel = bot.channels.cache.get('353436958724456448');
        channel.send('Подключился к голосовому каналу');
    }
});
*/
/*
bot.on('voiceStateUpdate', (oldState, newState) => {
    let oldStateChannel = oldState.channelID;
    let newStateChannel = newState.channelID;

    //Когда подключен к голосовому каналу
    if(oldStateChannel === undefined && newStateChannel !== undefined) {
        //channel = bot.channels.cache.get('353436958724456448');
        sysCh.send('Подключился к голосовому каналу');
    } 

    // if nobody left the channel in question, return.
    if (oldState.channelID !==  oldState.guild.me.voice.channelID || newState.channel)
    return;

    // otherwise, check how many people are in the channel now
    if (!oldState.channel.members.size - 1) 
    setTimeout(() => { // if 1 (you), wait five minutes
        if (!oldState.channel.members.size - 1) // if there's still 1 member, 
        oldState.channel.leave(); // leave
    }, 300000); // (5 min in ms)

});
*/

bot.on('voiceChannelJoin', (member,newChannel) => {
    console.log("Join in voice channel", member.username, newChannel.name);
    let sysCh = bot.channels.cache.get('353436958724456448');
    sysCh.send(member.username + " подключился к голосовому каналу [" + newChannel.name + "]");
});

bot.on('voiceChannelLeave', (member,oldChannel) => {
    console.log("Leave voice channel", member.username, oldChannel.name);
});

bot.on('voiceChannelSwitch', (member, newChannel, oldChannel) => {
    console.log("Switch voice channel", member.username, oldChannel.name, newChannel.name);
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

/*
//Пользоваель подключился к голосовому каналу
bot.on('voiceChannelJoin', (member, channel) => {
    console.log(member.user.tag+' подключился '+channel.name+'!');
    //channel = bot.channels.cache.get('353436958724456448');
    //sysCh.send('Подключился к голосовому каналу');

});
//Пользоваель отключился от голосового канала
bot.on('voiceChannelLeave', (member, channel) => {
    console.log(member.user.tag+" покинул "+channel.name+"!");
});
//Пользователь переходит из одного голосового канала в другой
bot.on('voiceChannelSwitch', (member, oldChannel, newChannel) => {
    console.log(member.user.tag+" отключился из "+oldChannel.name+" и подключился к "+newChannel.name+"!");
});
//Пользователь отключил микрофон
bot.on('voiceChannelMute', (member, muteType) => {
    console.log(member.user.tag+" отключил микрофон! (type: "+muteType);
});
//Пользователь включил себе микрофон
bot.on('voiceChannelMute', (member, oldMuteType) => {
    console.log(member.user.tag+" включил микрофон!");
});
//Пользователь отключил себе звук
bot.on('voiceChannelDeaf', (member, deafType) => {
    console.log(member.user.tag+" отключил себе звук!");
});
//Пользователь включил себе звук
bot.on('voiceChannelUneaf', (member, deafType) => {
    console.log(member.user.tag+" включил себе звук!");
});
//Пользователь начал трансляцию
bot.on('voiceStreamingStart', (member, voiceChannel) => {
    console.log(member.user.tag+" запустил трансляцию на канале "+voiceChannel.name);
});
//Пользователь завершил трансляцию
bot.on('voiceStreamingStop', (member, voiceChannel) => {
    console.log(member.user.tag+" остановил трансляцию");
});
*/
//Токен
bot.login(token);
