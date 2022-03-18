var express = require('express');
var router = express.Router();

// npm i node-cron --save
var cron = require('node-cron');
const { save } = require('node-cron/src/storage');

// DB연동 모델
var Book1 = require('../models/book1');

// 10초 간격
cron.schedule('*/10 * * * * *', async () => {
    console.log('aaa');
    var book1 = new Book1();
        book1.title = "aaa";
        await book1.save();
});
module.exports = router;
