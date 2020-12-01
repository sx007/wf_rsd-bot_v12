const Discord = require('discord.js');
var request = require('request');
var express = require('express');
const bot = new Discord.Client();

//получаем токен, префикс, id канала
const token = process.env.BOT_TOKEN; 
const prefix = process.env.PREFIX;
const idChMsg = process.env.ID_CHANNEL_SEND;
const idSrv = process.env.ID_SERVER;

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

//Проверка наличия пользователя на сервере
function existInSrv(){
    //указываем на каком сервере искать
    let guild = bot.guilds.cache.get(idSrv);
    //Получаем ID пользователя отправившего сообщение
    let userID = message.author.id;
    //Если есть на указанном сервере
    if (guild.member(userID)) {
        //console.log('Есть пользователь на сервере');
        return true;
    } else {
        //console.log('Нет пользователя на сервере');
        return false;
    }
}

//Проверка на JSON
function IsJsonString(str) {
    str = typeof item !== "string"
        ? JSON.stringify(str)
        : str;
    try {
        str = JSON.parse(str);
    } catch (e) {
        return false;
    }
    if (typeof str === "object" && str !== null) {
        return true;
    }
    return false;
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
            message.reply(`Pong! Время генерации сообщения ${timeTaken}ms.`);
        } else {
            //Если нет таких прав
            message.reply(`У тебя нет прав`);
        }
    } else {
        //Если личное сообщение
        message.reply(`Личное сообщение`);
    }
}

else if (command === "sum") {
    message.reply(`Количество аргуметов: ${numArg}!`);
}

/* Команда перезагрузки бота */
else if (command === "rs") {
    //Получаем ID владельца сервера
    const ownerSrvID = bot.guilds.cache.map(guild => guild.ownerID).join("\n");
    //Функция перезапуска
    function restart() {
        return process.exit(1);
    }
    //Если сообщение публичное
    if (privateMsg() == false){
        //Проверяем автора - владелец ли сервера
        if (message.member.id === ownerSrvID) {
            //Если владелец, то перезапускаем бота
            restart();
            message.reply(`:robot: :repeat: **Бот перезапускается!**`).then(m => m.delete({timeout: 20000}));
        } else {
            //Если нет прав
            message.reply(`:no_entry: **У вас нет прав для данной команды!**`).then(m => m.delete({timeout: 20000}));
        }
    } else {
        //Если личное сообщение
        //Проверяем автора - владелец ли сервера
        if (message.author.id === ownerSrvID) {
            //Если владелец, то перезапускаем бота
            restart();
            message.reply(`:robot: :repeat: **Бот перезапускается!**`);
        } else {
            //Если нет прав
            message.reply(`:no_entry: **У вас нет прав для данной команды!**`);
        }
    }
}

/* Подбросить монетку */
else if (command === "монетка") {
    //Вычисляем случайное число от 1 до 3
    var random = Math.floor(Math.random() * 4) + 1;
    if (random === 1) {
        //Если число = 1, то выпадает орёл.
        message.channel.send(':full_moon: Орёл!');
    } else if (random === 2) { 
        //Если число = 2, то выпадает решка.
        message.channel.send(':new_moon: Решка!');
    } else if (random === 3) { 
        //Если число = 3, то монета падает ребром.
        message.channel.send(':last_quarter_moon: Монета упала ребром!');
    }
}

else if (command === "lol") {
    const nArg = numArg-2;
    message.reply("Всего аргрументов: " + nArg + " Последний аргумент: " + args[nArg] + "!");
    message.reply("Нулевой агрумент: " + args[0]);
    message.reply("Первый агрумент: " + args[1]);
    //message.reply(`Последний аргумент: ${lastArg} и ${args}!`);
}

/* Удаление сообщений */
else if (command === "удалить") {
    //Проверяем куда была отправленна данная команда
    if (privateMsg() == false){
        //публично
        if (hasRole(message.member, "Администратор") || hasRole(message.member, "Модераторы")){
            //И есть права необходимые
            if(numArg >= 3){
                message.channel.send(`:exclamation: Ты указал много аргументов.\nИспользуй команду: \`${prefix}удалить (количество сообщений)\``);
            } else {
                let msg;
                //Считаем сколько удалять сообщений
                if(numArg === 1) {
                    //Если указали только название команды
                    msg = 2;
                    //Удаляем одно сообщение
                    message.channel.bulkDelete(msg);
                } else {
                    //Берём количество из аргумента +1 (самой команды)
                    //Проверяем аргумент количества - число или нет
                    if (isNaN(parseInt(args[0]))) {
                        //console.log('Агрумент не число');
                        message.channel.send(`:exclamation: Количество удаляемых сообщений указываем **числом**.\nИспользуй: \`${prefix}удалить (количество сообщений)\``);
                    } else {
                        //console.log('Аргумент число');
                        if (parseInt(args[0]) < 0){
                            message.channel.send(`:exclamation: Количество удаляемых сообщений не должно быть отрицательным.`);
                        } else {
                            //Если количество сообщений положительное число
                            msg = parseInt(args[0]) + 1;
                            //Проверяем на лимит
                            if (parseInt(args[0]) >= 98){
                                message.channel.send(`:exclamation: Количество одновременно удаляемых сообщений должно быть меньше **98**.`);
                            } else {
                                //удаляем N количество сообщений
                                message.channel.bulkDelete(msg);
                            }
                        }
                    }
                }
            }
        } else {
            //Если нет таких прав
            message.reply(`\n:no_entry_sign: Недостаточно прав для данной команды!`);
        }
    } else {
        //лично
        message.reply(`:no_entry_sign: **Данная команда здесь недоступна!**`);
    }
}

