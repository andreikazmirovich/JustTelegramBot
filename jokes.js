var TelegramBot = require('node-telegram-bot-api'),
    Cron = require('cron').CronJob,
    request = require('request'),
    Entities = require('html-entities').AllHtmlEntities,
    entities = new Entities(),
    striptags = require('striptags'),
    token = '388812803:AAHr_1dJQW_24_fVh5EPuIlxvIoWxmrCQRY';


var bot = new TelegramBot(token, {
  polling: true,
});

bot.on('message', function(msg) {
  var id = msg.from.id;
  bot.sendMessage(id, msg.text);
  console.log(msg);
})

var job = new Cron('0,10,20,30,40,50 * * * * *', function() {
  var chatId = 431310527,
      url = 'http://api.forismatic.com/api/1.0/?method=getQuote&format=json';

  request(url, function(error, response, body) {
    var data = JSON.parse(body);
    // console.log(body);
    bot.sendMessage(chatId, data.quoteText +'\n\n'+ data.quoteAuthor);
  })
});

job.start();