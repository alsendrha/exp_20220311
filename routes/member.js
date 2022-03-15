var express = require('express');
var router = express.Router();

// 문자를 HASH하기
// 문자가 들어오면 특수하게 변경
// a = > dsafdsafasdfsdafdsafdsfdsf r2343er w34
const crypto = require('crypto');

// 토큰발행
const jwt = require('jsonwebtoken');
const auth = require('../token/auth');

// member 스키마 가져오기 import
var Member = require('../models/member');
const { vary } = require('express/lib/response');
const { query } = require('express');


// 로그인 : 회원정보수정
// 토큰, 이름과 나이변경
// {"name":"김민영", "age":37}
// 127.0.0.1:3000/member/update
router.put('/update', auth.checkToken, async function(req, res, next) {
    try {
        const sessionID = req.body.USERID; // 토큰에서 추출
        const name = req.body.name; // 전달된값
        const age = req.body.age; // 전달된값

        // 아이디에 해당하는 값 조회 후 변경할 항목 2개 변경
        var Member1 = await Member.findOne({_id : sessionID});
        Member1.name = name;
        Member1.age = age;

        const result = Member1.save();
        if(result._id != ''){
            return res.json({status:200});
        }
        return res.json({status:0});

    } catch (e) {
        console.error(e);
        return res.send({status:-1});
    }
});

// 로그인 : 암호변경
//{"pw":"aaa", "newpw":"bbb"}
// 127.0.0.1:3000/member/updatepw
router.put('/updatepw', auth.checkToken, async function(req, res, next) {
    try {
        const sessionID = req.body.USERID; // 토큰에서 추출

        const hashPw = crypto.createHmac('sha256', sessionID).update(req.body.pw).digest('hex');

        // findOne으로 로그인 한 후 변경하기
        const query = {_id : req.body.id, password : hashPw};
        var Member1 = await Member.findOne(query);

        // 새로운 함호 hash
        const hashPw1 = crypto.createHmac('sha256', sessionID).update(req.body.newpw).digest('hex');
        Member1.password = hashPw1;
        
        const result = Member1.save();
        if(result._id != ''){
            return res.send({status:200});
        }
        return res.send({status:0});
        
    } catch (e) {
        console.error(e);
        return res.send({status:-1});
        
    }
});


// 로그인 : 회원탈퇴
// 127.0.0.1:3000/member/delete
router.delete('/delete', auth.checkToken, async function(req, res, next) {
    try {
        const sessionID = req.body.USERID;
        const query = {_id :sessionID};
     
        const result = await Member.deleteOne(query);
        console.log(result);
        if(result.deletedCount === 1){
            
            return res.send({status:200});  

        }
        return res.send({status:0});  
        
        

    } catch (e) {
        console.error(e);
        return res.send({status:-1});
    }
});


// 로그인
// {"id":"aaa", "pw":"aaa"}
// 127.0.0.1:3000/member/select
router.post('/select', async function(req, res, next) {
    try {
        //get => req.query.키
        // post => req.body.키
        const hashPw = crypto.createHmac('sha256', req.body.id).update(req.body.pw).digest('hex');
        console.log(hashPw);
        const query = {$and : [{_id:req.body.id, password:hashPw}]};

        const result = await Member.findOne(query);
        console.log(result);
        if(result !== null){
            // 세션에 정보를 추가함.
            // 같은서버가 아니기때문에 세션을 확인할 방법없음.
            // 토큰(출입할수 있는 키를)을 발행
            
            // 세션에 추가할값, 보안키, 옵션
            const sessionData = {USERID : result._id, USERNAME : result.name};
            const token =
            jwt.sign(sessionData, auth.securityKEY, auth.options);
            // db에 token이라는 키로 수정함.
            return res.json({status:200, result:token});
        }

        return res.json({status:0});
    
    } catch (e) {
        console.error(e);
        return res.json({status:-1});
    }

});

// 127.0.0.1:3000/member/idcheck
router.get('/idcheck', async function(req, res, next) {
    try {

        // 아이디에 해당하는 값을 조회
        const result = await Member.findOne({_id : req.query.id});
        console.log(result);
        if(result !== null){
            return res.send({status:200, result:1});
        }
        return res.send({status:200, result:0});

    } catch (e) {
        console.error(e);
        return res.send({status:-1});
        
    }
});

// 127.0.0.1:3000/member/selectone
router.get('/selectone',  auth.checkToken, async function(req, res, next) {
    try {
        const sessionID = req.body.USERID; // 토큰에서 추출
        // 아이디에 해당하는 값을 조회
        const result = await Member.findOne({_id : sessionID}).select({"name":1, "age":1});
        console.log(result);
        if(result !== null){
            return res.send({status:200, result:result});
        }
        return res.send({status:200, result:0});

    } catch (e) {
        console.error(e);
        return res.send({status:-1});
        
    }
});

// 127.0.0.1:3000/member/insert
router.post('/insert', async function(req, res, next) {
    try {
        //a+1 => 1234
        //a+2 => 4567
        const hashPw = crypto.createHmac('sha256', req.body.id).update(req.body.pw).digest('hex');

        // 빈 Member 객체 생성 -> 객체에 넣기
        var obj = new Member();
        //obj['_id'] = req.body.id;
        obj._id = req.body.id;
        obj.name = req.body.name;
        obj.password = hashPw;
        obj.email = req.body.email;
        obj.age = Number(req.body.age);

        const result = await obj.save();
        console.log(result);
        if(result._id != null){
            return res.json({status:200});
        }
        return res.json({status:0});
    
    } catch (e) {
        console.error(e);
        return res.json({status:-1});   
    }

});

// 127.0.0.1:3000/member/select
router.get('/select', async function(req, res, next) {
    try {
        
        const result = await Member.find({});
        return res.json({status:200, result:result});
    
    } catch (e) {
        console.error(e);
        return res.json({status:-1});
        
    }

});







module.exports = router;
