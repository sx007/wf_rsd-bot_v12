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
//Проверка на наличие префикса в начале сообщения
if (!message.content.startsWith(prefix)) return;
//Получение команды из полученного сообщения
const commandBody = message.content.slice(prefix.length);
const args = commandBody.split(' ');
const command = args.shift().toLowerCase();
//Проверка ролей пользователя
function hasRole(mem, r){
    if (mem.roles.cache.some(role => role.name === r)){
        return true;
    }
    else {
        return false;
    }
}
//member.roles.cache.some(role => role.name === 'Mod');

if (command === "ping") {
    const timeTaken = Date.now() - message.createdTimestamp;
    //Если сообщение не от Администратора или Модератора
    if(hasRole(message.member, "Администратор") || hasRole(message.member, "Модераторы")){
        //Если есть права
        message.reply(`У тебя есть права`);
    } else {
        //Если нет таких прав
        message.reply(`У тебя нет прав`);
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
