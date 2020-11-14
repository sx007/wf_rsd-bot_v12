const Discord = require('discord.js'); 
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
        message.reply(`:no_entry_sign: Данная команда здесь недоступна!`);
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
        if (message.member.hasPermission("KICK_MEMBERS")){
            if(numArg === 1) {
                //Если указали только название команды
                message.reply(`:exclamation: Неверно указана команда.\nИспользуй: \`${prefix}кик @Ник Причина_кика\``).then(m => m.delete({timeout: 20000, reason: 'Самоудаляемое сообщение'}));
                return;
            }
            //Пользователь не найден
            if (!user){
                message.reply(`\n:no_pedestrians: Указанный пользователь не найден!`).then(m => m.delete({timeout: 15000, reason: 'Самоудаляемое сообщение'}));
                return;
            }
            //Попытка самого себя кикнуть
            if (user.id == message.author.id){
                message.reply(`\n:no_entry_sign: Ты не можешь кикнуть себя!`).then(m => m.delete({timeout: 15000, reason: 'Самоудаляемое сообщение'}));
                return;
            }
            //Проверяем Администратор или Модератор 
            if (hasRole(user, "Администратор") || hasRole(user, "Модераторы")){
                message.reply(`\n:no_entry_sign: Нельзя кикнуть пользователя с правами **Администратор** или **Модераторы**!`).then(m => m.delete({timeout: 15000, reason: 'Самоудаляемое сообщение'}));
                return;
            }
            //Попытка кикнуть бота
            if (user.user.bot){
                message.reply(`\n:robot: Чем тебе бот помешал, мешок с костями? Ты не можешь кикнуть бота!`).then(m => m.delete({timeout: 15000, reason: 'Самоудаляемое сообщение'}));
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
            .setTitle(':no_pedestrians: **[КИКНУЛИ ПОЛЬЗОВАТЕЛЯ]**')
            .setColor(0xFF3700)
            .setDescription(`Пользователя ${user}\nНик: \`${user.displayName}\`\nTag: \`${user.user.username}#${user.user.discriminator}\`\n\nКто кикнул:\n${message.author}`)
            .setTimestamp()
            .setFooter("Бот клана", "")
            //Отправка сообщения
            sysCh.send(KickUser);
        } else {
            //Если нет таких прав
            message.reply(`\n:no_entry_sign: Недостаточно прав для данной команды!`).then(m => m.delete({timeout: 20000, reason: 'Самоудаляемое сообщение'}));
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
        if (message.member.hasPermission("BAN_MEMBERS")){
            if(numArg === 1) {
                //Если указали только название команды
                message.reply(`:exclamation: Неверно указана команда.\nИспользуй: \`${prefix}бан @Ник Причина_бана\``).then(m => m.delete({timeout: 20000, reason: 'Самоудаляемое сообщение'}));
                return;
            }
            //Пользователь не найден
            if (!user){
                message.reply(`\n:no_pedestrians: Указанный пользователь не найден!`).then(m => m.delete({timeout: 15000, reason: 'Самоудаляемое сообщение'}));
                return;
            }
            //Попытка самого себя забанить
            if (user.id == message.author.id){
                message.reply(`\n:no_entry_sign: Ты не можешь забанить себя!`).then(m => m.delete({timeout: 15000, reason: 'Самоудаляемое сообщение'}));
                return;
            }
            //Проверяем Администратор или Модератор 
            if (hasRole(user, "Администратор") || hasRole(user, "Модераторы")){
                message.reply(`\n:no_entry_sign: Нельзя забанить пользователя с правами **Администратор** или **Модераторы**!`).then(m => m.delete({timeout: 15000, reason: 'Самоудаляемое сообщение'}));
                return;
            }
            //Попытка забанить бота
            if (user.user.bot){
                message.reply(`\n:robot: Чем тебе бот помешал, мешок с костями? Ты не можешь забанить бота!`).then(m => m.delete({timeout: 15000, reason: 'Самоудаляемое сообщение'}));
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
            .setTitle(':no_pedestrians: **[ЗАБАНИЛИ ПОЛЬЗОВАТЕЛЯ]**')
            .setColor(0xFF3700)
            .setDescription(`Пользователя ${user}\nНик: \`${user.displayName}\`\nTag: \`${user.user.username}#${user.user.discriminator}\`\n\nКто забанил:\n${message.author}`)
            .setTimestamp()
            .setFooter("Бот клана", "")
            //Отправка сообщения
            sysCh.send(BanUser);
        } else {
            //Если нет таких прав
            message.reply(`\n:no_entry_sign: Недостаточно прав для данной команды!`).then(m => m.delete({timeout: 20000, reason: 'Самоудаляемое сообщение'}));
        }
    } else {
        //лично
        message.reply(`:no_entry_sign: Данная команда здесь недоступна!`);
    }
}

});

/* Проверяем изменения голосовых каналов */
bot.on("voiceStateUpdate", (oldState, newState) => {
    //Проверяем наличие канала, куда будем отправлять сообщение
    let logChannel = bot.channels.cache.find(ch => ch.id === idChMsg);
    if(!logChannel) return;

    //Канал для отправки сообщения
    let sysCh = bot.channels.cache.get(idChMsg);
    //информация о каналах и пользователе
    let oldChannel = oldState.channel;
    let oldMember = oldState.member;
    let newChannel = newState.channel;
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
        avatar: 5
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
    //Если сменился аватар
    if (newMember.user.displayAvatarURL() !== oldMember.user.displayAvatarURL())
        change = Changes.avatar;
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
                    info = `У кого сменился серверный ник: <@${newMember.id}>\nНик: \`${newMember.nickname}\`\nTag: \`${newMember.user.username}#${newMember.user.discriminator}\`\n\n**Старый ник:**\n${oldNick}\n**Новый ник:**\n${newNick}\n\nКто сменил:\n<@${userID}>`;
                    //Отправляем сообщение
                    sysCh.send(EmbedMsg(':repeat: **[ИЗМЕНЕН СЕРВЕРНЫЙ НИК]**', 0x50E3C2, info));
                })
                break;
            //Смена аватара
            case Changes.avatar:
                info = `Пользователь <@${newMember.id}>\nНик: \`${newMember.nickname}\`\nTag: \`${newMember.user.username}#${newMember.user.discriminator}\`\n\nизменил свой аватар.`;
                sysCh.send(EmbedMsg('**[ИЗМЕНИЛАСЬ АВАТАРКА]**', 0x50E3C2, info));
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

/*
//Заготовка для получения кода заголовка
response.setHeader("Content-Type", "text/html");
*/

//Токен
bot.login(token);
