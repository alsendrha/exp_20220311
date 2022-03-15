
const { verify } = require('jsonwebtoken');
const jwt = require('jsonwebtoken');

// module.sxports = { } 외부에서 import하기위해

const self = module.exports = {

    // 토큰발행 salt값
    securityKEY : 'fasdgggg4gfdsre5',

    // 토큰발행에 필요한 옵션들..
    options : {
        algorithm : 'HS256',
        expiresIn : '10h', // 10시간
        issuer    : 'ds',
    },

    //프런트엔드에서 오는 토큰 검증 부분
    checkToken : async(req, res, next) => {
        try {
            const token = req.headers.auth; // 키는 auth;
            if(token === null){
                return res.send({status:0, result:'토큰없음'});
            }
            
            // 발생시 sign <=> verify 검증시
            
            // 발행된 토큰, 보안키
            const sessinData = jwt.verify(token, self.securityKEY);
            
            // USERID, USERNAME키가 존재하는지 확인
            if(sessinData.USERID === 'undefined'){
                return res.send({status:0, result:'토큰복원실패'});
            }

            if(sessinData.USERNAME === 'undefined'){
                return res.send({status:0, result:'토큰복원실패'});
            }

            // routes/member.js에서 사용가능하도록 정보전달
            req.body.USERID = sessinData.USERID;
            req.body.USERNAME = sessinData.USERNAME;

            next(); // routes/member.js로 전환

        } catch (e) {
            console.error(e);
            if(e.message === 'invalid signature'){
                return res.send({status:0, result:'인정실패'});
            }
            else if(e.message === 'jwt expired'){
                return res.send({status:0, result:'시간만료'});
            }
            else if(e.message === 'invalid token'){
                return res.send({status:0, result:'유효하지않는토큰'});
            }
            return res.send({status:0, result:'유효하지않는토큰'});
        }
    }
}