/* Выгнать пользователя с сервера */
else if (command === "кик") {
    //Название сервера
    const nameSrv = bot.guilds.cache.map(guild => guild.name).join("\n");
    //Проверяем куда была отправленна данная команда
    if (privateMsg() == false){
        //публично
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let reas = args.slice(1).join(' ');
        //Если автор сообщения - Бот
        if (message.author.bot){
            return;
        };
        //Проверяем права на доступ к данной команде
        if (hasRole(message.member, "Администратор") || hasRole(message.member, "Модераторы")){
            if(numArg === 1) {
                //Если указали только название команды
                message.reply(`:exclamation: Неверно указана команда.\nИспользуй: \`${prefix}кик @Ник Причина_кика\``).then(m => m.delete({timeout: 20000}));
                return;
            }
            //Пользователь не найден
            if (!user){
                message.reply(`\n:no_pedestrians: Указанный пользователь не найден!`).then(m => m.delete({timeout: 15000}));
                return;
            }
            //Попытка самого себя кикнуть
            if (user.id == message.author.id){
                message.reply(`\n:no_entry_sign: Ты не можешь кикнуть себя!`).then(m => m.delete({timeout: 15000}));
                return;
            }
            //Проверяем Администратор или Модератор 
            if (hasRole(user, "Администратор") || hasRole(user, "Модераторы")){
                message.reply(`\n:no_entry_sign: Нельзя кикнуть пользователя с правами **Администратор** или **Модераторы**!`).then(m => m.delete({timeout: 15000}));
                return;
            }
            //Попытка кикнуть бота
            if (user.user.bot){
                message.reply(`\n:robot: Чем тебе бот помешал, мешок с костями? Ты не можешь кикнуть бота!`).then(m => m.delete({timeout: 15000}));
                return;
            }
            //Не указана причина кика
            if (!reas){
                reas = "Увы, не указана причина кика";
            }
            //Отправляем пользователю, которого кикнули, сообщение
            user.send(">>> Тебя кикнули с сервера **" + nameSrv + "**\nПричина: " + reas);
            //Кикаем пользователя с сервера
            user.kick(reas);
            //Проверяем наличие канала, куда будем отправлять сообщение
            let logChannel = bot.channels.cache.find(ch => ch.id === idChMsg);
            if(!logChannel) return;
            //Канал для отправки сообщения
            let sysCh = bot.channels.cache.get(idChMsg);
            //Формирование 
            let KickUser = new Discord.MessageEmbed()
            .setTitle(':diamonds: :no_pedestrians: **[КИКНУЛИ ПОЛЬЗОВАТЕЛЯ]**')
            .setColor(0xFF3700)
            .setDescription(`Пользователя ${user}\nНик: \`${user.displayName}\`\nTag: \`${user.user.username}#${user.user.discriminator}\`\n\nКто кикнул:\n${message.author}`)
            .setTimestamp()
            .setFooter("Бот клана", "")
            //Отправка сообщения
            sysCh.send(KickUser);
        } else {
            //Если нет таких прав
            message.reply(`\n:no_entry_sign: Недостаточно прав для данной команды!`).then(m => m.delete({timeout: 20000}));
        }
    } else {
        //лично
        message.reply(`:no_entry_sign: Данная команда здесь недоступна!`);
    }
}

/* Забанить пользователя на сервере */
else if (command === "бан") {
    //Название сервера
    const nameSrv = bot.guilds.cache.map(guild => guild.name).join("\n");
    //Проверяем куда была отправленна данная команда
    if (privateMsg() == false){
        //публично
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let reas = args.slice(1).join(' ');
        //Если автор сообщения - Бот
        if (message.author.bot){
            return;
        };
        //Проверяем права на доступ к данной команде
        if (hasRole(message.member, "Администратор") || hasRole(message.member, "Модераторы")){
            if(numArg === 1) {
                //Если указали только название команды
                message.reply(`:exclamation: Неверно указана команда.\nИспользуй: \`${prefix}бан @Ник Причина_бана\``).then(m => m.delete({timeout: 20000}));
                return;
            }
            //Пользователь не найден
            if (!user){
                message.reply(`\n:no_pedestrians: Указанный пользователь не найден!`).then(m => m.delete({timeout: 15000}));
                return;
            }
            //Попытка самого себя забанить
            if (user.id == message.author.id){
                message.reply(`\n:no_entry_sign: Ты не можешь забанить себя!`).then(m => m.delete({timeout: 15000}));
                return;
            }
            //Проверяем Администратор или Модератор 
            if (hasRole(user, "Администратор") || hasRole(user, "Модераторы")){
                message.reply(`\n:no_entry_sign: Нельзя забанить пользователя с правами **Администратор** или **Модераторы**!`).then(m => m.delete({timeout: 15000}));
                return;
            }
            //Попытка забанить бота
            if (user.user.bot){
                message.reply(`\n:robot: Чем тебе бот помешал, мешок с костями? Ты не можешь забанить бота!`).then(m => m.delete({timeout: 15000}));
                return;
            }
            //Не указана причина бана
            if (!reas){
                reas = "Увы, не указана причина бана";
            }
            //Отправляем пользователю, которого забанили, сообщение
            user.send(">>> Тебя забанили на сервере **" + nameSrv + "**\nПричина: " + reas);
            //Баним пользователя на сервере
            user.ban({ reason: reas });
            //Проверяем наличие канала, куда будем отправлять сообщение
            let logChannel = bot.channels.cache.find(ch => ch.id === idChMsg);
            if(!logChannel) return;
            //Канал для отправки сообщения
            let sysCh = bot.channels.cache.get(idChMsg);
            //Формирование 
            let BanUser = new Discord.MessageEmbed()
            .setTitle(':diamonds: :no_pedestrians: **[ЗАБАНИЛИ ПОЛЬЗОВАТЕЛЯ]**')
            .setColor(0xFF3700)
            .setDescription(`Пользователя ${user}\nНик: \`${user.displayName}\`\nTag: \`${user.user.username}#${user.user.discriminator}\`\n\nКто забанил:\n${message.author}`)
            .setTimestamp()
            .setFooter("Бот клана", "")
            //Отправка сообщения
            sysCh.send(BanUser);
        } else {
            //Если нет таких прав
            message.reply(`\n:no_entry_sign: Недостаточно прав для данной команды!`).then(m => m.delete({timeout: 20000}));
        }
    } else {
        //лично
        message.reply(`:no_entry_sign: Данная команда здесь недоступна!`);
    }
}


