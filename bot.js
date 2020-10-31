const Discord = require('discord.js'); 
const bot = new Discord.Client();
//подключаем файл конфигурации
//let config = require('./botconfig.json'); 
//"достаём" токен и префикс
let token = process.env.BOT_TOKEN; 
let prefix = process.env.PREFIX;

//Вывод сообщения о работе и готовности бота
bot.on('ready', () => { 
    // Если всё хорошо, то выводим статус ему + в консоль информаию
    bot.user.setPresence({ activity: { name: 'Warface RU' }, status: 'online'})
    //.then(console.log)
    //.catch(console.error);
    console.log(`Запустился бот ${bot.user.username} ${ Date.now()}`);
});

//Обработка сообщений
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
    //message.channel.send("Ссылка-приглашение");
    //message.author.send("Ссылка-приглашение (DM)");
    //Если сообщение публичное
    if (privateMsg() == false){
        //Если сообщение от Администратора или Модератора
        if(!hasRole(message.member, "Администратор") && !hasRole(message.member, "Модераторы")){
            //Удаляем сообщение
            message.delete();
            message.author.send("Ссылки-приглашения (Invite) **запрещены** на данном сервере!\nЧтобы кого-то пригласить на другой Discord-сервер, отправьте приглашение или ссылку в личку определённому человеку.");
        }
    }
}

//Проверка на наличие префикса в начале сообщения
if (!message.content.startsWith(prefix)) return;
//Получение команды из полученного сообщения
const commandBody = message.content.slice(prefix.length);
const args = commandBody.split(' ');
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
    const numArgs = args.map(x => parseFloat(x));
    const sum = numArgs.length;
    message.reply(`Количество аргуметов: ${sum}!`);
}
});

bot.login(token);
