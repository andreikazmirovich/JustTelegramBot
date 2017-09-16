var TelegramBot = require('node-telegram-bot-api'),
    request = require('request'),
    jsdom = require('jsdom'),
    { JSDOM } = jsdom;
    token = '388812803:AAHr_1dJQW_24_fVh5EPuIlxvIoWxmrCQRY';


var bot = new TelegramBot(token, {
  polling: true,
});

bot.onText(/\/next/, (msg) => {
  request('http://www.lp.edu.ua/rozklad-dlya-studentiv-zaochnykiv?group=%D0%9A%D0%9D-22%D0%B7&semestr=0', (error, response, body) => {
    var dom = new JSDOM(body),
        table = dom.window.document.querySelector("table.outer tbody");

    var tableTrs = table.querySelectorAll('tr'),
        days = [],
        userID = msg.chat.id;
    

    var arr = [tableTrs[0]];

    for(var i = 1; i < tableTrs.length; i++){
      if(!!tableTrs[i].querySelector('.data')){
        arr.splice(1,1);
        days.push(arr);
        arr = [];
      }
      arr.push(tableTrs[i]);
    };


    var timetable = ['8:30', '10:20', '12:10', '14:15', '16:00', '17:40', '19:20', '21:00'];
    	date = new Date();
    	date.setHours('21');
    	date.setMinutes('20');
    var curTime = `${date.getHours()}${date.getMinutes()}`,
        curDate = `${date.getDate()}.${date.getMonth()+1 < 10 ? `0${date.getMonth()+1}` : date.getMonth()+1}.${date.getFullYear()}`;

    days[5][0].textContent = '16.09.2017';
    // console.log(days[0][0].textContent);

    var message = '';

    for(var i = 0; i < days.length; i++){
    	if(days[i][0].textContent === curDate){

	        for(var j = 0; j < timetable.length; j++){
	        	if(+timetable[j].replace(':', '') > +curTime){
	        		days[i][j+1].children[0].remove();

	        		var subject = days[i][j+1].children[0].textContent,
	        			teacher = days[i][j+1].children[1].textContent,
	        			building = days[i][j+1].children[2].textContent,
	        			room = days[i][j+1].children[3].textContent;

	        		// console.log(`${subject} - ${teacher} - ${building} - ${room}`);
	        		message = `Наступна пара - <b>${subject}</b>\nВідбудеться о <b>${timetable[j]}</b> в аудиторії №<b>${room}</b>, <b>${building}</b>`;
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