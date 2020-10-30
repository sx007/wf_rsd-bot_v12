const Discord = require('discord.js'); 
const bot = new Discord.Client();
//подключаем файл конфигурации
let config = require('./botconfig.json'); 
//"достаём" токен и префикс
let token = config.token; 
let prefix = config.prefix;

bot.on('ready', () => { 
    // Если всё хорошо, то выводим в консоль информаию
    bot.user.setPresence({ activity: { name: 'Warface RU' }, status: 'online'})
    //.then(console.log)
    //.catch(console.error);


    console.log(`Запустился бот ${bot.user.username} ${ Date.now()}`);
    //bot.generateInvite(["ADMINISTRATOR"]).then(link => { 
        //console.log(link);
    //});
});

bot.on("message", function(message) {
if (message.author.bot) return;
if (!message.content.startsWith(prefix)) return;

const commandBody = message.content.slice(prefix.length);
const args = commandBody.split(' ');
const command = args.shift().toLowerCase();

if (command === "ping") {
    const timeTaken = Date.now() - message.createdTimestamp;
    message.reply(`Pong! Время генерации сообщения ${timeTaken}ms.`);
}

else if (command === "sum") {
    const numArgs = args.map(x => parseFloat(x));
    const sum = numArgs.length;
    message.reply(`Количество аргуметов: ${sum}!`);
}
});

bot.login(token);
