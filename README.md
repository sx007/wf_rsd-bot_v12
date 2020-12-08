<p align="center">
<img src="https://i.imgur.com/BO26Msw.jpg" alt="Logo Clan + Discord" />
</p>


Проект в стадии разработки.
======
| Информация | Описание |
| --- | --- |
| Версия бота | <a href="https://github.com/sx007/wf_rsd-bot_v12/blob/master/changelog.md"><img src="https://img.shields.io/badge/dynamic/json?color=brightgreen&url=https://raw.githubusercontent.com/sx007/wf_rsd-bot_v12/main/package.json&query=$.version&label=Version" alt="Version"></a> |
| Библиотека | <a href="http://nodejs.org"><img src="https://img.shields.io/badge/dynamic/json?color=red&url=https://raw.githubusercontent.com/sx007/wf_rsd-bot_v12/master/package.json&query=$.engines.node&label=Node.js" alt="Node.js"></a> |
^^| <a href="https://discord.js.org"><img src="https://img.shields.io/badge/dynamic/json?color=orange&url=https://raw.githubusercontent.com/sx007/wf_rsd-bot_v12/master/package.json&query=$.dependencies[%22discord.js%22]&label=Discord.js" alt="Discord.js"></a> |
^^| <a href="https://www.npmjs.com/package/request"><img src="https://img.shields.io/badge/dynamic/json?color=yellow&url=https://raw.githubusercontent.com/sx007/wf_rsd-bot_v12/master/package.json&query=$.dependencies.request&label=Request" alt="Request"></a> |
^^| <a href="https://www.npmjs.com/package/express"><img src="https://img.shields.io/badge/dynamic/json?color=blue&url=https://raw.githubusercontent.com/sx007/wf_rsd-bot_v12/master/package.json&query=$.dependencies.express&label=Express" alt="Express"></a> |
| Лицензия | <a href="https://creativecommons.org/licenses/by/4.0/deed.ru"><img src="https://img.shields.io/badge/dynamic/json?color=%23373737&url=https://raw.githubusercontent.com/sx007/wf_rsd-bot_v12/master/package.json&query=$.license&label=License" alt="License"></a> |


# Про бота
> Данный бот изначально был создан для ведения статистики по серверу Discord клана. 

<a href="https://vk.com/wf_rsd">Группа VK</a> клана
<a href="https://discord.gg/PR57GzV"><img src="https://discordapp.com/api/guilds/307431674671792129/widget.png" alt="Discord server"></a>

Появляются новые люди на сервере, покидают, назначаются права. __Журнал аудита__ на сервере хранит информацию примерно `30 дней`. Порой, чтобы узнать кто выдал права пользователю приходилось в журнале выискивать пользователя. А если он уже больше месяца, то не узнать кто выдал права. Поэтому захотелось долгосрочную статистику вести.
***
На нашем сервере Discord есть текстовый канал __#system__, в котором отправляются системные сообщения из __Журнала аудита__. 
Права на сервере разделены на две части: `Администратор и модераторы` и `Прочие права` (их несколько).
