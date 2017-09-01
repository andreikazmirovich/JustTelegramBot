var TelegramBot = require('node-telegram-bot-api'),
    request = require('request'),
    jsdom = require('jsdom'),
    { JSDOM } = jsdom;
    token = '388812803:AAHr_1dJQW_24_fVh5EPuIlxvIoWxmrCQRY';


var bot = new TelegramBot(token, {
  polling: true,
});

bot.onText(/\/start/, (msg) => {
  request('http://www.lp.edu.ua/rozklad-dlya-studentiv-zaochnykiv?group=%D0%9A%D0%9D-22%D0%B7&semestr=0', (error, response, body) => {
    var dom = new JSDOM(body),
        table = dom.window.document.querySelector("table.outer tbody");

    var tableTrs = table.querySelectorAll('tr'),
        days = [];
    

    var arr = [tableTrs[0]];

    for(var i = 1; i < tableTrs.length; i++){
      if(!!tableTrs[i].querySelector('.data')){
        days.push(arr);
        arr = [];
      }
      arr.push(tableTrs[i]);
    };

    var date = new Date();
      date.setHours('13');
      date.setMinutes('40');
    var curTime = `${date.getHours()}:${date.getMinutes()}`,
        curDate = `${date.getDate()}.${date.getMonth()+1 < 10 ? `0${date.getMonth()+1}` : date.getMonth()+1}.${date.getFullYear()}`;

    for(var i = 0; i < days.length; i++){
      if(days[i][0].textContent === curDate){
        switch (curTime) {
          case '9':
            // statements_1
            break;
          default:
            // statements_def
            break;
        }
      }
    }

  });
});