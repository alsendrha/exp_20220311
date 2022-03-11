var express = require('express');
const member = require('../models/member');
var router = express.Router();

var Member = require('../models/member');

// 127.0.0.1:3000/member/insert
router.post('/insert', async function(req, res, next) {
    try {
        var obj = new Member();
        obj._id = req.body._id;
        obj.name = req.body.name;
        obj.password = req.body.password;
        obj.email = req.body.email;
        obj.age = Number(req.body.age);

        const result = await obj.save();
        console.log(result);
        if(result._id != null){
            return res.json({status:200});
        }
        return res.json({status:0});
    
    } catch (e) {
        console.log(e);
        return res.json({status:-1});
        
    }

});

// 127.0.0.1:3000/member/select
router.get('/select', async function(req, res, next) {
    try {
        
        const result = await Member.find({});
        return res.json({status:200, result:result});
    
    } catch (e) {
        console.log(e);
        return res.json({status:-1});
        
    }

});

// 127.0.0.1:3000/member/update
router.put('/update', async function(req, res, next) {
    try {

        // 기존 데이터를 읽음
        const obj = await Member.findOne({_id:req.body._id});

        // 변경할 항목(이름, 나이) 설정
        obj.name = req.body.name;
        obj.age = Number(req.body.age);
    
        // 저장하기(아이디 값이 동일하기 때문에 수정됨.)
        const result = await obj.save();
        console.log(result);

        return res.json({status:200});

    } catch (e) {
        console.log(e);
        return res.json({status:-1});
    }
});

// 127.0.0.1:3000/member/delete
router.delete('/delete', async function(req, res, next) {
    try {

        const result = await Member.deleteOne();
        return res.json({status:200, result:result});

    } catch (e) {
        console.log(e);
        return res.json({status:-1});
    }
});



module.exports = router;
