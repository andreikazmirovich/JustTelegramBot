const TelegramBot = require('node-telegram-bot-api'),
	Cron = require('cron').CronJob,
	request = require('request'),
	token = '388812803:AAHr_1dJQW_24_fVh5EPuIlxvIoWxmrCQRY';

var bot = new TelegramBot(token, {
	polling: true,
});

const job = new Cron('* * * * * *', function() {
	console.log('You will see this message every second');
});

job.start();

bot.on('message', (msg) => {
	var id = msg.from.id;
	bot.sendMessage(id, msg.text);
	// console.log(msg);
});