else if (command === "0") {
    let link = "http://api.warface.ru/user/stat/?name=мельх1&server=1";
    let urlEnc = encodeURI(link);
    var options = {url: urlEnc, method: 'GET', json: true, headers: {'User-Agent': 'request', 'Accept-Language' : 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7'}, timeout: 10000};

    //Запрос с лимитом
    request(options, function(error, response, body){
        //Если возникла ошибка
        if (error) {
            console.log(error);
            return;
        } else {
            //Всё хорошо
            console.log("Всё заебись!");
            //Если есть ответ
            if (response) {
                console.log("yes response");
                console.log(response.statusCode);
                //Проверяем содержимое
                if (body) {
                    console.log("yes body");
                    console.log(body);
                } else {
                    console.log("no body");
                }
            } else {
                console.log("no response");
            }
        }
    });
}



/* WF */
else if (command === "wf") {
    //console.log("WF");
    //Заготовка для Embed сообщения
    function EmbedMsg(title, color, Descr){
        let embed = new Discord.MessageEmbed()
        .setTitle(title)
        .setColor(color)
        .setDescription(Descr)
        .setFooter("Бот клана", "")
        .setTimestamp()
        return embed;
    }

    //парсинг данных с API
    function parseApi(str) {
        //Проверяем полученное содержимое на JSON
        if (IsJsonString(str) == true) {
            //Если это JSON
            console.log("JSON");
        } else {
            //Если это не JSON
            console.log("не JSON");
        }
    }
    /*
    var data = JSON.parse(resp);
    if(typeof data.age === 'undefined')
    alert('Поля "age" нет');
    else
    alert('Поле "age" в наличии, значение: ' + data.age);
    */


    //Номер сервера в название
    function numSrvToStr(num){
        if (num == 1){
            return "Альфа";
        }
        if (num == 2){
            return "Браво";
        }
        if (num == 3){
            return "Чарли";
        }
    }
    //Если указали только название команды
    if(numArg === 1 || numArg > 3) {
        message.reply(EmbedMsg(':no_entry_sign: Ошибка',0x02A5D0,`Укажите через пробел ник бойца, которого будите искать.\nТак же можно указать сервер через пробел.\nПример: \`${prefix}wf НикБойца Альфа\``)).then(m => m.delete({timeout: 20000}));
        return;
    }
    //Если не указали где искать
    if(numArg === 2) {
        //console.log(args[0]);
        let uName = args[0].toLowerCase();
        //Проверяем указанный ник
        if (uName.length >= 4 && uName.length <= 16) {
            //Номер сервера + Название сервера
            let numSrv = 1;
            let nameSrv = numSrvToStr(numSrv);
            //Начинаем проверку на сервере Альфа
            let link = "http://api.warface.ru/user/stat/?name=" + uName + "&server=" + numSrv;
            let urlEnc = encodeURI(link);
            var options = {url: urlEnc, method: 'GET', json: true, headers: {'User-Agent': 'request', 'Accept-Language' : 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7'}, timeout: 10000};
            //Запрос
            request(options, function(err, res, data){
            //var options = {url: urlEnc, json: true, headers: {'User-Agent': 'request'},timeout: 10000};
            //request.get(options, function(err, res, data) {
                //Если ошибка
                if (err) {
                    //console.log('Error: ', err);
                    message.reply(EmbedMsg(':no_entry_sign: Ошибка',0x02A5D0,`Сервер с информацией недоступен.\nПопробуйте отправить команду позже.`)).then(m => m.delete({timeout: 20000}));
                    return;
                }
                //Если нет ответа запроса
                if(!res) {
                    message.reply(EmbedMsg(':no_entry_sign: Ошибка',0x02A5D0,`Не получен ответ на запроса в течении 10 секунд.\nПопробуйте отправить команду позже.`)).then(m => m.delete({timeout: 20000}));
                    return;
                } else {
                    console.log('statusCode:', res && res.statusCode);
                    //Если статус запроса 200
                    if (res.statusCode == 200) {
                        //Нашли на Альфа
                        if (IsJsonString(data) == true) {
                            console.log("norm");
                        }
                        parseApi(data);
                        message.reply(EmbedMsg(':bar_chart: Статистика по бойцу',0x02A5D0,`Боец найден на сервере **${nameSrv}**\n`));
                    } else {
                        //Неверный запрос
                        if (res.statusCode == 400) {
                            //Не нашли на Альфе
                            if (data.message == "Пользователь не найден"){
                                //Не нашли на Альфе - надо дальше искать (Браво)
                                numSrv = numSrv+1;
                                nameSrv = numSrvToStr(numSrv);
                                let link = "http://api.warface.ru/user/stat/?name=" + uName + "&server=" + numSrv;
                                let urlEnc = encodeURI(link);
                                var options = {url: urlEnc, method: 'GET', json: true, headers: {'User-Agent': 'request', 'Accept-Language' : 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7'}, timeout: 10000};
                                //Запрос
                                request(options, function(err, res, data){
                                    //Если ошибка
                                    if (err) {
                                        //console.log('Error: ', err);
                                        message.reply(EmbedMsg(':no_entry_sign: Ошибка',0x02A5D0,`Сервер с информацией недоступен.\nПопробуйте отправить команду позже.`)).then(m => m.delete({timeout: 20000}));
                                        return;
                                    }
                                    //Если нет ответа запроса
                                    if(!res) {
                                        message.reply(EmbedMsg(':no_entry_sign: Ошибка',0x02A5D0,`Не получен ответ на запроса в течении 10 секунд.\nПопробуйте отправить команду позже.`)).then(m => m.delete({timeout: 20000}));
                                        return;
                                    } else {
                                        //Если статус запроса 200
                                        if (res.statusCode == 200) {
                                            //Нашли на Браво
                                            message.reply(EmbedMsg(':bar_chart: Статистика по бойцу',0x02A5D0,`Боец найден на сервере **${nameSrv}**\n`));
                                        } else {
                                            //Неверный запрос
                                            if (res.statusCode == 400) {
                                                //Не нашли на Браво
                                                if (data.message == "Пользователь не найден"){
                                                    //надо дальше искать (Чарли)
                                                    numSrv = numSrv+1;
                                                    nameSrv = numSrvToStr(numSrv);
                                                    let link = "http://api.warface.ru/user/stat/?name=" + uName + "&server=" + numSrv;
                                                    let urlEnc = encodeURI(link);
                                                    var options = {url: urlEnc, method: 'GET', json: true, headers: {'User-Agent': 'request', 'Accept-Language' : 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7'}, timeout: 10000};
                                                    //Запрос
                                                    request(options, function(err, res, data){
                                                        //Если ошибка
                                                        if (err) {
                                                            //console.log('Error: ', err);
                                                            message.reply(EmbedMsg(':no_entry_sign: Ошибка',0x02A5D0,`Сервер с информацией недоступен.\nПопробуйте отправить команду позже.`)).then(m => m.delete({timeout: 20000}));
                                                            return;
                                                        }
                                                        //Если нет ответа запроса
                                                        if(!res) {
                                                            message.reply(EmbedMsg(':no_entry_sign: Ошибка',0x02A5D0,`Не получен ответ на запроса в течении 10 секунд.\nПопробуйте отправить команду позже.`)).then(m => m.delete({timeout: 20000}));
                                                            return;
                                                        } else {
                                                            //Если статус запроса 200
                                                            if (res.statusCode == 200) {
                                                                //Нашли на Чарли
                                                                message.reply(EmbedMsg(':bar_chart: Статистика по бойцу',0x02A5D0,`Боец найден на сервере **${nameSrv}**\n`));
                                                            } else {
                                                                //Неверный запрос
                                                                if (res.statusCode == 400) {
                                                                    //Не нашли даже на Чарли
                                                                    if (data.message == "Пользователь не найден"){
                                                                        message.reply(EmbedMsg(':no_entry_sign: Ошибка',0x02A5D0,`На всех трёх игровых серверах такой __боец не найден__`));
                                                                    }
                                                                    //Чарли
                                                                    if (data.message == "Игрок скрыл свою статистику"){
                                                                        message.reply(EmbedMsg(':no_entry_sign: Ошибка',0x02A5D0,`Боец найден на сервере **${nameSrv}**\nНо его __статистика скрыта__`));
                                                                    }
                                                                    if (data.message == "Персонаж неактивен"){
                                                                        message.reply(EmbedMsg(':no_entry_sign: Ошибка',0x02A5D0,`Боец найден на сервере **${nameSrv}**\nНо его __персонаж неактивен__`));
                                                                    }
                                                                }
                                                                //Доступ запрещён || Страница не найдена || Внутренняя ошибка сервера
                                                                if (res.statusCode == 403 || res.statusCode == 404 || res.statusCode == 500) {
                                                                    message.reply(EmbedMsg(':no_entry_sign: Ошибка',0x02A5D0,`Сервер с информацией недоступен.\nПопробуйте отправить команду позже.`)).then(m => m.delete({timeout: 20000}));
                                                                }
                                                            }
                                                        }
                                                    });
                                                }
                                                //Браво
                                                if (data.message == "Игрок скрыл свою статистику"){
                                                    message.reply(EmbedMsg(':no_entry_sign: Ошибка',0x02A5D0,`Боец найден на сервере **${nameSrv}**\nНо его __статистика скрыта__`));
                                                }
                                                if (data.message == "Персонаж неактивен"){
                                                    message.reply(EmbedMsg(':no_entry_sign: Ошибка',0x02A5D0,`Боец найден на сервере **${nameSrv}**\nНо его __персонаж неактивен__`));
                                                }
                                            }
                                            //Доступ запрещён || Страница не найдена || Внутренняя ошибка сервера
                                            if (res.statusCode == 403 || res.statusCode == 404 || res.statusCode == 500) {
                                                message.reply(EmbedMsg(':no_entry_sign: Ошибка',0x02A5D0,`Сервер с информацией недоступен.\nПопробуйте отправить команду позже.`)).then(m => m.delete({timeout: 20000}));
                                            }
                                        }
                                    }
                                    
                                });
                            }
                            //Альфа
                            if (data.message == "Игрок скрыл свою статистику"){
                                message.reply(EmbedMsg(':no_entry_sign: Ошибка',0x02A5D0,`Боец найден на сервере **${nameSrv}**\nНо его __статистика скрыта__`));
                            }
                            if (data.message == "Персонаж неактивен"){
                                message.reply(EmbedMsg(':no_entry_sign: Ошибка',0x02A5D0,`Боец найден на сервере **${nameSrv}**\nНо его __персонаж неактивен__`));
                            }
                        }
                        //Доступ запрещён || Страница не найдена || Внутренняя ошибка сервера
                        if (res.statusCode == 403 || res.statusCode == 404 || res.statusCode == 500) {
                            message.reply(EmbedMsg(':no_entry_sign: Ошибка',0x02A5D0,`Сервер с информацией недоступен.\nПопробуйте отправить команду позже.`)).then(m => m.delete({timeout: 20000}));
                        }
                    }
                }
            });
        } else {
            message.reply(EmbedMsg(':no_entry_sign: Ошибка',0x02A5D0,`Указанный ник бойца должен быть **от 4 до 16 символов**`)).then(m => m.delete({timeout: 20000}));
            return;
        }
    }
    //Если указали где искать
    if(numArg === 3) {
        //console.log(args[0]);
        //console.log(args[1]);
        //Ник бойца + сервер
        let uName = args[0].toLowerCase();
        //Проверяем указанный ник
        if (uName.length >= 4 && uName.length <= 16) {
            //console.log("Количество символов в нике: ", uName.length);
            let uSrv = args[1].toLowerCase();
            //Номер сервера + Название сервера
            let numSrv;
            let nameSrv;
            //Проверяем указанное название сервера
            if (uSrv == "альфа"){
                numSrv = 1;
                nameSrv = "Альфа";
            } else if (uSrv == "браво"){
                numSrv = 2;
                nameSrv = "Браво";
            } else if (uSrv == "чарли"){
                numSrv = 3;
                nameSrv = "Чарли";
            } else {
                message.reply(EmbedMsg(':no_entry_sign: Ошибка',0x02A5D0,`**Неверно указан сервер.**\n\nДоступные варианты:\n\`Альфа Браво Чарли\``)).then(m => m.delete({timeout: 20000}));
                return;
            }
            //Функция названия класса в игре
            function classInGame(cl){
                let gameClass;
                if (cl == "Rifleman"){
                    gameClass = "Штурмовик";
                }
                if (cl == "Engineer"){
                    gameClass = "Инженер";
                }
                if (cl == "Medic"){
                    gameClass = "Медик";
                }
                if (cl == "Recon"){
                    gameClass = "Снайпер";
                }
                if (cl == "Heavy"){
                    gameClass = "СЭД";
                }
                return gameClass;
            }
            //Начинаем проверку на указанном сервере
            //console.log(getCodeUser(uName, numSrv));
            let link = "http://api.warface.ru/user/stat/?name=" + uName + "&server=" + numSrv;
            let urlEnc = encodeURI(link);
            var options = {url: urlEnc, method: 'GET', json: true, headers: {'User-Agent': 'request', 'Accept-Language' : 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7'}, timeout: 10000};
            //Запрос
            request(options, function(err, res, data){
                //Если ошибка
                if (err) {
                    console.log('Error: ', err);
                    message.reply(EmbedMsg(':no_entry_sign: Ошибка',0x02A5D0,`Сервер с информацией недоступен.\nПопробуйте отправить команду позже.`)).then(m => m.delete({timeout: 20000}));
                    return;
                }
                //Если нет ответа запроса
                if(!res) {
                    console.log('res: ', res);
                    message.reply(EmbedMsg(':no_entry_sign: Ошибка',0x02A5D0,`Не получен ответ на запроса в течении 10 секунд.\nПопробуйте отправить команду позже.`)).then(m => m.delete({timeout: 20000}));
                    return;
                } else {
                    //Если статус запроса 200
                    if (res.statusCode == 200) {
                        //console.log('Status 200:', res.statusCode);
                        message.reply(EmbedMsg(':bar_chart: Статистика по бойцу',0x02A5D0,`Информация...`));
                    } else {
                        //Неверный запрос
                        if (res.statusCode == 400) {
                            //console.log('Status 400:', res.statusCode);
                            //console.log('Data.message 400:', data.message);
                            if (data.message == "Пользователь не найден"){
                                message.reply(EmbedMsg(':no_entry_sign: Ошибка',0x02A5D0,`На указанном сервере такой __боец не найден__`));
                            }
                            if (data.message == "Игрок скрыл свою статистику"){
                                message.reply(EmbedMsg(':no_entry_sign: Ошибка',0x02A5D0,`Боец найден на сервере **${nameSrv}**\nНо его __статистика скрыта__`));
                            }
                            if (data.message == "Персонаж неактивен"){
                                message.reply(EmbedMsg(':no_entry_sign: Ошибка',0x02A5D0,`Боец найден на сервере **${nameSrv}**\nНо его __персонаж неактивен__`));
                            }
                        }
                        //Доступ запрещён || Страница не найдена || Внутренняя ошибка сервера
                        if (res.statusCode == 403 || res.statusCode == 404 || res.statusCode == 500) {
                            //console.log('Status 403+404+500:', res.statusCode);
                            message.reply(EmbedMsg(':no_entry_sign: Ошибка',0x02A5D0,`Сервер с информацией недоступен.\nПопробуйте отправить команду позже.`)).then(m => m.delete({timeout: 20000}));
                        }
                    }
                }
            });
        } else {
            message.reply(EmbedMsg(':no_entry_sign: Ошибка',0x02A5D0,`Указанный ник бойца должен быть **от 4 до 16 символов**`)).then(m => m.delete({timeout: 20000}));
        }
    }
}


});

/* Проверяем изменения голосовых каналов */
bot.on("voiceStateUpdate", (oldState, newState) => {
    //console.log(oldState);
    //console.log(newState);
    //Проверяем наличие канала, куда будем отправлять сообщение
    let logChannel = bot.channels.cache.find(ch => ch.id === idChMsg);
    if(!logChannel) return;

    //Канал для отправки сообщения
    let sysCh = bot.channels.cache.get(idChMsg);
    //информация о каналах и пользователе
    let oldChannel = oldState.channel;
    let newChannel = newState.channel;
    let oldMember = oldState.member;
    let newMember = newState.member;
    let srvNick = '';
    //Проверяем серверный ник
    if(oldMember.nickname == null){
        srvNick = 'По умолчанию';
    } else {
        srvNick = oldMember.nickname;
    }
    //Заготовка для Embed сообщения
    function EmbedMsg(color, Descr){
        let embed = new Discord.MessageEmbed()
        .setColor(color)
        .setDescription(Descr)
        .setFooter("Бот клана", "")
        .setTimestamp()
        return embed;
    }
    //id AFK канала сервера
    const afkSrv = bot.guilds.cache.map(guild => guild.afkChannelID).join("\n");

    //Пользователь подключился к голосовому каналу
    if(!oldState.channel && newState.channel) {
        let info = `Пользователь <@${oldMember.id}>\nНик: \`${srvNick}\`\nTag: \`${oldMember.user.username}#${oldMember.user.discriminator}\`\n\nподключился к каналу:  ${newChannel.name}`;
        sysCh.send(EmbedMsg(0x005F31, info));
    }
    //Пользователь вышел из голосового канала
    if(oldState.channel && !newState.channel) {
        let info = `Пользователь <@${oldMember.id}> \nНик: \`${srvNick}\`\nTag: \`${oldMember.user.username}#${oldMember.user.discriminator}\`\n\nпокинул канал:  ${oldChannel.name}`;
        sysCh.send(EmbedMsg(0x5F0000, info));
    }
    //Пользователь перешёл из голосового канала в другой
    if(oldState.channel && newState.channel && newChannel !== oldChannel) {
        let info = `Пользователь <@${oldMember.id}> \nНик: \`${srvNick}\`\nTag: \`${oldMember.user.username}#${oldMember.user.discriminator}\`\n\nперешёл из канала:  ${oldChannel.name}\nв канал:  ${newChannel.name}`;
        sysCh.send(EmbedMsg(0x002D5F, info));
    }
    //Пользователь выключил микрофон
    if(oldState.selfMute === false && newState.selfMute === true) {
        let info = `:microphone: Пользователь <@${oldMember.id}>\nНик: \`${srvNick}\`\nTag: \`${oldMember.user.username}#${oldMember.user.discriminator}\`\n\nотключил микрофон.`;
        sysCh.send(EmbedMsg(0x8B572A, info));
    }
    //Пользователь включил микрофон
    if(oldState.selfMute === true && newState.selfMute === false && oldState.channel.id !== afkSrv) {
        let info = `:microphone: Пользователь <@${oldMember.id}>\nНик: \`${srvNick}\`\nTag: \`${oldMember.user.username}#${oldMember.user.discriminator}\`\n\nвключил микрофон.`;
        sysCh.send(EmbedMsg(0x8B572A, info));
    }
    //Пользователь отключил звук
    if(oldState.selfDeaf === false && newState.selfDeaf === true && newState.channel.id !== afkSrv){
        let info = `:mute: Пользователь <@${oldMember.id}>\nНик: \`${srvNick}\`\nTag: \`${oldMember.user.username}#${oldMember.user.discriminator}\`\n\nотключил звук.`;
        sysCh.send(EmbedMsg(0x8B572A, info));
    }
    //Пользователь включил звук
    if(oldState.selfDeaf === true && newState.selfDeaf === false){
        let info = `:loud_sound: Пользователь <@${oldMember.id}>\nНик: \`${srvNick}\`\nTag: \`${oldMember.user.username}#${oldMember.user.discriminator}\`\n\nвключил звук.`;
        sysCh.send(EmbedMsg(0x8B572A, info));
    }
    //Пользователь включил камеру
    if(oldState.selfVideo === false && newState.selfVideo === true){
        let info = `:film_frames: Пользователь <@${oldMember.id}>\nНик: \`${srvNick}\`\nTag: \`${oldMember.user.username}#${oldMember.user.discriminator}\`\n\nвключил камеру.`;
        sysCh.send(EmbedMsg(0x8B572A, info));
    }
    //Пользователь выключил камеру
    if(oldState.selfVideo === true && newState.selfVideo === false){
        let info = `:film_frames: Пользователь <@${oldMember.id}>\nНик: \`${srvNick}\`\nTag: \`${oldMember.user.username}#${oldMember.user.discriminator}\`\n\nвыключил камеру.`;
        sysCh.send(EmbedMsg(0x8B572A, info));
    }
    //Пользователь включил стрим
    if(oldState.streaming === false && newState.streaming === true){
        let info = `:red_circle: Пользователь <@${oldMember.id}>\nНик: \`${srvNick}\`\nTag: \`${oldMember.user.username}#${oldMember.user.discriminator}\`\n\nвключил стрим.`;
        sysCh.send(EmbedMsg(0x8B572A, info));
    }
    //Пользователь выключил стрим
    if(oldState.streaming === true && newState.streaming === false){
        let info = `:red_circle: Пользователь <@${oldMember.id}>\nНик: \`${srvNick}\`\nTag: \`${oldMember.user.username}#${oldMember.user.discriminator}\`\n\nвыключил стрим.`;
        sysCh.send(EmbedMsg(0x8B572A, info));
    }
    //Пользователю выключили микрофон на сервере
    if(oldState.serverMute === false && newState.serverMute === true){
        //Полуаем из логов кто это сделал
        newMember.guild.fetchAuditLogs().then(logs => {
            //Получения id пользователя, который выполнил непосредственно
            userID = logs.entries.first().executor.id;
            let info = `:large_orange_diamond: :microphone: Пользователю <@${oldMember.id}>\nНик: \`${srvNick}\`\nTag: \`${oldMember.user.username}#${oldMember.user.discriminator}\`\n\nвыключили микрофон на сервере.\n\nКто отключил:\n<@${userID}>`;
            sysCh.send(EmbedMsg(0x8B572A, info));
        });
    }
    //Пользователю включили микрофон на сервере
    if(oldState.serverMute === true && newState.serverMute === false){
        //Полуаем из логов кто это сделал
        newMember.guild.fetchAuditLogs().then(logs => {
            //Получения id пользователя, который выполнил непосредственно
            userID = logs.entries.first().executor.id;
            let info = `:large_orange_diamond: :microphone: Пользователю <@${oldMember.id}>\nНик: \`${srvNick}\`\nTag: \`${oldMember.user.username}#${oldMember.user.discriminator}\`\n\nвключили микрофон на сервере.\n\nКто включил:\n<@${userID}>`;
            sysCh.send(EmbedMsg(0x8B572A, info));
        });
    }
    //Пользователю выключили звук на сервере
    if(oldState.serverDeaf === false && newState.serverDeaf === true){
        //Полуаем из логов кто это сделал
        newMember.guild.fetchAuditLogs().then(logs => {
            //Получения id пользователя, который выполнил непосредственно
            userID = logs.entries.first().executor.id;
            let info = `:large_orange_diamond: :mute: Пользователю <@${oldMember.id}>\nНик: \`${srvNick}\`\nTag: \`${oldMember.user.username}#${oldMember.user.discriminator}\`\n\nвыключили звук на сервере.\n\nКто отключил:\n<@${userID}>`;
            sysCh.send(EmbedMsg(0x8B572A, info));
        });
    }
    //Пользователю включили звук на сервере
    if(oldState.serverDeaf === true && newState.serverDeaf === false){
        //Полуаем из логов кто это сделал
        newMember.guild.fetchAuditLogs().then(logs => {
            //Получения id пользователя, который выполнил непосредственно
            userID = logs.entries.first().executor.id;
            let info = `:large_orange_diamond: :loud_sound: Пользователю <@${oldMember.id}>\nНик: \`${srvNick}\`\nTag: \`${oldMember.user.username}#${oldMember.user.discriminator}\`\n\nвключили звук на сервере.\n\nКто включил:\n<@${userID}>`;
            sysCh.send(EmbedMsg(0x8B572A, info));
        });
    }
});

//Сообщаем о новом пользователе на сервере
bot.on('guildMemberAdd', member => {
    //Проверяем наличие канала, куда будем отправлять сообщение
    let logChannel = bot.channels.cache.find(ch => ch.id === idChMsg);
    if(!logChannel) return;

    //Канал для отправки сообщения
    let sysCh = bot.channels.cache.get(idChMsg);
    //Формирование 
    let NewUserServer = new Discord.MessageEmbed()
    .setTitle('**[Новый пользователь]**')
    .setColor(0xFDFDFD)
    .setDescription(`Пользователь ${member}\nНик: \`${member.displayName}\`\nНик: \`${member.user.username}#${member.user.discriminator}\`\n\nтолько что зашёл на сервер`)
    .setTimestamp()
    .setFooter("Бот клана", "")
    //Отправка сообщения
    sysCh.send(NewUserServer);

    //Отправляем в личку сообщение пользователю 
    //Название сервера
    const nameSrv = bot.guilds.cache.map(guild => guild.name).join("\n");
    member.send(`>>> Добро пожаловать на сервер **${nameSrv}**!\n\n**1.** Необходимо сменить свой ник на нашем сервере по шаблону **Ник в игре (Ваше имя)**.\nПример: **ТащерДжек (Вася)**\n\n**2.** В текстовом канале **#welcome** есть краткая информация о ролях, кто может их выдать. А так же информация о текстовых и голосовых каналах.\n\n**3.** В текстовом канале **#rules** ознакомьтесь с правилами нашего сервера.`);
});

//Сообщаем о пользователе, который покинул сервер
bot.on('guildMemberRemove', member => {
    //Проверяем наличие канала, куда будем отправлять сообщение
    let logChannel = bot.channels.cache.find(ch => ch.id === idChMsg);
    if(!logChannel) return;
    //Канал для отправки сообщения
    let sysCh = bot.channels.cache.get(idChMsg);
    //Формирование
    let OldUserServer = new Discord.MessageEmbed()
    .setTitle('**[Покинул пользователь]**')
    .setColor(0xFDFDFD)
    .setDescription(`Пользователь ${member}\nНик: \`${member.displayName}\`\nНик: \`${member.user.username}#${member.user.discriminator}\`\n\nпокинул наш сервер`)
    .setTimestamp()
    .setFooter("Бот клана", "")
    //Отправка сообщения
    sysCh.send(OldUserServer);
});

/* Проверка на изменение прав, ника, аватара */
bot.on('guildMemberUpdate', function(oldMember, newMember) {
    //Проверяем наличие канала, куда будем отправлять сообщение
    let logChannel = bot.channels.cache.find(ch => ch.id === idChMsg);
    if(!logChannel) return;
    //Канал для отправки сообщения
    let sysCh = bot.channels.cache.get(idChMsg);

    //объявляем изменения
    var Changes = {
        unknown: 0,
        addedRole: 1,
        removedRole: 2,
        username: 3,
        nickname: 4,
    };
    var change = Changes.unknown;

    //Заготовка для Embed сообщения
    function EmbedMsg(title, color, Descr){
        let embed = new Discord.MessageEmbed()
        .setTitle(title)
        .setColor(color)
        .setDescription(Descr)
        .setFooter("Бот клана", "")
        .setTimestamp()
        return embed;
    }

    //Если изменился личный ник пользователя
    if (newMember.user.username !== oldMember.user.username)
        change = Changes.username;
    //Если изменился серверный ник пользователя
    if (newMember.nickname !== oldMember.nickname)
        change = Changes.nickname;
    //Если добавили роль
    var addedRole = '';
    if (oldMember.roles.cache.size < newMember.roles.cache.size) {
        change = Changes.addedRole;
        //Получаем название роли
        for (const role of newMember.roles.cache.map(x => x.id)) {
            if (!oldMember.roles.cache.has(role)) {
                addedRole = oldMember.guild.roles.cache.get(role).name;
            }
        }
    }
    //Если удалили роль
    var removedRole = '';
    if (oldMember.roles.cache.size > newMember.roles.cache.size) {
        change = Changes.removedRole;
        //Получаем название роли
        for (const role of oldMember.roles.cache.map(x => x.id)) {
            if (!newMember.roles.cache.has(role)) {
                removedRole = oldMember.guild.roles.cache.get(role).name;
            }
        }
    }

    //Отправляем сообщение в канал
    var log = newMember.guild.channels.cache.find(ch => ch.id === idChMsg);
    let info = '';
    if (log) {
        switch (change) {
            //Неизвестное изменение
            case Changes.unknown:
                //info = `Пользователь <@${newMember.id}>\nНик: \`${newMember.nickname}\`\nTag: \`${newMember.user.username}#${newMember.user.discriminator}\`\n\nобновил информацию.`;
                //sysCh.send(EmbedMsg('**[ИЗМЕНИЛАСЬ ИНФОРМАЦИЯ]**', 0x50E3C2, info));
                break;
            //Смена ника пользователя
            case Changes.username:
                info = `Пользователь сменивший личный ник: <@${newMember.id}>\nНик: \`${newMember.nickname}\`\nTag: \`${newMember.user.username}#${newMember.user.discriminator}\`\n\n**Старый ник:**\n${oldMember.user.username}#${oldMember.user.discriminator}\n**Новый ник:**\n${newMember.user.username}#${newMember.user.discriminator}`;
                sysCh.send(EmbedMsg('**[ИЗМЕНЕН ЛИЧНЫЙ НИК]**', 0x50E3C2, info));
                break;
            //Смена серверного ника
            case Changes.nickname:
                //Ковыряемся в Журнале серверном
                newMember.guild.fetchAuditLogs().then(logs => {
                    //Получения id пользователя, который выполнил непосредственно
                    var userID = logs.entries.first().executor.id;
                    let oldNick = '';
                    let newNick = '';
                    //Если первоначальный ник - по умолчанию
                    if (oldMember.nickname != null){
                        oldNick = oldMember.nickname;
                    } else {
                        oldNick = 'По умолчанию';
                    }
                    //Если новый ник - по умолчанию
                    if (newMember.nickname != null){
                        newNick = newMember.nickname;
                    } else {
                        newNick = 'По умолчанию';
                    }
                    info = `У кого сменился серверный ник: <@${newMember.id}>\nНик: \`${newMember.nickname}\`\nTag: \`${newMember.user.username}#${newMember.user.discriminator}\`\n\n**Старый ник:**\n${oldNick}\n**Новый ник:**\n\`${newNick}\`\n\nКто сменил:\n<@${userID}>`;
                    //Отправляем сообщение
                    sysCh.send(EmbedMsg(':repeat: **[ИЗМЕНЕН СЕРВЕРНЫЙ НИК]**', 0x50E3C2, info));
                })
                break;
            //Добавление прав/роли
            case Changes.addedRole:
                //Ковыряемся в Журнале серверном
                newMember.guild.fetchAuditLogs().then(logs => {
                    //Получения id пользователя, который выполнил непосредственно
                    var userID = logs.entries.first().executor.id;
                    let nickuser = newMember.nickname;
                    if (nickuser == null) {
                        nickuser = 'По умолчанию';
                    }
                    //формируем сообщение
                    info = `**Кому добавили:**<@${newMember.id}>\nНик: \`${nickuser}\`\nTag: \`${newMember.user.username}#${newMember.user.discriminator}\`\n\n**Роль:**\n __${addedRole}__\n\nКто добавил:\n<@${userID}>`;
                    //Отправляем сообщение
                    sysCh.send(EmbedMsg(':warning: **[ДОБАВЛЕНА РОЛЬ]**', 0x50E3C2, info));
                })
                break;
            //Удаление прав/роли
                case Changes.removedRole:
                //Ковыряемся в Журнале серверном
                newMember.guild.fetchAuditLogs().then(logs => {
                    //Получения id пользователя, который выполнил непосредственно
                    var userID = logs.entries.first().executor.id;
                    let nickuser = newMember.nickname;
                    if (nickuser == null) {
                        nickuser = 'По умолчанию';
                    }
                    //формируем сообщение
                    info = `**Кому удалили:**<@${newMember.id}>\nНик: \`${nickuser}\`\nTag: \`${newMember.user.username}#${newMember.user.discriminator}\`\n\n**Роль:**\n __${removedRole}__\n\nКто удалил:\n<@${userID}>`;
                    //Отправляем сообщение
                    sysCh.send(EmbedMsg(':warning: **[УДАЛЕНА РОЛЬ]**', 0x50E3C2, info));
                })
                break;
        }
    }
});

//Токен
bot.login(token);
