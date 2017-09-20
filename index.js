var TelegramBot = require('node-telegram-bot-api'),
    request = require('request'),
    jsdom = require('jsdom'),
    { JSDOM } = jsdom;
    token = '388812803:AAHr_1dJQW_24_fVh5EPuIlxvIoWxmrCQRY';


var bot = new TelegramBot(token, {
  polling: true,
});

var url = 'http://www.lp.edu.ua/rozklad-dlya-studentiv-zaochnykiv?group=%D0%9A%D0%9D-22%D0%B7&semestr=0',
	timetable = ['8:30', '10:20', '12:10', '14:15', '16:00', '17:40', '19:20', '21:00'];

var getArrOfSubjects = function (msg, body) {
	var dom = new JSDOM(body),
	    table = dom.window.document.querySelector("table.outer tbody");

	var tableTrs = table.querySelectorAll('tr'),
	days = [];
	    
	var arr = [tableTrs[0]];

	for(var i = 1; i < tableTrs.length; i++){
		if(!!tableTrs[i].querySelector('.data')){
	        arr.splice(1,1);
	        days.push(arr);
	        arr = [];
	    }
	    arr.push(tableTrs[i]);
	};

	return days;
};

bot.onText(/\/next/, (msg) => {
	request(url, (error, response, body) => {
	    var userID = msg.chat.id,
	    	days = getArrOfSubjects(msg, body),
	    	date = new Date();
	    	date.setHours('14');
	    	date.setMinutes('20');
	    var curTime = `${date.getHours()}${date.getMinutes()}`,
	        curDate = `${date.getDate()}.${date.getMonth()+1 < 10 ? `0${date.getMonth()+1}` : date.getMonth()+1}.${date.getFullYear()}`;

	    days[5][0].textContent = '17.09.2017';
	    // days[5][5].children[0].textContent = '6';

	    var message = '';

	    for(var i = 0; i < days.length; i++){
	    	if(days[i][0].textContent === curDate){

		        for(var j = 0; j < timetable.length; j++){
		        	if(+timetable[j].replace(':', '') > +curTime){

		        		var subject = days[i][j+1].children[1].textContent,
		        			teacher = days[i][j+1].children[2].textContent,
		        			building = days[i][j+1].children[3].textContent,
		        			room = days[i][j+1].children[4].textContent;

		        		message = `Наступна пара - <b>${subject}</b>\nВідбудеться о <b>${timetable[days[i][j+1].children[0].textContent - 1]}</b> в аудиторії №<b>${room}</b>, <b>${building}</b>`;
		        		break;
		        	}
		        }
	      	}
	    }
	    if(message.length != 0){
	    	bot.sendMessage(userID, message, {parse_mode : "HTML"});
	    }
	    else{
	    	bot.sendMessage(userID, 'Більше сьогодні пар немає!');
	    }

	});
});

bot.onText(/\/today/, (msg) => {
	request(url, (error, response, body) => {
		var userID = msg.chat.id,
			days = getArrOfSubjects(msg, body),
			date = new Date();
	    	date.setHours('11');
	    	date.setMinutes('20');
	    var curTime = `${date.getHours()}${date.getMinutes()}`,
	        curDate = `${date.getDate()}.${date.getMonth()+1 < 10 ? `0${date.getMonth()+1}` : date.getMonth()+1}.${date.getFullYear()}`;

	    days[5][0].textContent = '17.09.2017';
	    // days[5][5].children[0].textContent = '6';

	    var message = '';

	    for(var i = 0; i < days.length; i++){
	    	if(days[i][0].textContent === curDate){
	    		for(var j = 1; j < days[i].length; j++){
	    			message += `${days[i][j].children[0].textContent} - <b>${days[i][j].children[1].textContent}</b>\n`;
	    		}
	      	}
	    }
	    bot.sendMessage(userID, message, {parse_mode : "HTML"});
	});
});